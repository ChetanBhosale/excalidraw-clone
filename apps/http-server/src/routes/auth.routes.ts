
import { Router } from "express";
import { signup } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup",[authMiddleware as any], signup as any);

export default router;
