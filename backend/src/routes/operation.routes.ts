import express from "express";
import { 
  findAllOperations, 
  findOperation, 
  editOperation, 
  removeOperation, 
  createOperation, 
  findByDate
} from "../controllers/operation.controller";
import { auth } from "../middleware/auth";
import { checkOperationProperty } from "../middleware/property";

const router = express.Router();

router.get("/", auth, findAllOperations)
router.get("/:id", auth, checkOperationProperty, findOperation)
router.post("/", auth, createOperation)
router.put("/:id", auth, checkOperationProperty, editOperation)
router.delete("/:id", checkOperationProperty, auth, removeOperation)
router.post("/byDate", auth, findByDate)

export { router as operationRoutes};
