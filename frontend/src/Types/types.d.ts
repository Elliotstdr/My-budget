type User = {
  _id: string,
  username: string,
  email: string,
  allowPropositions: boolean,
  goal?: string,
  goalPeriod?: Date[],
  allowGoal: boolean
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

type Debt = {
  _id: string
  target: string
  title: string,
  value: number,
  dueDate?: Date | null,
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
  date: string,
  [key: string]: number
}

type ExpenseTypeSum = {
  name: string,
  value: number
}

type SynthesisData = {
  date: string,
  expense: number,
  revenue: number,
  bilan: number,
  solde: number
}

type PieDataItem = {
  name: string,
  value: number
}

type Legends = {
  hover: string | null;
  [key: string]: key extends 'hover' ? string | null : boolean;
};

type Decile = {
  percile: number,
  value: number,
  mine?: number
}

type LoanElement = {
  temps: number,
  value: number,
  cost: number
}