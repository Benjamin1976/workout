import mongoose, { model, Schema } from "mongoose";
import { UserType, ValidationType } from "../interfaces/User.interface";

const validationSchema = new Schema<ValidationType>({
  code: { type: Number },
  codeGenerated: { type: Date },
  emailsSent: [
    { id: { type: String }, sent: { type: Date }, result: { type: String } },
  ],
  lastEmailSentOk: { type: Date },
  lastEmailSent: { type: Date },
  history: [{ date: { type: Date }, matched: { type: Boolean } }],
});

const userSchema = new Schema<UserType>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  // activation: {
  //   firstEmailSent: { type: Date },
  //   emailSent: { type: Date },
  //   noEmailsSent: { type: Number },
  //   key: { type: ObjectId },
  //   encryptedKey: { type: String },
  // },
  isValidated: {
    type: Boolean,
    default: false,
  },
  validation: validationSchema,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<UserType>("User", userSchema);
