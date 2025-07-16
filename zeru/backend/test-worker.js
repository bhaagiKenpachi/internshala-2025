const fetch = require('node-fetch');

async function testWorker() {
    console.log('🧪 Testing Worker with USDC...\n');

    try {
        // Schedule a job
        console.log('📤 Scheduling job...');
        const scheduleResponse = await fetch('http://localhost:4000/api/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                network: 'ethereum'
            })
        });

        const scheduleResult = await scheduleResponse.json();
        console.log('✅ Job scheduled:', scheduleResult);

        // Wait a moment for worker to start processing
        console.log('\n⏳ Waiting for worker to process...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test a few price queries to see if data was stored
        console.log('\n🔍 Testing price queries...');
        const timestamps = [
            Math.floor(Date.now() / 1000) - (6 * 86400), // 6 days ago
            Math.floor(Date.now() / 1000) - (3 * 86400), // 3 days ago
            Math.floor(Date.now() / 1000) - (1 * 86400), // 1 day ago
        ];

        for (const timestamp of timestamps) {
            const priceResponse = await fetch('http://localhost:4000/api/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    network: 'ethereum',
                    timestamp: timestamp
                })
            });

            const priceResult = await priceResponse.json();
            const date = new Date(timestamp * 1000).toISOString().split('T')[0];
            console.log(`📅 ${date}: ${JSON.stringify(priceResult)}`);
        }

        console.log('\n🎉 Test completed! Check worker logs for processing details.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testWorker(); 