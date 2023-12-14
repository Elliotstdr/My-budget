import { Request, Response } from "express";
import { DUser, User } from "../models/user.model";
import { badFileFormatERROR, noUserERROR, randomERROR } from "../services/const.service";
import { checkCsvData, findType, treatment, extractDoubleCSVData, isSemicolonOperator, treatmentXLSX, treatXlsxDates } from "../services/file.service";
import parser from 'csv-parser'
import exceljs from 'exceljs'

export const TreatFile = async (req: Request, res: Response) => {
  const user: any = await User.findById(req.params.id);
  if (!user) { return res.status(401).json(noUserERROR) }

  const file = req.file;
  if(!file) { return res.status(401).json({ message: "Fichier non trouvé" }) }

  let data: any = null

  try {
    if(file.originalname.split(".")[1] === 'csv') {
      data = await caseSimpleCSV(file, user)
    }
    if(file.originalname.split(".")[1] === 'xlsx') {
      data = await caseSimpleXLSX(file, user)
    }
  } catch {
    return res.status(401).json(randomERROR)
  }
  
  if(data) {
    res.status(200).json(data)
  } else {
    res.status(401).json(badFileFormatERROR)
  }
};

export const TreatDoubleFile = async (req: Request, res: Response) => {
  const user: any = await User.findById(req.params.id);
  if (!user) { return res.status(401).json(noUserERROR) }

  const file = req.file;
  if(!file) { return res.status(401).json({ message: "Fichier non trouvé" }) }

  let data: any = null

  if(file.originalname.split(".")[1] === 'csv') {
    data = await caseDoubleCSV(file, user)
  }
  if(file.originalname.split(".")[1] === 'xlsx') {
    data = await caseDoubleXLSX(file, user)
  }
  
  if(data) {
    res.status(200).json(data)
  } else {
    res.status(401).json(badFileFormatERROR)
  }
};

const caseSimpleCSV = async (file: any, user: DUser) => {
  return new Promise<any>((resolve) => {
    const rowList: any[] = []
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

      const rowListSemicolon: any[] = []
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

const caseSimpleXLSX = async (file: any, user: DUser) => {
  const data: any[] = []
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.load(file.buffer).then(async () => {
    const worksheet = workbook.worksheets[0];

    const keys = (worksheet.getRow(1).values as string[]).filter((x) => x !== undefined)
    // Parcourez les lignes de la feuille de calcul
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const rowData: Record<string, any> = {};
  
      // Accédez aux cellules de chaque ligne
      worksheet.getRow(rowNumber).eachCell((cell, colNumber) => {
        const columnHeader = keys[colNumber - 1];
        rowData[columnHeader] = cell.value;
      });
  
      data.push(rowData)
    }
  })

  if(checkCsvData(data)) {
    let treatedData = treatXlsxDates(data)
    treatedData = treatmentXLSX(treatedData)
    treatedData = await findType(treatedData, user)
    return treatedData
  }
  return
}

const caseDoubleCSV = async(file: any, user: DUser) => {
  return new Promise<any>((resolve) => {
    const rowList: any[] = []
    const cp = parser({separator: ","})
    cp.write(file.buffer.toString('utf8'));
    cp.end();
    cp.on('data', async (row) => { rowList.push(row) });

    cp.on('end', async () => {
      const extractedData: any[] = rowList.flatMap((x) => extractDoubleCSVData(x))
      if(checkCsvData(extractedData) && !isSemicolonOperator(rowList)) {
        let treatedData = treatment(extractedData)
        treatedData = await findType(treatedData, user)
        resolve(treatedData)
      }

      const rowListSemicolon: any[] = []
      const cpSC = parser({separator: ";"})
      cpSC.write(file.buffer.toString('utf8'));
      cpSC.end();
      cpSC.on('data', async (row) => { rowListSemicolon.push(row) });

      cpSC.on('end', async () => {
        const extractedData: any[] = rowListSemicolon.flatMap((x) => extractDoubleCSVData(x))
        if(!checkCsvData(extractedData)) return
        let treatedData = treatment(extractedData)
        treatedData = await findType(treatedData, user)
        resolve(treatedData)
      });
    });
  })
}

const caseDoubleXLSX = async(file: any, user: DUser) => {
  const data: any[] = []
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.load(file.buffer).then(async () => {
    const worksheet = workbook.worksheets[0];

    const dates = (worksheet.getRow(1).values as string[]).filter((x) => x !== undefined)
    const names = []
    const values: any[] = []
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