import { Router } from "express";
import authMiddleware from "../../middleware/auth";

const router = Router();

// All class member routes require authentication
router.use(authMiddleware);

// TODO: Implement class member routes
// GET /class-members?classId=:classId - List members of a class
// POST /class-members - Add a member to a class (create)
// PUT /class-members/:classId/:userId - Update member status (approve/reject) or role
// DELETE /class-members/:classId/:userId - Remove a member from a class

export default router;

