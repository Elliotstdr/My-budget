import { Type, DType } from "../models/type.model";
import { Request, Response } from "express";
// import { compareTokenUserID } from "../services/auth.service";
import { USER_REF, noTypeERROR, randomERROR } from "../services/const.service";
import { Operation } from "../models/operation.model";

export const findAllTypes = async (req: Request, res: Response) => {
  const types: DType[] = await Type.find({
    $or: [
      { user: null },
      { user: req.body.user },
    ],
  }).populate(USER_REF);

  if(!types) {
    return res.status(401).json(noTypeERROR);
  }

  res.status(200).json(types)
};

export const findType = async (req: Request, res: Response) => {
  const type: DType | null = await Type.findOne({ _id: req.params.id }).populate(USER_REF)

  if(!type) {
    return res.status(401).json(noTypeERROR);
  }

  res.status(200).json(type)
};

export const createType = async (req: Request, res: Response) => {
  if(!req.body.user) {
    return res.status(401).json(randomERROR);
  }

  const existingType: DType[] = await Type.find({
    $or: [{ user: null }, { user: req.body.user }],
    label: req.body.label
  })

  if(existingType.length !== 0) {
    return res.status(401).json("Un type portant ce nom existe déjà")
  }

  delete req.body._id;
  const type = new Type({
    ...req.body,
  });

  try {
    await type.save();
    await type.populate(USER_REF);
    res.status(201).json(type);
  } catch (error) {
    res.status(400).json(randomERROR);
  }
};

export const editType = async (req: Request, res: Response) => {
  const type: DType | null = await Type.findById(req.params.id);

  if (!type) {
    return res.status(401).json(noTypeERROR);
  }

  const existingType: DType[] = await Type.find({
    $or: [{ user: null }, { user: req.body.user }],
    label: req.body.label
  })

  if(existingType.length !== 0) {
    return res.status(401).json("Un type portant ce nom existe déjà")
  }

  try {
    const updatedType: DType | null = await Type.findByIdAndUpdate(type, req.body, { new: true })
    updatedType?.populate(USER_REF)
    res.status(200).json(updatedType)
  } catch (error) {
    res.status(400).json(randomERROR);
  }
};

export const removeType = async (req: Request, res: Response) => {
  const typeId = req.params.id

  const type: DType | null = await Type.findOne({ _id: typeId })

  if(!type) {
    return res.status(401).json(noTypeERROR);
  }
  
  Type.deleteOne({ _id: typeId })
    .then(() => {
      Operation.updateMany({type: type}, {type: null})
      res.status(200).json({ message: "Type supprimé !" })
    })
    .catch(() => res.status(400).json(randomERROR));
};