// External Dependencies
import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";

import validation from "../middleware/validation";
import auth from "../middleware/auth";

import { body, param } from "express-validator";
import { log } from "../utils";
import {
  ExerciseItemType,
  ExerciseNameInitialValues,
  ExerciseNameType,
  SessionItemType,
  SessionListItemType,
  SetItemType,
} from "../interfaces/Session.interface";

import Session from "../models/Session.model";
import Exercise from "../models/Exercise.model";

// Global Config
export const sessionsRouter = express.Router();
sessionsRouter.use(express.json());

const DBL = 1;
const dp = "routes.session";

// @route   GET api/sessions/
// @desc    Get all sessions
// @access  Private
sessionsRouter.get(
  "/",
  auth,
  validation,
  async (req: Request, res: Response) => {
    try {
      let { filters, sort, start } = req.params;
      let s = 0;
      let limit = s + 10;
      // if (!sort) sort = { date: -1 };

      const sessions = (await Session.find({})
        .sort({
          date: -1,
        })
        .skip(s)
        .limit(limit)
        .select({
          exercises: 0,
          created: 0,
          updated: 0,
        })) as SessionListItemType[];

      res.json(sessions);
    } catch (error: any) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
);

// @route   GET api/sessions/session/:id
// @desc    Get a single session
// @access  Private
sessionsRouter.get(
  "/session/:id",
  auth,
  [param("id", "Please enter a sessionId").exists()],
  validation,
  async (req: Request, res: Response, next: NextFunction) => {
    let lm = dp + ".get: ";

    const { id } = req.params;
    try {
      const query = { _id: new ObjectId(id) };
      const session = (await Session.findOne(query)) as SessionItemType;

      if (session) {
        res.json(session);
      } else {
        res.status(404).send(`Unable to find matching document with id: ${id}`);
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(404).send(`Unable to find matching document with id: ${id}`);
    }
  }
);

// @route   GET api/sessions/exercises
// @desc    Get all exercises
// @access  Private
sessionsRouter.get("/exercises", auth, async (req: Request, res: Response) => {
  try {
    let lm = dp + ".exercises.get: ";
    log(1, DBL, lm + "Start");
    const exercises = (await Exercise.find({}).sort({
      name: 1,
    })) as ExerciseNameType[];
    log(1, DBL, lm + (exercises?.length ?? 0) + " exercises found");

    res.json(exercises);
    log(1, DBL, lm + "Finish");
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// @route   POST api/sessions/exercise/name
// @desc    Create new exercise name
// @access  Private
sessionsRouter.post(
  "/exercise/name",
  auth,
  [
    body("name", "Missing name property").exists(),
    // body("_id", "Missing _id property").exists(),
  ],
  validation,
  async (req: Request, res: Response) => {
    try {
      let lm = dp + ".exercise.name.post: ";
      log(1, DBL, lm + "Start");

      const newExerciseName: Partial<ExerciseNameType> = {
        ...ExerciseNameInitialValues,
        name: req.body.name,
      };
      const exercise: ExerciseNameType = await Exercise.create(newExerciseName);
      if (exercise) {
        // const exercise: ExerciseNameType = result
        exercise.save();

        log(1, DBL, lm + `Created new exercise with id ${exercise._id}`);
        res.json(exercise);
      } else {
        res.status(400).send("Record create failed.");
      }
      log(1, DBL, lm + "Finish");
    } catch (error: any) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
);

// @route   POST api/sessions
// @desc    Create a new session
// @access  Private
sessionsRouter.post(
  "/",
  auth,
  [body("name", "Please enter a name").exists()],
  validation,
  async (req: Request, res: Response) => {
    try {
      const newSession = req.body as SessionItemType;
      const session = (await Session.insertOne(newSession)) as SessionItemType;
      session
        ? res.json(session)
        : res.status(500).send("Failed to create a new session.");
    } catch (error: any) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
);

// @route   POST api/sessions/clone
// @desc    Create an existing session
// @access  Private
sessionsRouter.post(
  "/clone",
  auth,
  [body("sessionId", "Please enter a sessionId").exists()],
  validation,
  async (req: Request, res: Response) => {
    try {
      const sessionId = req.body.sessionId;
      let sessionToClone = await Session.findById(sessionId);

      if (!sessionToClone) {
        res.status(403).send("Session not found.");
        return;
      }

      let exDefaults = {
        started: false,
        startedWhen: null,
        completed: false,
        completedWhen: null,
        rating: 0,
        visible: true,
        comments: "",
      };

      let setDefaults = {
        startedWhen: null,
        started: false,
        completed: false,
        completedWhen: null,
      };

      let newSession = {
        name: sessionToClone.name,
        user: sessionToClone.user,
        exercises: [],
        date: new Date(),
        created: new Date(),
        updated: new Date(),
      };

      let exercisesToClone = sessionToClone.exercises;
      let newExercises = exercisesToClone.map((exerciseToClone, idx) => {
        let newEx = {
          ...exDefaults,
          name: exerciseToClone.name,
          object: exerciseToClone.object,
          type: exerciseToClone.type,
          supersetNo: exerciseToClone.supersetNo ?? "",
          id: idx,
          order: idx,
          sets: exerciseToClone.sets.map((setToClone, idx) => {
            let newSet = {
              ...setDefaults,
              reps: setToClone.reps,
              weight: setToClone.weight,
              unit: setToClone.unit,
              order: idx,
              id: idx,
              no: idx + 1,
            };
            return newSet;
          }),
        };
        return newEx;
      });

      const session = await Session.create({
        ...newSession,
        exercises: newExercises,
      });

      session
        ? res.json(session)
        : res.status(500).send("Failed to create a new session.");
    } catch (error: any) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
);

const updateSession = async (
  _id: string,
  updSession: SessionItemType | SessionListItemType
): Promise<SessionItemType | SessionListItemType> => {
  const lm = dp + ".updateSession: ";

  if (!updSession || !updSession?._id) {
    log(1, DBL, lm + "Session not found");
    return updSession;
  }

  let result = await Session.findByIdAndUpdate(new ObjectId(_id), updSession)
    .then((result: SessionItemType | null) => {
      if (result) {
        log(1, DBL, lm + "Finish");
        return result;
      } else {
        log(1, DBL, `Session with id: ${_id} not updated`);
        return updSession;
      }
    })
    .catch((error) => {
      log(1, DBL, lm + "Error: ", error.message);
      return updSession;
    });

  log(1, DBL, lm + "Finish");
  return result;
};

const dataChanged = (data1: any, data2: any, fields: string[]): boolean => {
  if (!data1 || !data2 || !fields) return false;

  let changed = false;
  fields.forEach((field: string) => {
    if (!changed) {
      const newKey = !data1?.[field];
      const hasData = !!data2?.[field];
      const hasChanged =
        hasData && data1[field] !== data2[field] ? true : false;
      changed = newKey || hasChanged;
    }
  });
  return changed;
};

const updateIfChanged = async (
  updSession: SessionListItemType
): Promise<SessionItemType | SessionListItemType> => {
  if (!updSession?._id) return updSession;
  const _id: string = updSession._id;

  const session: SessionItemType | null = await Session.findById(_id);
  if (!session) return updSession;

  const updatedRecord:
    | SessionListItemType
    | SessionItemType
    | null
    | undefined = await updateSession(_id, updSession);
  return updatedRecord ? updatedRecord : session;
};

// @route   POST api/sessions/many
// @desc    Update many sessions
// @access  Private
sessionsRouter.post(
  "/many",
  auth,
  [param("sessions", "Missing sessions from post").exists().isArray()],
  validation,
  async (req: Request, res: Response) => {
    let lm = dp + ".updateManySessions: ";
    log(1, DBL, lm + "Start");

    const sessionsToUpdate: SessionListItemType[] = req.body;
    const sessionsToReturn: SessionListItemType[] = await Promise.all(
      sessionsToUpdate.map(async (sessionUpd: SessionListItemType) => {
        let savedSession = await updateIfChanged(sessionUpd);
        return savedSession ?? sessionUpd;
      })
    );

    if (sessionsToReturn && Array.isArray(sessionsToReturn)) {
      log(1, DBL, lm + `Updated ${sessionsToReturn.length} sessions`);
      log(1, DBL, lm + "Finished, returning data.");
      res.json(sessionsToReturn);
    } else {
      log(1, DBL, lm + "Finished, no data updated.");
      res.status(403).send("Finished, no data updated.");
    }
  }
);

// @route   PUT api/sessions/:id
// @desc    Update a session
// @access  Private
sessionsRouter.put(
  "/:id",
  auth,
  [param("id", "Please enter a id").exists()],
  validation,
  async (req: Request, res: Response) => {
    let lm = dp + ".updateSesh: ";
    log(1, DBL, lm + "Start");

    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const updSession: SessionItemType = req.body as SessionItemType;
    // console.log(updSession);

    const savedSession: SessionItemType | SessionListItemType =
      await updateIfChanged(updSession);

    const sessionToReturn: SessionItemType | SessionListItemType =
      savedSession ?? updSession;

    if (sessionToReturn && !Array.isArray(sessionToReturn)) {
      log(1, DBL, lm + `Updated 1 sessions`);
      log(1, DBL, lm + "Finished, returning data.");
      res.json(sessionToReturn);
    } else {
      log(1, DBL, lm + "Finished, no data updated.");
      res.status(403).send("Finished, no data updated.");
    }
  }
);

// @route   PUT api/sessions/exercise/:id/:exerciseId
// @desc    Update one exercise
// @access  Private
sessionsRouter.put(
  "/exercise/:id/:exerciseId",
  auth,
  [param("id", "Please include Session Id").exists()],
  [param("exerciseId", "Please include Exercise Id").exists()],
  validation,
  async (req: Request, res: Response) => {
    let lm = dp + ".updateExercise: ";
    log(1, DBL, lm + "Start");

    const sessionId: string = req.params.id;
    const exerciseId: number = parseInt(req.params.exerciseId);

    try {
      const updatedExercise: Partial<ExerciseItemType> =
        req.body as Partial<ExerciseItemType>;
      const query = { _id: new ObjectId(sessionId) };

      let session = await Session.findOne(query);
      if (!session) throw new Error("Missing result");

      if (!session.exercises[exerciseId]) {
        log(1, DBL, lm + "Exercise not found");
      }

      // console.log(updatedExercise);
      Object.entries(updatedExercise).forEach(([key, value]) => {
        log(1, DBL, lm + "key: " + value);
        session.exercises[exerciseId][key] = value;
      });
      session.save();

      session
        ? res.json(session)
        : res.status(304).send(`Exercise with id: ${sessionId} not updated`);
      log(1, DBL, lm + "Finish");
    } catch (error: any) {
      log(1, DBL, lm + "Error: ", error.message);
      res.status(400).send(error.message);
    }
  }
);

// @route   PUT api/sessions/set/:id/:exerciseId/:setId
// @desc    Update one set
// @access  Private
sessionsRouter.put(
  "/set/:id/:exerciseId/:setId",
  auth,
  [param("id", "Please include Session Id").exists()],
  [param("exerciseId", "Please include Exercise Id").exists()],
  [param("setId", "Please include Set Id").exists()],
  validation,
  async (req: Request, res: Response) => {
    let lm = dp + ".updateSet: ";

    log(1, DBL, lm + "Start");
    const sessionId: string = req.params.id;
    const exerciseId: number = parseInt(req.params.exerciseId);
    const setId: number = parseInt(req.params.setId);

    try {
      const updatedSet: Partial<SetItemType> = req.body as Partial<SetItemType>;
      const query = { _id: new ObjectId(sessionId) };

      let session = await Session.findOne(query);
      if (!session) throw new Error("Missing result");

      Object.entries(updatedSet).forEach(([key, value]) => {
        session.exercises[exerciseId].sets[setId][key] = value;
      });
      session.save();

      log(1, DBL, lm + "Finish");
      session
        ? res.json(session)
        : res.status(304).send(`Set with id: ${sessionId} not updated`);

      log(1, DBL, lm + "Finish");
    } catch (error: any) {
      log(1, DBL, lm + "Error: ", error.message);
      res.status(400).send(error.message);
    }
  }
);

// @route   DELETE api/sessions/:id
// @desc    Delete one session
// @access  Private
sessionsRouter.delete(
  "/:id",
  auth,
  [param("id", "Please include a Session Id").exists()],
  validation,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const query = { _id: new ObjectId(id) };
      const result = await Session.deleteOne(query);

      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed game with id ${id}`);
      } else if (!result) {
        res.status(400).send(`Failed to remove game with id ${id}`);
      } else if (!result.deletedCount) {
        res.status(404).send(`Game with id ${id} does not exist`);
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);
