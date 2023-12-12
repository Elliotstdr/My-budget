import mongoose, { Schema, Model, Document, Date } from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import { OPERATION_COLLECTION, OPERATION_MODEL, TYPE_MODEL, USER_MODEL } from '../services/const.service';
import { DUser } from './user.model';
import { DType } from './type.model';

type DOperation = Document & {
  label: string,
  value: number,
  user: DUser,
  type: DType,
  datePeriod: Date
};

const operationsSchema = new Schema(
  {
    label: {
      type: Schema.Types.String,
      required: true,
    },
    value: {
      type: Schema.Types.Number,
      required: true,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: USER_MODEL, 
      required: true 
    },
    type: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: TYPE_MODEL, 
      required: true 
    },
    datePeriod: {
      type: mongoose.Schema.Types.Date,
      require: true
    }
  },
  {
    collection: OPERATION_COLLECTION,
    timestamps: true,
  },
);

operationsSchema.plugin(uniqueValidator);

const Operation: Model<DOperation> = mongoose.model<DOperation>(OPERATION_MODEL, operationsSchema);

export { Operation, DOperation };
