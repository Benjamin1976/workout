import { Types } from "mongoose";

export type UserType = {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | Types.ObjectId
    | null
    | undefined;
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  date: Date;
  isValidated: boolean | null;
  status?: string | null;
  password?: string;
} & Types.Subdocument;

export type ValidationType = {
  code: number;
  codeGenerated: Date;
  emailsSent: [{ id: string; sent: Date; result: string }];
  lastEmailSentOk: Date;
  lastEmailSent: Date;
  history: [{ date: Date; matched: boolean }];
} & Types.Subdocument;

// export interface UserDocType extends Types.Subdocument {
//   // [key: string]: string | number | boolean | Date | Types.ObjectId |null;
//   _id: string | Types.ObjectId;
//   name: string;
//   email: string;
//   date: Date;
//   isValidated: boolean | null;
//   status?: string | null;
//   password?: string;
// }
