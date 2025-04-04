"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validationSchema = new mongoose_1.Schema({
    code: { type: Number },
    codeGenerated: { type: Date },
    emailsSent: [
        { id: { type: String }, sent: { type: Date }, result: { type: String } },
    ],
    lastEmailSentOk: { type: Date },
    lastEmailSent: { type: Date },
    history: [{ date: { type: Date }, matched: { type: Boolean } }],
});
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    // activation: {
    //   firstEmailSent: { type: Date },
    //   emailSent: { type: Date },
    //   noEmailsSent: { type: Number },
    //   key: { type: ObjectId },
    //   encryptedKey: { type: String },
    // },
    isValidated: {
        type: Boolean,
        default: false,
    },
    validation: validationSchema,
    date: {
        type: Date,
        default: Date.now,
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
