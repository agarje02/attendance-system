import { Router } from "express";
import authRouter from "./authRoutes";
import classRouter from "./classRoutes";
import attendanceRouter from "./attendanceRoutes";
import schoolRouter from "./schoolRoutes";
import departmentRouter from "./departmentRoutes";
import managedUserRouter from "./managedUserRoutes";
import classMemberRouter from "./classMemberRoutes";

const router = Router();

// Authentication routes
router.use("/auth", authRouter);

// Resource routes (require authentication)
router.use("/schools", schoolRouter);
router.use("/departments", departmentRouter);
router.use("/managed-users", managedUserRouter);
router.use("/class", classRouter);
router.use("/class-members", classMemberRouter);
router.use("/attendance", attendanceRouter);

export default router;