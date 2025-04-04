"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = require("./config/mongoose");
const auth_router_1 = require("./routes/auth.router");
const sessions_router_1 = require("./routes/sessions.router");
const ENV = process.env.NODE_ENV;
const PROD = ENV === "production";
const PORT = PROD ? process.env.PORT || 5030 : 5030;
(0, mongoose_1.connectToDB)();
app_1.default.listen(PORT, () => {
    /* eslint-disable no-console */
    app_1.default.use("/api/auth", auth_router_1.authRouter);
    app_1.default.use("/api/sessions", sessions_router_1.sessionsRouter);
    console.log("env:", ENV);
    console.log("server started on port http://localhost:", PORT);
    /* eslint-enable no-console */
});
