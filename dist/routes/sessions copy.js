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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middleware/auth"));
const utils_1 = require("../utils");
const Session_model_1 = __importDefault(require("../models/Session.model"));
const types_1 = require("../types");
const DBL = 0;
let dp = "routes.session";
router.get("/sessions", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".get.sessions: ";
    (0, utils_1.log)(1, DBL, lm + "Reading Sessions Start");
    (0, utils_1.log)(1, DBL, lm + "Reading data");
    yield Session_model_1.default.find({ user: req.user.id })
        .limit(10)
        .sort({ date: -1 })
        .then((sessions) => {
        // const definedSessions: SessionItemType[] = sessions.map(session => ({...session}))
        // definedSessions?.length ? res.json(definedSessions) : res.json(null);
        (sessions === null || sessions === void 0 ? void 0 : sessions.length) ? res.json(sessions) : res.json(null);
        (0, utils_1.log)(1, DBL, lm + "Reading Sessions Finish");
    })
        .catch((err) => {
        (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
        res.status(500).json({ msg: "Server Error" });
    });
}));
// @name    Get Session
// @route   GET api/sessions
// @desc    get specific session
// @access  Private
router.get("/session/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let lm = dp + ".get.session: ";
    (0, utils_1.log)(1, DBL, lm + "Reading Session Start");
    (0, utils_1.log)(1, DBL, lm + "Reading filters");
    let _id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    (0, utils_1.log)(1, DBL, lm + "Reading data");
    yield Session_model_1.default.find({ _id })
        .then((session) => {
        session ? res.json(session) : res.json(null);
        (0, utils_1.log)(1, DBL, lm + "Reading Session Finish");
    })
        .catch((err) => {
        (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
        res.status(500).json({ msg: "Server Error" });
    });
}));
// @route   PUT api/sessions/:id
// @desc    Update session based on id passed
// @access  Private
router.put("/session/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lm = dp + ".update: ";
    (0, utils_1.log)(1, DBL, lm + `Starting to update session`);
    const _id = req.params.id;
    let body = Object.assign({}, req.body);
    yield Session_model_1.default.find({ _id })
        .then((session) => __awaiter(void 0, void 0, void 0, function* () {
        if (!session)
            return res.status(400).json({ msg: "Session doesn't exist" });
        let updRecord = types_1.SessionItemInitialValues;
        Object.keys(updRecord).forEach((key) => {
            if ((body === null || body === void 0 ? void 0 : body[key]) !== undefined) {
                updRecord[key] = body === null || body === void 0 ? void 0 : body[key];
            }
            else {
                delete updRecord[key];
            }
        });
        console.log("updRecord:", updRecord);
        yield Session_model_1.default.findByIdAndUpdate(_id, { $set: updRecord })
            .then((result) => {
            //   console.log(result);
            res.json(updRecord);
        })
            .catch((err) => {
            (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
            res.status(500).json({ msg: "Error updating Session" });
        });
    }))
        .catch((err) => {
        (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
        res.status(500).json({ msg: "Server Error" });
    });
}));
// @route   PUT api/exercise/:sessionId/:exerciseId
// @desc    Update exercise based on id passed
// @access  Private
router.put("/exercise/:sessionId/:exerciseId", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("here");
    const lm = dp + ".update.exercise: ";
    (0, utils_1.log)(1, DBL, lm + `Starting to update exercise`);
    const sessionId = req.params.sessionId;
    const exerciseId = parseInt(req.params.exerciseId);
    let body = Object.assign({}, req.body);
    yield Session_model_1.default.find({ _id: sessionId })
        .then((session) => __awaiter(void 0, void 0, void 0, function* () {
        if (!session)
            return res.status(400).json({ msg: "Session doesn't exist" });
        let updRecord = types_1.ExerciseItemInitialValues;
        Object.keys(updRecord).forEach((key) => {
            if ((body === null || body === void 0 ? void 0 : body[key]) !== undefined) {
                updRecord[key] = body === null || body === void 0 ? void 0 : body[key];
            }
            else {
                delete updRecord[key];
            }
        });
        console.log(updRecord);
        return res.json(updRecord);
        let findId = `exercises.${exerciseId}`;
        yield Session_model_1.default.findByIdAndUpdate({ _id: sessionId }, { $set: { [findId]: updRecord } })
            .then((result) => {
            console.log("updRecord:", updRecord);
            console.log(findId);
            if (result) {
                console.log(result);
                console.log(result);
                console.log(result.exercises[exerciseId]);
                res.json(result.exercises[exerciseId]);
            }
            // res.json(result);
        })
            .catch((err) => {
            (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
            res.status(500).json({ msg: "Error updating Session" });
        });
    }))
        .catch((err) => {
        (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
        // res.status(500).json({ msg: "Server Error" });
    });
}));
// @route   PUT api/set/:sessionId/:exerciseId/:setId
// @desc    Update exercise based on id passed
// @access  Private
router.put("/set/:sessionId/:exerciseId/:setId", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lm = dp + ".update.exercise: ";
    (0, utils_1.log)(1, DBL, lm + `Starting to update exercise`);
    const sessionId = req.params.sessionId;
    const exerciseId = req.params.exerciseId;
    const setId = req.params.setId;
    let body = Object.assign({}, req.body);
    yield Session_model_1.default.find({ _id: sessionId })
        .then((session) => __awaiter(void 0, void 0, void 0, function* () {
        if (!session)
            return res.status(400).json({ msg: "Session doesn't exist" });
        let updRecord = types_1.SetItemInitialValues;
        Object.keys(updRecord).forEach((key) => {
            if ((body === null || body === void 0 ? void 0 : body[key]) !== undefined) {
                updRecord[key] = body === null || body === void 0 ? void 0 : body[key];
            }
            else {
                delete updRecord[key];
            }
        });
        console.log("updRecord:", updRecord);
        let findId = `exercises.${exerciseId}.sets.${setId}`;
        yield Session_model_1.default.findByIdAndUpdate({ _id: sessionId }, { $set: { [findId]: updRecord } })
            .then((result) => {
            console.log(result);
            res.json(result);
        })
            .catch((err) => {
            (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
            res.status(500).json({ msg: "Error updating Session" });
        });
    }))
        .catch((err) => {
        (0, utils_1.log)(1, DBL, lm + `error: ${err.message}}`);
        res.status(500).json({ msg: "Server Error" });
    });
}));
//   try {
//     const userId = "620f7a3b7c20b90851a1283c";
//     // add exercise name to the db
//     let body = { ...req.body };
//     if (body?.exercises?.length) {
//       let exercises = req.body.exercises;
//       for (let i = 0; i < exercises.length; i++) {
//         if (exercises[i].name._id === "new") {
//           log(1, DBL, lm + "Finding new exercise");
//           let exName = exercises?.[i]?.name?.name ?? "New Exercise";
//           log(1, DBL, lm + "Finding existing exercise with name: " + exName);
//           let exercisesNew = await Exercise.getExercisesByName(exName);
//           if (!exercisesNew || !exercisesNew?.length) {
//             log(1, DBL, lm + "Cannot find, creating new: " + exName);
//             exercises[i].name = new Exercise({ name: exName });
//           } else {
//             let exCount = exercisesNew?.length ?? 0;
//             log(1, DBL, lm + "Found " + exCount + " exercises");
//             log(1, DBL, lm + "Found exercise:", exercisesNew[0]);
//             exercises[i].name = exercisesNew[0];
//           }
//         }
//       }
//       body.exercises = exercises;
//     }
//     log(1, DBL, lm + `Creating session record`);
//     let sessionRecord = getSessionRecord(body, userId, "update");
//     log(1, DBL, lm + `Session record:-`, sessionRecord);
//     log(1, DBL, lm + `Find the session record`);
//     let session = await Session.findById(req.params.id);
//     if (!session) {
//       log(1, DBL, lm + `Record doesn't exist`);
//       return res.status(404).json({ msg: "Session does not exist" });
//     }
//     if (session.user.toString() !== userId) {
//       log(1, DBL, lm + `User not authorised`);
//       return res.status(401).json({ msg: "Not Authorised" });
//     }
//     log(1, DBL, lm + `Update and retrieve the updated record`);
//     session = await Session.findByIdAndUpdate(
//       ObjectId(req.params.id),
//       { $set: sessionRecord },
//       { new: true }
//     );
//     log(1, DBL, lm + `Return updated record`);
//     res.json(session);
//   } catch (err) {
//     logError({
//       ...err,
//       sessionId: req.params.id,
//       body: JSON.stringify(req.body),
//     });
//     log(1, DBL, lm + `error: ${err.message}}`);
//     res.status(500).json({ msg: "Server Error" });
//   }
exports.default = router;
