interface User {
  _id: string,
  username: string,
  email: string,
}

interface Operation {
  _id: string,
  label: string,
  value: number,
  user: User,
  type: Type,
  datePeriod: Date
}

interface Type {
  _id: string,
  label: string,
  keywords: string[],
  user: User
}

type ImportedOperation = {
  id: number
  date: string,
  valeur: number,
  nom: string,
  type?: string
}

interface NewOperation {
  label: string,
  value: number,
  type: string,
  user: string,
  datePeriod: Date
}

interface CalculatedGroupOP {
  Total: number,
  date: string
}