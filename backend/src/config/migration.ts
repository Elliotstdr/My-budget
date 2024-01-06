import mongoose from 'mongoose'
import { Debt } from '../models/debt.model'
import { User } from '../models/user.model'
import { Operation } from '../models/operation.model'
import { Type } from '../models/type.model'

// npx migrate create first-migration  
// ./node_modules/.bin/migrate up first-migration
export const getModels = async () => {
  // In case you using mongoose 6
  // https://mongoosejs.com/docs/guide.html#strictQuery
  mongoose.set('strictQuery', false)
  // Ensure connection is open so we can run migrations
  process.env.MONGO_URI && await mongoose.connect(process.env.MONGO_URI)
  // Return models that will be used in migration methods
  return {
    mongoose,
    User,
    Debt,
    Operation,
    Type
  }
}