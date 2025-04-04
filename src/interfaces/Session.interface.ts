import { Types } from "mongoose";

export type SetItemType = {
  [key: string]: string | number | boolean | Date | Types.ObjectId | null;

  _id: string | Types.ObjectId | null;
  id: number;
  no: number;
  order: number;
  reps: number;
  weight: number;
  unit: string;
  link: boolean;
  rating: number;
  started: boolean;
  startedWhen: Date | null;
  completed: boolean;
  completedWhen: Date | null;
} & Types.Subdocument;

export const SetItemInitialValues = {
  _id: "",
  id: 0,
  no: 0,
  order: 0,
  reps: 12,
  weight: 0,
  unit: "",
  link: false,
  rating: 0,
  started: false,
  startedWhen: null,
  completed: false,
  completedWhen: null,
};

export type ExerciseNameType = {
  // [key: string]: string | Date | Types.ObjectId | null;
  _id: string | Types.ObjectId;
  name: string;
  comments: string | null;
  created: Date | null;
  updated: Date | null;
} & Types.Subdocument;

export const ExerciseNameInitialValues = {
  // _id: "new",
  name: "new",
  comments: "",
  created: new Date(),
  updated: new Date(),
};

export type ExerciseItemType = {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | Types.ObjectId
    | SetItemType[]
    | ExerciseNameType
    | null
    | undefined;
  _id?: string | Types.ObjectId | null | undefined;
  name: ExerciseNameType;
  rating: number | null;
  id: number;
  order: number;
  object: string | null;
  type: string | null;
  sets: SetItemType[];
  supersetNo: string | null;
  comments: string | null;
  started: boolean;
  startedWhen: Date | null;
  completed: boolean;
  completedWhen: Date | null;
  visible: boolean;
} & Types.Subdocument;

export const ExerciseItemInitialValues = {
  _id: "",
  name: ExerciseNameInitialValues,
  rating: 0,
  id: 0,
  order: 0,
  object: "",
  type: "",
  sets: [],
  supersetNo: null,
  comments: null,
  started: false,
  startedWhen: null,
  completed: false,
  completedWhen: null,
  visible: true,
};

export type SessionListItemType = {
  [key: string]: string | Types.ObjectId | Date | null;
  _id: string | Types.ObjectId;
  user: string | Types.ObjectId;
  date: Date;
  name: string;
} & Types.ArraySubdocument;

export type SessionItemType = SessionListItemType & {
  // [key: string]: ExerciseItemType[] | string | Date | null | undefined;
  [key: string]:
    | string
    | Types.ObjectId
    | Date
    | ExerciseItemType[]
    | null
    | undefined;
  _id: string;
  user: string | Types.ObjectId;
  date: Date;
  name: string;
  exercises: ExerciseItemType[];
  created: Date;
  updated: Date;
  comments?: string | null;
} & Types.Subdocument;

export type SessionItemTypeOnly = {
  // [key: string]: ExerciseItemType[] | string | Date | null | undefined;
  [key: string]:
    | string
    | Types.ObjectId
    | Date
    | ExerciseItemType[]
    | null
    | undefined;
  _id: string;
  user: string | Types.ObjectId;
  date: Date;
  name: string;
  exercises: ExerciseItemType[];
  created: Date;
  updated: Date;
  comments?: string | null;
};

export const SessionItemInitialValues = {
  user: "",
  date: new Date(),
  name: "",
  exercises: [],
  comments: "",
  created: new Date(),
  updated: new Date(),
};
