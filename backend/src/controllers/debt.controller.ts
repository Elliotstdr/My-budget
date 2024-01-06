import { Request, Response } from "express";
import { USER_REF, noDebtERROR, randomERROR } from "../services/const.service";
import { DDebt, Debt } from "../models/debt.model";

export const findAllDebts = async (req: Request, res: Response) => {
  const debts: DDebt[] = await Debt.find({
    $or: [
      { user: null },
      { user: req.body.user },
    ],
  }).populate(USER_REF);

  if(!debts) {
    return res.status(401).json(noDebtERROR);
  }

  res.status(200).json(debts)
};

export const findDebt = async (req: Request, res: Response) => {
  const debt: DDebt | null = await Debt.findOne({ _id: req.params.id }).populate(USER_REF)

  if(!debt) {
    return res.status(401).json(noDebtERROR);
  }

  res.status(200).json(debt)
};

export const createDebt = async (req: Request, res: Response) => {
  if(!req.body.user) {
    return res.status(401).json(randomERROR);
  }

  delete req.body._id;
  const debt = new Debt({
    ...req.body,
  });

  try {
    await debt.save();
    await debt.populate(USER_REF);
    res.status(201).json(debt);
  } catch (error) {
    res.status(400).json(randomERROR);
  }
};

export const editDebt = async (req: Request, res: Response) => {
  const debt: DDebt | null = await Debt.findById(req.params.id);

  if (!debt) {
    return res.status(401).json(noDebtERROR);
  }

  try {
    const updatedDebt: DDebt | null = await Debt.findByIdAndUpdate(debt, req.body, { new: true })
    updatedDebt?.populate(USER_REF)
    res.status(200).json(updatedDebt)
  } catch (error) {
    res.status(400).json(randomERROR);
  }
};

export const removeDebt = async (req: Request, res: Response) => {
  const debtId = req.params.id

  const debt: DDebt | null = await Debt.findOne({ _id: debtId })

  if(!debt) {
    return res.status(401).json(noDebtERROR);
  }
  
  Debt.deleteOne({ _id: debtId })
    .then(() => {
      res.status(200).json({ message: "Dette supprimée !" })
    })
    .catch(() => res.status(400).json(randomERROR));
};