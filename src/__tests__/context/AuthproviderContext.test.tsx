// validateUser.test.ts
import { describe, it, vi, expect } from "vitest";

// import { validateUser } from './path-to-your-function';
// import { validateUserCode } from './path-to-validateUserCode';
// import { AUTH_REDUCER_ACTIONS } from './path-to-actions';
import { validateUserCode } from "../../axios/auth.axios";
import {
  AUTH_REDUCER_ACTION_TYPE,
  initAuthState,
  useAuthContext,
} from "../../context/AuthProvider";
import { UserType } from "../../context/types";

// Mocks
vi.mock("./path-to-validateUserCode", () => ({
  validateUserCode: vi.fn(),
}));

const dateStamp = new Date(new Date().toDateString());
const testUser: UserType = {
  _id: "testUser",
  name: "Joe",
  email: "joe@joe.com",
  date: dateStamp,
  isValidated: true,
};

const mockDispatch = vi.fn();
const mockLoadUser = vi.fn();
const mockDbMsg = vi.fn();
const mockDbMsgLarge = vi.fn();

const configJSON = { some: "config" }; // mock config
const dp = "prefix";
const DBL = "debugLevel";

// Inject globals if they’re not imported
globalThis.dispatch = mockDispatch;
globalThis.loadUser = mockLoadUser;
globalThis.dbMsg = mockDbMsg;
globalThis.dbMsgLarge = mockDbMsgLarge;
globalThis.configJSON = configJSON;
globalThis.dp = dp;
globalThis.DBL = DBL;

describe("validateUser", () => {
  const user = { name: "John" }; // mock user
  const code = "123456";
  const AuthContext = useAuthContext(initAuthState);
  const { validateUser } = AuthContext;

  it("should call loadUser on successful validation", async () => {
    const token = { accessToken: "abc" };
    (validateUserCode as any).mockResolvedValue(token);

    await validateUser(testUser, code);

    expect(validateUserCode).toHaveBeenCalledWith(user, code, configJSON);
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: AUTH_REDUCER_ACTION_TYPE.VALIDATE_FAIL,
      })
    );
    expect(mockLoadUser).toHaveBeenCalled();
  });

  it("should dispatch VALIDATE_FAIL if token is null", async () => {
    (validateUserCode as any).mockResolvedValue(null);

    await validateUser(testUser, code);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AUTH_REDUCER_ACTION_TYPE.VALIDATE_FAIL,
    });
    expect(mockLoadUser).not.toHaveBeenCalled();
  });

  it("should dispatch AUTH_ERROR if validateUserCode throws", async () => {
    (validateUserCode as any).mockRejectedValue({ msg: "Invalid code" });

    await validateUser(testUser, code);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AUTH_REDUCER_ACTION_TYPE.AUTH_ERROR,
      error: "Invalid code",
    });
    expect(mockLoadUser).not.toHaveBeenCalled();
  });
});
