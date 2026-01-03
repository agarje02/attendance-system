import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import listSchools from "./listSchools";
import createSchool from "./createSchool";
import getSchool from "./getSchool";
import updateSchool from "./updateSchool";
import deleteSchool from "./deleteSchool";

const router = Router();

// All school routes require authentication
router.use(authMiddleware);

// School CRUD operations
router.get("/", listSchools); // List all schools for the authenticated user
router.post("/", createSchool); // Create a new school
router.get("/:id", getSchool); // Get a specific school
router.put("/:id", updateSchool); // Update a school
router.delete("/:id", deleteSchool); // Delete a school

export default router;

