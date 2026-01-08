import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import listManagedUsers from "./listManagedUsers";
import createManagedUser from "./createManagedUser";
import getManagedUser from "./getManagedUser";
import updateManagedUser from "./updateManagedUser";
import deleteManagedUser from "./deleteManagedUser";

const router = Router();

// All managed user routes require authentication
router.use(authMiddleware);

// Managed user CRUD operations
router.get("/", listManagedUsers); // List managed users (optionally filtered by departmentId or role query params)
router.post("/", createManagedUser); // Create a new managed user (teacher/student)
router.get("/:id", getManagedUser); // Get a specific managed user
router.put("/:id", updateManagedUser); // Update a managed user
router.delete("/:id", deleteManagedUser); // Delete a managed user

export default router;

