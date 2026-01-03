import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import createClass from "./createClass";
import getClass from "./getClass";
import getMyAttendanceByClassId from "./getMyAttendanceByClassId";

const router = Router();

// All class routes require authentication
router.use(authMiddleware);

// Class CRUD operations
router.post("/", createClass); // Create a new class
// TODO: router.get("/", listClasses); // List all classes for the authenticated user
router.get("/:id", getClass); // Get a specific class
// TODO: router.put("/:id", updateClass); // Update a class
// TODO: router.delete("/:id", deleteClass); // Delete a class

// Class-specific routes
router.get("/:id/my-attendance", getMyAttendanceByClassId); // Get my attendance for a class

// Note: add-student route moved to /class-members endpoint

export default router;