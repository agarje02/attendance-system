import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import createClass from "./createClass";
import addStudent from "./addStudent";
import getClass from "./getClass";
import getMyAttendanceByClassId from "./getMyAttendanceByClassId";

const router = Router();

router.post("/", authMiddleware, createClass);

router.post("/:id/add-student",authMiddleware,addStudent);

router.get("/:id",authMiddleware,getClass)

router.get("/:id/my-attendance",authMiddleware,getMyAttendanceByClassId);

export default router;