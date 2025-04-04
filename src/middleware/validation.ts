import { validationResult } from "express-validator";
import { log } from "../utils";

const DBL = 1;
const dp = "middlew.validation";

export default (req: any, res: any, next: any) => {
  const lm = dp + ".check: ";
  // console.log("validation check");

  log(1, DBL, lm + "Checking post validation");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    log(1, DBL, lm + "Post error", JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }
  log(1, DBL, lm + "Validation successful");

  next();
};
