// config/redis.js
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('connect', () => console.log(`Redis Server is connected to : ${process.env.REDIS_URL} `));
redisClient.on('error', (err) => console.error('Redis Server Error', err));

// await redisClient.connect();

export default redisClient;