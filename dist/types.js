"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionItemInitialValues = exports.ExerciseItemInitialValues = exports.ExerciseNameInitialValues = exports.SetItemInitialValues = void 0;
// export interface SetItemMongoType extends Types.Subdocument {
//   // [key: string]: string | number | boolean | Date | Types.ObjectId | null;
//   _id: string | Types.ObjectId;
//   id: number;
//   no: number;
//   order: number;
//   reps: number;
//   weight: number;
//   unit: string;
//   link: boolean;
//   rating: number;
//   started: boolean;
//   startedWhen: Date | null;
//   completed: boolean;
//   completedWhen: Date | null;
// }
exports.SetItemInitialValues = {
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
exports.ExerciseNameInitialValues = {
    _id: "",
    name: "",
    comments: "",
    created: new Date(),
    updated: new Date(),
};
// export interface ExerciseItemMongoType extends Types.Subdocument {
//   // [key: string]:
//   //   | string
//   //   | number
//   //   | boolean
//   //   | Date
//   //   | Types.ObjectId
//   //   | SetItemType[]
//   //   | ExerciseNameType
//   //   | null;
//   _id: string | Types.ObjectId | undefined;
//   name: ExerciseNameType;
//   rating: number | null;
//   id: number;
//   order: number;
//   object: string | null;
//   type: string | null;
//   sets: SetItemMongoType[];
//   supersetNo: string | null;
//   comments: string | null;
//   started: boolean;
//   startedWhen: Date | null;
//   completed: boolean;
//   completedWhen: Date | null;
//   visible: boolean;
// }
exports.ExerciseItemInitialValues = {
    _id: "",
    name: exports.ExerciseNameInitialValues,
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
// export interface SessionItemMongoType extends Types.Subdocument {
//   // [key: string]: string | Types.ObjectId | Date | ExerciseItemType[] | null;
//   _id: Types.ObjectId | undefined;
//   user: string | Types.ObjectId;
//   date: Date;
//   name: string;
//   exercises: ExerciseItemMongoType[];
//   comments: string | null;
//   created: Date;
//   updated: Date;
// }
exports.SessionItemInitialValues = {
    user: "",
    date: new Date(),
    name: "",
    exercises: [],
    comments: "",
    created: new Date(),
    updated: new Date(),
};
// export type mongooseSessionType = {
//   user: string | Types.ObjectId;
//   date: Date;
//   name: string;
//   comments: string | null;
//   created: Date;
//   updated: Date;
//   exercises: Types.DocumentArray<ExerciseItemType>;
// }  & Types.Subdocument;
