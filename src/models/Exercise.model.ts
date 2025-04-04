import { model, Schema } from "mongoose";
import ExerciseSchema from "./Exercise.schema";
import { ExerciseNameType } from "../interfaces/Session.interface";

export const exerciseSchema = new Schema<ExerciseNameType>(ExerciseSchema);

// get Exercise by ID
exerciseSchema.statics.getExerciseById = function (_id) {
  let data = this.find({ _id: _id });
  return data;
};

// get Exercise by name
exerciseSchema.statics.getExercisesByName = function (name) {
  let data = this.find({ name: name });
  return data;
};

// get ExercisesBy User
exerciseSchema.statics.getExercisesByUser = function (user) {
  // let data = this.find({ user: user });
  let data = this.find();
  return data;
};

// method on doc itself
exerciseSchema.statics.getExerciseCount = function (user) {
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

export default model("Exercise", exerciseSchema);
