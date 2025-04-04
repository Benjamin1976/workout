"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import config from "dotenv";
const config_1 = __importDefault(require("config"));
// const config = require("config");
// require('dotenv').config({
//   path: `${__dirname}/dev.env`
// })
let uri = config_1.default.get("mongoURI_local");
// console.log(uri);
// config.configDotenv({ path: "./dev.json" });
// config.configDotenv({ path: "../.env" });
// console.log(config.);
// console.log(process.env);
// console.log("env: " + process.env.NODE_ENV);
const connectDB = () => { };
// let uri =
//   process?.env?.NODE_ENV === "production"
//     ? process.env.MONGODB_URI?.toString()
//     : config.get("mongoURI_local").toString();
// if (!uri) process.exit(1);
// const db: string = uri
// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       // useNewUrlParser: true,
//       // useCreateIndex: true,
//       // useUnifiedTopology: true,
//       family: 4,
//       // useFindAndModify: false,
//     });
//     console.log("MongoDB Connected...");
//   } catch (err: any) {
//     console.error("MongoDB Issue - " + err.message);
//     process.exit(1);
//   }
// };
exports.default = connectDB;
