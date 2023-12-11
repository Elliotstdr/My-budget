import express from "express";
import { signUp, login } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signUp)
router.post("/login", login)

export { router as  authRoutes};
