import { rateLimit } from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many login attempts from this IP, please try again after 5 minutes",
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

