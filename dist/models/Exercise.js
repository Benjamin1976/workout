"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseSchema = void 0;
const mongoose_1 = require("mongoose");
const ExerciseSchema_1 = __importDefault(require("./ExerciseSchema"));
// Mongoose
// const mongoose = require("mongoose");
// const ExerciseSchema = require("./ExerciseSchema");
exports.ExerciseSchema = new mongoose_1.Schema(ExerciseSchema_1.default);
// get Exercise by ID
exports.ExerciseSchema.statics.getExerciseById = function (_id) {
    let data = this.find({ _id: _id });
    return data;
};
// get Exercise by name
exports.ExerciseSchema.statics.getExercisesByName = function (name) {
    let data = this.find({ name: name });
    return data;
};
// get ExercisesBy User
exports.ExerciseSchema.statics.getExercisesByUser = function (user) {
    // let data = this.find({ user: user });
    let data = this.find();
    return data;
};
// method on doc itself
exports.ExerciseSchema.statics.getExerciseCount = function (user) {
    // const data = this.countDocuments({user: user});
    const data = this.countDocuments();
    return data;
};
// // method on doc itself
// ExerciseSchema.statics.balanceExists = function (user, period, code) {
//   let date = DateTime.fromISO(period);
//   const data = this.findOne({
//     user: user,
//     code: code,
//     period: {
//       $gte: date.startOf("day").toISO(),
//       $lte: date.endOf("day").toISO(),
//     },
//   }).select({ _id: 1 });
//   return data;
// };
// // method on doc itself
// ExerciseSchema.method.getBalances = function (user, period) {
//   let date = DateTime.fromISO(period);
//   const data = this.find({
//     user: user,
//     $gte: date.startOf("day").toISO(),
//     $lte: date.endOf("day").toISO(),
//   })
//     .sort({
//       date_due: -1,
//       period: -1,
//       status: 1,
//       created: -1,
//     })
//     .populate("account");
//   return data;
// };
exports.default = (0, mongoose_1.model)("exercise", exports.ExerciseSchema);
