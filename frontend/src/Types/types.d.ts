type User = {
  _id: string,
  username: string,
  email: string,
  allowPropositions: boolean
}

type Operation = {
  _id: string,
  label: string,
  value: number,
  user: User,
  type: Type,
  datePeriod: Date
}

type Type = {
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

type NewOperation = {
  label: string,
  value: number,
  type: string,
  user: string,
  datePeriod: Date
}

type CalculatedGroupOP = {
  Total: number,
  "Total-abs": number,
  date: string,
  [key: string]: number;
}