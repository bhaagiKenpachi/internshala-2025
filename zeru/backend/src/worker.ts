import { Worker } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();
import { TokenPrice } from './models/TokenPrice';
import { getAlchemy } from './routes/price';
import { fetchPriceFromAlchemy } from './utils/fetchPriceFromAlchemy';

const getTokenCreationDate = async (alchemy: any, token: string, network: string): Promise<number> => {
    const url = network === 'ethereum'
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_ETHEREUM}`
        : `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_POLYGON}`;

    // Get first transfer
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'alchemy_getAssetTransfers',
            params: [{
                contractAddresses: [token],
                category: ['erc20'],
                order: 'asc',
                maxCount: '0x1'
            }]
        })
    });
    const data = await res.json();
    const blockNum = data?.result?.transfers?.[0]?.blockNum;
    if (!blockNum) throw new Error('Token creation block not found');

    // Get block details to get timestamp
    const blockRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'eth_getBlockByNumber',
            params: [blockNum, false]
        })
    });
    const blockData = await blockRes.json();
    const timestamp = blockData?.result?.timestamp;
    if (timestamp) return parseInt(timestamp, 16);
    throw new Error('Block timestamp not found');
};

const getDailyTimestamps = (from: number, to: number, maxDays: number = 7): number[] => {
    const days = [];
    let current = Math.max(from, to - (maxDays * 86400)); // Start from maxDays ago or creation date, whichever is later
    while (current <= to) {
        days.push(current);
        current += 86400; // add 1 day
    }
    return days;
};

const worker = new Worker('price-history', async job => {
    const { token, network } = job.data;
    const alchemy = getAlchemy(network);
    const now = Math.floor(Date.now() / 1000);

    console.log(`🚀 Starting job for ${token} on ${network}`);

    try {
        const creation = await getTokenCreationDate(alchemy, token, network);
        console.log(`📅 Token creation date: ${new Date(creation * 1000).toISOString()}`);

        // Process only last 7 days for faster testing
        const days = getDailyTimestamps(creation, now, 7);
        console.log(`📊 Processing ${days.length} days (last 7 days for testing)`);

        let processedCount = 0;
        let successCount = 0;

        for (const day of days) {
            processedCount++;
            console.log(`⏳ Processing day ${processedCount}/${days.length}: ${new Date(day * 1000).toISOString().split('T')[0]}`);

            let price = await fetchPriceFromAlchemy(alchemy, token, day, network);
            if (price !== null) {
                await TokenPrice.updateOne(
                    { token, network, date: day },
                    { $set: { price } },
                    { upsert: true }
                );
                successCount++;
                console.log(`✅ Day ${processedCount}: Price $${price} stored`);
            } else {
                console.log(`❌ Day ${processedCount}: No price available`);
            }

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`🎉 Job completed! Processed ${processedCount} days, stored ${successCount} prices for ${token} on ${network}`);
    } catch (err) {
        console.error('❌ Worker error:', err);
    }
}, {
    connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
});

worker.on('completed', job => {
    console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
});

console.log('🔄 Worker started and waiting for jobs...'); 