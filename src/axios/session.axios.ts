import axios from "axios";
import {
  ExerciseItemType,
  ExerciseNameType,
  SessionItemType,
  SessionListItemType,
  SetItemType,
} from "../context/types";
import { configJSON } from "../utilities/common";

export const getSessionsFromDb = async (
  filters: any,
  sort: object,
  start?: number
): Promise<SessionListItemType[] | null> => {
  return await axios
    .get(`/api/sessions`, {
      params: { filters: filters, sort: sort, start: start },
      // params: { filters: filters, sort: sort, start: start },
    })
    .then((res) => {
      if (res?.data) {
        return res.data as SessionListItemType[];
      } else {
        return null;
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
      return null;
    });
};

export const getSessionFromDb = async (
  sessionId: string
): Promise<SessionItemType | null> => {
  return await axios
    .get(`/api/sessions/session/${sessionId}`)
    .then((res) => {
      if (res?.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
      return null;
    });
};

export const saveSessionsToDb = async (
  sessions: Partial<SessionItemType>[]
): Promise<SessionListItemType[] | null> => {
  return await axios
    .put(`/api/sessions/many`, sessions, configJSON)
    .then((res) => {
      return res?.data ? res.data : null;
    })
    .catch((err) => {
      if (err) console.log(err);
      return null;
    });
};

export const saveSessionToDb = async (
  session: SessionItemType | Partial<SessionItemType>
): Promise<SessionItemType | null> => {
  return await axios
    .put(`/api/sessions/${session._id}`, session, configJSON)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err) console.log(err);
      return null;
    });
};

export const cloneSessionToDb = async (
  sessionId: string
): Promise<SessionItemType | null> => {
  return await axios
    .post(`/api/sessions/clone`, { sessionId }, configJSON)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err) console.log(err);
      return null;
    });
};

export const getAllExercisesFromDb = async () => {
  return await axios
    .get(`/api/sessions/exercises`)
    .then((res) => {
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

export const addExerciseNameToDb = async (
  exerciseName: Partial<ExerciseNameType>
): Promise<ExerciseNameType | null> => {
  delete exerciseName._id;

  return await axios
    .post(`/api/sessions/exercise/name`, exerciseName, configJSON)
    .then((res) => {
      if (res?.data && res?.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      if (err) console.log(err);
      return null;
    });
};

export const saveExerciseToDb = async (
  sessionId: string,
  exercise: ExerciseItemType
): Promise<SessionItemType | null> => {
  return await axios
    .put(
      `/api/sessions/exercise/${sessionId}/${exercise.id}`,
      exercise,
      configJSON
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err) console.log(err);
      return null;
    });
};

export const saveSetToDb = async (
  sessionId: string,
  exerciseId: number,
  setId: number,
  set: SetItemType
): Promise<SessionItemType | null> => {
  return await axios
    .put(
      `/api/sessions/set/${sessionId}/${exerciseId}/${setId}`,
      set,
      configJSON
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err) console.log(err);
      return null;
    });
};
