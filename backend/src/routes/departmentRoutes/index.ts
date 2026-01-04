import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import listDepartments from "./listDepartments";
import createDepartment from "./createDepartment";
import getDepartment from "./getDepartment";
import updateDepartment from "./updateDepartment";
import deleteDepartment from "./deleteDepartment";

const router = Router();

// All department routes require authentication
router.use(authMiddleware);

// Department CRUD operations
router.get("/", listDepartments); // List departments (optionally filtered by schoolId query param)
router.post("/", createDepartment); // Create a new department
router.get("/:id", getDepartment); // Get a specific department
router.put("/:id", updateDepartment); // Update a department
router.delete("/:id", deleteDepartment); // Delete a department

export default router;

