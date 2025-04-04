import { config } from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";

// import morgan from "morgan";
// import helmet from "helmet";

config();
const app = express();
const isProd = process.env.NODE_ENV === "production";

// app.use(morgan("dev"));
// app.use(validation())
// app.use(helmet());
app.use(cors());
app.use(express.json());

// Server static assests
if (isProd) {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req: any, res: any) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

export default app;
