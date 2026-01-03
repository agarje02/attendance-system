import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import teacherAuthMiddleware from "../../middleware/teacherAuth";
import startAttendance from "./startAttendance";

const router = Router();

// All attendance routes require authentication
router.use(authMiddleware);

// ClassSession/Attendance routes
router.post("/start", teacherAuthMiddleware, startAttendance); // Start an attendance session
// TODO: router.post("/sessions", teacherAuthMiddleware, createSession); // Create a scheduled session
// TODO: router.get("/sessions", /* getSessions */); // List sessions (filter by classId, etc.)
// TODO: router.get("/sessions/:id", /* getSession */); // Get a specific session
// TODO: router.put("/sessions/:id", teacherAuthMiddleware, /* updateSession */); // Update a session
// TODO: router.post("/sessions/:id/mark", teacherAuthMiddleware, /* markAttendance */); // Mark attendance for a session
// TODO: router.post("/sessions/:id/finalize", teacherAuthMiddleware, /* finalizeSession */); // Finalize a session
// TODO: router.get("/sessions/:id/attendance", /* getSessionAttendance */); // Get attendance for a session

export default router;
