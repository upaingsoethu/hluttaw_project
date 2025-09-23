// Core modules 
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

// error handlers modules
import {
  routeErrorHandler,
  globalErrorHandler,
} from "./helpers/errorHandler.js";
// custom modules
import { apiLimiter, loginLimiter } from "./helpers/rateLimit.js";
import authRoute from "./routes/auth.route.js";
import committeeRoute from "./routes/committee.route.js";
import electionRoute from "./routes/election.route.js";
import governmentRoute from "./routes/government.route.js";
import hluttawRoute from "./routes/hluttaw.route.js";
import lawRoute from "./routes/law.route.js";
import meetingRoute from "./routes/meeting.route.js";
import politicalPartiesRoute from "./routes/political.parties.route.js";


import postRoute from "./routes/post.route.js";
import tagRoute from "./routes/tag.route.js";






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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// Basic route
app.get("/api", (req, res) => {
  res.send("မင်္ဂလာပါ! Ayeyarwady Region Hluttaw API is running...");
});

// Routes
//app.use("/api/", apiLimiter); // Apply to all routes under /api/
//app.use("/api/auth/login", loginLimiter); // Apply stricter limit to login route

app.use("/api/auth",  authRoute);   
app.use("/api/setting/committees", committeeRoute); 
app.use("/api/setting/election-types", electionRoute); 
app.use("/api/setting/governments", governmentRoute); 
app.use("/api/setting/hluttaw-times", hluttawRoute); 
app.use("/api/setting/meeting-types", meetingRoute); 
app.use("/api/setting/political-parties", politicalPartiesRoute); 
app.use("/api/data/laws", lawRoute); 
app.use("/api/data/posts", postRoute); 
app.use("/api/setting/tags", tagRoute); 








//routes error handler 
app.use(routeErrorHandler);
//global error handler
app.use(globalErrorHandler);

export default app;
