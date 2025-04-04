import mongoose, { Schema } from "mongoose";
import SessionSchema from "./Session.schema";
import { SessionItemType } from "../interfaces/Session.interface";

const sessionSchema = new Schema<SessionItemType>(SessionSchema);

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

export default mongoose.model("Session", sessionSchema);
