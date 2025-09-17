import redisClient from "../db/redis.connection.js";

export const redisStoreRefreshToken = async (user, refreshToken) => {
  await redisClient.set(
    `refresh_token:${user._id}`.toString(),
    refreshToken,
    { EX: process.env.REDIS_REFRESH_TOKEN_EXPIRES_IN } 
  );
};

export const redisDeleteRefreshToken = async (user) => {
  await redisClient.del(`refresh_token:${user._id}`.toString());
};

export const redisGetRefreshToken = async (user) => {
  const redisRefreshToken = await redisClient.get(`refresh_token:${user._id}`.toString());
  return redisRefreshToken;
};
