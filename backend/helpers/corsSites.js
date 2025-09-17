import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "https://ayeyarwadyregion.hluttaw.mm", // Production frontend
  "https://api.ayeyarwadyregion.hluttaw.mm", // API self-access
  "http://localhost:5000", // ✅ Dev mode frontend
];

export const CORS  = app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-to-server
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true, // allow cookies
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
}));