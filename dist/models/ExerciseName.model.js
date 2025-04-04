"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseSchema = void 0;
const mongoose_1 = require("mongoose");
const Exercise_schema_1 = __importDefault(require("./Exercise.schema"));
exports.exerciseSchema = new mongoose_1.Schema(Exercise_schema_1.default);
// get Exercise by ID
exports.exerciseSchema.statics.getExerciseById = function (_id) {
    let data = this.find({ _id: _id });
    return data;
};
// get Exercise by name
exports.exerciseSchema.statics.getExercisesByName = function (name) {
    let data = this.find({ name: name });
    return data;
};
// get ExercisesBy User
exports.exerciseSchema.statics.getExercisesByUser = function (user) {
    // let data = this.find({ user: user });
    let data = this.find();
    return data;
};
// method on doc itself
exports.exerciseSchema.statics.getExerciseCount = function (user) {
    // const data = this.countDocuments({user: user});
    const data = this.countDocuments();
    return data;
};
// // method on doc itself
// exerciseSchema.statics.balanceExists = function (user, period, code) {
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
// exerciseSchema.method.getBalances = function (user, period) {
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
exports.default = (0, mongoose_1.model)("Exercise", exports.exerciseSchema);
