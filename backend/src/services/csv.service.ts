import { DOperation, Operation } from "../models/operation.model"
import parser from 'csv-parser'

type TreatedOperation = {
  date: string,
  valeur: string | number,
  nom: string,
  type?: string
}

export const checkCsvData = (data: any) => {
  return data && data[0] && data[0].date && data[0].nom && data[0].valeur
}

export const treatment = (data: any) => {
  const newData: TreatedOperation[] = data.map((x: TreatedOperation) => 
    Object.fromEntries(
      Object.entries(x).filter(([key, value]) => value !== "" && key !== "")
    )
  )
  const filteredObject = newData.filter((x: TreatedOperation) => 
    Object.values(x).length === 3 && x.date.split("/").length === 3 && Number((x.valeur as string).replace(",", "."))
  )
  filteredObject.forEach((x: TreatedOperation) => x.valeur = Number((x.valeur as string).replace(",", ".")))

  return filteredObject
}

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