import { Router } from "express";
import signup from "./signup";
import login from "./login";
import authMiddleware from "../../middleware/auth";
import me from "./me";
import signUpWithGoogle from "./signUpWithGoogle";
import refresh from "./refresh";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/signup-with-google", signUpWithGoogle);
router.post("/refresh", refresh);
export default router;