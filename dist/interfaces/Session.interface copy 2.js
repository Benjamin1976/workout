"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionItemInitialValues = exports.ExerciseItemInitialValues = exports.ExerciseNameInitialValues = exports.SetItemInitialValues = void 0;
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
// export type ExerciseNameDocType = {
//   // [key: string]: string | Date | Types.ObjectId | null;
//   _id: string | Types.ObjectId;
//   name: string;
//   comments: string | null;
//   created: Date | null;
//   updated: Date | null;
// } & Types.ArraySubdocument;
exports.ExerciseNameInitialValues = {
    _id: "new",
    name: "new",
    comments: "",
    created: new Date(),
    updated: new Date(),
};
exports.ExerciseItemInitialValues = {
    _id: "new",
    name: exports.ExerciseNameInitialValues,
    rating: 0,
    id: 0,
    order: 0,
    object: "kg",
    type: "normal",
    sets: [],
    supersetNo: null,
    comments: null,
    started: false,
    startedWhen: null,
    completed: false,
    completedWhen: null,
    visible: true,
};
exports.SessionItemInitialValues = {
    user: "",
    date: new Date(),
    name: "",
    exercises: [],
    comments: "",
    created: new Date(),
    updated: new Date(),
};
