import mongoose, { Schema, Model, Document } from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import { DEBT_COLLECTION, DEBT_MODEL, USER_MODEL } from '../services/const.service';
import { DUser } from './user.model';

type DDebt = Document & {
  target: string
  title: string,
  value: number,
  dueDate?: Date
  user: DUser
};

const debtSchema = new Schema(
  {
    target: {
      type: Schema.Types.String,
      required: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
    },
    value: {
      type: Schema.Types.Number,
      required: true,
    },
    dueDate: {
      type: mongoose.Schema.Types.Date,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: USER_MODEL
    }
  },
  {
    collection: DEBT_COLLECTION,
    timestamps: true,
  },
);

debtSchema.plugin(uniqueValidator);

const Debt: Model<DDebt> = mongoose.model<DDebt>(DEBT_MODEL, debtSchema);

export { Debt, DDebt };
