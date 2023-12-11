import express from "express";
import { findUser, editUser, removeUser, Statistics, Dashboard, editPassword } from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/:id", auth, findUser)
router.put("/:id", auth, editUser)
router.delete("/:id", auth, removeUser)
router.post("/statistics", auth, Statistics)
router.post("/dashboard", auth, Dashboard)
router.post("/:id/edit_password", auth, editPassword)

export { router as userRoutes};
