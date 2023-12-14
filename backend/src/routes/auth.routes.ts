import express from "express";
import { signUp, login, refreshToken } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signUp)
router.post("/login", login)
router.post("/refresh", refreshToken)

export { router as  authRoutes};
