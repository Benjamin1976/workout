import ExerciseSchema from "./Exercise.schema";
import mongoose from "mongoose";

const SessionSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  date: {
    type: Date,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  exercises: [
    {
      name: {
        type: ExerciseSchema,
        required: true,
      },
      rating: {
        type: Number,
        default: 0,
        required: true,
      },
      id: {
        type: Number,
        default: 0,
        required: true,
      },
      order: {
        type: Number,
        default: 0,
        required: true,
      },
      object: {
        type: String,
      },
      type: {
        type: String,
        default: "normal",
      },
      supersetNo: {
        type: String,
      },
      comments: {
        type: String,
      },
      started: {
        type: Boolean,
        default: false,
      },
      startedWhen: {
        type: Date,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedWhen: {
        type: Date,
      },
      visible: {
        type: Boolean,
        default: true,
        required: true,
      },
      sets: [
        {
          id: {
            type: Number,
          },
          no: {
            type: Number,
          },
          order: {
            type: Number,
          },
          reps: {
            type: Number,
          },
          weight: {
            type: Number,
          },
          unit: {
            type: String,
            default: "kg",
          },
          link: {
            type: Boolean,
          },
          rating: {
            type: Number,
            default: 0,
          },
          started: {
            type: Boolean,
            default: false,
          },
          startedWhen: {
            type: Date,
          },
          completed: {
            type: Boolean,
            default: false,
          },
          completedWhen: {
            type: Date,
          },
        },
      ],
    },
  ],
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

export default SessionSchema;
