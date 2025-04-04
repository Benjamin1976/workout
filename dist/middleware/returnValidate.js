"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const DBL = 0;
const dp = "middlew.return";
exports.default = (req, res, next) => {
    const lm = dp + ".return: ";
    console.log("response return check");
    // log(1, DBL, lm + "Checking post validation");
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   log(1, DBL, lm + "Post error", JSON.stringify(errors.array()));
    //   return res.status(400).json({ errors: errors.array() });
    // }
    (0, utils_1.log)(1, DBL, lm + "response return check");
    next();
};
