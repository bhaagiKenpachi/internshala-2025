import { Alchemy } from 'alchemy-sdk';

// Custom error for quota exceeded
export class QuotaExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'QuotaExceededError';
    }
}

// Enhanced retry function
async function retry<T>(
    fn: () => Promise<T>,
    options: { retries: number; minTimeout: number; maxTimeout: number } = { retries: 3, minTimeout: 1000, maxTimeout: 30000 }
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= options.retries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            // Check for Alchemy quota exceeded
            if (error?.status === 429 && error?.message?.includes('exceeded its limit')) {
                throw new QuotaExceededError('Alchemy API quota exceeded. Please upgrade your plan or wait for quota reset.');
            }
            if (error?.response) {
                // Try to parse error body for quota message
                try {
                    const body = typeof error.response === 'string' ? JSON.parse(error.response) : error.response;
                    if (body?.error?.message?.includes('exceeded its limit')) {
                        throw new QuotaExceededError('Alchemy API quota exceeded. Please upgrade your plan or wait for quota reset.');
                    }
                } catch { }
            }
            lastError = error;

            // Don't retry on 4xx errors (except 429)
            if (error.status >= 400 && error.status < 500 && error.status !== 429) {
                throw error;
            }

            if (i === options.retries) {
                throw error;
            }

            // Exponential backoff
            const delay = Math.min(
                options.minTimeout * Math.pow(2, i),
                options.maxTimeout
            );

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError!;
}

const ALCHEMY_PRICES_API_KEY = 'sUY2wbVYzREi6QSSC7UTT';
const ALCHEMY_PRICES_BASE_URL = 'https://api.g.alchemy.com/prices/v1';

// Map network to correct Alchemy format
const networkMap: Record<string, string> = {
    ethereum: 'eth-mainnet',
    polygon: 'polygon-mainnet'
};

// Fallback to CoinGecko for tokens not supported by Alchemy
const COINGECKO_TOKEN_MAP: Record<string, string> = {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap', // UNI
    '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC
    '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': 'weth', // WETH (Polygon)
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'weth', // WETH (Ethereum)
};

export async function fetchPriceFromAlchemy(
    alchemy: Alchemy,
    token: string,
    timestamp: number,
    network: string
): Promise<number | null> {
    try {
        // Try Alchemy Historical Prices API first
        const alchemyPrice = await tryAlchemyHistoricalAPI(token, timestamp, network);
        if (alchemyPrice !== null) {
            return alchemyPrice;
        }

        // Last resort: try Alchemy current price (but only for recent dates)
        const now = Math.floor(Date.now() / 1000);
        const daysDiff = (now - timestamp) / (24 * 60 * 60);

        if (daysDiff <= 7) { // Only use current price for dates within last 7 days
            console.log(`🔄 Trying Alchemy current price as last resort...`);
            const currentPrice = await tryAlchemyCurrentPriceAPI(token, network);
            if (currentPrice !== null) {
                return currentPrice;
            }
        }

        // If all Alchemy attempts fail, throw a clear error
        throw new Error(`No price data available for ${token} at ${new Date(timestamp * 1000).toISOString()}`);
    } catch (error) {
        // Surface the error for the frontend to display
        throw error;
    }
}

async function tryAlchemyHistoricalAPI(token: string, timestamp: number, network: string): Promise<number | null> {
    try {
        const alchemyNetwork = networkMap[network] || 'eth-mainnet';

        // Convert timestamp to ISO string for the API
        const targetDate = new Date(timestamp * 1000).toISOString();

        // Add 1 hour to the endTime
        const endDate = new Date(timestamp * 1000);
        endDate.setHours(endDate.getHours() + 1);
        const endTimeISO = endDate.toISOString();

        console.log(`🔍 Trying Alchemy Historical API for ${token} on ${alchemyNetwork} at ${targetDate}`);

        const url = `${ALCHEMY_PRICES_BASE_URL}/${ALCHEMY_PRICES_API_KEY}/tokens/historical`;

        // Use the historical API with the new format including withMarketData and interval
        const requestBody = {
            network: alchemyNetwork,
            address: token,
            startTime: targetDate,
            endTime: endTimeISO, // Now using endTime with 1 hour added
            interval: "5m"
        };

        console.log(`📤 Request body:`, JSON.stringify(requestBody, null, 2));

        const response = await retry(
            () => fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }),
            { retries: 3, minTimeout: 1000, maxTimeout: 30000 }
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`📊 Alchemy Historical response:`, JSON.stringify(data, null, 2));

            if (data.data && data.data.length > 0) {
                const price = data.data[0];
                if (price.value) {
                    console.log(`✅ Alchemy Historical API success: $${price.value}`);
                    return parseFloat(price.value);
                }
            } else {
                console.log(`⚠️ Alchemy Historical API returned empty data array`);
            }
        } else {
            console.log(`❌ Alchemy Historical API failed: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.log(`Error details: ${errorText}`);
        }

        return null;

    } catch (error) {
        console.error('❌ Alchemy Historical API error:', error);
        return null;
    }
}

async function tryAlchemyCurrentPriceAPI(token: string, network: string): Promise<number | null> {
    try {
        const alchemyNetwork = networkMap[network] || 'eth-mainnet';

        console.log(`🔍 Trying Alchemy Current Price API with network: ${alchemyNetwork}`);

        const url = `${ALCHEMY_PRICES_BASE_URL}/${ALCHEMY_PRICES_API_KEY}/tokens/by-address`;

        const requestBody = {
            addresses: [{
                address: token,
                network: alchemyNetwork
            }]
        };

        const response = await retry(
            () => fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }),
            { retries: 3, minTimeout: 1000, maxTimeout: 30000 }
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`📊 Current price response:`, JSON.stringify(data, null, 2));

            if (data.data && data.data.length > 0) {
                const tokenData = data.data[0];

                if (tokenData.error) {
                    console.log(`⚠️ Current price error: ${tokenData.error.message}`);
                    return null;
                }

                if (tokenData.prices && tokenData.prices.length > 0) {
                    const usdPrice = tokenData.prices.find((p: any) => p.currency === 'USD' || p.currency === 'usd');
                    if (usdPrice) {
                        console.log(`✅ Alchemy current price: $${usdPrice.value}`);
                        return parseFloat(usdPrice.value);
                    }
                }
            }
        } else {
            console.log(`❌ Current price API failed: ${response.status}`);
        }

        console.log(`❌ Alchemy Current Price API failed`);
        return null;

    } catch (error) {
        console.error('❌ Alchemy Current Price API error:', error);
        return null;
    }
} 