import { createContext, ReactElement, useMemo, useReducer } from "react";
import axios, { AxiosResponse } from "axios";

import {
  SetItemType,
  ExerciseItemType,
  SessionItemType,
  ExerciseNameType,
  ExerciseItemNewValues,
  SessionListItemType,
} from "./types";
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
  isCurrentExercise,
  // isCurrentSession,
  isCurrentSet,
} from "../utilities/common";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

type ExerciseStateType = {
  sessions: Partial<SessionItemType>[];
  // sessions: SessionListItemType[];
  currentSession: SessionItemType | null;
  exercises: ExerciseItemType[];
  exercisesAll: ExerciseNameType[];
  totalExercises: number | null;
  currentExercise: ExerciseItemType | null;
  currentSet: SetItemType | null;
  deletePressed: string | null;
  timerVisible: boolean | null;
  add: boolean;
  edit: boolean;
};

const initExerciseState: ExerciseStateType = {
  sessions: [],
  currentSession: null,
  exercises: [],
  exercisesAll: [],
  totalExercises: null,
  currentExercise: null,
  currentSet: null,
  deletePressed: null,
  timerVisible: true,
  edit: false,
  add: false,
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
        return { ...state };
      } else {
        return { ...state, sessions: payload };
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
          // exercises: currentSession.exercises ?? [],
        };
      } else {
        return { ...state };
      }
    }
    case EXERCISE_REDUCER_ACTION_TYPE.CLEAR_CURRENT_SESSION: {
      return { ...state, currentSession: null };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.EDIT_SESSION: {
      return { ...state, edit: !state.edit };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.UPDATE_SESSION: {
      const payload = action?.payloadSessionPartial;
      if (!payload || !Array.isArray(payload)) {
        throw new Error("action.payload missing in UPDATE_SESSION action");
      }

      if (action?.id === undefined || typeof action?.id !== "number") {
        throw new Error("action.id missing in UPDATE_SESSION action");
      }

      const id = action.id;
      const currentSession = !state?.currentSession
        ? null
        : id !== -1
        ? { ...state.currentSession, ...payload[id] }
        : state.currentSession;

      return {
        ...state,
        sessions: payload,
        currentSession: currentSession,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.CLONE_SESSION:
    case EXERCISE_REDUCER_ACTION_TYPE.ADD_SESSION: {
      const payload = action?.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in UPDATE_SESSION action");
      }

      let newSessions = [payload, ...state.sessions];
      newSessions.pop();

      return {
        ...state,
        sessions: newSessions,
      };
    }

    case EXERCISE_REDUCER_ACTION_TYPE.SAVE_SESSIONS: {
      const payload = action?.payloadSessionPartial;
      if (!payload || !Array.isArray(payload)) {
        throw new Error("Sessions payload not passed for saving");
      }

      // let currentSession = state.currentSession ? {...state.currentSession} : null
      // if (currentSession && currentSession?._id) {
      //   let sessionId = currentSession._id
      //   currentSession = state.sessions.find(session => session._id === sessionId) ?? null
      // }

      return {
        ...state,
        sessions: payload,
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
        };
      } else {
        return { ...state };
      }
    }

    // ______________Exercise Reducer Actions
    case EXERCISE_REDUCER_ACTION_TYPE.SHOW_TIMER: {
      return { ...state, timerVisible: !state.timerVisible };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.SHOW_ADD_EXERCISE: {
      if (action?.other && Array.isArray(action.other)) {
        return { ...state, add: !state.add, exercisesAll: action.other };
      } else {
        return { ...state, add: !state.add };
      }
    }
    case EXERCISE_REDUCER_ACTION_TYPE.ADD_EXERCISE: {
      // const payloadEx = action.payload;
      const payloadSession = action.payloadSession;
      if (
        // payloadEx &&
        // Array.isArray(payloadEx) &&
        payloadSession &&
        !Array.isArray(payloadSession)
      ) {
        return {
          ...state,
          // exercises: payloadEx,
          currentSession: payloadSession,
        };
      } else {
        return { ...state };
      }
    }
    case EXERCISE_REDUCER_ACTION_TYPE.DELETE_EXERCISE: {
      // if (!action.payload || !Array.isArray(action.payload)) {
      //   throw new Error("action.payload missing in DELETE_EXERCISE action");
      // }

      // return {
      //   ...state,
      //   exercises: action.payload ?? state.exercises,
      //   deletePressed: "",
      // };
      if (!action.payloadSession || Array.isArray(action.payloadSession)) {
        throw new Error("action.payload missing in DELETE_EXERCISE action");
      }

      return {
        ...state,
        currentSession: action.payloadSession,
        deletePressed: "",
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.MARK_TO_DELETE: {
      if (action.id === undefined || typeof action.id !== "string") {
        console.log("action.id missing or incorrect in MARK_TO_DELETE action");
        return { ...state };
      }

      return {
        ...state,
        deletePressed: action.id,
      };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.UPDATE_EXERCISE: {
      // if (!action.payload || !Array.isArray(action.payload)) {
      //   throw new Error("action.payload missing in UPDATE_EXERCISE action");
      // }
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
        // exercises: action.payload,
        currentSession: currentSession,
        currentExercise: currentExercise,
      };
    }
    // case EXERCISE_REDUCER_ACTION_TYPE.SET_EXERCISES: {
    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in SET_EXERCISES action");
    //   }

    //   return { ...state, exercises: action.payload };
    // }
    // case EXERCISE_REDUCER_ACTION_TYPE.CLEAR_EXERCISES: {
    //   return { ...state, exercises: [] };
    // }
    case EXERCISE_REDUCER_ACTION_TYPE.SET_CURRENT_EXERCISE: {
      if (!action.payload || Array.isArray(action.payload)) {
        throw new Error(
          "action.payload missing in SET_CURRENT_EXERCISE action"
        );
      }

      return { ...state, currentExercise: action.payload };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.CLEAR_CURRENT_EXERCISE: {
      return { ...state, currentExercise: null };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.LINK_EXERCISE: {
      let payload = action.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in REORDER_EXERCISE action");
      }

      return {
        ...state,
        currentSession: payload,
      };
      // if (!action.payload || !Array.isArray(action.payload)) {
      //   throw new Error("action.payload missing in REORDER_EXERCISE action");
      // }

      // return {
      //   ...state,
      //   exercises: action.payload,
      // };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.SHOWHIDE_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.SHOWHIDE_EXERCISE_ALL:
    case EXERCISE_REDUCER_ACTION_TYPE.RATE_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.REORDER_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_EXERCISE_ALL:
    case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_EXERCISE:
    case EXERCISE_REDUCER_ACTION_TYPE.START_SET:

    case EXERCISE_REDUCER_ACTION_TYPE.ADD_SET:
    case EXERCISE_REDUCER_ACTION_TYPE.LINK_SET:
    case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_SET: {
      let payload = action?.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in REORDER_EXERCISE action");
      }

      return {
        ...state,
        currentSession: payload,
        // exercises: action.payload,
      };
    }
    // case EXERCISE_REDUCER_ACTION_TYPE.SHOWHIDE_EXERCISE:

    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in REORDER_EXERCISE action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // // }
    // case EXERCISE_REDUCER_ACTION_TYPE.RATE_EXERCISE:

    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in REORDER_EXERCISE action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // // }

    // case EXERCISE_REDUCER_ACTION_TYPE.REORDER_EXERCISE:

    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in REORDER_EXERCISE action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // }
    // case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_EXERCISE_ALL: {
    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in COMPLETE_EXERCISE action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // }
    // case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_EXERCISE: {
    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in COMPLETE_EXERCISE action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // }
    // ______________Set Reducer Actions

    case EXERCISE_REDUCER_ACTION_TYPE.UPDATE_SET: {
      if (!action.payloadSession || Array.isArray(action.payloadSession)) {
        throw new Error("action.payloadSession missing in UPDATE_SET action");
      }
      // if (!action.payload || !Array.isArray(action.payload)) {
      //   throw new Error("action.payload missing in UPDATE_SET action");
      // }

      if (action.payloadSet === undefined || Array.isArray(action.payloadSet)) {
        throw new Error("action.payloadSet missing in UPDATE_SET action");
      }

      return {
        ...state,
        currentSession: action.payloadSession,
        // exercises: action.payload,
        currentSet: action.payloadSet,
      };
    }
    // case EXERCISE_REDUCER_ACTION_TYPE.ADD_SET: {
    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in ADD_SET action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // }
    case EXERCISE_REDUCER_ACTION_TYPE.DELETE_SET: {
      const payload = action.payloadSession;
      if (!payload || Array.isArray(payload)) {
        throw new Error("action.payload missing in DELETE_SET action");
      }

      return {
        ...state,
        currentSession: payload,
        // exercises: action.payload ?? state.exercises,
        deletePressed: null,
      };
      // if (!action.payload || !Array.isArray(action.payload)) {
      //   throw new Error("action.payload missing in DELETE_SET action");
      // }

      // return {
      //   ...state,
      //   exercises: action.payload ?? state.exercises,
      //   deletePressed: null,
      // };
    }
    case EXERCISE_REDUCER_ACTION_TYPE.NEXT_SET: {
      if (!action.payload || Array.isArray(action.payload)) {
        throw new Error("action.payload missing in NEXT_SET action");
      }

      if (!action.payloadSet || Array.isArray(action.payloadSet)) {
        throw new Error("action.payloadSet missing in NEXT_SET action");
      }

      return {
        ...state,
        currentExercise: action.payload,
        currentSet: action.payloadSet,
      };
    }
    // case EXERCISE_REDUCER_ACTION_TYPE.START_SET: {
    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in START_SET action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // }

    // case EXERCISE_REDUCER_ACTION_TYPE.COMPLETE_SET: {
    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in COMPLETE_SET action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload ?? state.exercises,
    //   };
    // }

    // case EXERCISE_REDUCER_ACTION_TYPE.LINK_SET: {
    //   if (!action.payload || !Array.isArray(action.payload)) {
    //     throw new Error("action.payload missing in LINK_SET action");
    //   }

    //   return {
    //     ...state,
    //     exercises: action.payload,
    //   };
    // }
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

  // __________ SESSION FUNCTIONS

  // const getSessions = async () => {
  const getSessions = async (filters: any, sort: object, start?: number) => {
    if (!start) start = 1;

    await axios
      .get(`/api/sessions`, {
        params: { filters: filters, sort: sort, start: start },
        // params: { filters: filters, sort: sort, start: start },
      })
      .then((res: AxiosResponse) => {
        const sessions: SessionListItemType[] = res.data;
        if (sessions) {
          dispatch({
            type: EXERCISE_REDUCER_ACTIONS.GET_SESSIONS,
            payloadSessionPartial: sessions,
          });
        } else {
          return null;
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  const getSession = async (
    sessionId: string
  ): Promise<SessionItemType | null> => {
    return await axios
      .get(`/api/sessions/session/${sessionId}`)
      .then((res: AxiosResponse) => {
        if (res.data) {
          return res.data;
        } else {
          return null;
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return null;
        }
      });
  };

  const openSession = async (sessionId: string | null | undefined) => {
    if (!sessionId) return;
    localStorage.setItem("session", sessionId);

    let session: SessionItemType | null = await getSession(sessionId);
    if (!session) return;

    let exercises = session.exercises;
    findNextSet(exercises, exercises[0], exercises[0].sets[0]);

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SET_CURRENT_SESSION,
      payloadSession: session,
    });
  };

  const loadLastSession = () => {
    let lastSessionId: string | null = localStorage.getItem("session");
    if (lastSessionId) {
      openSession(lastSessionId);
      // const session = state.sessions.find(
      //   (session) => session._id === lastSessionId
      // );
      // if (session) {
      //   dispatch({
      //     type: EXERCISE_REDUCER_ACTIONS.LOAD_LAST_SESSION,
      //     payloadSession: session,
      //   });

      //   let exercises = session.exercises;
      //   findNextSet(exercises, exercises[0], exercises[0].sets[0]);
      // }
    }
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
    session: Partial<SessionItemType>,
    // session: SessionItemType | SessionListItemType,
    _id: string,
    update: UpdateValueType
  ) => {
    const { name, value } = update;
    const sessionId = state.sessions.findIndex((sess) => sess._id === _id);

    if (sessionId === null || sessionId === undefined)
      return console.log("Session ID not found");

    let updatedSessions: Partial<SessionItemType>[] = [...state.sessions];
    updatedSessions[sessionId] = { ...session, [name]: value };

    const currentId = state?.currentSession?._id;
    const isTheCurrentSession = currentId === _id;
    const updateCurrentToThisId = isTheCurrentSession ? sessionId : -1;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.UPDATE_SESSION,
      payloadSessionPartial: updatedSessions,
      id: updateCurrentToThisId,
    });
  };

  const cloneSessionToDb = async (
    sessionId: string
  ): Promise<SessionItemType> => {
    return await axios
      .post(`/api/sessions/clone`, { sessionId }, config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err) console.log(err);
        return null;
      });
  };

  const cloneSession = async (sessionId: string | null | undefined) => {
    if (!sessionId) return;

    let clonedSession: SessionItemType | null = await cloneSessionToDb(
      sessionId
    );

    // let newSession: Partial<SessionItemType> = {
    //   ...session,
    //   date: new Date(),
    //   comments: "",
    // };
    // let exercises = newSession.exercises;
    // delete newSession._id;
    // newSession.exercises = !exercises
    //   ? []
    //   : exercises.map((exercise) => ({
    //       ...exercise,
    //       ...started.no,
    //       ...completed.no,
    //       rating: 0,
    //       visible: true,
    //       comments: "",
    //       sets: !exercise?.sets
    //         ? []
    //         : exercise.sets.map((set) => ({
    //             ...set,
    //             ...started.no,
    //             ...completed.no,
    //           })),
    //     }));

    // const savedSession: SessionItemType = await addSession(newSession);
    if (clonedSession) {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.CLONE_SESSION,
        payloadSession: clonedSession,
      });
    }
  };

  const saveSessionsToDB = async (
    sessions: Partial<SessionItemType>[]
  ): Promise<SessionListItemType[]> => {
    return await axios
      .put(`/api/sessions/many`, sessions, config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  };

  const saveSessions = async () => {
    if (!state.sessions || !state.sessions?.length) {
      console.log("Sessions don't exist to save");
      return;
    }

    const updSessions: SessionListItemType[] = await saveSessionsToDB(
      state.sessions
    );

    if (
      updSessions === undefined ||
      updSessions === null ||
      !updSessions?.length
    ) {
      console.log("Sessions don't exist to save");
      return;
    }

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SAVE_SESSIONS,
      payloadSessionPartial: updSessions,
    });
  };

  const saveSession = async (session: SessionItemType) => {
    // if (!state.sessions || !state.sessions?.length) {
    //   console.log("Sessions don't exist to save");
    //   return;
    // }

    const updSessions: SessionListItemType[] = await saveSessionsToDB(
      state.sessions
    );

    if (
      updSessions === undefined ||
      updSessions === null ||
      !updSessions?.length
    ) {
      console.log("Sessions don't exist to save");
      return;
    }

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SAVE_SESSIONS,
      payloadSessionPartial: updSessions,
    });
  };

  const saveCurrentSession = async (currentSession: SessionItemType | null) => {
    // const session = state.currentSession;
    if (!currentSession || !currentSession?._id) {
      console.log("Session ID or Current Session doesn't exist");
      return;
    }

    if (currentSession !== null && state?.exercises !== null) {
      const updSession: SessionItemType = await saveSessionToDB(currentSession);
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.SAVE_SESSION,
        payloadSession: updSession,
      });

      findNextSet(
        updSession.exercises,
        updSession.exercises[0],
        updSession.exercises[0].sets[0]
      );
    }
  };

  const saveSessionToDB = async (
    session: SessionItemType | Partial<SessionItemType>
  ): Promise<SessionItemType> => {
    return await axios
      .put(`/api/sessions/${session._id}`, session, config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  };

  // ______________Exercise Functions
  const showTimer = () => {
    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SHOW_TIMER,
    });
  };

  const getAllExercises = async () => {
    return await axios
      .get(`/api/sessions/exercises`)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          return res.data;
        } else {
          return null;
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return null;
        }
      });
  };

  const showAddExercise = async () => {
    if (!state.add) {
      const exercises = await getAllExercises();
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

  const addExerciseNameToDb = async (
    exerciseName: Partial<ExerciseNameType>
  ): Promise<ExerciseNameType> => {
    delete exerciseName._id;

    return await axios
      .post(`/api/sessions/exercise/name`, exerciseName, config)
      .then((res) => {
        if (res?.data && res.data?._id) {
          return res.data;
        }
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  };

  const addExercise = async (exerciseName: ExerciseNameType) => {
    const newExerciseName: ExerciseNameType =
      exerciseName?._id && exerciseName._id.includes("new")
        ? await addExerciseNameToDb(exerciseName)
        : exerciseName;

    if (state.currentSession && state.currentSession?._id) {
      let newExercise: ExerciseItemType = {
        ...ExerciseItemNewValues,
        name: newExerciseName,
        id: totalExercises,
        order: totalExercises,
      };
      // let exercises: ExerciseItemType[] = [...state.exercises, newExercise];
      const currentSession = { ...state.currentSession };
      currentSession.exercises = [...currentSession.exercises, newExercise];

      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.ADD_EXERCISE,
        // payload: exercises,
        payloadSession: currentSession,
      });
      // dispatch({
      //   type: EXERCISE_REDUCER_ACTIONS.ADD_EXERCISE,
      //   payload: exercises,
      //   payloadSession: { ...state.currentSession, exercises },
      // });

      await saveSessionToDB(currentSession);
    }
  };

  const deleteExercise = (exercises: ExerciseItemType[], id: string) => {
    if (state.deletePressed === id) {
      const { exerciseId } = getIds(id);
      const updExercises: ExerciseItemType[] = [...exercises];
      updExercises.splice(exerciseId, 1);

      if (state.currentSession?._id) {
        const currentSession: SessionItemType = { ...state.currentSession };
        currentSession.exercises = updExercises;

        dispatch({
          type: EXERCISE_REDUCER_ACTIONS.DELETE_SET,
          // payload: updExercises,
          payloadSession: currentSession,
          id: null,
        });

        // const sessionId = state.currentSession._id;
        // if (sessionId) saveExercise(sessionId, updExercises[exerciseId]);
        // if (sessionId) saveCurrentSession(currentSession);
        saveCurrentSession(currentSession);
      }
    } else {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.MARK_TO_DELETE,
        id: id,
      });
      // setAlert to advise to represe
    }
  };

  const updateExercise = (
    exercise: ExerciseItemType,
    id: string,
    update: UpdateValueType
  ) => {
    if (!state.currentSession?._id) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    if (!currentSession?.exercises) return;
    const { name, value } = update;
    const { exerciseId } = getIds(id);

    let updExercises: ExerciseItemType[] = [...currentSession.exercises];
    updExercises[exerciseId] = { ...exercise, [name]: value };
    const isCurrentEx: boolean = isCurrentExercise(
      state.currentExercise,
      exerciseId
    );
    const updateCurrentToThisId = isCurrentEx ? exerciseId : -1;
    currentSession.exercises = updExercises;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.UPDATE_EXERCISE,
      // payload: updExercises,
      payloadSession: currentSession,
      id: updateCurrentToThisId,
    });

    // const { name, value } = update;
    // const { exerciseId } = getIds(id);

    // let updExercises: ExerciseItemType[] = [...state.exercises];
    // updExercises[exerciseId] = { ...exercise, [name]: value };

    // const isCurrentEx: boolean = isCurrentExercise(
    //   state.currentExercise,
    //   exerciseId
    // );
    // const updateCurrentToThisId = isCurrentEx ? exerciseId : -1;

    // dispatch({
    //   type: EXERCISE_REDUCER_ACTIONS.UPDATE_EXERCISE,
    //   payload: updExercises,
    //   id: updateCurrentToThisId,
    // });
  };

  const setExercises = (exercises: ExerciseItemType[]) => {
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
    if (
      !state?.currentSession ||
      !state.currentSession?._id ||
      typeof !state.currentSession?._id !== "string"
    )
      return;
    // const sessionId = state.currentSession?._id

    const currentSession: SessionItemType = { ...state.currentSession };
    const { exerciseId } = getIds(id);
    let updExercises = [...currentSession.exercises];
    // let updExercise = updExercises[exerciseId];
    updExercises[exerciseId].sets = exercise.sets.map((set) => ({
      ...set,
      link: link,
    }));
    currentSession.exercises = updExercises;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.LINK_EXERCISE,
      payloadSession: currentSession,
      // payload: updExercises,
    });

    // const sessionId = state.currentSession?._id;
    // if (sessionId) {
    saveCurrentSession(currentSession);
    // saveExercise(sessionId, updExercise);
    // }
  };

  const showHideExercise = (exercise: ExerciseItemType, id: string) => {
    // const exercise = action.payload;
    if (!state.currentSession) return;
    const currentSession: SessionItemType = { ...state.currentSession };
    const { exerciseId } = getIds(id);
    // let updExercises = [...state.currentSession.exercises];
    currentSession.exercises[exerciseId].visible = !exercise.visible;
    // currentSession.exercises = updExercises

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SHOWHIDE_EXERCISE,
      payloadSession: currentSession,
      // payload: updExercises,
    });

    // const sessionId = state.currentSession?._id;
    // if (sessionId) {
    saveCurrentSession(currentSession);
    // saveExercise(sessionId, updExercises[exerciseId]);
    // }
  };

  const showHideExerciseAll = (showNotHide: boolean) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };
    currentSession.exercises.map((ex) => ({ ...ex, visible: showNotHide }));
    // let exercises: ExerciseItemType[] = [
    //   ...currentSession.exercises.map((ex) => ({ ...ex, visible: showNotHide })),
    // ];

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.SHOWHIDE_EXERCISE_ALL,
      payloadSession: currentSession,
    });

    saveCurrentSession(currentSession);

    // if (state.currentSession && state?.currentSession?._id) {
    //   const currentSession: SessionItemType = state.currentSession;
    //   if (currentSession?._id) {
    //     const sessionToSave: SessionItemType = {
    //       ...currentSession,
    //       exercises: updExercises,
    //     };
    //     saveCurrentSession(sessionToSave);
    //   }
    // // }
  };

  const rateExercise = (id: string, rating: number) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };
    let { exerciseId } = getIds(id);
    // let updExercises = [...state.exercises];

    // read existing rating to see if same is passed
    //    if same is passed, its considered to clear it
    rating =
      currentSession.exercises[exerciseId]?.rating === rating ? 0 : rating;
    currentSession.exercises[exerciseId].rating = rating;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.RATE_EXERCISE,
      payloadSession: currentSession,
    });
    saveCurrentSession(currentSession);

    // const sessionId = state.currentSession?._id;
    // console.log(sessionId);
    // if (sessionId) {
    //   saveExercise(sessionId, updExercises[exerciseId]);
    // }
  };

  const reorderExercise = (
    exercises: ExerciseItemType[],
    id: string,
    direction: string
  ) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId } = getIds(id);
    const newPosition = direction === "up" ? exerciseId - 1 : exerciseId + 1;

    // let updExercises = [...exercises];
    let updExercise = currentSession.exercises[exerciseId];

    currentSession.exercises.splice(exerciseId, 1);
    currentSession.exercises.splice(newPosition, 0, updExercise);
    currentSession.exercises = reIndexExercises(currentSession.exercises);

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.REORDER_EXERCISE,
      payloadSession: currentSession,
      // payload: updExercises,
    });
    saveCurrentSession(currentSession);

    // if (state?.currentSession?._id) {
    //   saveCurrentSession({ ...state.currentSession, exercises: updExercises });
    // }
  };

  const completeExercisesAll = async (completeOrNot: boolean) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    let updExercises = updateAllExsStatus(
      currentSession.exercises,
      completeOrNot
    );
    findNextSet(updExercises, updExercises[0], updExercises[0].sets[0]);

    currentSession.exercises = updExercises;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.COMPLETE_EXERCISE_ALL,
      payloadSession: currentSession,
    });
    saveCurrentSession(currentSession);
    //   dispatch({
    //     type: EXERCISE_REDUCER_ACTIONS.COMPLETE_EXERCISE_ALL,
    //     payload: updExercises,
    //   });

    //   if (state?.currentSession?._id) {
    //     saveCurrentSession({ ...state.currentSession, exercises: updExercises });
    //   }
  };

  const completeExercise = (exercise: ExerciseItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const markCompleted = !exercise?.completed;
    const { exerciseId } = getIds(id);

    let updExercises = [...currentSession.exercises];
    let updExercise = exercise;

    updExercise = updateTheExerciseStatus(updExercise, markCompleted);
    updExercises[exerciseId] = updExercise;

    findNextSet(updExercises, updExercise, updExercise.sets[0]);
    currentSession.exercises = updExercises;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.COMPLETE_EXERCISE,
      payloadSession: currentSession,
      // payload: updExercises,
      // id: id,
    });

    // const sessionId = state.currentSession?._id;
    saveCurrentSession(currentSession);
    // const markCompleted = !exercise?.completed;
    // const { exerciseId } = getIds(id);

    // let updExercises = [...state.exercises];
    // let updExercise = exercise;

    // updExercise = updateTheExerciseStatus(updExercise, markCompleted);
    // updExercises[exerciseId] = updExercise;

    // findNextSet(updExercises, updExercise, updExercise.sets[0]);

    // dispatch({
    //   type: EXERCISE_REDUCER_ACTIONS.COMPLETE_EXERCISE,
    //   payload: updExercises,
    //   id: id,
    // });

    // const sessionId = state.currentSession?._id;
    // saveExercise(sessionId, updExercises[exerciseId]);
  };

  const saveExerciseToDB = async (
    sessionId: string,
    exercise: ExerciseItemType
  ): Promise<SessionItemType> => {
    return await axios
      .put(
        `/api/sessions/exercise/${sessionId}/${exercise.id}`,
        exercise,
        config
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  };

  const saveExercise = async (
    sessionId: string | null | undefined,
    exercise: ExerciseItemType
  ) => {
    console.log(exercise);
    if (sessionId == null || exercise?.id == null) {
      console.log("Session or Exercise ID doesn't exist");
      return;
    }

    await saveExerciseToDB(sessionId, exercise)
      .then((res) => {
        // console.log("data exists? ", !!res?.data);
        // console.log(res?.data);
        return res.data;
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  };

  // ______________Set Reducer Functions

  const saveSet = async (
    sessionId: string | null | undefined,
    exerciseId: number,
    setId: number,
    set: SetItemType
  ) => {
    // console.log({ sessionId, exerciseId, setId, set });
    if (
      sessionId === undefined ||
      sessionId === null ||
      exerciseId === undefined ||
      setId === undefined
    ) {
      console.log("Session, Exercise or Set ID doesn't exist");
      return;
    }

    await axios
      .put(`/api/sessions/set/${sessionId}/${exerciseId}/${setId}`, set, config)
      .then((res) => {
        console.log("data exists? ", !!res?.data);
        console.log(res?.data);
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  };

  const updateSet = (set: SetItemType, id: string, update: UpdateValueType) => {
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

    let updExercises: ExerciseItemType[] = [...currentSession.exercises];
    updExercises[exerciseId].sets[setId] = { ...set, [name]: value };

    let updatedSet: SetItemType = updExercises[exerciseId].sets[setId];
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
      // payload: updExercises,
      payloadSession: currentSession,
      payloadSet: currentSet,
    });
  };

  const addSet = (exercise: ExerciseItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    let { exerciseId } = getIds(id);
    // let updExercises = [...currentSession.exercises];
    let updExercise = exercise;

    let setToCopy = updExercise.sets[exercise.sets.length - 1];
    let itemsToChange = {
      completed: false,
      completedWhen: null,
      started: false,
      startedWhen: null,
      rating: null,
      no: setToCopy.no + 1,
    };

    if (updExercise?.sets?.length) {
      updExercise.sets = [
        ...updExercise.sets,
        { ...setToCopy, ...itemsToChange },
      ];
    }
    currentSession.exercises[exerciseId] = updExercise;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.ADD_SET,
      payloadSession: currentSession,
      // payload: updExercises,
    });

    // const sessionId = state.currentSession?._id;
    saveCurrentSession(currentSession);
    // const sessionId = state.currentSession?._id;
    // saveExercise(sessionId, updExercise);
    // TO-DO: return saved exercise to state to keep version current
  };

  // const deleteSet = (set: SetItemType, id: string) => {
  const deleteSet = (id: string) => {
    if (state.deletePressed === id) {
      // const updExercises = [...state.exercises];
      const { exerciseId, setId } = getIds(id);

      if (setId !== undefined && setId !== null) {
        if (!state.currentSession || !state.currentSession?.exercises) return;
        const currentSession: SessionItemType = { ...state.currentSession };

        currentSession.exercises[exerciseId].sets.splice(setId, 1);
        saveCurrentSession(currentSession);
        // const sessionId = state.currentSession?._id;
        // saveExercise(sessionId, updExercises[exerciseId]);

        dispatch({
          type: EXERCISE_REDUCER_ACTIONS.DELETE_SET,
          payloadSession: currentSession,
          // payload: updExercises,
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
    currentExercise: ExerciseItemType,
    currentSet: SetItemType
  ) => {
    const { nextExercise, nextSet } = getNextExerciseAndSet(
      exercises,
      currentExercise,
      currentSet
    );

    if (nextExercise && nextSet) {
      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.NEXT_SET,
        payload: nextExercise,
        payloadSet: nextSet,
      });
    }
  };

  const startSet = (set: SetItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId, setId } = getIds(id);
    if (
      exerciseId === undefined ||
      exerciseId === null ||
      setId === undefined ||
      setId === null
    ) {
      return console.log("Exercise or Set Id missing in startSet action");
      // return throw new Error("Exercise or Set Id missing in startSet action");
    }

    const find: string = started.text;
    const currentValue = set?.[find];

    let updExercises = [...currentSession.exercises];
    let updExercise = updExercises[exerciseId];
    let updSet = {
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
      // payload: updExercises,
    });

    saveCurrentSession(currentSession);
    // const sessionId = state.currentSession?._id;
    // saveSet(sessionId, exerciseId, setId, updSet);
  };

  const completeSet = (set: SetItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId, setId } = getIds(id);
    if (setId === undefined || setId === null) return;

    const find = completed.text;
    const currentValue = set?.[find] ? true : false;

    let updExercises = [...currentSession.exercises];
    let updExercise = updExercises[exerciseId];
    let updSet = {
      ...set,
      [find]: currentValue ? false : true,
      [`${find}When`]: currentValue ? null : new Date(),
    };
    updExercises[exerciseId].sets[setId] = updSet;

    // update overall exercise to completed as well
    updExercise = updateExerciseStartedCompleted(find, updExercise);
    updExercises[exerciseId] = updExercise;

    findNextSet(updExercises, updExercise, updExercise.sets[setId]);
    currentSession.exercises = updExercises;

    dispatch({
      type: EXERCISE_REDUCER_ACTIONS.COMPLETE_SET,
      payloadSession: currentSession,
      // payload: updExercises,
    });

    saveCurrentSession(currentSession);
    // const sessionId = state.currentSession?._id;
    // saveSet(sessionId, exerciseId, setId, updSet);
  };

  const linkSet = (set: SetItemType, id: string) => {
    if (!state.currentSession || !state.currentSession?.exercises) return;
    const currentSession: SessionItemType = { ...state.currentSession };

    const { exerciseId, setId } = getIds(id);

    if (setId !== undefined && setId !== null) {
      let updExercises: ExerciseItemType[] = [...currentSession.exercises];
      let updSet: SetItemType = updExercises[exerciseId].sets[setId];
      updSet.link = set?.link ? false : true;
      updExercises[exerciseId].sets[setId] = updSet;
      currentSession.exercises = updExercises;

      dispatch({
        type: EXERCISE_REDUCER_ACTIONS.LINK_SET,
        payloadSession: currentSession,
        // payload: updExercises,
      });

      saveCurrentSession(currentSession);
      // const sessionId = state.currentSession?._id;
      // saveSet(sessionId, exerciseId, setId, updSet);
    }
  };

  const totalSessions: number = state.sessions.length;
  const totalExercises: number = state.exercises.length;

  const isExerciseCompleted = (exercise: ExerciseItemType) => {
    if (!exercise?.sets?.length) return false;
    let setsNotDone = exercise.sets.filter(
      (set: SetItemType) => !set?.completed
    );
    return setsNotDone?.length ? false : true;
  };
  const exercisesCompleted: number = state.exercises.filter(
    (exercise: ExerciseItemType) => isExerciseCompleted(exercise)
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
    deletePressed: state.deletePressed,
    timerVisible: state.timerVisible,
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
  startSet: () => {},
  completeSet: () => {},
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
  exercises: [],
  exercisesAll: [],
  deletePressed: null,
  timerVisible: true,
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
