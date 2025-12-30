import { Router } from "express";
import signup from "./signup";
import login from "./login";
import authMiddleware from "../../middleware/auth";
import me from "./me";
import signUpWithGoogle from "./signUpWithGoogle";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/signup-with-google", signUpWithGoogle);
export default router;