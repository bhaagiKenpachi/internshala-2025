const { fetchPriceFromAlchemy } = require('./dist/utils/fetchPriceFromAlchemy');
const { Alchemy, Network } = require('alchemy-sdk');

async function testAlchemyPrices() {
    console.log('🧪 Testing Alchemy Prices API Integration...\n');

    const alchemy = new Alchemy({
        apiKey: process.env.ALCHEMY_API_KEY_ETHEREUM || 'demo',
        network: Network.ETH_MAINNET,
    });

    const testCases = [
        {
            token: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
            timestamp: Math.floor(Date.now() / 1000), // Current time
            network: 'ethereum'
        },
        {
            token: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
            timestamp: Math.floor(Date.now() / 1000), // Current time
            network: 'ethereum'
        }
    ];

    for (const testCase of testCases) {
        console.log(`🔍 Testing ${testCase.token} (${testCase.network})...`);
        console.log(`📅 Timestamp: ${new Date(testCase.timestamp * 1000).toISOString()}`);

        try {
            const price = await fetchPriceFromAlchemy(
                alchemy,
                testCase.token,
                testCase.timestamp,
                testCase.network
            );

            if (price !== null) {
                console.log(`✅ Price: $${price}`);
            } else {
                console.log(`❌ No price found`);
            }
        } catch (error) {
            console.error(`❌ Error:`, error.message);
        }

        console.log('---\n');
    }
}

testAlchemyPrices().catch(console.error); 