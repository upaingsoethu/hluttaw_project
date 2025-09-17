import app from './app.js';
import mongodbConnection from './db/mongo.connection.js';
import redisClient from './db/redis.connection.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
    console.log(`Node Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    await mongodbConnection();
    await redisClient.connect();
});