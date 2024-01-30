import { DOperation, Operation } from "../models/operation.model"
import { Type } from "../models/type.model"
import { TYPE_REF, USER_REF } from "./const.service"

/**
 * Add new name or edited name to the keyword list
 * @param reqType 
 * @param reqLabel 
 * @returns boolean
 */
export const EditKeyword = async (reqType: string, reqLabel: string): Promise<boolean> => {
  if(!reqType || !reqLabel) return false

  const type = await Type.findById(reqType)
  if(!type) return false

  const keywords = type.keywords.includes(reqLabel)
    ? type.keywords
    : [...type.keywords, reqLabel]
  
  await type.updateOne({keywords: keywords})
  
  return true
}

/**
 * Retourne toutes les opérations pour une plage de dates donnée
 * @param payload 
 * @returns DOperation[] | null
 */
export const findRangeDateOperations = async (payload: any) => {
  if(
    !payload.startDate || 
    !payload.endDate ||
    payload.startDate.split('-').length !== 3 ||
    payload.endDate.split('-').length !== 3
  ) {
    return null
  }
  
  return await Operation
    .find({ 
      user: payload.user,
      datePeriod: {$gte: payload.startDate, $lt: payload.endDate}
    })
    .populate(USER_REF)
    .populate(TYPE_REF);
}

/**
 * A partir d'un array d'opérations construit un array d'array d'opérations triés par type
 * @param data 
 * @returns ExpenseTypeSum[] | undefined
 */
export const expenseByType = (data: DOperation[]) => {
  const result: Record<string, DOperation[]> = {};

  // Itérer sur le tableau d'origine
  data.forEach((item) => {
    if(!item?.type?._id) return
    const typeId = item.type._id
    if (!result[typeId]) {
      result[typeId] = [];
    }
    result[typeId].push(item);
  });

  if(Object.values(result).length === 0) return

  const output: ExpenseTypeSum[] = []
  Object.values(result).forEach((operationArray: DOperation[]) => {
    let sum = 0
    operationArray.forEach((x) => sum += x.value)
    output.push({
      name: operationArray[0].type.label,
      value: sum,
    })
  })
  return output.sort((a,b) => b.value - a.value);
};