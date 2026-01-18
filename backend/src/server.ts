// Load environment variables FIRST, before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes";
// import {connectDB} from "./config/database";
import { connectRedis } from "./config/redis";
import { initializeWebSocket } from "./websocket";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(express.json());
const allowedOrigins = JSON.parse((process.env.ALLOWED_ORIGINS || "['http://localhost:3000']").replace(/'/g, '"'));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(cookieParser());
app.set("trust proxy", 1);

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