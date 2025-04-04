"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsRouter = void 0;
// External Dependencies
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const validation_1 = __importDefault(require("../middleware/validation"));
const auth_1 = __importDefault(require("../middleware/auth"));
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const Session_interface_1 = require("../interfaces/Session.interface");
const Session_model_1 = __importDefault(require("../models/Session.model"));
const Exercise_model_1 = __importDefault(require("../models/Exercise.model"));
// import returnValidate from "../middleware/returnValidate";
// Global Config
exports.sessionsRouter = express_1.default.Router();
exports.sessionsRouter.use(express_1.default.json());
const DBL = 1;
const dp = "routes.session";
// @route   GET api/sessions/
// @desc    Get all sessions
// @access  Private
exports.sessionsRouter.get("/", auth_1.default, validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { filters, sort, start } = req.params;
        let s = 0;
        let limit = s + 10;
        // if (!sort) sort = { date: -1 };
        const sessions = (yield Session_model_1.default.find({})
            .sort({
            date: -1,
        })
            .skip(s)
            .limit(limit)
            .select({
            exercises: 0,
            created: 0,
            updated: 0,
        }));
        res.json(sessions);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}));
// @route   GET api/sessions/session/:id
// @desc    Get a single session
// @access  Private
exports.sessionsRouter.get("/session/:id", auth_1.default, [(0, express_validator_1.param)("id", "Please enter a sessionId").exists()], validation_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".get: ";
    const { id } = req.params;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const session = (yield Session_model_1.default.findOne(query));
        if (session) {
            res.json(session);
        }
        else {
            res.status(404).send(`Unable to find matching document with id: ${id}`);
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(404).send(`Unable to find matching document with id: ${id}`);
    }
}));
// @route   GET api/sessions/exercises
// @desc    Get all exercises
// @access  Private
exports.sessionsRouter.get("/exercises", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let lm = dp + ".exercises.get: ";
        (0, utils_1.log)(1, DBL, lm + "Start");
        const exercises = (yield Exercise_model_1.default.find({}).sort({
            name: 1,
        }));
        (0, utils_1.log)(1, DBL, lm + ((_a = exercises === null || exercises === void 0 ? void 0 : exercises.length) !== null && _a !== void 0 ? _a : 0) + " exercises found");
        res.json(exercises);
        (0, utils_1.log)(1, DBL, lm + "Finish");
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}));
// @route   POST api/sessions/exercise/name
// @desc    Create new exercise name
// @access  Private
exports.sessionsRouter.post("/exercise/name", auth_1.default, [
    (0, express_validator_1.body)("name", "Missing name property").exists(),
    // body("_id", "Missing _id property").exists(),
], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let lm = dp + ".exercise.name.post: ";
        (0, utils_1.log)(1, DBL, lm + "Start");
        const newExerciseName = Object.assign(Object.assign({}, Session_interface_1.ExerciseNameInitialValues), { name: req.body.name });
        const exercise = yield Exercise_model_1.default.create(newExerciseName);
        if (exercise) {
            // const exercise: ExerciseNameType = result
            exercise.save();
            (0, utils_1.log)(1, DBL, lm + `Created new exercise with id ${exercise._id}`);
            res.json(exercise);
        }
        else {
            res.status(400).send("Record create failed.");
        }
        (0, utils_1.log)(1, DBL, lm + "Finish");
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}));
// @route   POST api/sessions
// @desc    Create a new session
// @access  Private
exports.sessionsRouter.post("/", auth_1.default, [(0, express_validator_1.body)("name", "Please enter a name").exists()], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSession = req.body;
        const session = (yield Session_model_1.default.insertOne(newSession));
        session
            ? res.json(session)
            : res.status(500).send("Failed to create a new session.");
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
// @route   POST api/sessions/clone
// @desc    Create an existing session
// @access  Private
exports.sessionsRouter.post("/clone", auth_1.default, [(0, express_validator_1.body)("sessionId", "Please enter a sessionId").exists()], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.body.sessionId;
        let sessionToClone = yield Session_model_1.default.findById(sessionId);
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
            var _a;
            let newEx = Object.assign(Object.assign({}, exDefaults), { name: exerciseToClone.name, object: exerciseToClone.object, type: exerciseToClone.type, supersetNo: (_a = exerciseToClone.supersetNo) !== null && _a !== void 0 ? _a : "", id: idx, order: idx, sets: exerciseToClone.sets.map((setToClone, idx) => {
                    let newSet = Object.assign(Object.assign({}, setDefaults), { reps: setToClone.reps, weight: setToClone.weight, unit: setToClone.unit, order: idx, id: idx, no: idx + 1 });
                    return newSet;
                }) });
            return newEx;
        });
        const session = yield Session_model_1.default.create(Object.assign(Object.assign({}, newSession), { exercises: newExercises }));
        //  await Session.save();
        session
            ? res.json(session)
            : res.status(500).send("Failed to create a new session.");
        // if (sessionToClone) {
        //   Object.entries(sessionToClone).forEach(([key, value]) => {
        //     console.log(key, ":", value);
        //   });
        //   //   let newSession = { ...sessionToClone };
        //   //   newSession.name = "Testing";
        //   //   delete newSession._id;
        //   //   newSession.exercises = [];
        //   //   console.log("-----------------");
        //   //   console.log(newSession);
        //   //   let updatedSession = await Exercise.create(newSession);
        //   //   console.log(
        //   //     "((((((((((((((((((((((-----------------))))))))))))))))))))))"
        //   //   );
        //   //   console.log(updatedSession);
        //   // console.log(updatedSession.exercises[0]);
        // }
        // let exDefaults = {
        //   started: false,
        //   startedWhen: null,
        //   completed: false,
        //   completedWhen: null,
        //   rating: 0,
        //   visible: true,
        //   comments: "",
        // };
        // let setDefaults = {
        //   startedWhen: null,
        //   started: false,
        //   completed: false,
        //   completedWhen: null,
        // };
        // // let newSession: any = {
        // //   name: sessionToClone.name,
        // //   user: sessionToClone.user,
        // //   date: new Date(),
        // //   created: new Date(),
        // //   updated: new Date(),
        // //   // exercises: [],
        // // };
        // // console.log(newSession);
        // // let exercisesToClone: any = sessionToClone.exercises;
        // // let newExercises: any = exercisesToClone.map(
        // //   (exerciseToClone: any, idx: number) => {
        // //     let newEx = {
        // //       ...exerciseToClone,
        // //       ...exDefaults,
        // //       id: idx,
        // //       order: idx,
        // //     };
        // //     console.log(newEx);
        // //     // if (newEx.sets.length) {
        // //     //   newEx.sets = exerciseToClone.sets.map((set: any, idx: number) => {
        // //     //     let newSet = {
        // //     //       ...set,
        // //     //       ...setDefaults,
        // //     //       order: idx,
        // //     //       id: idx,
        // //     //       no: idx + 1,
        // //     //     };
        // //     //     delete newSet._id;
        // //     //     return newSet;
        // //     //   });
        // //     // }
        // //     // delete newEx._id;
        // //     // return newEx;
        // //     return exerciseToClone;
        // //   }
        // // );
        // // // console.log(newExercises);
        // // newSession.exercises = newExercises;
        // // const session = (await Session.insertOne(newSession)) as SessionItemType;
        // let session = {};
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
// // @route   POST api/sessions/clone
// // @desc    Create an existing session
// // @access  Private
// sessionsRouter.post(
//   "/clone",
//   auth,
//   // [body("sessionId", "Please enter a sessionId").exists()],
//   validation,
//   async (req: Request, res: Response) => {
//     try {
//       const sessionData: Partial<SessionItemType> = req.body;
//       const session = await Session.create(sessionData);
//       session
//         ? res.json(session)
//         : res.status(500).send("Failed to create a new session.");
//       // if (sessionToClone) {
//       //   Object.entries(sessionToClone).forEach(([key, value]) => {
//       //     console.log(key, ":", value);
//       //   });
//       //   //   let newSession = { ...sessionToClone };
//       //   //   newSession.name = "Testing";
//       //   //   delete newSession._id;
//       //   //   newSession.exercises = [];
//       //   //   console.log("-----------------");
//       //   //   console.log(newSession);
//       //   //   let updatedSession = await Exercise.create(newSession);
//       //   //   console.log(
//       //   //     "((((((((((((((((((((((-----------------))))))))))))))))))))))"
//       //   //   );
//       //   //   console.log(updatedSession);
//       //   // console.log(updatedSession.exercises[0]);
//       // }
//       // let exDefaults = {
//       //   started: false,
//       //   startedWhen: null,
//       //   completed: false,
//       //   completedWhen: null,
//       //   rating: 0,
//       //   visible: true,
//       //   comments: "",
//       // };
//       // let setDefaults = {
//       //   startedWhen: null,
//       //   started: false,
//       //   completed: false,
//       //   completedWhen: null,
//       // };
//       // // let newSession: any = {
//       // //   name: sessionToClone.name,
//       // //   user: sessionToClone.user,
//       // //   date: new Date(),
//       // //   created: new Date(),
//       // //   updated: new Date(),
//       // //   // exercises: [],
//       // // };
//       // // console.log(newSession);
//       // // let exercisesToClone: any = sessionToClone.exercises;
//       // // let newExercises: any = exercisesToClone.map(
//       // //   (exerciseToClone: any, idx: number) => {
//       // //     let newEx = {
//       // //       ...exerciseToClone,
//       // //       ...exDefaults,
//       // //       id: idx,
//       // //       order: idx,
//       // //     };
//       // //     console.log(newEx);
//       // //     // if (newEx.sets.length) {
//       // //     //   newEx.sets = exerciseToClone.sets.map((set: any, idx: number) => {
//       // //     //     let newSet = {
//       // //     //       ...set,
//       // //     //       ...setDefaults,
//       // //     //       order: idx,
//       // //     //       id: idx,
//       // //     //       no: idx + 1,
//       // //     //     };
//       // //     //     delete newSet._id;
//       // //     //     return newSet;
//       // //     //   });
//       // //     // }
//       // //     // delete newEx._id;
//       // //     // return newEx;
//       // //     return exerciseToClone;
//       // //   }
//       // // );
//       // // // console.log(newExercises);
//       // // newSession.exercises = newExercises;
//       // // const session = (await Session.insertOne(newSession)) as SessionItemType;
//       // let session = {};
//     } catch (error: any) {
//       console.error(error);
//       res.status(400).send(error.message);
//     }
//   }
// );
const updateSession = (_id, updSession) => __awaiter(void 0, void 0, void 0, function* () {
    const lm = dp + ".updateSession: ";
    if (!updSession || !(updSession === null || updSession === void 0 ? void 0 : updSession._id)) {
        (0, utils_1.log)(1, DBL, lm + "Session not found");
        return updSession;
    }
    let result = yield Session_model_1.default.findByIdAndUpdate(new mongodb_1.ObjectId(_id), updSession)
        .then((result) => {
        if (result) {
            (0, utils_1.log)(1, DBL, lm + "Finish");
            return result;
        }
        else {
            (0, utils_1.log)(1, DBL, `Session with id: ${_id} not updated`);
            return updSession;
        }
    })
        .catch((error) => {
        (0, utils_1.log)(1, DBL, lm + "Error: ", error.message);
        return updSession;
    });
    (0, utils_1.log)(1, DBL, lm + "Finish");
    return result;
});
const dataChanged = (data1, data2, fields) => {
    if (!data1 || !data2 || !fields)
        return false;
    let changed = false;
    fields.forEach((field) => {
        if (!changed) {
            const newKey = !(data1 === null || data1 === void 0 ? void 0 : data1[field]);
            const hasData = !!(data2 === null || data2 === void 0 ? void 0 : data2[field]);
            const hasChanged = hasData && data1[field] !== data2[field] ? true : false;
            changed = newKey || hasChanged;
        }
    });
    return changed;
};
const updateIfChanged = (updSession) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(updSession === null || updSession === void 0 ? void 0 : updSession._id))
        return updSession;
    const _id = updSession._id;
    const session = yield Session_model_1.default.findById(_id);
    if (!session)
        return updSession;
    // const fields: string[] = ["name", "date"];
    // const changed: boolean = dataChanged(session, updSession, fields);
    // if (!changed) return session;
    const updatedRecord = yield updateSession(_id, updSession);
    return updatedRecord ? updatedRecord : session;
});
// @route   POST api/sessions/many
// @desc    Update many sessions
// @access  Private
exports.sessionsRouter.post("/many", auth_1.default, [(0, express_validator_1.param)("sessions", "Missing sessions from post").exists().isArray()], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".updateManySessions: ";
    (0, utils_1.log)(1, DBL, lm + "Start");
    const sessionsToUpdate = req.body;
    const sessionsToReturn = yield Promise.all(sessionsToUpdate.map((sessionUpd) => __awaiter(void 0, void 0, void 0, function* () {
        let savedSession = yield updateIfChanged(sessionUpd);
        return savedSession !== null && savedSession !== void 0 ? savedSession : sessionUpd;
    })));
    // const sessionsToUpdate: SessionUpdateType[] = req.body;
    // const sessionsToReturn: SessionUpdateType[] =
    //   await Promise.all(
    //     sessionsToUpdate.map(async ({updSession}: SessionUpdateType) => {
    //       let savedSession = await updateIfChanged(updSession);
    //       return savedSession ?? updSession;
    //     })
    //   );
    // const sessionsToUpdate: Partial<SessionItemType>[] = req.body;
    // const sessionsToReturn: SessionItemType[] | Partial<SessionItemType>[] =
    //   await Promise.all(
    //     sessionsToUpdate.map(async (sessionUpd: Partial<SessionItemType>) => {
    //       let savedSession = await updateIfChanged(sessionUpd);
    //       return savedSession ?? sessionUpd;
    //     })
    //   );
    if (sessionsToReturn && Array.isArray(sessionsToReturn)) {
        (0, utils_1.log)(1, DBL, lm + `Updated ${sessionsToReturn.length} sessions`);
        (0, utils_1.log)(1, DBL, lm + "Finished, returning data.");
        res.json(sessionsToReturn);
    }
    else {
        (0, utils_1.log)(1, DBL, lm + "Finished, no data updated.");
        res.status(403).send("Finished, no data updated.");
    }
}));
// @route   PUT api/sessions/:id
// @desc    Update a session
// @access  Private
exports.sessionsRouter.put("/:id", auth_1.default, [(0, express_validator_1.param)("id", "Please enter a id").exists()], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".updateSesh: ";
    (0, utils_1.log)(1, DBL, lm + "Start");
    const { id } = req.params;
    const query = { _id: new mongodb_1.ObjectId(id) };
    const updSession = req.body;
    console.log(updSession);
    const savedSession = yield updateIfChanged(updSession);
    const sessionToReturn = savedSession !== null && savedSession !== void 0 ? savedSession : updSession;
    if (sessionToReturn && !Array.isArray(sessionToReturn)) {
        (0, utils_1.log)(1, DBL, lm + `Updated 1 sessions`);
        (0, utils_1.log)(1, DBL, lm + "Finished, returning data.");
        res.json(sessionToReturn);
    }
    else {
        (0, utils_1.log)(1, DBL, lm + "Finished, no data updated.");
        res.status(403).send("Finished, no data updated.");
    }
    // await Session.findOne(query)
    //   .then(async (session: SessionItemType | null) => {
    //     if (!session) {
    //       log(1, DBL, lm + "Session not found");
    //       res.status(304).send(`Session with id: ${id} not found`);
    //       return;
    //     }
    //     const updSession: SessionItemType = req.body as SessionItemType;
    //     Object.entries(updSession).forEach(([key, value]) => {
    //       if (session) {
    //         session[key] = value;
    //       }
    //     });
    //     if (session !== null) {
    //       session.updated = new Date();
    //       // session.save()
    //       session = await Session.findByIdAndUpdate(new ObjectId(id), session);
    //       res.json(session);
    //     } else {
    //       res.status(304).send(`Session with id: ${id} not updated`);
    //     }
    //     log(1, DBL, lm + "Finish");
    //   })
    //   .catch((error) => {
    //     log(1, DBL, lm + "Error: ", error.message);
    //     res.status(400).send(error.message);
    //   });
}));
// @route   PUT api/sessions/exercise/:id/:exerciseId
// @desc    Update one exercise
// @access  Private
exports.sessionsRouter.put("/exercise/:id/:exerciseId", auth_1.default, [(0, express_validator_1.param)("id", "Please include Session Id").exists()], [(0, express_validator_1.param)("exerciseId", "Please include Exercise Id").exists()], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".updateExercise: ";
    (0, utils_1.log)(1, DBL, lm + "Start");
    const sessionId = req.params.id;
    const exerciseId = parseInt(req.params.exerciseId);
    try {
        const updatedExercise = req.body;
        const query = { _id: new mongodb_1.ObjectId(sessionId) };
        let session = yield Session_model_1.default.findOne(query);
        if (!session)
            throw new Error("Missing result");
        if (!session.exercises[exerciseId]) {
            (0, utils_1.log)(1, DBL, lm + "Exercise not found");
        }
        // console.log(updatedExercise);
        Object.entries(updatedExercise).forEach(([key, value]) => {
            (0, utils_1.log)(1, DBL, lm + "key: " + value);
            session.exercises[exerciseId][key] = value;
        });
        session.save();
        session
            ? res.json(session)
            : res.status(304).send(`Exercise with id: ${sessionId} not updated`);
        (0, utils_1.log)(1, DBL, lm + "Finish");
    }
    catch (error) {
        (0, utils_1.log)(1, DBL, lm + "Error: ", error.message);
        res.status(400).send(error.message);
    }
}));
// @route   PUT api/sessions/set/:id/:exerciseId/:setId
// @desc    Update one set
// @access  Private
exports.sessionsRouter.put("/set/:id/:exerciseId/:setId", auth_1.default, [(0, express_validator_1.param)("id", "Please include Session Id").exists()], [(0, express_validator_1.param)("exerciseId", "Please include Exercise Id").exists()], [(0, express_validator_1.param)("setId", "Please include Set Id").exists()], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".updateSet: ";
    (0, utils_1.log)(1, DBL, lm + "Start");
    const sessionId = req.params.id;
    const exerciseId = parseInt(req.params.exerciseId);
    const setId = parseInt(req.params.setId);
    try {
        const updatedSet = req.body;
        const query = { _id: new mongodb_1.ObjectId(sessionId) };
        let session = yield Session_model_1.default.findOne(query);
        if (!session)
            throw new Error("Missing result");
        Object.entries(updatedSet).forEach(([key, value]) => {
            session.exercises[exerciseId].sets[setId][key] = value;
        });
        session.save();
        (0, utils_1.log)(1, DBL, lm + "Finish");
        session
            ? res.json(session)
            : res.status(304).send(`Set with id: ${sessionId} not updated`);
        (0, utils_1.log)(1, DBL, lm + "Finish");
    }
    catch (error) {
        (0, utils_1.log)(1, DBL, lm + "Error: ", error.message);
        res.status(400).send(error.message);
    }
}));
// @route   DELETE api/sessions/:id
// @desc    Delete one session
// @access  Private
exports.sessionsRouter.delete("/:id", auth_1.default, [(0, express_validator_1.param)("id", "Please include a Session Id").exists()], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield Session_model_1.default.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
