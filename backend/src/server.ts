import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import {connectDB} from "./config/database";
import http from "http";
import { initializeWebSocket } from "./websocket";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(router);
app.use((_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' ws://localhost:8000;"
  );
  next();
});

app.get("/api/test", (req, res) => {
  res.send("Working!");
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
   const server = app.listen(3000, () => {
      console.log("Server is running on port 8000");
    });
    initializeWebSocket(server);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();