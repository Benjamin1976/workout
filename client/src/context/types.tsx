export type UserType = {
  _id: string;
  name: string;
  email: string;
  date: Date;
  isValidated: boolean | null;
  status?: string | null;
  password?: string;
};

export type AuthItemType = {
  token: string | null;
  isAuthenticated: boolean;
  isValidated: boolean;
  loading: boolean;
  user: UserType | null;
  error: string | null;
  // error: { status: string; data: string } | null;
};

export type AlertItemType = {
  message: string;
  type: string;
  id: string;
};

export type SetItemType = {
  [key: string]: string | number | boolean | Date | null | undefined;
  _id?: string;
  id: number;
  no: number;
  unit: string;
  reps: number;
  weight: number;
  started: boolean;
  startedWhen: Date | null;
  completed: boolean;
  completedWhen: Date | null;
  link: boolean;
  rating: number | null;
  order: number | null;
};

export const SetItemInitialValues = {
  // _id: "",
  id: 0,
  no: 1,
  order: 0,
  reps: 12,
  weight: 0,
  unit: "kg",
  link: false,
  rating: 0,
  started: false,
  startedWhen: null,
  completed: false,
  completedWhen: null,
};

export type ExerciseNameType = {
  _id: string;
  name: string;
};

export const ExerciseNameInitialValues = {
  _id: "",
  name: "",
  comments: "",
  created: new Date(),
  updated: new Date(),
};

export const ExerciseNameNewValues = {
  _id: "new",
  name: "New Exercise",
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
    | null
    | undefined
    | ExerciseNameType
    | SetItemType[];
  _id?: string | null;
  id: number;
  name: ExerciseNameType;
  type: string;
  supersetNo?: string | null;
  object: string;
  sets: SetItemType[];
  comments: string | null;
  started: boolean;
  startedWhen: Date | null;
  completed: boolean;
  completedWhen: Date | null;
  visible: boolean;
  order: number;
  rating: number | null;
};

export const ExerciseItemInitialValues = {
  // _id: "new-1",
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

export const ExerciseItemNewValues = {
  name: ExerciseNameNewValues,
  rating: 0,
  id: 0,
  order: 0,
  object: "cable",
  type: "kg",
  sets: [
    { ...SetItemInitialValues },
    { ...SetItemInitialValues, no: 2, order: 1, id: 1 },
    { ...SetItemInitialValues, no: 3, order: 2, id: 2 },
    // { ...SetItemInitialValues },
    // { ...SetItemInitialValues, _id: "new-2", no: 2, order: 1, id: 1 },
    // { ...SetItemInitialValues, _id: "new-3", no: 3, order: 2, id: 2 },
  ],
  supersetNo: null,
  comments: null,
  started: false,
  startedWhen: null,
  completed: false,
  completedWhen: null,
  visible: true,
};

export type SessionListItemType = {
  [key: string]: number | string | Date | boolean | null | undefined;
  _id: string;
  user: string;
  date: Date;
  name: string;
  comments?: string | null;
};

export type SessionItemType = {
  [key: string]:
    | ExerciseItemType[]
    | number
    | string
    | Date
    | boolean
    | null
    | undefined;
  _id: string;
  user: string;
  date: Date;
  name: string;
  comments: string | null;
  exercises: ExerciseItemType[];
  created: Date;
  updated: Date;
};

// export type SessionItemType = {
//   [key: string]:
//     | ExerciseItemType[]
//     | string
//     | number
//     | boolean
//     | Date
//     | null
//     | undefined;
//   _id: string;
//   user: string;
//   date: Date | null;
//   name: string;
//   exercises: ExerciseItemType[];
//   comments?: string;
// };

export const SessionItemInitialValues = {
  user: "",
  date: new Date(),
  name: "",
  exercises: [],
  comments: "",
  created: new Date(),
  updated: new Date(),
};

export const sessionFlds = {
  name: { title: "Name", field: "name", type: "text" },
  date: { title: "Date", field: "date", type: "date" },
};

export const exerciseFlds = {
  name: { title: "Name", field: "name", type: "text" },
  object: { title: "Object", field: "object", type: "text" },
  type: {
    title: "Type",
    field: "type",
    type: "select",
    options: ["normal set", "superset"],
  },
  supersetNo: {
    title: "Superset ID",
    field: "supersetNo",
    type: "text",
  },
  comments: { title: "Comments", field: "comments", type: "text" },
};

export const setFlds = {
  order: { title: "No.", field: "order", type: "text" },
  reps: { title: "Reps", field: "reps", type: "text" },
  weight: { title: "Weight", field: "weight", type: "text" },
  unit: { title: "Unit", field: "unit", type: "text" },
};
