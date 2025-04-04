"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ExerciseSchema = {
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = ExerciseSchema;
