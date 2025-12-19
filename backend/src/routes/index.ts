import { Router } from "express";
import authRouter from "./authRoutes";
import classRouter from "./classRoutes";
import attendanceRouter from "./attendanceRoutes";
import authMiddleware from "../middleware/auth";
import getStudents from "./classRoutes/getStudents";

const router = Router();

router.use("/auth", authRouter);
router.use("/class", classRouter);
router.use("/attendance", attendanceRouter);
router.get("/students", authMiddleware, getStudents);

export default router;