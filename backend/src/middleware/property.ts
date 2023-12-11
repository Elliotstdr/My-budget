import { DOperation, Operation } from "../models/operation.model";
import { DType, Type } from "../models/type.model";
import { compareTokenUserID } from "../services/auth.service";

export const checkTypeProperty = async (req: any, res: any, next: any) => {
  const type: DType | null = await Type.findOne({ _id: req.params.id })

  if(!type) {
    return res.status(401).json({ message: "Type non trouvé" });
  }

  if(!compareTokenUserID(req.headers.authorization, type?.user?._id)) {
    return res.status(401).json({ message: "Vous n'avez pas l'autorisation d'altérer ce type" });
  }

  next()
}

export const checkOperationProperty = async (req: any, res: any, next: any) => {
  const operation: DOperation | null = await Operation.findOne({ _id: req.params.id })

  if(!operation) {
    return res.status(401).json({ message: "Opération non trouvé" });
  }

  if(!compareTokenUserID(req.headers.authorization, operation?.user?._id)) {
    return res.status(401).json({ message: "Vous n'avez pas l'autorisation d'altérer' cette opération" });
  }

  next()
}