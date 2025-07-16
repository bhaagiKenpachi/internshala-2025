import { Alchemy } from 'alchemy-sdk';

const ALCHEMY_PRICES_API_KEY = 'sUY2wbVYzREi6QSSC7UTT';
const ALCHEMY_PRICES_BASE_URL = 'https://api.g.alchemy.com/prices/v1';

// Fallback to CoinGecko for tokens not supported by Alchemy
const COINGECKO_TOKEN_MAP: Record<string, string> = {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap', // UNI
    '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC
};

export async function fetchPriceFromAlchemy(
    alchemy: Alchemy,
    token: string,
    timestamp: number,
    network: string
): Promise<number | null> {
    try {
        // Try Alchemy Prices API first
        const alchemyPrice = await tryAlchemyPricesAPI(token, timestamp, network);
        if (alchemyPrice !== null) {
            return alchemyPrice;
        }

        // Fallback to CoinGecko
        console.log(`🔄 Alchemy Prices API failed, trying CoinGecko fallback...`);
        return await tryCoinGeckoAPI(token, timestamp);

    } catch (error) {
        console.error('❌ Error fetching price:', error);
        return null;
    }
}

async function tryAlchemyPricesAPI(token: string, timestamp: number, network: string): Promise<number | null> {
    try {
        const date = new Date(timestamp * 1000).toISOString().split('T')[0];

        // Map network to correct Alchemy format
        const networkMap: Record<string, string> = {
            ethereum: 'eth-mainnet',
            polygon: 'polygon-mainnet'
        };

        const alchemyNetwork = networkMap[network] || 'eth-mainnet';

        console.log(`🔍 Trying Alchemy Prices API with network: ${alchemyNetwork}`);

        const url = `${ALCHEMY_PRICES_BASE_URL}/${ALCHEMY_PRICES_API_KEY}/tokens/by-address`;

        const requestBody = {
            addresses: [{
                address: token,
                network: alchemyNetwork
            }],
            date: date
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`📊 Alchemy response:`, JSON.stringify(data, null, 2));

            if (data.data && data.data.length > 0) {
                const tokenData = data.data[0];

                // Check if there's an error
                if (tokenData.error) {
                    console.log(`⚠️ Alchemy error: ${tokenData.error.message}`);
                    return null;
                }

                if (tokenData.prices && tokenData.prices.length > 0) {
                    const usdPrice = tokenData.prices.find((p: any) => p.currency === 'USD' || p.currency === 'usd');
                    if (usdPrice) {
                        console.log(`✅ Alchemy Prices API success: $${usdPrice.value}`);
                        return parseFloat(usdPrice.value);
                    }
                }
            }
        } else {
            console.log(`❌ Alchemy API failed: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.log(`Error details: ${errorText}`);
        }

        // Try current price if historical failed
        console.log(`🔄 Trying current price...`);
        const currentRequestBody = {
            addresses: [{
                address: token,
                network: alchemyNetwork
            }]
        };

        const currentResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentRequestBody)
        });

        if (currentResponse.ok) {
            const currentData = await currentResponse.json();
            console.log(`📊 Current price response:`, JSON.stringify(currentData, null, 2));

            if (currentData.data && currentData.data.length > 0) {
                const tokenData = currentData.data[0];

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
            console.log(`❌ Current price API failed: ${currentResponse.status}`);
        }

        console.log(`❌ Alchemy Prices API failed`);
        return null;

    } catch (error) {
        console.error('❌ Alchemy Prices API error:', error);
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
        const historicalUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${new Date(timestamp * 1000).toISOString().split('T')[0]}`;
        const historicalResponse = await fetch(historicalUrl);

        if (historicalResponse.ok) {
            const historicalData = await historicalResponse.json();
            if (historicalData.market_data && historicalData.market_data.current_price) {
                const price = historicalData.market_data.current_price.usd;
                console.log(`✅ CoinGecko historical price: $${price}`);
                return price;
            }
        }

        // Fallback to current price
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