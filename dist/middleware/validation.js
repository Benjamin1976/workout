"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const DBL = 1;
const dp = "middlew.validation";
exports.default = (req, res, next) => {
    const lm = dp + ".check: ";
    // console.log("validation check");
    (0, utils_1.log)(1, DBL, lm + "Checking post validation");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        (0, utils_1.log)(1, DBL, lm + "Post error", JSON.stringify(errors.array()));
        return res.status(400).json({ errors: errors.array() });
    }
    (0, utils_1.log)(1, DBL, lm + "Validation successful");
    next();
};
