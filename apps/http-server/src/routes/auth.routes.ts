
import { Router } from "express";
import { login, signup } from "../controller/auth.controller";

const router = Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
export default router;
