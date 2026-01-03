import { Router } from "express";
import authMiddleware from "../../middleware/auth";

const router = Router();

// All managed user routes require authentication
router.use(authMiddleware);

// TODO: Implement managed user routes
// GET /managed-users - List all managed users for the authenticated user
// POST /managed-users - Create a new managed user (teacher/student)
// GET /managed-users/:id - Get a specific managed user
// PUT /managed-users/:id - Update a managed user
// DELETE /managed-users/:id - Delete a managed user

export default router;

