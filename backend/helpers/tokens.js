// utils/generateTokens.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = async (userId) => {
    return jwt.sign({ userId }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN, // Access token expires 
    });
};

const generateRefreshToken = async (userId) => {
    return jwt.sign({userId }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN, // Refresh token expires 
    });
};

export { generateAccessToken, generateRefreshToken };