"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exercise_schema_1 = __importDefault(require("./Exercise.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const SessionSchema = {
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
                type: Exercise_schema_1.default,
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
exports.default = SessionSchema;
