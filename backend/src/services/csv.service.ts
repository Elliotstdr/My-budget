import { DOperation, Operation } from "../models/operation.model"
import parser from 'csv-parser'

type TreatedOperation = {
  date: string,
  valeur: string | number,
  nom: string,
  type?: string
}

/**
 * Check if data exists, as a first item and got "date", "nom" and "valeur" in its attributes
 * @param data 
 * @returns boolean
 */
export const checkCsvData = (data: any) => {
  return data && data[0] && data[0].date && data[0].nom && data[0].valeur
}

/**
 * Refine and sort the data from csv
 * @param data 
 * @returns 
 */
export const treatment = (data: any) => {
  // Delete empty attributes
  const newData: TreatedOperation[] = data.map((x: TreatedOperation) => 
    Object.fromEntries(
      Object.entries(x).filter(([key, value]) => value !== "" && key !== "")
    )
  )
  // Keeps only objects with the 3 attributes, those whith a 3 part date and those whose "valeur" is a number
  const filteredObject = newData.filter((x: TreatedOperation) => 
    Object.values(x).length === 3 && x.date.split("/").length === 3 && Number((x.valeur as string).replace(",", "."))
  )
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
export const findType = async (data: TreatedOperation[], user: any) => {
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
 * Extract the data from the csv to an Array of objects
 * @param file 
 * @param separator 
 * @returns Array of object
 */
export const extractCSVData = (file: Express.Multer.File, separator: boolean = false) => {
  // Utiliser csv-parser pour convertir le fichier CSV en JSON
  const data: any[] = []
  const csvParser = parser({separator: separator? ";" : ","})
  csvParser.write(file.buffer.toString('utf8'));
  csvParser.end();

  csvParser.on('data', (row) => {
    data.push(row);
  });

  return {data: data, parser: csvParser}
}