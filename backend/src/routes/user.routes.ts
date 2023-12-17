import express from "express";
import { 
  findUser, 
  editUser, 
  removeUser, 
  editPassword 
} from "../controllers/user.controller";
import { auth, authID } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:id", auth, authID, findUser)
router.put("/:id", auth, authID, editUser)
router.delete("/:id", auth, authID, removeUser)
router.post("/:id/edit_password", auth, authID, editPassword)

export { router as userRoutes};
