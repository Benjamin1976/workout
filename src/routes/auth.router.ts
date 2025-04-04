import express from "express";
import mongoose from "mongoose";

import auth from "../middleware/auth";
import validation from "../middleware/validation";

import User from "../models/User.model";
import { UserType } from "../interfaces/User.interface";
// import { UserDocType } from "../types";

import { check } from "express-validator";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { getJwt, log } from "../utils";

const DBL = 0;
const dp = "routes.auth";

export const authRouter = express.Router();

// @route   POST api/auth
// @desc    Login user
// @access  Private
authRouter.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  validation,
  async (req: any, res: any) => {
    let lm = dp + ".login: ";
    log(1, DBL, lm + "Started");

    const { email, password } = req.body;
    try {
      log(1, DBL, lm + "Checking for user");
      let data = await User.findOne({ email });

      if (!data) {
        log(1, DBL, lm + "Finish. User doesn't exist");
        return res.status(401).json({ msg: "Invalid Credentials" });
      }

      const user: Partial<UserType> = data;
      log(1, DBL, lm + "User exists");

      log(1, DBL, lm + "Checking password");
      if (!user?.password)
        return res.status(401).json({ msg: "Finish. Credential Issue" });

      const isMatch = await compare(password, user.password);
      if (!isMatch) return res.status(401).json({ msg: "Invalid Credentials" });
      log(1, DBL, lm + "Password Ok");

      const payload = {
        user: {
          id: user._id,
        },
      };

      // Create jwtToken & return
      log(1, DBL, lm + "Returning token");
      const secret = getJwt();
      jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        log(1, DBL, lm + "Finish");
        res.json({ token });
      });
    } catch (error: any) {
      console.error(error.message);
      log(1, DBL, lm + "Finish");
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/auth
// @desc    Get logged in user
// // @access  Private
authRouter.get("/:from", auth, async (req: any, res: any) => {
  let lm = dp + ".login: ";
  log(1, DBL, lm + "Started");

  try {
    // Check token through "auth" and if successful,
    //    get user and return all except password
    let reqId: string = req.user.id;
    const userId = new mongoose.Types.ObjectId(reqId);
    const user = await User.findOne({ _id: userId }).select({
      password: 0,
      status: 0,
    });

    log(1, DBL, lm + "Finish");

    // Return user
    user ? res.json(user) : res.status(400).json({ msg: "User not loaded" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
