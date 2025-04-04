"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Session_schema_1 = __importDefault(require("./Session.schema"));
const sessionSchema = new mongoose_1.Schema(Session_schema_1.default);
// method on doc itself
sessionSchema.statics.getSession = function (id) {
    const data = this.findOne({
        _id: id,
    });
    return data;
};
// method on doc itself
sessionSchema.statics.getSessions = function (user, sort, skip, limit) {
    let sortString = {
        date: -1,
    };
    const data = this.find({
        user: user,
    })
        .sort(sortString)
        .skip(skip)
        .limit(limit);
    return data;
};
// method on doc itself
sessionSchema.statics.getSessionCount = function (user, sort) {
    let sortString = {
        date: -1,
    };
    const data = this.countDocuments({
        user: user,
    });
    return data;
};
sessionSchema.statics.getExercises = function (user, period, sort) {
    let data = this.find({});
    // let date = DateTime.fromISO(period);
    // let sortString = {
    //   // date_due: -1,
    //   period: -1,
    //   status: 1,
    //   created: -1,
    // };
    // if (sort) {
    //   sortString = { ...sort, ...sortString };
    // }
    // const data = this.find({
    //   user: user,
    //   period: {
    //     $gte: date.startOf("day").toISO(),
    //     $lte: date.endOf("day").toISO(),
    //   },
    // })
    //   .sort(sortString)
    //   .populate("account");
    return data;
};
exports.default = mongoose_1.default.model("Session", sessionSchema);
