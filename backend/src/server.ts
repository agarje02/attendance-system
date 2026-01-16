// Load environment variables FIRST, before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes";
// import {connectDB} from "./config/database";
import { connectRedis } from "./config/redis";
import { initializeWebSocket } from "./websocket";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use((_req, res, next) => {
  // CORS configuration
  const origin = _req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' ws://localhost:8000;"
  );
  next();
});
app.use(router);

app.get("/api/test", (req, res) => {
  res.send("Working!");
});

// Connect to database and start server
const startServer = async () => {
  try {
    // await connectDB();
    await connectRedis();
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
    initializeWebSocket(server);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();