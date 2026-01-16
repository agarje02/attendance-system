import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

// Redis Client Singleton
// Prevents multiple instances of RedisClient in development (hot reload)
const globalForRedis = globalThis as unknown as {
    redis: RedisClientType | undefined;
};

let redis: RedisClientType;

if (!globalForRedis.redis) {
    redis = createClient({
        username: 'default',
        password: process.env.REDIS_PASSWORD as string,
        socket: {
            host: process.env.REDIS_HOST as string,
            port: 11556
        }
    });

    redis.on('error', (err) => {
        console.error('Redis Client Error', err);
    });

    if (process.env.NODE_ENV !== 'production') {
        globalForRedis.redis = redis;
    }
} else {
    redis = globalForRedis.redis;
}

const connectRedis = async () => {
    try {
        if (!redis.isOpen) {
            await redis.connect();
        }
        console.log('Redis connected successfully');
        return redis;
    }
    catch (error) {
        console.log('Redis connection error', error);
        process.exit(1);
    }
}

export { connectRedis, redis };
