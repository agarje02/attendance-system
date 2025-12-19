import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import teacherAuthMiddleware from "../../middleware/teacherAuth";
import startAttendance from "./startAttendance";

const router = Router();

// All attendance routes require authentication
router.use(authMiddleware);

// Start attendance requires teacher role
router.post("/start", teacherAuthMiddleware, startAttendance);

export default router;
