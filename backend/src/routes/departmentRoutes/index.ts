import { Router } from "express";
import authMiddleware from "../../middleware/auth";

const router = Router();

// All department routes require authentication
router.use(authMiddleware);

// TODO: Implement department routes
// GET /departments?schoolId=:schoolId - List departments for a school
// POST /departments - Create a new department
// GET /departments/:id - Get a specific department
// PUT /departments/:id - Update a department
// DELETE /departments/:id - Delete a department

export default router;

