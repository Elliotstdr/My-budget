import express from "express";
import { auth, authBodyID, findTokenUser } from "../middleware/auth.middleware";
import { checkDebtProperty } from "../middleware/property.middleware";
import { createDebt, editDebt, findAllDebts, findDebt, removeDebt } from "../controllers/debt.controller";

const router = express.Router();

router.get("/", auth, findTokenUser, findAllDebts)
router.get("/:id", auth, checkDebtProperty, findDebt)
router.post("/", auth, authBodyID, createDebt)
router.put("/:id", auth, checkDebtProperty, editDebt)
router.delete("/:id", auth, checkDebtProperty, removeDebt)

export { router as debtRoutes};
