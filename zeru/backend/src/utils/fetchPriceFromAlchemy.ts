import { Alchemy } from 'alchemy-sdk';

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

        // Fallback to CoinGecko for historical data
        console.log(`🔄 Alchemy Historical API failed, trying CoinGecko fallback...`);
        const coinGeckoPrice = await tryCoinGeckoAPI(token, timestamp);
        if (coinGeckoPrice !== null) {
            return coinGeckoPrice;
        }

        // Last resort: try Alchemy current price (but only for recent dates)
        const now = Math.floor(Date.now() / 1000);
        const daysDiff = (now - timestamp) / (24 * 60 * 60);

        if (daysDiff <= 7) { // Only use current price for dates within last 7 days
            console.log(`🔄 Trying Alchemy current price as last resort...`);
            return await tryAlchemyCurrentPriceAPI(token, network);
        }

        console.log(`❌ No price data available for ${token} at ${new Date(timestamp * 1000).toISOString()}`);
        return null;

    } catch (error) {
        console.error('❌ Error fetching price:', error);
        return null;
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

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

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

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

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

async function tryCoinGeckoAPI(token: string, timestamp: number): Promise<number | null> {
    try {
        const coinId = COINGECKO_TOKEN_MAP[token.toLowerCase()];
        if (!coinId) {
            console.log(`❌ Token ${token} not found in CoinGecko mapping`);
            return null;
        }

        console.log(`🔍 Fetching from CoinGecko: ${coinId}`);

        // Try historical price first
        const dateStr = new Date(timestamp * 1000).toISOString().split('T')[0];
        const historicalUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${dateStr}`;

        console.log(`📤 CoinGecko historical URL: ${historicalUrl}`);

        const historicalResponse = await fetch(historicalUrl);

        if (historicalResponse.ok) {
            const historicalData = await historicalResponse.json();
            console.log(`📊 CoinGecko historical response:`, JSON.stringify(historicalData, null, 2));

            if (historicalData.market_data && historicalData.market_data.current_price) {
                const price = historicalData.market_data.current_price.usd;
                console.log(`✅ CoinGecko historical price: $${price}`);
                return price;
            } else {
                console.log(`⚠️ CoinGecko historical data missing market_data or current_price`);
            }
        } else {
            console.log(`❌ CoinGecko historical API failed: ${historicalResponse.status}`);
        }

        // Fallback to current price only if historical failed
        console.log(`🔄 CoinGecko historical failed, trying current price...`);
        const currentUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
        const currentResponse = await fetch(currentUrl);

        if (currentResponse.ok) {
            const currentData = await currentResponse.json();
            if (currentData[coinId] && currentData[coinId].usd) {
                const price = currentData[coinId].usd;
                console.log(`✅ CoinGecko current price: $${price}`);
                return price;
            }
        }

        console.log(`❌ CoinGecko API failed`);
        return null;

    } catch (error) {
        console.error('❌ CoinGecko API error:', error);
        return null;
    }
} 