import {
  beforeEach,
  describe,
  expect,
  it,
  // , test, vi
} from "vitest";
import {
  AUTH_REDUCER_ACTION_TYPE,
  AuthReducerAction,
  AuthReducerActionType,
  AuthStateType,
  initAuthState,
  reducer,
} from "../../context/AuthProvider";
import { UserType } from "../../context/types";

const dateStamp = new Date(new Date().toDateString());
const testUser: UserType = {
  _id: "testUser",
  name: "Joe",
  email: "joe@joe.com",
  date: dateStamp,
  isValidated: true,
};

describe.skip("Authprovider Reducer Tests", () => {
  let initState: AuthStateType;
  let types: AuthReducerActionType = AUTH_REDUCER_ACTION_TYPE;

  beforeEach(() => {
    // const [state, dispatch] = useReducer(reducer, initAuthState);
    initState = { ...initAuthState };
    console.log(initState);
    types = AUTH_REDUCER_ACTION_TYPE;
  });

  it("VALIDATE_SUCCESS state change", async () => {
    const action: AuthReducerAction = {
      type: types.VALIDATE_SUCCESS,
    };

    const testPayloads = [
      { isValidated: true },
      { isValidated: false },
      { isValidated: undefined },
      {},
    ];
    const expecteds = [
      [true, false],
      [false, false],
      [false, false],
      [false, false],
    ];

    testPayloads.forEach((testPayload, i) => {
      const updState: AuthStateType = reducer(
        { ...initAuthState },
        { ...action, payload: testPayload }
      );
      expect(updState.isValidated).toBe(expecteds[i][0]);
      expect(updState.loading).toBe(expecteds[i][1]);
    });
  });

  it("VALIDATE_FAIL state change", async () => {
    const action: AuthReducerAction = {
      type: types.VALIDATE_FAIL,
    };

    const testPayloads = [
      { isValidated: false },
      { isValidated: true },
      { isValidated: undefined },
      {},
    ];
    const expecteds = [
      [false, false],
      [false, false],
      [false, false],
      [false, false],
    ];

    testPayloads.forEach((testPayload, i) => {
      const updState: AuthStateType = reducer(
        { ...initAuthState },
        { ...action, payload: testPayload }
      );
      expect(updState.isValidated).toBe(expecteds[i][0]);
      expect(updState.loading).toBe(expecteds[i][1]);
    });
  });

  // TO-DO: decide whether to add null / undefined token handling to reducer
  it("LOGIN_SUCCESS and REGISTER_SUCCESS state change", async () => {
    const testPayloads = [
      { token: "thisToken" },
      { token: "" },
      { token: undefined },
      {},
    ];
    const expecteds = [
      [true, "thisToken", "thisToken"],
      [true, "", null],
      [true, undefined, null],
      [true, null, null],
    ];

    [types.LOGIN_SUCCESS, types.REGISTER_SUCCESS].forEach((redType) => {
      const action: AuthReducerAction = {
        type: redType,
      };

      testPayloads.forEach((testPayload, i) => {
        localStorage.removeItem("token");
        const updState: AuthStateType = reducer(
          { ...initAuthState },
          { ...action, payload: testPayload }
        );
        expect(updState.loading).toBe(false);
        expect(updState.isAuthenticated).toBe(expecteds[i][0]);
        expect(updState.token).toBe(expecteds[i][1]);
        expect(localStorage.getItem("token")).toBe(expecteds[i][2]);
      });
    });
  });

  // TO-DO: decide whether to add null / undefined token handling to reducer
  it("USER_LOADED state change", async () => {
    const testPayloads = [
      {
        user: testUser,
      },
      { user: null },
    ];
    const expecteds = [
      [true, true, testPayloads[0].user],
      [false, false, null],
    ];
    [types.USER_LOADED].forEach((redType) => {
      const action: AuthReducerAction = {
        type: redType,
      };

      testPayloads.forEach((testPayload, i) => {
        const updState: AuthStateType = reducer(
          { ...initAuthState },
          { ...action, ...testPayload }
        );

        expect(updState.loading).toBe(false);
        expect(updState.isAuthenticated).toBe(expecteds[i][0]);
        expect(updState.isValidated).toBe(expecteds[i][1]);
        expect(updState.user).toBe(expecteds[i][2]);
      });
    });
  });

  it("USER_NOT_LOADED state change", async () => {
    [types.USER_NOT_LOADED].forEach((redType) => {
      const action: AuthReducerAction = {
        type: redType,
      };

      const updState: AuthStateType = reducer(
        { ...initAuthState },
        { ...action }
      );

      expect(updState.loading).toBe(false);
      expect(updState.isAuthenticated).toBe(false);
      expect(updState.isValidated).toBe(false);
      expect(updState.token).toBe(null);
      expect(updState.user).toBe(null);
    });
  });

  it("REGISTER_FAIL, AUTH_ERROR, LOGIN_FAIL, LOGOUT state change", async () => {
    const actionTypes = [
      types.REGISTER_FAIL,
      types.AUTH_ERROR,
      types.LOGIN_FAIL,
      types.LOGOUT,
    ];

    const errorValues = ["login error", ""];
    const expectedErrors = ["login error", ""];

    actionTypes.forEach((redType) => {
      errorValues.forEach((error, errorIdx) => {
        const action: AuthReducerAction = {
          type: redType,
          error: error,
        };

        const initState = {
          ...initAuthState,
          token: "thisToken",
          isAuthenticated: true,
          isValidated: true,
          loading: true,
          user: testUser,
          error: error,
        };

        localStorage.setItem("token", "thisToken");
        const updState: AuthStateType = reducer(initState, { ...action });

        expect(updState.isAuthenticated).toBe(false);
        expect(updState.isValidated).toBe(false);
        expect(updState.token).toBe(null);
        expect(updState.user).toBe(null);
        expect(updState.error).toBe(expectedErrors[errorIdx]);
        expect(localStorage.getItem("token")).toBe(null);
        expect(updState.loading).toBe(false);
      });
    });
  });

  it("CLEAR_ERRORS state change", async () => {
    [types.CLEAR_ERRORS].forEach((redType) => {
      const action: AuthReducerAction = {
        type: redType,
      };

      const updState: AuthStateType = reducer(
        { ...initAuthState, error: "login failure" },
        { ...action }
      );

      expect(updState.error).toBe(null);
      expect(updState.loading).toBe(false);
    });
  });
});

// describe("Authprovider Context Tests", () => {
//     const ctx = useAuthContext(initAuthState)
//     const {validateUser} = ctx

//     it("check validateUser returns correct user", async () => {
//         let user = testUser
//         let code = "1234"
//         vi.mock("validateUserCode", ()=> {

//         })

//     })
// })
