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
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("../middleware/auth"));
const validation_1 = __importDefault(require("../middleware/validation"));
const User_model_1 = __importDefault(require("../models/User.model"));
// import { UserDocType } from "../types";
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
const utils_1 = require("../utils");
const DBL = 0;
const dp = "routes.auth";
exports.authRouter = express_1.default.Router();
// @route   POST api/auth
// @desc    Login user
// @access  Private
exports.authRouter.post("/", [
    (0, express_validator_1.check)("email", "Please enter a valid email").isEmail(),
    (0, express_validator_1.check)("password", "Password is required").exists(),
], validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".login: ";
    (0, utils_1.log)(1, DBL, lm + "Started");
    const { email, password } = req.body;
    try {
        (0, utils_1.log)(1, DBL, lm + "Checking for user");
        let data = yield User_model_1.default.findOne({ email });
        if (!data) {
            (0, utils_1.log)(1, DBL, lm + "Finish. User doesn't exist");
            return res.status(401).json({ msg: "Invalid Credentials" });
        }
        const user = data;
        (0, utils_1.log)(1, DBL, lm + "User exists");
        (0, utils_1.log)(1, DBL, lm + "Checking password");
        if (!(user === null || user === void 0 ? void 0 : user.password))
            return res.status(401).json({ msg: "Finish. Credential Issue" });
        const isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch)
            return res.status(401).json({ msg: "Invalid Credentials" });
        (0, utils_1.log)(1, DBL, lm + "Password Ok");
        const payload = {
            user: {
                id: user._id,
            },
        };
        // Create jwtToken & return
        (0, utils_1.log)(1, DBL, lm + "Returning token");
        const secret = (0, utils_1.getJwt)();
        jsonwebtoken_1.default.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
            if (err)
                throw err;
            (0, utils_1.log)(1, DBL, lm + "Finish");
            res.json({ token });
        });
    }
    catch (error) {
        console.error(error.message);
        (0, utils_1.log)(1, DBL, lm + "Finish");
        res.status(500).send("Server Error");
    }
}));
// @route   GET api/auth
// @desc    Get logged in user
// // @access  Private
exports.authRouter.get("/:from", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lm = dp + ".login: ";
    (0, utils_1.log)(1, DBL, lm + "Started");
    try {
        // Check token through "auth" and if successful,
        //    get user and return all except password
        let reqId = req.user.id;
        const userId = new mongoose_1.default.Types.ObjectId(reqId);
        const user = yield User_model_1.default.findOne({ _id: userId }).select({
            password: 0,
            status: 0,
        });
        (0, utils_1.log)(1, DBL, lm + "Finish");
        // Return user
        user ? res.json(user) : res.status(400).json({ msg: "User not loaded" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
