import { Operation, DOperation } from "../models/operation.model";
import { Request, Response } from "express";
import { findTokenUser } from "../services/auth.service";
import { DUser, User } from "../models/user.model";
import { TYPE_REF, USER_REF, badFileFormatERROR, noOperationERROR, noUserERROR, randomERROR } from "../services/const.service";
import { checkCsvData, extractCSVData, findType, treatment } from "../services/csv.service";
import { EditKeyword } from "../services/operation.service";
// import exceljs from 'exceljs'

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

export const TreatCSV = async (req: Request, res: Response) => {
  const user: any = await User.findById(req.params.id);

  if (!user) {
    return res.status(401).json(noUserERROR);
  }

  const file = req.file;
  if(!file) {
    return res.status(401).json({ message: "Fichier non trouvé" });
  }

  const extract = extractCSVData(file)
  extract.parser.on('end', async () => {
    if(checkCsvData(extract.data)) {
      let treatedData = treatment(extract.data)
      treatedData = await findType(treatedData, user)
      return res.status(200).json(treatedData)
    }

    const flatted = Object.keys(extract.data[0])

    if(!flatted || !flatted[0] || flatted[0].split(";").length <= 2) {
      return res.status(401).json(badFileFormatERROR);
    }

    const extractSemicolon = extractCSVData(file, true)
    extractSemicolon.parser.on('end', async () => {
      if(!checkCsvData(extractSemicolon.data)) {
        return res.status(401).json(badFileFormatERROR);
      }
      let treatedData = treatment(extractSemicolon.data)
      treatedData = await findType(treatedData, user)
      return res.status(200).json(treatedData)
    });
  });
};

// ? Pour tableaux croisés
// const values = Object.values(row)
//     const keys = Object.keys(row)
//     const name = values[0]

//     values.shift()
//     keys.shift()

//     let i = 0
//     values.forEach((x) => {
//       csvData.push({
//         nom: name,
//         date: keys[i],
//         value: x
//       })
//       i += 1
//     })

//     console.log(csvData)

// ? Pour fichiers xlsx
// if(file.originalname.split(".")[1] === 'xlsx') {
//   const workbook = new exceljs.Workbook();
//   workbook.xlsx.load(file.buffer).then(() => {
//     const worksheet = workbook.worksheets[0];

//     const keys = worksheet.getRow(1).values as string[]
//     // Parcourez les lignes de la feuille de calcul
//     for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
//       const rowData: Record<string, any> = {};
  
//       // Accédez aux cellules de chaque ligne
//       worksheet.getRow(rowNumber).eachCell((cell, colNumber) => {
//         const columnHeader = keys[colNumber - 1];
//         rowData[columnHeader] = cell.value;
//       });
  
//       // À ce stade, vous avez les données de la ligne avec les noms de colonnes
//       console.log('Données de la ligne:', rowData);
//     }

//     // Alternativement, vous pouvez extraire les données sous forme de tableau
//     const data = worksheet.getSheetValues();
//     console.log('Données extraites:', data);
//   })
// }