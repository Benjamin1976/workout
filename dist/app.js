"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// import morgan from "morgan";
// import helmet from "helmet";
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const isProd = process.env.NODE_ENV === "production";
// app.use(morgan("dev"));
// app.use(validation())
// app.use(helmet());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Server static assests
if (isProd) {
    // Set static folder
    app.use(express_1.default.static("client/build"));
    app.get("*", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html")));
}
exports.default = app;
