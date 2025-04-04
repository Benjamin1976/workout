"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the 'express' module along with 'Request' and 'Response' types from express
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./db"));
const auth_router_1 = require("./routes/auth.router");
const sessions_copy_2_1 = __importDefault(require("./routes/sessions copy 2"));
// import bodyParser from "body-parser";
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:3030",
};
app.use((0, cors_1.default)(corsOptions));
// Specify the port number for the server
const isProd = process.env.NODE_ENV === "production";
const PORT = isProd ? process.env.PORT || 3030 : 3030;
// Connect Database
(0, db_1.default)();
// Init Middleware
app.use(express_1.default.json({}));
// Define Routes
app.use("/api/auth", auth_router_1.authRouter);
app.use("/api/sessions", sessions_copy_2_1.default);
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/users", require("./routes/users"));
// app.use("/api/gym", require("./routes/gym"));
// app.use("/api/workouts", require("./routes/workouts"));
// app.use("/api/exercises", require("./routes/exercises"));
// Server static assests
if (isProd) {
    // Set static folder
    app.use(express_1.default.static("client/build"));
    app.get("*", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html")));
}
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
