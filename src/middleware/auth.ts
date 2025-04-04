import { getJwt } from "../utils";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// const config = require("config");

export default (req: any, res: any, next: any) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorisation denied" });
  }

  try {
    const secret = getJwt();

    // Read payload into json is verified (payload is just user)
    const decoded = jwt.verify(token, secret);

    // Add the decoded user to the req header
    req.user = {};
    if (typeof decoded !== "string") {
      req.user = decoded.user;
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
