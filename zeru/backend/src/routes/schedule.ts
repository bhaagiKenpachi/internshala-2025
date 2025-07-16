import express from 'express';
import { Queue } from 'bullmq';

const router = express.Router();

const priceQueue = new Queue('price-history', {
    connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
});

router.post('/schedule', async (req, res) => {
    const { token, network } = req.body;
    if (!token || !network) {
        return res.status(400).json({ error: 'token, network required' });
    }
    await priceQueue.add('fetch-history', { token, network });
    res.json({ status: 'scheduled' });
});

export default router; 