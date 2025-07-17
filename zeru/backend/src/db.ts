import mongoose from 'mongoose';
import Redis from 'ioredis';

export const connectMongo = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zeru';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
};

// Redis connection configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    showFriendlyErrorStack: true
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => console.log('Redis connected successfully'));
redis.on('ready', () => console.log('Redis ready'));
redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
    if (err.message.includes('NOAUTH')) {
        console.error('Authentication error - check Redis password configuration');
    }
});
redis.on('close', () => console.log('Redis connection closed'));
redis.on('reconnecting', () => console.log('Redis reconnecting...')); 