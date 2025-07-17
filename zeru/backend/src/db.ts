import mongoose from 'mongoose';
import Redis from 'ioredis';

export const connectMongo = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zeru';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
};

// Parse Railway Redis URL if provided
const parseRedisUrl = (url: string) => {
    try {
        const parsed = new URL(url);
        return {
            host: parsed.hostname,
            port: parseInt(parsed.port || '6379'),
            password: parsed.password || undefined,
            tls: parsed.protocol === 'rediss:' ? {} : undefined
        };
    } catch (error) {
        console.error('Failed to parse Redis URL:', error);
        return null;
    }
};

// Redis connection configuration
const getRedisConfig = () => {
    // Check for Railway Redis URL first
    if (process.env.REDIS_URL) {
        const parsed = parseRedisUrl(process.env.REDIS_URL);
        if (parsed) {
            return {
                ...parsed,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                showFriendlyErrorStack: true,
                connectTimeout: 10000,
                commandTimeout: 5000,
            };
        }
    }

    // Fallback to individual environment variables
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        // Railway Redis typically provides password in REDIS_PASSWORD or REDIS_AUTH
        password: process.env.REDIS_PASSWORD || process.env.REDIS_AUTH || undefined,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        showFriendlyErrorStack: true,
        // Add connection timeout
        connectTimeout: 10000,
        // Add command timeout
        commandTimeout: 5000,
        // Add TLS configuration for Railway Redis
        tls: process.env.REDIS_HOST?.includes('rlwy.net') ? {} : undefined
    };
};

const redisConfig = getRedisConfig();

// Log Redis configuration for debugging (without password)
console.log('Redis config:', {
    host: redisConfig.host,
    port: redisConfig.port,
    hasPassword: !!redisConfig.password,
    hasTLS: !!redisConfig.tls
});

export const redis = new Redis(redisConfig);

redis.on('connect', () => console.log('Redis connected successfully'));
redis.on('ready', () => console.log('Redis ready'));
redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
    if (err.message.includes('NOAUTH')) {
        console.error('Authentication error - check Redis password configuration');
        console.error('Available env vars:', {
            REDIS_URL: process.env.REDIS_URL ? 'SET' : 'NOT_SET',
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
            hasPassword: !!process.env.REDIS_PASSWORD,
            hasAuth: !!process.env.REDIS_AUTH
        });
    }
});
redis.on('close', () => console.log('Redis connection closed'));
redis.on('reconnecting', () => console.log('Redis reconnecting...')); 