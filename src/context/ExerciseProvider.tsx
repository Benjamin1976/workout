import { createContext, ReactElement, useMemo, useReducer } from "react";

import { DateTime } from "luxon";
import {
  addExerciseNameToDb,
  cloneSessionToDb,
  getAllExercisesFromDb,
  getSessionFromDb,
  getSessionsFromDb,
  // saveExerciseToDb,
  saveSessionsToDb,
  saveSessionToDb,
} from "../axios/session.axios";
import { isCurrentExercise, isCurrentSet } from "../utilities/common";
import {
  completed,
  getIds,
  getNextExerciseAndSet,
  reIndexExercises,
  started,
  updateAllExsStatus,
  updateExerciseStartedCompleted,
  updateTheExerciseStatus,
} from "./ExerciseProviderFunctions";
import {
  ExerciseItemNewValues,
  ExerciseItemType,
  ExerciseNameType,
  SessionItemType,
  SessionListItemType,
  SetItemInitialValues,
  SetItemType,
} from "./types";

type ExerciseStateType = {
  sessions: Partial<SessionItemType>[];
  currentSession: SessionItemType | null;
  exercises: ExerciseItemType[];
  exercisesAll: ExerciseNameType[];
  totalExercises: number | null;
  currentExercise: ExerciseItemType | null;
  currentSet: SetItemType | null;
  currentId: string | null;
  deletePressed: string | null;
  timerVisible: boolean | null;
  timerExpiry: string | null;
  add: boolean;
  edit: boolean;
  loading: boolean;
};

const initExerciseState: ExerciseStateType = {
  sessions: [],
  currentSession: null,
  exercises: [],
  exercisesAll: [],
  totalExercises: null,
  currentExercise: null,
  currentSet: null,
  currentId: null,
  deletePressed: null,
  timerVisible: true,
  timerExpiry: null,
  edit: false,
  add: false,
  loading: true,
};

const EXERCISE_REDUCER_ACTION_TYPE = {
  SET_CURRENT_SESSION: "SET_CURRENT_SESSION",
  LOAD_LAST_SESSION: "LOAD_LAST_SESSION",
  CLEAR_CURRENT_SESSION: "CLEAR_CURRENT_SESSION",
  GET_SESSIONS: "GET_SESSIONS",
  GET_SESSION: "GET_SESSION",
  EDIT_SESSION: "EDIT_SESSION",
  UPDATE_SESSION: "UPDATE_SESSION",
  ADD_SESSION: "ADD_SESSION",
  CLONE_SESSION: "CLONE_SESSION",
  SHOW_TIMER: "SHOW_TIMER",
  RESTART_TIMER: "RESTART_TIMER",
  UPDATE_EXERCISE: "UPDATE_EXERCISE",
  UPDATE_SET: "UPDATE_SET",
  SAVE_SESSION: "SAVE_SESSION",
  SAVE_SESSIONS: "SAVE_SESSIONS",
  SET_EXERCISES: "SET_EXERCISES",
  CLEAR_EXERCISES: "CLEAR_EXERCISES",
  SET_CURRENT_EXERCISE: "SET_CURRENT_EXERCISE",
  CLEAR_CURRENT_EXERCISE: "CLEAR_CURRENT_EXERCISE",
  SHOW_ADD_EXERCISE: "SHOW_ADD_EXERCISE",
  ADD_EXERCISE: "ADD_EXERCISE",
  DELETE_EXERCISE: "DELETE_EXERCISE",
  SHOWHIDE_EXERCISE_ALL: "SHOWHIDE_EXERCISE_ALL",
  SHOWHIDE_EXERCISE: "SHOWHIDE_EXERCISE",
  RATE_EXERCISE: "RATE_EXERCISE",
  REORDER_EXERCISE: "REORDER_EXERCISE",
  LINK_EXERCISE: "LINK_EXERCISE",
  COMPLETE_EXERCISE_ALL: "COMPLETE_EXERCISE_ALL",
  COMPLETE_EXERCISE: "COMPLETE_EXERCISE",
  LINK_SET: "LINK_SET",
  START_SET: "START_SET",
  COMPLETE_SET: "COMPLETE_SET",
  NEXT_SET: "NEXT_SET",
  CLEAR_NEXT_SET: "CLEAR_NEXT_SET",
  ADD_SET: "ADD_SET",
  DELETE_SET: "DELETE_SET",
  MARK_TO_DELETE: "MARK_TO_DELETE",
};

export type ExerciseReducerActionType = typeof EXERCISE_REDUCER_ACTION_TYPE;

export type UpdateValueType = {
  name: string;
  value: string | Date | number | null | undefined | boolean;
};

export type ExerciseReducerAction = {
  type: string;
  payload?: ExerciseItemType | ExerciseItemType[] | null;
  payloadSet?: SetItemType | SetItemType[] | null;
  payloadSessionPartial?:
    | Partial<SessionItemType>
    | Partial<SessionItemType>[]
    | null;
  payloadSession?: SessionItemType | SessionItemType[] | null;
  id?: string | number | null;
  other?:
    | number
    | string
    | boolean
    | null
    | ExerciseNameType[]
    | ExerciseNameType;
  update?: UpdateValueType;
};

const reducer = (
  state: ExerciseStateType,
  action: ExerciseReducerAction
): ExerciseStateType => {
  switch (action.type) {
    // ______________Session Reducer Actions

    case EXERCISE_REDUCER_ACTION_TYPE.GET_SESSIONS: {
      const payload = action.payloadSessionPartial;
      if (!payload || !Array.isArray(payload)) {
        return { ...state, loading: false };
      } else {
        return { ...state, sessions: payload, loading: false };
      }
    }
    case EXERCISE_REDUCER_ACTION_TYPE.LOAD_LAST_SESSION:
    case EXERCISE_REDUCER_ACTION_TYPE.GET_SESSION:
    case EXERCISE_REDUCER_ACTION_TYPE.SET_CURRENT_SESSION: {
      const payload = action.payloadSession;
      if (
        !payload ||
        Array.isArray(payload) ||
        typeof payload?._id !== "string"
      ) {
        throw new Error("action.payloadSession missing in OPEN action");
      }

      const currentSession: SessionItemType = payload;
      if (currentSession) {
        return {
          ...state,
          currentSession: currentSession,
          loading: false,
        };
      } else {
        return { ...state, loading: false };
      }
    }
    case EXERCISE_REDUCER_ACTION_TYPE.CLEAR_CURRENT_SESSION: {
      return { ...state, currentSession: null, loading: false };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.EDIT_SESSION: {
      return { ...state, edit: !state.edit, loading: false };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.UPDATE_SESSION: {
      const payload = action?.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in UPDATE_SESSION action");
      }

      return {
        ...state,
        currentSession: payload,
        loading: false,
      };
    }

    case EXERCISE_REDUCER_ACTION_TYPE.CLONE_SESSION:
    case EXERCISE_REDUCER_ACTION_TYPE.ADD_SESSION: {
      const payload = action?.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in UPDATE_SESSION action");
      }

      const newSessions = [payload, ...state.sessions];
      newSessions.pop();

      return {
        ...state,
        sessions: newSessions,
        loading: false,
      };
    }

    case EXERCISE_REDUCER_ACTION_TYPE.SAVE_SESSIONS: {
      const payload = action?.payloadSessionPartial;
      if (!payload || !Array.isArray(payload)) {
        throw new Error("Sessions payload not passed for saving");
      }

      return {
        ...state,
        sessions: payload,
        loading: false,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.SAVE_SESSION: {
      if (
        action?.payloadSession &&
        !Array.isArray(action?.payloadSession) &&
        action?.payloadSession?._id &&
        typeof action.payloadSession._id === "string"
      ) {
        const currentSession: SessionItemType = action.payloadSession;
        const partialSession: Partial<SessionItemType> = {
          date: currentSession.date,
          name: currentSession.name,
          comments: currentSession.comments ?? "",
        };
        return {
          ...state,
          sessions: state.sessions.map((s) =>
            s._id === currentSession._id
              ? { ...s, comments: currentSession.comments, ...partialSession }
              : s
          ),
          currentSession: currentSession,
          loading: false,
        };
      } else {
        return { ...state, loading: false };
      }
    }

    // ______________Exercise Reducer Actions
    case EXERCISE_REDUCER_ACTION_TYPE.SHOW_TIMER: {
      if (
        action?.other === undefined ||
        action.other === null ||
        Array.isArray(action.other) ||
        typeof action.other !== "boolean"
      ) {
        return { ...state, loading: false };
      } else {
        return { ...state, timerVisible: action.other, loading: false };
      }
    }

    case EXERCISE_REDUCER_ACTION_TYPE.RESTART_TIMER: {
      if (
        action?.other === undefined ||
        action.other === null ||
        Array.isArray(action.other)
      ) {
        return { ...state, loading: false };
      } else {
        return {
          ...state,
          timerExpiry: action.other.toString(),
          loading: false,
        };
      }
    }

    case EXERCISE_REDUCER_ACTION_TYPE.SHOW_ADD_EXERCISE: {
      if (action?.other && Array.isArray(action.other)) {
        return {
          ...state,
          add: !state.add,
          exercisesAll: action.other,
          loading: false,
        };
      } else {
        return { ...state, add: !state.add, loading: false };
      }
    }
    case EXERCISE_REDUCER_ACTION_TYPE.ADD_EXERCISE: {
      const payloadSession = action.payloadSession;
      if (payloadSession && !Array.isArray(payloadSession)) {
        return {
          ...state,
          currentSession: payloadSession,
          add: false,
          loading: false,
        };
      } else {
        return { ...state, loading: false };
      }
    }
    case EXERCISE_REDUCER_ACTION_TYPE.DELETE_EXERCISE: {
      if (!action.payloadSession || Array.isArray(action.payloadSession)) {
        throw new Error("action.payload missing in DELETE_EXERCISE action");
      }

      return {
        ...state,
        currentSession: action.payloadSession,
        deletePressed: "",
        loading: false,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.MARK_TO_DELETE: {
      if (action.id === undefined || typeof action.id !== "string") {
        console.log("action.id missing or incorrect in MARK_TO_DELETE action");
        return { ...state, loading: false };
      }

      return {
        ...state,
        deletePressed: action.id,
        loading: false,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.UPDATE_EXERCISE: {
      const currentSession = action.payloadSession;
      if (!currentSession || Array.isArray(currentSession)) {
        throw new Error("action.payload missing in UPDATE_EXERCISE action");
      }

      if (action?.id === undefined || typeof action?.id !== "number") {
        throw new Error("action.id missing in UPDATE_EXERCISE action");
      }

      // if no current exercise, pass back null, don't update
      //   if the exercise is not the current / highlighted, don't update
      //   if the exercise is the current / highlighted, update
      const id = action.id;
      const currentExercise = !state?.currentExercise
        ? null
        : id === -1
        ? state.currentExercise
        : currentSession.exercises[id];

      return {
        ...state,
        currentSession: currentSession,
        currentExercise: currentExercise,
        loading: false,
      };
    }

    case EXERCISE_REDUCER_ACTION_TYPE.SET_CURRENT_EXERCISE: {
      if (!action.payload || Array.isArray(action.payload)) {
        throw new Error(
          "action.payload missing in SET_CURRENT_EXERCISE action"
        );
      }

      return { ...state, currentExercise: action.payload, loading: false };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.CLEAR_CURRENT_EXERCISE: {
      return { ...state, currentExercise: null, loading: false };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.LINK_EXERCISE: {
      const payload = action.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in REORDER_EXERCISE action");
      }

      return { ...state, currentSession: payload, loading: false };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.SHOWHIDE_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.SHOWHIDE_EXERCISE_ALL:
    case EXERCISE_REDUCER_ACTION_TYPE.RATE_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.REORDER_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_EXERCISE_ALL:
    case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.ADD_SET:
    case EXERCISE_REDUCER_ACTION_TYPE.LINK_SET:
    case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_SET: {
      const payload = action?.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in REORDER_EXERCISE action");
      }

      return {
        ...state,
        currentSession: payload,
        loading: false,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.START_SET: {
      const payload = action?.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in REORDER_EXERCISE action");
      }
      const payloadSet = action?.payloadSet;
      if (!payloadSet || Array.isArray(payloadSet)) {
        throw new Error("action.payloadSet missing in REORDER_EXERCISE action");
      }

      return {
        ...state,
        currentSession: payload,
        currentSet: payloadSet,
        loading: false,
      };
    }

    // ______________Set Reducer Actions

    case EXERCISE_REDUCER_ACTION_TYPE.UPDATE_SET: {
      if (!action.payloadSession || Array.isArray(action.payloadSession)) {
        throw new Error("action.payloadSession missing in UPDATE_SET action");
      }

      if (action.payloadSet === undefined || Array.isArray(action.payloadSet)) {
        throw new Error("action.payloadSet missing in UPDATE_SET action");
      }

      return {
        ...state,
        currentSession: action.payloadSession,
        currentSet: action.payloadSet,
        loading: false,
      };
    }

    case EXERCISE_REDUCER_ACTION_TYPE.DELETE_SET: {
      const payload = action.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in DELETE_SET action");
      }

      return {
        ...state,
        currentSession: payload,
        deletePressed: null,
        loading: false,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.NEXT_SET: {
      if (!action.payload || Array.isArray(action.payload)) {
        throw new Error("action.payload missing in NEXT_SET action");
      }

      if (!action.payloadSet || Array.isArray(action.payloadSet)) {
        throw new Error("action.payloadSet missing in NEXT_SET action");
      }

      if (
        !action.id ||
        Array.isArray(action.id) ||
        typeof action.id === "number"
      ) {
        throw new Error("action.id missing in NEXT_SET action");
      }

      return {
        ...state,
        currentExercise: action.payload,
        currentSet: action.payloadSet,
        currentId: action.id,
        loading: false,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.CLEAR_NEXT_SET: {
      return {
        ...state,
        currentExercise: null,
        currentSet: null,
        currentId: null,
        loading: false,
      };
    }

    default:
      throw new Error("Unknown Session Action Type");
  }
};

// CONTEXT
const useExerciseContext = (initExerciseState: ExerciseStateType) => {
  const [state, dispatch] = useReducer(reducer, initExerciseState);

  const EXERCISE_REDUCER_ACTIONS = useMemo(() => {
    return EXERCISE_REDUCER_ACTION_TYPE;
  }, []);

  const currentExists: boolean =
    state.currentSession &&
    state.currentSession !== null &&
    state.currentSession?._id
      ? true
      : false;
  const currentSession: SessionItemType | null = currentExists
    ? state.currentSession
    : null;

  // __________ SESSION FUNCTIONS
  const getSessions = async (
    filters: unknown,
    sort: object,
    start?: number
  ) => {
    if (!start) start = 1;

    const sessions: SessionListItemType[] | null = await getSessionsFromDb(
      filters,
      sort,
      start
    );

    if (sessions) {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.GET_SESSIONS,
        payloadSessionPartial: sessions,
      });
    }
  };

  const openSession = async (sessionId: string | null | undefined) => {
    if (!sessionId) return;
    localStorage.setItem("session", sessionId);

    const session: SessionItemType | null = await getSessionFromDb(sessionId);
    if (!session) return;

    const exercises = session.exercises;

    findNextSet(exercises, 0, 0);

    restartTimer(90);

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SET_CURRENT_SESSION,
      payloadSession: session,
    });
  };

  const loadLastSession = () => {
    const lastSessionId: string | null = localStorage.getItem("session");
    if (lastSessionId) openSession(lastSessionId);
  };

  const closeSession = () => {
    localStorage.removeItem("session");

    dispatch({ type: EXERCISE_REDUCER_ACTIONS.CLEAR_CURRENT_SESSION });
  };

  const editSession = () => {
    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.EDIT_SESSION,
    });
  };

  const updateSession = (
    // session: SessionItemType,
    _id: string,
    update: UpdateValueType
  ) => {
    const { name, value } = update;
    if (!currentExists || !state.currentSession?._id) return;
    // const updatedSession = { ...session, [name]: value };

    const updatedSession: SessionItemType = {
      ...state.currentSession,
      [name]: value,
    };

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.UPDATE_SESSION,
      payloadSession: updatedSession,
    });
  };

  const cloneSession = async (sessionId: string | null | undefined) => {
    if (!sessionId) return;

    const clonedSession: SessionItemType | null = await cloneSessionToDb(
      sessionId
    );
    if (clonedSession) {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.CLONE_SESSION,
        payloadSession: clonedSession,
      });
    }
  };

  const saveSessions = async () => {
    if (!state.sessions || !state.sessions?.length) {
      console.log("Sessions don't exist to save");
      return;
    }

    const updSessions: SessionListItemType[] | null = await saveSessionsToDb(
      state.sessions
    );

    if (!updSessions?.length) {
      console.log("Sessions don't exist to save");
      return;
    }

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SAVE_SESSIONS,
      payloadSessionPartial: updSessions,
    });
  };

  const saveCurrentSession = async (
    currentSession: SessionItemType | null,
    updateState: boolean = false
  ) => {
    if (!currentSession || !currentSession?._id) {
      console.log("Session ID or Current Session doesn't exist");
      return;
    }

    if (currentSession !== null && state?.exercises !== null) {
      const updSession: SessionItemType | null = await saveSessionToDb(
        currentSession
      );

      if (updateState) {
        dispatch({
          type: EXERCISE_REDUCER_ACTIONS.SAVE_SESSION,
          payloadSession: updSession,
        });
      }
    }
  };

  // ______________Exercise Functions
  const showTimer = (initialLoad?: boolean) => {
    let showTimerOrNot = !state.timerVisible;
    if (initialLoad) {
      const show = localStorage.getItem("timerVisible");
      showTimerOrNot = show ? JSON.parse(show) : showTimerOrNot;
    }
    localStorage.setItem("timerVisible", JSON.stringify(showTimerOrNot));

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SHOW_TIMER,
      other: showTimerOrNot,
    });
  };

  const restartTimer = (expiryTimer: number) => {
    const expiryDate = DateTime.local().plus({ seconds: expiryTimer });

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.RESTART_TIMER,
      other: expiryDate.toISO().toString(),
    });
  };

  const showAddExercise = async () => {
    if (!state.add) {
      const exercises = await getAllExercisesFromDb();
      if (exercises) {
        dispatch({
          type: EXERCISE_REDUCER_ACTIONS.SHOW_ADD_EXERCISE,
          other: exercises,
        });
      }
    } else {
      dispatch({ type: EXERCISE_REDUCER_ACTIONS.SHOW_ADD_EXERCISE });
    }
  };

  const addExercise = async (exerciseName: ExerciseNameType) => {
    const newExerciseName: ExerciseNameType | null =
      exerciseName?._id && exerciseName._id.includes("new")
        ? await addExerciseNameToDb(exerciseName)
        : exerciseName;

    if (state.currentSession && state.currentSession?._id && newExerciseName) {
      const newExercise: ExerciseItemType = {
        ...ExerciseItemNewValues,
        name: newExerciseName,
        id: totalExercises,
        order: totalExercises,
      };
      const currentSession = { ...state.currentSession };
      currentSession.exercises = [...currentSession.exercises, newExercise];

      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.ADD_EXERCISE,
        payloadSession: currentSession,
      });

      saveSessionToDb(currentSession);
    }
  };

  const deleteExercise = (id: string) => {
    if (currentSession !== null) {
      if (state.deletePressed === id) {
        const { exerciseId } = getIds(id);
        currentSession.exercises.splice(exerciseId, 1);

        dispatch({
          type: EXERCISE_REDUCER_ACTIONS.DELETE_SET,
          payloadSession: currentSession,
          id: null,
        });
        saveCurrentSession(currentSession);
      } else {
        dispatch({
          type: EXERCISE_REDUCER_ACTIONS.MARK_TO_DELETE,
          id: id,
        });
        // setAlert to advise to represe
      }
    }
  };

  const updateExercise = (
    // exercise: ExerciseItemType,
    id: string,
    update: UpdateValueType
  ) => {
    if (!currentSession?.exercises) return;
    const { name, value } = update;
    const { exerciseId } = getIds(id);

    const updExercises: ExerciseItemType[] = [...currentSession.exercises];
    const updExercise: ExerciseItemType = updExercises[exerciseId];
    updExercises[exerciseId] = { ...updExercise, [name]: value };

    const isCurrentEx: boolean = isCurrentExercise(
      state.currentExercise,
      exerciseId
    );
    const updateCurrentToThisId = isCurrentEx ? exerciseId : -1;
    currentSession.exercises = updExercises;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.UPDATE_EXERCISE,
      payloadSession: currentSession,
      id: updateCurrentToThisId,
    });
  };

  const setExercises = (exercises: ExerciseItemType[]) => {
    console.log(exercises);
    // dispatch({
    //   type: EXERCISE_REDUCER_ACTIONS.SET_EXERCISES,
    //   payload: exercises,
    // });
  };

  const clearExercises = () => {
    // dispatch({
    //   type: EXERCISE_REDUCER_ACTIONS.CLEAR_EXERCISES,
    // });
  };

  const setCurrentExercise = (exercise: ExerciseItemType) => {
    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SET_CURRENT_EXERCISE,
      payload: exercise,
    });
  };

  const clearCurrentExercise = () => {
    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SET_CURRENT_EXERCISE,
    });
  };

  const linkExercise = (
    exercise: ExerciseItemType,
    id: string,
    link: boolean
  ) => {
    if (currentSession === null) return;
    const { exerciseId } = getIds(id);
    currentSession.exercises[exerciseId].sets = exercise.sets.map((set) => ({
      ...set,
      link: link,
    }));

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.LINK_EXERCISE,
      payloadSession: currentSession,
    });

    saveCurrentSession(currentSession);
  };

  const showHideExercise = (exercise: ExerciseItemType, id: string) => {
    if (!currentSession) return;
    const { exerciseId } = getIds(id);
    currentSession.exercises[exerciseId].visible = !exercise.visible;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SHOWHIDE_EXERCISE,
      payloadSession: currentSession,
    });

    saveCurrentSession(currentSession);
  };

  const showHideExerciseAll = (showNotHide: boolean) => {
    if (!currentSession || !currentSession?.exercises) return;
    currentSession.exercises = currentSession.exercises.map((ex) => ({
      ...ex,
      visible: showNotHide,
    }));

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SHOWHIDE_EXERCISE_ALL,
      payloadSession: currentSession,
    });

    saveCurrentSession(currentSession);
  };

  const rateExercise = (id: string, rating: number) => {
    if (!currentSession || !currentSession?.exercises) return;

    const { exerciseId } = getIds(id);
    rating =
      currentSession.exercises[exerciseId]?.rating === rating ? 0 : rating;
    currentSession.exercises[exerciseId].rating = rating;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.RATE_EXERCISE,
      payloadSession: currentSession,
    });
    saveCurrentSession(currentSession);
  };

  const reorderExercise = (id: string, direction: string) => {
    if (!currentSession || !currentSession?.exercises) return;
    const { exerciseId } = getIds(id);
    const newPosition = direction === "up" ? exerciseId - 1 : exerciseId + 1;

    const updExercise = currentSession.exercises[exerciseId];
    currentSession.exercises.splice(exerciseId, 1);
    currentSession.exercises.splice(newPosition, 0, updExercise);
    currentSession.exercises = reIndexExercises(currentSession.exercises);

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.REORDER_EXERCISE,
      payloadSession: currentSession,
    });
    saveCurrentSession(currentSession);
  };

  const completeExercisesAll = async (completeOrNot: boolean) => {
    if (!currentSession || !currentSession?.exercises) return;

    const updExercises = updateAllExsStatus(
      currentSession.exercises,
      completeOrNot
    );
    currentSession.exercises = updExercises;
    findNextSet(updExercises, 0, 0);

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.COMPLETE_EXERCISE_ALL,
      payloadSession: currentSession,
    });
    saveCurrentSession(currentSession);
  };

  const completeExercise = (exercise: ExerciseItemType, id: string) => {
    if (!currentSession || !currentSession?.exercises) return;

    const markCompleted = !exercise?.completed;
    const { exerciseId } = getIds(id);

    const updExercises = [...currentSession.exercises];
    let updExercise = exercise;

    const exsUpdated = updateTheExerciseStatus(updExercise, markCompleted);
    updExercise = !exsUpdated ? exercise : exsUpdated;
    updExercises[exerciseId] = updExercise;

    currentSession.exercises = updExercises;

    findNextSet(updExercises, exerciseId, 0);

    restartTimer(90);

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.COMPLETE_EXERCISE,
      payloadSession: currentSession,
    });

    saveCurrentSession(currentSession);
  };

  // const saveExercise = async (
  //   sessionId: string | null | undefined,
  //   exercise: ExerciseItemType
  // ) => {
  //   console.log(exercise);
  //   if (sessionId == null || exercise?.id == null) {
  //     console.log("Session or Exercise ID doesn't exist");
  //     return;
  //   }

  //   await saveExerciseToDb(sessionId, exercise)
  //     .then((res) => {
  //       if (res?.data) {
  //         return res.data;
  //       } else {
  //         return null;
  //       }
  //     })
  //     .catch((err) => {
  //       if (err) console.log(err);
  //     });
  // };

  // // ______________Set Reducer Functions
  // const saveSet = async (
  //   sessionId: string | null | undefined,
  //   exerciseId: number,
  //   setId: number,
  //   set: SetItemType
  // ) => {
  //   // console.log({ sessionId, exerciseId, setId, set });
  //   if (
  //     sessionId === undefined ||
  //     sessionId === null ||
  //     exerciseId === undefined ||
  //     setId === undefined
  //   ) {
  //     console.log("Session, Exercise or Set ID doesn't exist");
  //     return;
  //   }
  //   await saveSetToDb(sessionId, exerciseId, setId, set);
  // };

  const updateSet = (id: string, update: UpdateValueType) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    // const update = action.update;
    if (update?.name == undefined || update?.value == undefined) {
      throw new Error("Update values are missing in updateSet action");
    }

    const { exerciseId, setId } = getIds(id);
    if (setId === undefined || setId === null) {
      throw new Error("setId missing in updateSet action");
    }
    // const set = action.payloadSet;
    const { name, value } = update;

    const updExercises: ExerciseItemType[] = [...currentSession.exercises];
    const set: SetItemType = { ...updExercises[exerciseId].sets[setId] };
    updExercises[exerciseId].sets[setId] = { ...set, [name]: value };

    const updatedSet: SetItemType = updExercises[exerciseId].sets[setId];
    const isTheCurrentExercise = isCurrentExercise(
      state.currentExercise,
      exerciseId
    );
    const isTheCurrentSet = isCurrentSet(state.currentSet, setId);
    const currentSet = !state.currentSet
      ? null
      : isTheCurrentSet && isTheCurrentExercise
      ? updatedSet
      : state.currentSet;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.UPDATE_SET,
      payloadSession: currentSession,
      payloadSet: currentSet,
    });
  };

  const addSet = (exercise: ExerciseItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId } = getIds(id);
    let updExercise = exercise;

    const noOfSets = updExercise.sets.length;
    if (noOfSets < 1) {
      updExercise.sets = [{ ...SetItemInitialValues }];
    } else {
      const setToCopy = updExercise.sets[noOfSets - 1];
      const newSet = {
        ...setToCopy,
        completed: false,
        completedWhen: null,
        started: false,
        startedWhen: null,
        rating: null,
        no: setToCopy.no + 1,
      };
      updExercise.sets = [...updExercise.sets, newSet];
    }
    currentSession.exercises[exerciseId] = updExercise;

    findNextSet(
      currentSession.exercises,
      exerciseId,
      noOfSets < 0 ? 0 : noOfSets
    );

    restartTimer(90);

    // update overall exercise to completed as well
    updExercise = updateExerciseStartedCompleted("completed", updExercise);
    currentSession.exercises[exerciseId] = updExercise;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.ADD_SET,
      payloadSession: currentSession,
    });

    saveCurrentSession(currentSession);
  };

  // const deleteSet = (set: SetItemType, id: string) => {
  const deleteSet = (id: string) => {
    if (state.deletePressed === id) {
      const { exerciseId, setId } = getIds(id);

      if (setId !== undefined && setId !== null) {
        if (!state.currentSession || !state.currentSession?.exercises) return;
        const currentSession: SessionItemType = { ...state.currentSession };
        let updExercise = currentSession.exercises[exerciseId];
        const currentSets = updExercise.sets;

        currentSets.splice(setId, 1);
        updExercise.sets = currentSets.map((set, idx) => ({
          ...set,
          no: idx + 1,
          order: idx,
          id: idx,
        }));

        // update overall exercise to completed as well
        updExercise = updateExerciseStartedCompleted("completed", updExercise);
        currentSession.exercises[exerciseId] = updExercise;

        saveCurrentSession(currentSession);

        dispatch({
          type: EXERCISE_REDUCER_ACTIONS.DELETE_SET,
          payloadSession: currentSession,
          id: null,
        });
      }
    } else {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.MARK_TO_DELETE,
        id: id,
      });
    }
  };

  const findNextSet = (
    exercises: ExerciseItemType[],
    exerciseId: number | null | undefined,
    setId: number | null | undefined
  ) => {
    exerciseId = exerciseId ?? 0;
    setId = setId ?? 0;
    const { nextExercise, nextSet } = getNextExerciseAndSet(
      exercises,
      exerciseId,
      setId
    );

    if (nextExercise && nextSet) {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.NEXT_SET,
        payload: nextExercise,
        payloadSet: nextSet,
        id: ["exercise", nextExercise.id, "set", nextSet.id].join("."),
      });
    } else {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.CLEAR_NEXT_SET,
      });
    }
  };

  const startSet = async (set: SetItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId, setId } = getIds(id);
    if (
      exerciseId === undefined ||
      exerciseId === null ||
      setId === null ||
      setId === undefined
    ) {
      return console.log("Exercise or Set Id missing in startSet action");
      // return throw new Error("Exercise or Set Id missing in startSet action");
    }

    const find: string = started.text;
    const currentValue = set?.[find];

    const updExercises = [...currentSession.exercises];
    let updExercise = updExercises[exerciseId];
    const updSet = {
      ...set,
      [find]: currentValue ? false : true,
      [`${find}When`]: currentValue ? null : new Date(),
    };
    updExercises[exerciseId].sets[setId] = updSet;

    // update overall exercise to completed as well
    updExercise = updateExerciseStartedCompleted(find, updExercise);
    updExercises[exerciseId] = updExercise;
    currentSession.exercises = updExercises;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.START_SET,
      payloadSession: currentSession,
      payloadSet: id === state.currentId ? updSet : state.currentSet,
    });

    saveCurrentSession(currentSession, false);
  };

  const completeSet = async (set: SetItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId, setId } = getIds(id);
    if (setId === undefined || setId === null) return;

    const find = completed.text;
    // const currentValue = set?.[find] ? true : false;
    const setCompleted = set?.[find] ? false : true;

    let updExercise = currentSession.exercises[exerciseId];
    let updSet = {
      ...set,
      [find]: setCompleted,
      [`${find}When`]: setCompleted ? new Date() : null,
    };
    if (!setCompleted) {
      updSet = { ...updSet, started: false, startedWhen: null };
    }
    updExercise.sets[setId] = updSet;

    // update overall exercise to completed as well
    updExercise = updateExerciseStartedCompleted(find, updExercise);
    currentSession.exercises[exerciseId] = updExercise;

    findNextSet(currentSession.exercises, exerciseId, setId);

    restartTimer(90);

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.COMPLETE_SET,
      payloadSession: currentSession,
    });

    saveCurrentSession(currentSession, false);
  };

  const linkSet = (set: SetItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId, setId } = getIds(id);

    if (setId !== undefined && setId !== null) {
      const updExercises: ExerciseItemType[] = [...currentSession.exercises];
      const updSet: SetItemType = updExercises[exerciseId].sets[setId];
      updSet.link = set?.link ? false : true;
      updExercises[exerciseId].sets[setId] = updSet;
      currentSession.exercises = updExercises;

      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.LINK_SET,
        payloadSession: currentSession,
      });

      saveCurrentSession(currentSession, false);
    }
  };

  const totalSessions: number = state.sessions.length;
  const totalExercises: number = state.currentSession?.exercises?.length ?? 0;

  const isExerciseCompleted = (exercise: ExerciseItemType) => {
    if (!exercise?.sets?.length) return false;
    const setsNotDone = exercise.sets.filter(
      (set: SetItemType) => !set?.completed
    );
    return setsNotDone?.length ? false : true;
  };
  const exercisesCompleted: number = !currentSession?.exercises
    ? 0
    : currentSession.exercises.filter((exercise: ExerciseItemType) =>
        isExerciseCompleted(exercise)
      ).length;

  return {
    getSessions,
    openSession,
    loadLastSession,
    closeSession,
    editSession,
    addExercise,
    showAddExercise,
    deleteExercise,
    updateSession,
    cloneSession,
    updateExercise,
    updateSet,
    saveCurrentSession,
    saveSessions,
    showTimer,
    restartTimer,
    setExercises,
    clearExercises,
    setCurrentExercise,
    clearCurrentExercise,
    showHideExerciseAll,
    showHideExercise,
    linkExercise,
    completeExercisesAll,
    completeExercise,
    rateExercise,
    reorderExercise,
    linkSet,
    addSet,
    deleteSet,
    startSet,
    completeSet,
    findNextSet,
    totalSessions,
    totalExercises,
    exercisesCompleted,
    sessions: state.sessions,
    currentSession: state.currentSession,
    exercises: state.exercises,
    exercisesAll: state.exercisesAll,
    currentExercise: state.currentExercise,
    currentSet: state.currentSet,
    currentId: state.currentId,
    deletePressed: state.deletePressed,
    timerVisible: state.timerVisible,
    timerExpiry: state.timerExpiry,
    edit: state.edit,
    add: state.add,
  };
};

export type UseExerciseContextType = ReturnType<typeof useExerciseContext>;

const initExerciseContextState: UseExerciseContextType = {
  getSessions: async () => {},
  openSession: async () => {},
  loadLastSession: () => {},
  closeSession: () => {},
  editSession: () => {},
  updateSession: () => {},
  cloneSession: async () => {},
  showTimer: () => {},
  restartTimer: () => {},
  addExercise: async () => {},
  showAddExercise: async () => {},
  deleteExercise: () => {},
  updateExercise: () => {},
  updateSet: () => {},
  saveCurrentSession: async () => {},
  saveSessions: async () => {},
  setExercises: () => {},
  clearExercises: () => {},
  setCurrentExercise: () => {},
  clearCurrentExercise: () => {},
  completeExercisesAll: async () => {},
  completeExercise: () => {},
  linkExercise: () => {},
  rateExercise: () => {},
  reorderExercise: () => {},
  showHideExerciseAll: () => {},
  showHideExercise: () => {},
  linkSet: () => {},
  addSet: () => {},
  deleteSet: () => {},
  startSet: async () => {},
  completeSet: async () => {},
  findNextSet: () => {},
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

export const ExerciseContext = createContext<UseExerciseContextType>(
  initExerciseContextState
);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const ExerciseProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <ExerciseContext.Provider value={useExerciseContext(initExerciseState)}>
      {children}
    </ExerciseContext.Provider>
  );
};
