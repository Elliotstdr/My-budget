import { Operation, DOperation } from "../models/operation.model";
import { Request, Response } from "express";
import { findTokenUser } from "../services/auth.service";
import { DUser } from "../models/user.model";
import { TYPE_REF, USER_REF, noOperationERROR, randomERROR } from "../services/const.service";
import { EditKeyword } from "../services/operation.service";

export const findAllOperations = async (req: Request, res: Response) => {
  const user: DUser | null = await findTokenUser(req.headers.authorization)

  if(!user) {
    return res.status(401).json(randomERROR);
  }

  const operations: DOperation[] = await Operation
    .find({ user })
    .sort({datePeriod: -1})
    .populate(USER_REF)
    .populate(TYPE_REF);

  if(!operations) {
    return res.status(401).json(noOperationERROR);
  }

  res.status(200).json(operations)
};

export const findByDate = async (req: Request, res: Response) => {
  if(
    !req.body.startDate || 
    !req.body.endDate ||
    req.body.startDate.split('-').length !== 3 ||
    req.body.endDate.split('-').length !== 3
  ) {
    return res.status(401).json({ message: "Aucune date renseignée" });
  }

  const user: DUser | null = await findTokenUser(req.headers.authorization)

  if(!user) {
    return res.status(401).json(randomERROR);
  }

  const operations: DOperation[] = await Operation
    .find({ 
      user,
      datePeriod: {$gte: req.body.startDate, $lt: req.body.endDate}
    })
    .populate(USER_REF)
    .populate(TYPE_REF);

  if(!operations) {
    return res.status(401).json(noOperationERROR);
  }

  res.status(200).json(operations)
};

export const findOperation = async (req: Request, res: Response) => {
  const operation: DOperation | null = await Operation.findOne({ _id: req.params.id })
    .populate(USER_REF)
    .populate(TYPE_REF);

  if(!operation) {
    return res.status(401).json(noOperationERROR);
  }

  res.status(200).json(operation)
};

export const createOperation = async (req: any, res: any) => {
  delete req.body._id;
  const operation = new Operation({
    ...req.body,
  });

  await EditKeyword(req.body.type, req.body.label)

  try {
    await operation.save();
    await operation.populate(USER_REF);
    await operation.populate(TYPE_REF);
    res.status(201).json(operation);
  } catch (error) {
    res.status(400).json(randomERROR);
  }
};

export const editOperation = async (req: Request, res: Response) => {
  const operation: DOperation | null = await Operation.findById(req.params.id);

  if (!operation) {
    return res.status(401).json(noOperationERROR);
  }

  await EditKeyword(operation.type._id, req.body.label)

  try {
    const updatedOp: DOperation | null = await Operation.findByIdAndUpdate(operation, req.body, { new: true })
    await updatedOp?.populate(USER_REF)
    await updatedOp?.populate(TYPE_REF)
    res.status(200).json(updatedOp)
  } catch (error) {
    res.status(400).json(randomERROR);
  }
};

export const removeOperation = async (req: Request, res: Response) => {
  const operationId = req.params.id

  const operation: DOperation | null = await Operation.findOne({ _id: operationId })

  if(!operation) {
    return res.status(401).json(noOperationERROR);
  }
  
  Operation.deleteOne({ _id: operationId })
    .then(() => {
      res.status(200).json({ message: "Opération supprimé !" })
    })
    .catch(() => res.status(400).json(randomERROR));
};