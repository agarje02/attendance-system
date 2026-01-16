import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import addClassMember from "./addClassMember";
import requestToJoinClass from "./requestToJoinClass";
import listClassMembers from "./listClassMembers";
import updateClassMember from "./updateClassMember";
import removeClassMember from "./removeClassMember";

const router = Router();

// All class member routes require authentication
router.use(authMiddleware);

// Class member routes
router.get("/", listClassMembers); // List members of a class (with filters)
router.post("/", addClassMember); // Add a member to a class (owner/teacher can add directly)
router.post("/request", requestToJoinClass); // Request to join a class (student can request)
router.put("/:classId/:userId", updateClassMember); // Update member status (approve/reject) or role
router.delete("/:classId/:userId", removeClassMember); // Remove a member from a class

export default router;

