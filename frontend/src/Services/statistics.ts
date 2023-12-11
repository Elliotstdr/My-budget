import { formatMonthYear } from "./functions"

interface ExtendedOP extends Operation {
  shortDate: string
}

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

  // const dataGroupedByType = groupByType(formattedOperations)
  // const calculatedDataGroupedByType: CalculatedGroupOP[][] = []
  // dataGroupedByType.forEach((x) =>{
  //   const item = groupByMonth(x)
  //   const calculatedTypeData = addValuesForTypes(item)

  //   calculatedDataGroupedByType.push(calculatedTypeData)
  // })

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

export const groupByType = <T extends ExtendedOP> (data: T[]): T[][] => {
  const result: Record<string, T[]> = {};

  // Itérer sur le tableau d'origine
  data.forEach((item) => {
    // Convertir la chaîne de date en objet Date
    if(!item?.type?._id) return
    const typeId = item.type._id
    if (!result[typeId]) {
      result[typeId] = [];
    }
    result[typeId].push(item);
  });

  return Object.values(result);
};

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