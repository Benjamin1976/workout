const mongoose = require("mongoose");

const LogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  lineNumber: {
    type: Number,
  },
  fileName: {
    type: String,
  },
  options: {
    type: Object,
  },
  type: {
    type: String,
  },
  level: {
    type: String,
  },
  message: {
    type: String,
  },
  reason: {
    type: String,
  },
  info: {
    type: Object,
  },
  data: {
    type: Object,
  },
  meta: {
    type: Object,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = LogSchema;
