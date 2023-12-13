import { Type } from "../models/type.model"

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