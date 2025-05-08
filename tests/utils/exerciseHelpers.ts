import { v4 as uuid } from "uuid";
import {
  ExerciseItemInitialValues,
  ExerciseItemType,
  SessionItemInitialValues,
  SessionItemType,
  SetItemInitialValues,
  SetItemType,
  UserType,
} from "../../src/context/types";
import { classNames, emojiIcons } from "../../src/utilities/common";

export const mockAuthProvider = {
  token: null,
  isAuthenticated: false,
  isValidated: false,
  loading: true,
  user: null,
  error: null,
  register: vi.fn(),
  validateUser: vi.fn(),
  sendValidationEmail: vi.fn(),
  loadUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  clearErrors: vi.fn(),
};

export const getMockUser = (): UserType => {
  return {
    _id: uuid(),
    name: "John Smith",
    email: "js@js.com",
    date: new Date(),
    isValidated: false,
    status: "validated",
    password: "password123",
  };
};

export const mockExerciseProvider = {
  getSessions: vi.fn().mockReturnValue({}),
  openSession: vi.fn().mockReturnValue({}),
  loadLastSession: vi.fn(),
  closeSession: vi.fn(),
  editSession: vi.fn(),
  updateSession: vi.fn(),
  cloneSession: vi.fn().mockReturnValue({}),
  showTimer: vi.fn(),
  restartTimer: vi.fn(),
  addExercise: vi.fn().mockReturnValue({}),
  showAddExercise: vi.fn().mockReturnValue({}),
  deleteExercise: vi.fn(),
  updateExercise: vi.fn(),
  updateSet: vi.fn(),
  saveCurrentSession: vi.fn().mockReturnValue({}),
  saveSessions: vi.fn().mockReturnValue({}),
  setExercises: vi.fn(),
  clearExercises: vi.fn(),
  setCurrentExercise: vi.fn(),
  clearCurrentExercise: vi.fn(),
  completeExercisesAll: vi.fn().mockReturnValue({}),
  completeExercise: vi.fn(),
  linkExercise: vi.fn(),
  rateExercise: vi.fn(),
  reorderExercise: vi.fn(),
  showHideExerciseAll: vi.fn(),
  showHideExercise: vi.fn(),
  linkSet: vi.fn(),
  addSet: vi.fn(),
  deleteSet: vi.fn(),
  startSet: vi.fn().mockReturnValue({}),
  completeSet: vi.fn().mockReturnValue({}),
  findNextSet: vi.fn(),
  loading: true,
  edit: false,
  add: false,
  totalSessions: 0,
  totalExercises: 0,
  exercisesCompleted: 0,
  currentSession: null,
  sessions: [],
  currentExercise: null,
  currentSet: null,
  currentId: null,
  exercises: [],
  exercisesAll: [],
  deletePressed: null,
  timerVisible: true,
  timerExpiry: null,
};

// All
// const saveSessions = vi.fn().mockReturnValue({});

// Sessions List
// const getSessions = vi.fn().mockReturnValue({});
const openSession = vi.fn().mockReturnValue({});
const cloneSession = vi.fn().mockReturnValue({});

// Sessions List & Session Item
// const loadLastSession = vi.fn();
// const updateSession = vi.fn();

// Session Item
const showTimer = vi.fn();
const saveCurrentSession = vi.fn().mockReturnValue({});
const editSession = vi.fn();
const closeSession = vi.fn();
// const addExercise = vi.fn().mockReturnValue({});

// Exercise List Buttons
const showAddExercise = vi.fn().mockReturnValue({});
const completeExercisesAll = vi.fn().mockReturnValue({});
const showHideExerciseAll = vi.fn();

// Highlight Exercise
// const startSet = vi.fn().mockReturnValue({});
// const findNextSet = vi.fn();

// Timer
// const restartTimer = vi.fn();

// Exercise Item
const completeExercise = vi.fn();
const linkExercise = vi.fn();
const rateExercise = vi.fn();
const showHideExercise = vi.fn();
// const updateExercise = vi.fn();
// const deleteExercise = vi.fn();
// const reorderExercise = vi.fn();
// const addSet = vi.fn();

// SetItem
// const updateSet = vi.fn();
const linkSet = vi.fn();
const deleteSet = vi.fn();
const completeSet = vi.fn().mockReturnValue({});

// Not used any longer - redundant
// const setExercises = vi.fn();
// const setCurrentExercise = vi.fn();
// const clearCurrentExercise = vi.fn();
// const clearExercises = vi.fn();

export const isOdd = (index: number): boolean => {
  return index % 2 === 0;
};

export const getSetInitialValues = (index: number): SetItemType => {
  return {
    ...SetItemInitialValues,
    id: index,
    no: index + 1,
    unit: isOdd(index) ? "lb" : "kg",
    reps: (index + 1) * 10,
    weight: (index + 1) * 10,
    started: false,
    startedWhen: null,
    completed: false,
    completedWhen: null,
    link: false,
    rating: 0,
    order: index,
  };
};

export const getSetsInitialValues = (howMany: number): SetItemType[] => {
  return Array(howMany)
    .fill(howMany)
    .map((_, i) => getSetInitialValues(i));
};

export const getExerciseInitialValues = (index: number): ExerciseItemType => {
  return {
    ...ExerciseItemInitialValues,
    id: index,
    name: { _id: uuid(), name: `Exercise ${index + 1}` },
    type: isOdd(index) ? "normal" : "superset",
    supersetNo: isOdd(index) ? null : "1",
    object: isOdd(index) ? "dumbbell" : "barbell",
    sets: getSetsInitialValues(3),
    comments: `comments ${index}`,
    started: false,
    startedWhen: null,
    completed: false,
    completedWhen: null,
    visible: true,
    order: index,
    rating: 0,
  };
};

export const getExercisesInitialValues = (
  howMany: number
): ExerciseItemType[] => {
  return Array(howMany)
    .fill(howMany)
    .map((_, i) => getExerciseInitialValues(i));
};

export const getSessionInitialValues = (index: number): SessionItemType => {
  const dateStamp: Date = new Date();
  const dateString: Date = new Date(dateStamp.setDate(dateStamp.getDate() - 5));

  return {
    ...SessionItemInitialValues,
    _id: uuid(),
    user: uuid(),
    name: `Session ${index + 1}`,
    date: dateString,
    exercises: getExercisesInitialValues(3),
    created: dateString,
    updated: dateString,
  };
};

export const getSessionsInitialValues = (howMany: number) => {
  return Array(howMany)
    .fill(howMany)
    .map((_, i) => getSessionInitialValues(i));
};

export const notStarted = { started: false, startedWhen: null };
export const notCompleted = { completed: false, completedWhen: null };

export const started = { started: true, startedWhen: new Date() };
export const completed = { completed: true, completedWhen: new Date() };

export const sessionInputValues = (testSession: SessionItemType) => {
  return [
    // {
    //   fld: "date",
    //   value: dateFormat(testSession.date.toString()),
    //   ctlValue: DateTime.fromJSDate(testSession.date).toFormat("dd-LLL-yy"),
    //   hasInput: true,
    //   role: "date",
    // },
    {
      fld: "name",
      value: testSession.name,
      ctlValue: testSession.name,
      hasInput: true,
      role: "textbox",
    },
    // { fld: "comments", value: testSession.comments, hasInput: true },
  ];
};

export const exerciseInputValues = (testExercise: ExerciseItemType) => {
  return [
    { fld: "name", value: testExercise.name.name, hasInput: false },
    { fld: "object", value: testExercise.object, hasInput: true },
    { fld: "type", value: testExercise.type, hasInput: true },
    { fld: "supersetNo", value: testExercise.supersetNo, hasInput: true },
    { fld: "comments", value: testExercise.comments, hasInput: true },
  ];
};

export const setInputValues = (testSet: SetItemType) => {
  return [
    { fld: "no", value: testSet.no, hasInput: false },
    { fld: "reps", value: testSet.reps, hasInput: true },
    { fld: "weight", value: testSet.weight, hasInput: true },
    { fld: "unit", value: testSet.unit, hasInput: true },
  ];
};

export const sessionButtonsInitialState = [
  {
    title: "Open Session",
    name: "openSession",
    icon: "arrow_forward",
    func: openSession,
  },
  {
    title: "Clone Session",
    name: "cloneSession",
    icon: "content_copy",
    func: cloneSession,
  },
];

export const sessionItemButtonsInitialState = [
  {
    title: "Show Timer",
    name: "showTimer",
    icon: "fitness_center",
    func: showTimer,
  },

  {
    title: "Edit Session",
    name: "editSession",
    icon: "edit",
    func: editSession,
  },
  {
    title: "Close Session",
    name: "closeSession",
    icon: "arrow_back",
    func: closeSession,
  },
];

export const sessionItemButtonsAlternateInitialState = [
  {
    title: "Edit Session",
    name: "editSession",
    icon: "close",
    func: editSession,
  },
  {
    title: "Save Session",
    name: "saveCurrentSession",
    icon: "save",
    func: saveCurrentSession,
  },
];

export const exerciseListButtonsInitialState = [
  {
    title: "Complete All Exercise",
    label: "completeExercisesAll",
    name: "completeExercisesAll",
    icon: "pending",
    func: completeExercisesAll,
  },
  {
    title: "Show Add Exercise",
    label: "showAddExercise",
    name: "showAddExercise",
    icon: "add",
    func: showAddExercise,
  },
  {
    title: "Show Hide Exercise All",
    label: "showExerciseAll",
    icon: "visibility",
    name: "showHideExerciseAll",
    func: showHideExerciseAll,
  },
  {
    title: "Show Hide Exercise All",
    label: "hideExerciseAll",
    icon: "visibility",
    name: "showHideExerciseAll",
    func: showHideExerciseAll,
  },
];

export const exerciseListButtonsAlternateInitialState = [
  {
    title: "Complete All Exercise",
    label: "completeExercisesAll",
    icon: "check_circle",
    name: "completeExercisesAll",
    func: completeExercisesAll,
  },
];

export const setButtonsInitialState = [
  {
    title: "Complete",
    name: "completeSet",
    icon: "pending",
    func: completeSet,
  },
  { title: "Delete", name: "deleteSet", icon: "delete", func: deleteSet },
];

export const setButtonsAlternateState = [
  { title: "Link", name: "linkSet", icon: "link_off", func: linkSet },
  {
    title: "Complete",
    name: "completeSet",
    icon: "check_circle",
    func: completeSet,
  },
];

export const buttonsTopInitialState = [
  //   {
  //     title: "Order Up",
  //     name: "reorderExerciseUp",
  //     icon: "arrow_upward",
  //     func: reorderExercise,
  //   },
  { title: "Link", name: "linkExercise", icon: "link", func: linkExercise },
  {
    title: "Complete",
    name: "completeExercise",
    icon: "pending",
    func: completeExercise,
  },
  {
    title: "Show / Hide",
    name: "showHideExercise",
    icon: "visibility_off",
    func: showHideExercise,
  },
];

export const buttonsTopAlternateState = [
  {
    title: "Complete",
    name: "completeExercise",
    icon: "check_circle",
    func: completeExercise,
  },
  {
    title: "Show / Hide",
    name: "showHideExercise",
    icon: "visibility",
    func: showHideExercise,
  },
];

const buttonsAddDeleteDropDownInitialState = [
  { title: "Add Set", name: "addSet", icon: "add", label: "add" },
  { title: "Delete", name: "deleteExercise", icon: "delete", label: "delete" },
];

export const buttonsDropDownInitialState = [
  {
    title: "Emoji Drop Down",
    name: "emojiDropDown",
    icon: "thumb_up",
    func: rateExercise,
    label: "EmojiDropDown",
    buttons: emojiIcons,
  },
  {
    title: "Buttons Drop Down",
    name: "buttonsDropDown",
    icon: "menu",
    label: "ButtonsDropDown",
    buttons: buttonsAddDeleteDropDownInitialState,
  },
];

export const buttonsBottomInitialState = [
  //   {
  //     title: "Order Down",
  //     name: "reorderExerciseDown",
  //     icon: "arrow_downward",
  //     func: reorderExercise,
  //   },
  {
    title: "Unlink",
    name: "unlinkExercise",
    icon: "link_off",
    func: linkExercise,
  },
];

export const completedHeaderClass =
  classNames.headerRowClasses.completed +
  " border border-bottom-1 align-items-center";
// const startedHeaderClass = classNames.headerRowClasses.started + " border border-bottom-1 align-items-center"

export const notStartedHeaderClass =
  classNames.headerRowClasses.notStarted +
  " border border-bottom-1 align-items-center";

export const completedRowClass =
  classNames.rowClasses.completed +
  " border border-bottom-1 align-items-center";

// const startedRowClass = classNames.rowClasses.started + " border border-bottom-1 align-items-center"
export const notStartedRowClass =
  classNames.rowClasses.notStarted +
  " border border-bottom-1 align-items-center";

export const startedRowClass =
  classNames.rowClasses.notStarted +
  " border border-bottom-1 align-items-center";
