import express from "express";
import { 
  findAllOperations, 
  findOperation, 
  editOperation, 
  removeOperation, 
  createOperation, 
  TreatCSV,
  findByDate,
  TreatDoubleCSV
} from "../controllers/operation.controller";
import { auth } from "../middleware/auth";
import multer from 'multer';
import { checkOperationProperty } from "../middleware/property";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", auth, findAllOperations)
router.get("/:id", auth, checkOperationProperty, findOperation)
router.post("/", auth, createOperation)
router.put("/:id", auth, checkOperationProperty, editOperation)
router.delete("/:id", checkOperationProperty, auth, removeOperation)
router.post("/treat/for_user/:id", upload.single('file'), auth, TreatCSV)
router.post("/treat/double/for_user/:id", upload.single('file'), auth, TreatDoubleCSV)
router.post("/byDate", auth, findByDate)

export { router as operationRoutes};
