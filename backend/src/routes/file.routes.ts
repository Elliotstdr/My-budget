import express from "express";
import { TreatFile, TreatDoubleFile } from "../controllers/file.controller";
import { auth, authID } from "../middleware/auth";
import multer from 'multer';
import { timeout } from "../middleware/timeout";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/treat/for_user/:id", upload.single('file'), auth, authID, timeout, TreatFile)
router.post("/treat/double/for_user/:id", upload.single('file'), auth, authID, timeout, TreatDoubleFile)

export { router as fileRoutes};
