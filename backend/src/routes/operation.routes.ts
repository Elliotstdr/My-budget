import express from "express";
import { 
  findAllOperations, 
  findOperation, 
  editOperation, 
  removeOperation, 
  createOperation, 
  findByDate,
  findRedondantOperations
} from "../controllers/operation.controller";
import { auth, authBodyID, authID, findTokenUser } from "../middleware/auth";
import { checkOperationProperty } from "../middleware/property";

const router = express.Router();

router.get("/", auth, findTokenUser, findAllOperations)
router.get("/:id", auth, checkOperationProperty, findOperation)
router.post("/", auth, authBodyID, createOperation)
router.put("/:id", auth, checkOperationProperty, editOperation)
router.delete("/:id", auth, checkOperationProperty, removeOperation)
router.post("/byDate", auth, findTokenUser, findByDate)
router.post("/redondant/user/:id", auth, authID, findRedondantOperations)

export { router as operationRoutes};
