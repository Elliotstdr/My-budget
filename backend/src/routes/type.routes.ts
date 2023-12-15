import express from "express";
import { 
  findAllTypes, 
  findType, 
  editType, 
  removeType, 
  // addKeyword, 
  createType
} from "../controllers/type.controller";
import { auth, authBodyID, findTokenUser } from "../middleware/auth.middleware";
import { checkTypeProperty } from "../middleware/property.middleware";

const router = express.Router();

router.get("/", auth, findTokenUser, findAllTypes)
router.get("/:id", auth, checkTypeProperty, findType)
router.post("/", auth, authBodyID, createType)
router.put("/:id", auth, checkTypeProperty, editType)
router.delete("/:id", auth, checkTypeProperty, removeType)
// router.post("/add_keyword", auth, addKeyword)

export { router as typeRoutes};
