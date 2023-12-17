import { Operation, DOperation } from "../models/operation.model";
import { Request, Response } from "express";
import { TYPE_REF, USER_REF, noOperationERROR, randomERROR } from "../services/const.service";
import { EditKeyword } from "../services/operation.service";

type GroupedOperations = {
  [key: string]: DOperation[];
};

export const findAllOperations = async (req: Request, res: Response) => {
  const operations: DOperation[] = await Operation
    .find({ user: req.body.user })
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
  
  const operations: DOperation[] = await Operation
    .find({ 
      user: req.body.user,
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

export const createOperation = async (req: Request, res: Response) => {
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

export const findRedondantOperations = async (req: Request, res: Response) => {
  let operationsWithoutUser: DOperation[] = await Operation.find({ user: req.params.id }).populate(TYPE_REF);
  if(!operationsWithoutUser) return res.status(200).json([])

  operationsWithoutUser = operationsWithoutUser.filter((op) => op.type.user === null)

  const group: GroupedOperations = operationsWithoutUser.reduce((acc: GroupedOperations, obj: DOperation) => {
    // créé une key à partir du label et de la value qui sont nos éléments de groupement
    const key = `${obj.label}-${obj.value}`;
    if (!acc[key]) {
      acc[key] = [obj];
    } else {
      acc[key].push(obj);
    }
    return acc;
  }, {})

  const arrayGroup = Object.values(group).filter((x) => x.length >= 2)

  const finalData = arrayGroup.map((x) => {
    return {
      nom: x[0].label,
      valeur: x[0].value,
      type: x[0].type._id
    }
  })
  res.status(200).json(finalData)
}