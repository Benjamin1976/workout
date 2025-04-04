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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
const database_service_1 = require("../services/database.service");
// const { users } = collections;
// import User from "../models/User";
const auth_1 = __importDefault(require("../middleware/auth"));
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
const DBL = 0;
const dp = "routes.auth";
exports.authRouter = express_1.default.Router();
// @route   GET api/auth
// @desc    Get logged in user
// // @access  Private
exports.authRouter.get("/:from", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check token through "auth" and if successful,
        //    get user and return all except password
        let reqId = req.user.id;
        const userId = new mongoose_1.default.Types.ObjectId(reqId);
        if (!(database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users)) {
            return res.status(500).json({ msg: "Missing users collection " });
        }
        console.log(userId);
        // const user = await collections.users.findOne({ _id: userId });
        const user = yield database_service_1.collections.users.findOne({ _id: userId }, { projection: { _id: 1, name: 1, isValidated: 1, email: 1 } });
        // Return user
        user ? res.json(user) : res.status(400).json({ msg: "User not loaded" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
exports.authRouter.post("/", [
    (0, express_validator_1.check)("email", "Please enter a valid email").isEmail(),
    (0, express_validator_1.check)("password", "Password is required").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".login: ";
    (0, utils_1.log)(0, DBL, lm + "Started");
    if (!(database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users))
        throw new Error("Missing collection.users");
    (0, utils_1.log)(0, DBL, lm + "Checking post validation");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        (0, utils_1.log)(0, DBL, lm + "Post error");
        return res.status(400).json({ errors: errors.array() });
    }
    (0, utils_1.log)(0, DBL, lm + "Validation successful");
    const { email, password } = req.body;
    try {
        if (!(database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users)) {
            return res.status(500).json({ msg: "Missing users collection " });
        }
        (0, utils_1.log)(0, DBL, lm + "Checking for user");
        let data = yield database_service_1.collections.users.findOne({ email });
        if (!data) {
            (0, utils_1.log)(0, DBL, lm + "Finish. User doesn't exist");
            return res.status(401).json({ msg: "Invalid Credentials" });
        }
        const user = data;
        (0, utils_1.log)(0, DBL, lm + "User exists");
        (0, utils_1.log)(0, DBL, lm + "Checking password");
        if (!(user === null || user === void 0 ? void 0 : user.password))
            return res.status(401).json({ msg: "Finish. Credential Issue" });
        const isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch)
            return res.status(401).json({ msg: "Invalid Credentials" });
        (0, utils_1.log)(0, DBL, lm + "Password Ok");
        const payload = {
            user: {
                id: user._id,
            },
        };
        // Create jwtToken & return
        (0, utils_1.log)(0, DBL, lm + "Returning token");
        const secret = (0, utils_1.getJwt)();
        jsonwebtoken_1.default.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
            if (err)
                throw err;
            (0, utils_1.log)(0, DBL, lm + "Finish");
            res.json({ token });
        });
    }
    catch (error) {
        console.error(error.message);
        (0, utils_1.log)(1, DBL, lm + "Finish");
        res.status(500).send("Server Error");
    }
}));
// router.post(
//   "/",
//   [
//     check("email", "Please enter a valid email").isEmail(),
//     check("password", "Password is required").exists(),
//   ],
//   async (req: any, res: any) => {
//     let lm = dp + ".login: ";
//     log(0, DBL, lm + "Started");
//     log(0, DBL, lm + "Checking post validation");
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       log(0, DBL, lm + "Post error");
//       return res.status(400).json({ errors: errors.array() });
//     }
//     log(0, DBL, lm + "Validation successful");
//     const { email, password } = req.body;
//     try {
//       log(0, DBL, lm + "Checking for user");
//       let data = await User.findOne({ email }).collation({
//         locale: "en",
//         strength: 2,
//       });
//       if (!data) {
//         log(0, DBL, lm + "Finish. User doesn't exist");
//         return res.status(401).json({ msg: "Invalid Credentials" });
//       }
//       const user: UserType = data;
//       log(0, DBL, lm + "User exists");
//       log(0, DBL, lm + "Checking password");
//       if (!user?.password)
//         return res.status(401).json({ msg: "Finish. Credential Issue" });
//       const isMatch = await compare(password, user.password);
//       if (!isMatch) return res.status(401).json({ msg: "Invalid Credentials" });
//       log(0, DBL, lm + "Password Ok");
//       const payload = {
//         user: {
//           id: user._id,
//         },
//       };
//       // Create jwtToken & return
//       log(0, DBL, lm + "Returning token");
//       const secret = getJwt();
//       jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;
//         log(0, DBL, lm + "Finish");
//         res.json({ token });
//       });
//     } catch (error: any) {
//       console.error(error.message);
//       log(1, DBL, lm + "Finish");
//       res.status(500).send("Server Error");
//     }
//   }
// );
// export default authRouter;
