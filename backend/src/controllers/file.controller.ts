import { Request, Response } from "express";
import { DUser, User } from "../models/user.model";
import { badFileFormatERROR, noFileERROR, noUserERROR } from "../services/const.service";
import { checkCsvData, findType, treatment, extractDoubleCSVData, isSemicolonOperator, treatmentXLSX, treatXlsxDates } from "../services/file.service";
import parser from 'csv-parser'
import exceljs from 'exceljs'

export const TreatFile = async (req: Request, res: Response) => {
  const user: DUser | null = await User.findById(req.params.id);
  if (!user) { return res.status(401).json(noUserERROR) }

  const file = req.file;
  if(!file) { return res.status(401).json(noFileERROR) }

  let data: TreatedOperation[] = []

  try {
    if(file.originalname.split(".")[1] === 'csv') {
      const treatedData = await caseSimpleCSV(file, user)
      if(treatedData) data = treatedData
    }
    if(file.originalname.split(".")[1] === 'xlsx') {
      const treatedData = await caseSimpleXLSX(file, user)
      if(treatedData) data = treatedData
    }
  } catch {
    return res.status(401).json(badFileFormatERROR)
  }
  
  if(data.length > 0) {
    res.status(200).json(data)
  } else {
    res.status(401).json(badFileFormatERROR)
  }
};

export const TreatDoubleFile = async (req: Request, res: Response) => {
  const user: DUser | null = await User.findById(req.params.id);
  if (!user) { return res.status(401).json(noUserERROR) }

  const file = req.file;
  if(!file) { return res.status(401).json(noFileERROR) }

  let data: TreatedOperation[] = []

  try {
    if(file.originalname.split(".")[1] === 'csv') {
      const treatedData = await caseDoubleCSV(file, user)
      if(treatedData) data = treatedData
    }
    if(file.originalname.split(".")[1] === 'xlsx') {
      const treatedData = await caseDoubleXLSX(file, user)
      if(treatedData) data = treatedData
    }
  } catch {
    return res.status(401).json(badFileFormatERROR)
  }
  
  if(data.length > 0) {
    res.status(200).json(data)
  } else {
    res.status(401).json(badFileFormatERROR)
  }
};

const caseSimpleCSV = async (file: Express.Multer.File, user: DUser) => {
  return new Promise<TreatedOperation[] | undefined>((resolve) => {
    const rowList: DynamicStringObject[] = []
    const cp = parser({separator: ","})
    cp.write(file.buffer.toString('utf8'));
    cp.end();
    cp.on('data', (row) => { rowList.push(row) });
    cp.on('end', async () => {
      if(checkCsvData(rowList)) {
        let treatedData = treatment(rowList)
        treatedData = await findType(treatedData, user)
        resolve(treatedData)
      }

      // Check if separator seems to be semicolon, if not exit
      const flatted = Object.keys(rowList[0])
      if(!flatted || !flatted[0] || flatted[0].split(";").length <= 2) {
        return
      }

      const rowListSemicolon: DynamicStringObject[] = []
      const cpSC = parser({separator: ";"})
      cpSC.write(file.buffer.toString('utf8'));
      cpSC.end();
      cpSC.on('data', (row) => { rowListSemicolon.push(row) });

      cpSC.on('end', async () => {
        if(!checkCsvData(rowListSemicolon)) {
          return
        }
        let treatedData = treatment(rowListSemicolon)
        treatedData = await findType(treatedData, user)
        resolve(treatedData)
      });
    });
  })
}

const caseSimpleXLSX = async (file: Express.Multer.File, user: DUser) => {
  const data: DynamicStringObject[] = []
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.load(file.buffer).then(async () => {
    const worksheet = workbook.worksheets[0];

    const keys = (worksheet.getRow(1).values as string[]).filter((x) => x !== undefined)
    // Parcourez les lignes de la feuille de calcul
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const rowData: DynamicStringObject = {};
  
      // Accédez aux cellules de chaque ligne
      worksheet.getRow(rowNumber).eachCell((cell, colNumber) => {
        const columnHeader = keys[colNumber - 1];
        rowData[columnHeader] = cell.value;
      });
  
      data.push(rowData)
    }
  })

  if(checkCsvData(data)) {
    const treatedDatesData = treatXlsxDates(data)
    let treatedData = treatmentXLSX(treatedDatesData)
    treatedData = await findType(treatedData, user)
    return treatedData
  }
  return
}

const caseDoubleCSV = async(file: Express.Multer.File, user: DUser) => {
  return new Promise<TreatedOperation[] | undefined>((resolve) => {
    const rowList: DynamicStringObject[] = []
    const cp = parser({separator: ","})
    cp.write(file.buffer.toString('utf8'));
    cp.end();
    cp.on('data', async (row) => { rowList.push(row) });

    cp.on('end', async () => {
      const extractedData = rowList.flatMap((x) => extractDoubleCSVData(x))
      if(checkCsvData(extractedData) && !isSemicolonOperator(rowList)) {
        let treatedData = treatment(extractedData)
        treatedData = await findType(treatedData, user)
        resolve(treatedData)
      }

      const rowListSemicolon: DynamicStringObject[] = []
      const cpSC = parser({separator: ";"})
      cpSC.write(file.buffer.toString('utf8'));
      cpSC.end();
      cpSC.on('data', async (row) => { rowListSemicolon.push(row) });

      cpSC.on('end', async () => {
        const extractedData: TreatedOperation[] = rowListSemicolon.flatMap((x) => extractDoubleCSVData(x))
        if(!checkCsvData(extractedData)) return
        let treatedData = treatment(extractedData)
        treatedData = await findType(treatedData, user)
        resolve(treatedData)
      });
    });
  })
}

const caseDoubleXLSX = async(file: Express.Multer.File, user: DUser) => {
  const data: TreatedOperation[] = []
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.load(file.buffer).then(async () => {
    const worksheet = workbook.worksheets[0];

    const dates = (worksheet.getRow(1).values as string[]).filter((x) => x !== undefined)
    const names = []
    const values: DynamicStringObject[] = []
    // Parcourez les lignes de la feuille de calcul
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      // Accédez aux cellules de chaque ligne
      const row = (worksheet.getRow(rowNumber).values as string[]).filter((x) => x !== undefined)
      names.push(row[0])

      row.shift()
      values.push(row)
    }

    names.forEach((name, nameIndex) => {
      dates.forEach((date, dateIndex) => {
        data.push({
          date: typeof date === "object" ? new Date(date).toLocaleDateString('fr-FR') : date,
          nom: name,
          valeur: values[nameIndex][dateIndex]
        })
      })
    })
  })

  if(checkCsvData(data)) {
    let treatedData = treatmentXLSX(data)
    treatedData = await findType(treatedData, user)
    return treatedData
  }
  return
}