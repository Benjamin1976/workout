import { Schema } from "mongoose";

const ExerciseSchema = {
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  comments: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
};

export default ExerciseSchema;
