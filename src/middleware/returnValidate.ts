import { log } from "../utils";

const DBL = 0;
const dp = "middlew.return";

export default (req: any, res: any, next: any) => {
  const lm = dp + ".return: ";
  console.log("response return check");

  // log(1, DBL, lm + "Checking post validation");
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   log(1, DBL, lm + "Post error", JSON.stringify(errors.array()));
  //   return res.status(400).json({ errors: errors.array() });
  // }
  log(1, DBL, lm + "response return check");

  next();
};
