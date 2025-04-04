"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLarge = exports.log = exports.getJwt = void 0;
const luxon_1 = require("luxon");
const config_1 = __importDefault(require("config"));
// import { DebugMsgType } from "./types";
const DBL = 0;
const dp = "utils";
const getJwt = () => {
    const lm = dp + ".getJwt: ";
    (0, exports.log)(1, DBL, lm + "Getting JWT");
    const jwtSecret = process.env.NODE_ENV === "production"
        ? process.env.jwtSecret
        : config_1.default.get("jwtSecret");
    return jwtSecret !== null && jwtSecret !== void 0 ? jwtSecret : "thisSecret";
};
exports.getJwt = getJwt;
const includeTime = true;
const log = (lvl, dbl, msg, data) => {
    let dbgLevel = dbl !== null && dbl !== void 0 ? dbl : 0;
    let dtStamp = luxon_1.DateTime.now().toFormat("yyyy-LL-dd hh:mm:ss.SSS");
    msg = includeTime ? dtStamp + ": " + msg : msg;
    if (dbgLevel >= lvl) {
        console.log(msg);
        if (data)
            console.log(data);
    }
};
exports.log = log;
const logLarge = (lvl, dbl, msg, data) => {
    let dbgLevel = dbl === null || dbl === undefined ? 0 : dbl;
    if (dbgLevel >= lvl) {
        if (msg)
            console.log(msg);
        if (data)
            console.log(data);
    }
};
exports.logLarge = logLarge;
