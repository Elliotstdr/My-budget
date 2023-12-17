import { DOperation, Operation } from "../models/operation.model"
import { DUser } from "../models/user.model";

/**
 * Check if data exists, as a first item and got "date", "nom" and "valeur" in its attributes
 * @param data 
 * @returns boolean
 */
export const checkCsvData = (data: DynamicStringObject[]) => {
  return data && data[0] && data[0].date && data[0].nom && data[0].valeur
}

/**
 * Refine and sort the data from csv
 * @param data 
 * @returns TreatedOperation[]
 */
export const treatment = (data: DynamicStringObject[]) => {
  // Delete empty attributes
  const newData: DynamicStringObject[] = data.map((x: DynamicStringObject) => 
    Object.fromEntries(
      Object.entries(x).filter(([key, value]) => value !== "" && key !== "")
    )
  )
  // Keeps only objects with the 3 attributes, those whith a 3 part date and those whose "valeur" is a number
  const filteredObject: TreatedOperation[] = newData
    .filter((x: DynamicStringObject) =>
      x.date && x.nom && x.valeur && 
      x.date.split("/").length === 3 && 
      Number((x.valeur as string).replace(",", "."))
    )
    .map((x: Partial<TreatedOperation>) => {
      return {
        date: x.date as string,
        nom: x.nom as string,
        valeur: x.valeur as string
      }
    })
  // Convert "valeur" to number and replace comma by dot
  filteredObject.forEach((x: TreatedOperation) => x.valeur = Number((x.valeur as string).replace(",", ".")))

  return filteredObject
}

/**
 * For each operation, from existing operations with the same, extract the type of the existing operation
 * @param data 
 * @param user 
 * @returns data with types if a correspondance exists
 */
export const findType = async (data: TreatedOperation[], user: DUser) => {
  const operations: DOperation[] = await Operation.find({user: user})

  if(operations.length === 0) return data

  const newData = data.map((x)=>{
    const sameNameOperations = operations.filter((op) => op.label === x.nom)
    if(sameNameOperations.length === 0) return x

    return {
      ...x,
      type: sameNameOperations[0].type._id
    }
  })
  return newData
}

/**
 * Vérifie que la data extraite ne contient pas de semicolon
 * @param data 
 * @returns boolean
 */
export const isSemicolonOperator = (data: DynamicStringObject[]) => {
  if(!data || !Array.isArray(data) || !data[0]) return false
  const values: string = Object.values<string>(data[0])[0]
  return values.split(";").length > 2
}

/**
 * Transforme la row brut en objet
 * @param row 
 * @returns TreatedOperation[]
 */
export const extractDoubleCSVData = (row: DynamicStringObject) => {
  const data: TreatedOperation[] = []
  const values = Object.values(row)
  const keys = Object.keys(row)
  const name = values[0]

  values.shift()
  keys.shift()

  let i = 0
  values.forEach((x) => {
    data.push({
      nom: name,
      date: keys[i],
      valeur: x
    })
    i += 1
  })
  return data
}

/**
 * Refine and sort the data from csv
 * @param data 
 * @returns TreatedOperation[]
 */
export const treatmentXLSX = (data: DynamicStringObject[]) => {
  // Delete empty attributes
  const newData: DynamicStringObject[] = data.map((x: DynamicStringObject) => 
    Object.fromEntries(
      Object.entries(x).filter(([key, value]) => value !== "" && key !== "")
    )
  )
  // Keeps only objects with the 3 attributes, those whith a 3 part date and those whose "valeur" is a number
  const filteredObject = newData
    .filter((x: DynamicStringObject) =>
      x.date && x.nom && x.valeur && 
      x.date.split("/").length === 3 && 
      Number(x.valeur)
    )
    .map((x: Partial<TreatedOperation>) => {
      return {
        date: x.date as string,
        nom: x.nom as string,
        valeur: x.valeur as string | number
      }
    })
  return filteredObject
}

/**
 * Si la date est de type date, la met au format jj/mm/yyyy
 * @param data 
 * @returns DynamicStringObject[]
 */
export const treatXlsxDates = (data: DynamicStringObject[]) => {
  const newData: DynamicStringObject[] = []
  data.forEach((x) => {
    const date = x.date
    if(!date || typeof date === "string") {
      newData.push(x)
      return
    }

    const formattedDate = new Date(date).toLocaleDateString('fr-FR');
    newData.push({
      ...x,
      date: formattedDate
    })
  })
  return newData
}