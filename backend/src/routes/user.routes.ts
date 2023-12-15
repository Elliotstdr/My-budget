import express from "express";
import { 
  findUser, 
  editUser, 
  removeUser, 
  // Statistics, 
  // Dashboard, 
  editPassword 
} from "../controllers/user.controller";
import { auth, authID } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:id", auth, authID, findUser)
router.put("/:id", auth, authID, editUser)
router.delete("/:id", auth, authID, removeUser)
// router.post("/statistics", auth, Statistics)
// router.post("/dashboard", auth, Dashboard)
router.post("/:id/edit_password", auth, authID, editPassword)

export { router as userRoutes};
