import mongoose, { Schema, Model, Document } from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import { USER_COLLECTION, USER_MODEL } from '../services/const.service';

type DUser = Document & {
  username: string,
  email: string;
  password: string;
};

const usersSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: USER_COLLECTION,
    timestamps: true,
  },
);

usersSchema.plugin(uniqueValidator);

const User: Model<DUser> = mongoose.model<DUser>(USER_MODEL, usersSchema);

export { User, DUser };
