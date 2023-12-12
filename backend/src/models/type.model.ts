import mongoose, { Schema, Model, Document } from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import { TYPE_COLLECTION, TYPE_MODEL, USER_MODEL } from '../services/const.service';
import { DUser } from './user.model';

type DType = Document & {
  label: string,
  keywords: string[],
  user?: DUser
};

const typesSchema = new Schema(
  {
    label: {
      type: Schema.Types.String,
      required: true,
    },
    keywords: {
      type: [Schema.Types.String],
      required: true,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: USER_MODEL
    }
  },
  {
    collection: TYPE_COLLECTION,
    timestamps: true,
  },
);

typesSchema.plugin(uniqueValidator);

const Type: Model<DType> = mongoose.model<DType>(TYPE_MODEL, typesSchema);

export { Type, DType };
