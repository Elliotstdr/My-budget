import { Date } from "mongoose"

type IUser = {
  _id?: string,
  email: string,
  password: string
}

type IOperation = {
  _id?: string,
  label: string,
  value: number,
  user: IUser,
  type: IType,
  datePeriod: Date
}

type IType = {
  _id?: string,
  label: string,
  keywords: string[]
  user: IUser | null
}