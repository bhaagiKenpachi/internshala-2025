import mongoose from 'mongoose';
import Redis from 'ioredis';

export const connectMongo = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zeru';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
};

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err)); 