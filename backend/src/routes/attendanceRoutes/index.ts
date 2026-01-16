import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import teacherAuthMiddleware from "../../middleware/teacherAuth";
import startAttendance from "./startAttendance";
import createSession from "./createSession";
import getSessions from "./getSessions";
import getSession from "./getSession";
import updateSession from "./updateSession";
import markAttendance from "./markAttendance";
import finalizeSession from "./finalizeSession";
import getSessionAttendance from "./getSessionAttendance";

const router = Router();

// All attendance routes require authentication
router.use(authMiddleware);

// ClassSession/Attendance routes
router.post("/start", teacherAuthMiddleware, startAttendance); // Start an attendance session
router.post("/sessions", teacherAuthMiddleware, createSession); // Create a scheduled session
router.get("/sessions", getSessions); // List sessions (filter by classId, etc.)
router.get("/sessions/:id", getSession); // Get a specific session
router.put("/sessions/:id", teacherAuthMiddleware, updateSession); // Update a session
router.post("/sessions/:id/mark", teacherAuthMiddleware, markAttendance); // Mark attendance for a session
router.post("/sessions/:id/finalize", teacherAuthMiddleware, finalizeSession); // Finalize a session
router.get("/sessions/:id/attendance", getSessionAttendance); // Get attendance for a session

export default router;
