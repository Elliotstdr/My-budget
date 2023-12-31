import { formatMonthYear } from "./functions"

type ExtendedOP = Operation & {
  shortDate: string
}

/**
 * Transforme une liste d'opérations en une liste d'objet contenant chaque type/valeur comme attribut
 * @param operations | Operation[]
 * @returns
 */
export const calculateData = (operations: Operation[]) => {
  const formattedOperations: ExtendedOP[] = operations.map((x: Operation) => {
    const splitted = x.datePeriod.toString().split("-")
    return {
      ...x,
      shortDate: splitted[1] + "/" + splitted[0]
    }
  })

  const groupData = groupByMonth(formattedOperations)
  const calculatedData = addValues(groupData)

  const groupDataByType: CalculatedGroupOP[][] = []
  groupData.forEach((x) => {
    const item = groupByType(x)
    const calculatedTypeData = addValuesForTypes(item)

    groupDataByType.push(calculatedTypeData)
  })

  groupDataByType.forEach((x) => {
    const dataIndex = calculatedData.findIndex((item) => x[0].date === item.date)
    if(dataIndex < 0) return

    x.forEach((y) => calculatedData[dataIndex] = {...calculatedData[dataIndex], ...y})
  })

  return calculatedData
}

/**
 * A partir d'un array d'opérations construit un array d'array d'opérations triés par mois
 * @param data 
 * @returns 
 */
export const groupByMonth = <T extends Operation> (data: T[]): T[][] => {
  const result: Record<string, T[]> = {};

  // Itérer sur le tableau d'origine
  data.forEach((item) => {
    // Convertir la chaîne de date en objet Date
    if(!item?.datePeriod) return
    const date = new Date(item.datePeriod);
    // Extraire le mois et l'année (au format "MM-YYYY")
    const monthKey = formatMonthYear(date);
    // Ajouter l'objet au groupe correspondant dans l'objet résultant
    if (!result[monthKey]) {
      result[monthKey] = [];
    }
    result[monthKey].push(item);
  });

  return Object.values(result);
};

/**
 * A partir d'un array d'opérations construit un array d'array d'opérations triés par type
 * @param data 
 * @returns 
 */
export const groupByType = <T extends ExtendedOP> (data: T[]): T[][] => {
  const result: Record<string, T[]> = {};

  // Itérer sur le tableau d'origine
  data.forEach((item) => {
    if(!item?.type?._id) return
    const typeId = item.type._id
    if (!result[typeId]) {
      result[typeId] = [];
    }
    result[typeId].push(item);
  });

  return Object.values(result);
};

/**
 * Calcul le total pour chaque mois en additionnant toutes les dépenses
 * @param data | ExtendedOP[][]
 * @returns CalculatedGroupOP[]
 */
export const addValues = (data: ExtendedOP[][]) => {
  const output: CalculatedGroupOP[] = []
  data.forEach((operationArray: any[]) => {
    let sum = 0
    operationArray.forEach((x) => sum += x.value)
    output.push({
      Total: sum,
      date: operationArray[0].shortDate
    })
  })
  return output
}

/**
 * Additionne toutes les dépenses d'un même type pour chaque mois
 * @param data | ExtendedOP[][]
 * @returns 
 */
export const addValuesForTypes = (data: ExtendedOP[][]) => {
  const output: any[] = []
  data.forEach((operationArray: ExtendedOP[]) => {
    let sum = 0
    operationArray.forEach((x) => sum += x.value)
    output.push({
      [operationArray[0].type.label]: sum,
      date: operationArray[0].shortDate
    })
  })
  return output
}

/**
 * Retourne la donnée avec les valeurs absolue
 * @param data 
 * @returns 
 */
export const toAbsolute = (data: any[]) => {
  const tempData = data.map((x) => { return { ...x } })
  tempData.forEach((x) => {
    for (const key in x) {
      if (key !== 'date') x[key] = Math.abs(x[key])
    }
  })

  return tempData
}

/**
 * Retourne une synthèse des données
 * @param data 
 * @returns SynthesisData[]
 */
export const getSynthesisData = (data: CalculatedGroupOP[]) => {
  const synth: SynthesisData[] = []
  let solde = 0
  data.forEach((x) => {
    let expense = 0
    let revenue = 0
    for (const key in x) {
      if (key === 'date' || key === 'Total') continue
      if (x[key] > 0) revenue += x[key]
      if (x[key] < 0) expense += x[key]
    }

    const bilan = revenue + expense
    solde += bilan

    synth.push({
      date: x['date'],
      expense: Math.abs(expense),
      revenue: Math.abs(revenue),
      bilan,
      solde
    })
  })

  return synth
}