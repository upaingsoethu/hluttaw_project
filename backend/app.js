// Core modules 
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// error handlers modules
import {
  routeErrorHandler,
  globalErrorHandler,
} from "./helpers/errorHandler.js";
// custom modules
import { apiLimiter, loginLimiter } from "./helpers/rateLimit.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import tagRoute from "./routes/tag.route.js";
import committeeRoute from "./routes/committee.route.js";
import electionRoute from "./routes/election.route.js";

import { CORS } from "./helpers/corsSites.js";
// Load environment variables from .env file
dotenv.config();

// Initialize Express app 
const app = express();

// CORS configuration
app.use(CORS);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Cookie parser middleware


// Basic route
app.get("/api", (req, res) => {
  res.send("Hey! Ayeyarwady Region Hluttaw API is running...");
});

// Routes
//app.use("/api/", apiLimiter); // Apply to all routes under /api/
//app.use("/api/auth/login", loginLimiter); // Apply stricter limit to login route

app.use("/api/auth",  authRoute);   
app.use("/api/posts", postRoute); 
app.use("/api/tags", tagRoute); 
app.use("/api/committees", committeeRoute); 
app.use("/api/election-types", electionRoute); 


//routes error handler 
app.use(routeErrorHandler);
//global error handler
app.use(globalErrorHandler);

export default app;
