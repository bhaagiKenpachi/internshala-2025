import express from 'express';
import { TokenPrice } from '../models/TokenPrice';
import { redis } from '../db';
import { interpolate } from '../utils/interpolate';
import { Alchemy, Network } from 'alchemy-sdk';
import { fetchPriceFromAlchemy } from '../utils/fetchPriceFromAlchemy';

const router = express.Router();

export const getAlchemy = (network: string) => {
    const apiKey = network === 'ethereum'
        ? process.env.ALCHEMY_API_KEY_ETHEREUM
        : process.env.ALCHEMY_API_KEY_POLYGON;
    return new Alchemy({
        apiKey,
        network: network === 'ethereum' ? Network.ETH_MAINNET : Network.MATIC_MAINNET,
    });
};

router.post('/price', async (req, res) => {
    const { token, network, timestamp } = req.body;
    if (!token || !network || !timestamp) {
        return res.status(400).json({ error: 'token, network, timestamp required' });
    }
    const cacheKey = `price:${token}:${network}:${timestamp}`;
    // 1. Check Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.json({ price: Number(cached), source: 'cache' });
    }
    // 2. Check MongoDB for exact match
    const priceDoc = await TokenPrice.findOne({ token, network, date: timestamp });
    if (priceDoc) {
        await redis.set(cacheKey, priceDoc.price, 'EX', 300);
        return res.json({ price: priceDoc.price, source: 'alchemy' });
    }
    // 3. Interpolation: find nearest before/after
    const before = await TokenPrice.findOne({ token, network, date: { $lt: timestamp } }).sort({ date: -1 });
    const after = await TokenPrice.findOne({ token, network, date: { $gt: timestamp } }).sort({ date: 1 });
    if (before && after) {
        const price = interpolate(timestamp, before.date, before.price, after.date, after.price);
        await redis.set(cacheKey, price, 'EX', 300);
        return res.json({ price, source: 'interpolated' });
    }
    // 4. Fallback: fetch from Alchemy
    try {
        const alchemy = getAlchemy(network);
        const price = await fetchPriceFromAlchemy(alchemy, token, timestamp, network);
        if (price !== null) {
            await TokenPrice.create({ token, network, date: timestamp, price });
            await redis.set(cacheKey, price, 'EX', 300);
            return res.json({ price, source: 'alchemy' });
        }
        // Should not reach here, but just in case
        return res.status(404).json({ error: 'Price not found and interpolation not possible' });
    } catch (err: any) {
        // Surface backend error to frontend
        return res.status(404).json({ error: err.message || 'Failed to fetch price' });
    }
});

// Fetch price history for a token/network
router.post('/price-history', async (req, res) => {
    const { token, network } = req.body;
    if (!token || !network) {
        return res.status(400).json({ error: 'token and network required' });
    }
    try {
        const history = await TokenPrice.find({ token, network }).sort({ date: 1 });
        if (!history || history.length === 0) {
            return res.status(404).json({ error: 'No price history found for this token/network.' });
        }
        res.json({ history });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch price history' });
    }
});

export default router; 