import { Worker } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();
import { connectMongo } from './db';
import { TokenPrice } from './models/TokenPrice';
import { getAlchemy } from './routes/price';
import { fetchPriceFromAlchemy } from './utils/fetchPriceFromAlchemy';
import { QuotaExceededError } from './utils/fetchPriceFromAlchemy';
import { getDailyTimestamps, getStartOfDayUTC, isValidTimestamp } from './utils/timeUtils';
import { redis } from './db';

// Connect to MongoDB
connectMongo().catch(console.error);

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

// Process a batch of days in parallel
const processBatch = async (
    alchemy: any,
    token: string,
    network: string,
    days: number[],
    startIndex: number
): Promise<{ successCount: number; processedCount: number }> => {
    const batchPromises = days.map(async (day, index) => {
        const globalIndex = startIndex + index;
        const dateStr = new Date(day * 1000).toISOString().split('T')[0];

        try {
            const price = await fetchPriceFromAlchemy(alchemy, token, day, network);
            if (price !== null) {
                await TokenPrice.updateOne(
                    { token, network, date: day },
                    { $set: { price } },
                    { upsert: true }
                );

                // Clear Redis cache for this specific price entry
                const cacheKey = `price:${token}:${network}:${day}`;
                await redis.del(cacheKey);
                console.log(`🗑️ Cleared Redis cache for ${cacheKey}`);

                console.log(`✅ Batch day ${globalIndex + 1}: Price $${price} stored for ${dateStr}`);
                return { success: true, price };
            } else {
                console.log(`❌ Batch day ${globalIndex + 1}: No price available for ${dateStr}`);
                return { success: false, price: null };
            }
        } catch (error) {
            console.error(`❌ Batch day ${globalIndex + 1}: Error processing ${dateStr}:`, error);
            return { success: false, price: null, error };
        }
    });

    const results = await Promise.allSettled(batchPromises);
    let successCount = 0;

    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
            successCount++;
        }
    });

    return { successCount, processedCount: days.length };
};

const worker = new Worker('price-history', async job => {
    const { token, network } = job.data;
    const alchemy = getAlchemy(network);
    const now = Math.floor(Date.now() / 1000);
    const BATCH_SIZE = 5;

    console.log(`🚀 Starting job for ${token} on ${network}`);

    try {
        const creation = await getTokenCreationDate(alchemy, token, network);
        console.log(`📅 Token creation date: ${new Date(creation * 1000).toISOString()}`);

        // Use timeUtils for proper daily bucket handling
        const allDays = getDailyTimestamps(creation, now);
        // Reverse the array to process from latest to creation date
        const reversedDays = allDays.reverse();
        console.log(`📊 Processing ${reversedDays.length} days in batches of ${BATCH_SIZE} (from latest to creation date, timezone-independent UTC daily buckets)`);

        let totalProcessedCount = 0;
        let totalSuccessCount = 0;

        // Process days in batches (from latest to creation date)
        for (let i = 0; i < reversedDays.length; i += BATCH_SIZE) {
            // Check if job has been cancelled
            const currentState = await job.getState();
            if (currentState === 'failed') {
                console.log(`🛑 Job ${job.id} was cancelled, stopping processing`);
                return;
            }

            const batch = reversedDays.slice(i, i + BATCH_SIZE);
            console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(reversedDays.length / BATCH_SIZE)} (days ${i + 1}-${Math.min(i + BATCH_SIZE, reversedDays.length)})`);

            const { successCount, processedCount } = await processBatch(
                alchemy,
                token,
                network,
                batch,
                i
            );

            totalProcessedCount += processedCount;
            totalSuccessCount += successCount;

            // Update progress
            await job.updateProgress(Math.round((totalProcessedCount / allDays.length) * 100));

            // Add delay between batches to avoid rate limiting
            if (i + BATCH_SIZE < reversedDays.length) {
                console.log(`⏳ Waiting 3 seconds before next batch...`);
                for (let j = 0; j < 3; j++) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // Check for cancellation during delay
                    const currentState = await job.getState();
                    if (currentState === 'failed') {
                        console.log(`🛑 Job ${job.id} was cancelled during delay, stopping processing`);
                        return;
                    }
                }
            }
        }

        console.log(`🎉 Job completed! Processed ${totalProcessedCount} days, stored ${totalSuccessCount} prices for ${token} on ${network}`);
    } catch (err) {
        if (err instanceof QuotaExceededError) {
            console.error('❌ Worker stopped: Alchemy API quota exceeded.');
            await job.moveToFailed(new Error(err.message), 'quota-exceeded');
            return;
        }
        console.error('❌ Worker error:', (err as Error));
        throw err; // Re-throw to mark job as failed
    }
}, {
    connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
});

worker.on('completed', job => {
    console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    if (err.message && err.message.includes('Job cancelled by user')) {
        console.log(`🛑 Job ${job?.id} was cancelled by user`);
    } else {
        console.error(`❌ Job ${job?.id} failed:`, err);
    }
});

console.log('🔄 Worker started and waiting for jobs...'); 