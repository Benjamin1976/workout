import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useReducer,
} from "react";
import {
  loadUserAxios,
  loginAxios,
  LoginType,
  registerAxios,
  sendValidationEmailAxios,
  SendValidationEmailType,
  TokenType,
  validateUserCode,
} from "../axios/auth.axios";
import { configJSON, dbMsg, dbMsgLarge } from "../utilities/common";
import setAuthToken from "../utilities/setAuthToken";
import { AuthItemType, UserType } from "./types";

// import { AxiosResponse } from "axios";

const DBL = 0;
const dp = "context.auth";

// Register User
export type LoginDetailsType = {
  name: string;
  email: string;
  password: string;
};

export type AuthStateType = {
  token: string | null;
  isAuthenticated: boolean;
  isValidated: boolean;
  loading: boolean;
  user: UserType | null;
  error: string | null;
};

export const initAuthState: AuthStateType = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isValidated: false,
  loading: true,
  user: null,
  error: null,
};

export const AUTH_REDUCER_ACTION_TYPE = {
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  VALIDATE_USER: "VALIDATE_USER",
  INVALIDATE_USER: "INVALIDATE_USER",
  VALIDATE_SUCCESS: "VALIDATE_SUCCESS",
  VALIDATE_FAIL: "VALIDATE_FAIL",
  VALIDATE_EMAIL: "VALIDATE_EMAIL",
  REGISTER_FAIL: "REGISTER_FAIL",
  USER_LOADED: "USER_LOADED",
  USER_NOT_LOADED: "USER_NOT_LOADED",
  AUTH_ERROR: "AUTH_ERROR",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAIL: "LOGIN_FAIL",
  LOGOUT: "LOGOUT",
  CLEAR_ERRORS: "CLEAR_ERRORS",
};

export type AuthReducerActionType = typeof AUTH_REDUCER_ACTION_TYPE;

export type AuthReducerAction = {
  type: string;
  payload?: AuthItemType | Partial<AuthItemType> | null;
  user?: UserType | null;
  // payload?: AuthItemType | null;
  error?: string | null;
};

export const reducer = (
  state: AuthStateType,
  action: AuthReducerAction
): AuthStateType => {
  switch (action.type) {
    case AUTH_REDUCER_ACTION_TYPE.VALIDATE_SUCCESS:
      if (
        action?.payload?.isValidated === undefined ||
        action?.payload?.isValidated === null
      ) {
        return { ...state, loading: false };
      }

      return {
        ...state,
        isValidated: action.payload.isValidated,
        loading: false,
      };
    case AUTH_REDUCER_ACTION_TYPE.VALIDATE_FAIL:
      return {
        ...state,
        isValidated: false,
        loading: false,
      };
    case AUTH_REDUCER_ACTION_TYPE.REGISTER_SUCCESS:
    case AUTH_REDUCER_ACTION_TYPE.LOGIN_SUCCESS:
      // store token in local storage
      //   and in context through ...action.payload
      if (action?.payload?.token) {
        localStorage.setItem("token", action.payload.token);
      }

      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case AUTH_REDUCER_ACTION_TYPE.USER_LOADED:
      // console.log("reducer.auth.user_loaded: user: ", action?.user);

      if (!action?.user) {
        return { ...state, loading: false };
      }

      return {
        ...state,
        isAuthenticated: true,
        isValidated: true,
        loading: false,
        user: action.user,
      };
    case AUTH_REDUCER_ACTION_TYPE.USER_NOT_LOADED:
      return {
        ...state,
        isAuthenticated: false,
        isValidated: false,
        token: null,
        user: null,
        loading: false,
      };
    case AUTH_REDUCER_ACTION_TYPE.REGISTER_FAIL:
    case AUTH_REDUCER_ACTION_TYPE.AUTH_ERROR:
    case AUTH_REDUCER_ACTION_TYPE.LOGIN_FAIL:
    case AUTH_REDUCER_ACTION_TYPE.LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        isValidated: false,
        token: null,
        user: null,
        error: action?.error ?? null,
        loading: false,
      };
    case AUTH_REDUCER_ACTION_TYPE.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        loading: false,
      };

    default:
      return state;
  }
};

// CONTEXT
export const useAuthContext = (initAuthState: AuthStateType) => {
  const [state, dispatch] = useReducer(reducer, initAuthState);

  const AUTH_REDUCER_ACTIONS = useMemo(() => {
    return AUTH_REDUCER_ACTION_TYPE;
  }, []);

  const validateUser = (user: UserType, code: string) => {
    const lm = dp + ".validateUser: ";
    dbMsg(1, DBL, lm + "Starting");

    // try registering user with form data and json config
    dbMsg(1, DBL, lm + "Validating code with API");
    validateUserCode(user, code, configJSON)
      .then((token: TokenType): void => {
        if (!token) {
          dbMsg(1, DBL, lm + "Other Issue");
          dispatch({
            type: AUTH_REDUCER_ACTIONS.VALIDATE_FAIL,
          });
          return;
        }

        dbMsgLarge(1, DBL, lm + "User Validation result:-", token);
        loadUser();
      })
      .catch((err: Error) => {
        dispatch({
          type: AUTH_REDUCER_ACTIONS.AUTH_ERROR,
          error: err.message,
        });
      });
  };

  const sendValidationEmail = async (user: UserType) => {
    const lm = dp + ".sendValidationEmail: ";

    dbMsg(1, DBL, lm + "Starting");
    sendValidationEmailAxios(user, configJSON)
      .then((emailResult: SendValidationEmailType) => {
        // try registering user with form data and json config
        console.log(emailResult);
        dbMsg(1, DBL, lm + "Validating code with API");
      })
      .catch((err: Error) => {
        dispatch({
          type: AUTH_REDUCER_ACTIONS.AUTH_ERROR,
          error: err.message,
        });
      });
  };

  // Login User
  const login = async (loginData: LoginType) => {
    const lm = dp + ".login: ";

    // try registering user with form data and json config
    dbMsg(1, DBL, lm + "Starting login");
    dbMsg(1, DBL, lm + "Posting form for login");
    loginAxios(loginData)
      .then((tokenData: Partial<AuthItemType>) => {
        const { token } = tokenData;
        if (!token) throw new Error("Token not returned");

        // send to reducer to log token in local storage
        //   and mark as authenticated
        localStorage.setItem("token", token.toString());
        dispatch({
          type: AUTH_REDUCER_ACTIONS.LOGIN_SUCCESS,
          payload: tokenData,
        });

        return token;
      })
      .then((token) => {
        if (token && localStorage.getItem("token")) {
          // load user and return user details
          dbMsg(1, DBL, lm + "Load User");
          loadUser();
        }
      })
      .catch((err: Error) => {
        const errMsg = getError(err);
        dbMsgLarge(1, DBL, lm + "Error:-", errMsg);
        dbMsg(1, DBL, lm + "Finish");
        dispatch({
          type: AUTH_REDUCER_ACTIONS.LOGIN_FAIL,
          payload: errMsg.data.msg,
        });
      });
  };

  // Load User
  const loadUser = async () => {
    const lm = dp + ".loadUser: ";

    dbMsg(1, DBL, lm + "Starting");

    const token = localStorage.getItem("token");
    if (token) {
      dbMsg(1, DBL, lm + "Token Exists, setting in header");
      setAuthToken(token);
    }

    // try getting user from auth
    dbMsg(1, DBL, lm + "Getting user data from auth");
    loadUserAxios()
      .then((user: UserType | null) => {
        dbMsgLarge(1, DBL, lm + "User result:-", user ?? "no data returned");
        if (!user) {
          dbMsg(1, DBL, lm + "User not loaded");
          dispatch({ type: AUTH_REDUCER_ACTIONS.USER_NOT_LOADED });
          return;
        }

        // send user to reducer and mark as authenticated
        dbMsg(1, DBL, lm + "User loaded");
        dispatch({
          type: AUTH_REDUCER_ACTIONS.USER_LOADED,
          user: user,
        });
        dbMsg(1, DBL, lm + "Finish");
      })
      .catch((err: Error) => {
        dbMsgLarge(1, DBL, lm + "Error:-", err.toString());
        dbMsg(1, DBL, lm + "Finish");
        dispatch({ type: AUTH_REDUCER_ACTIONS.AUTH_ERROR });
      });
  };

  const register = async (userLoginDetails: LoginDetailsType) => {
    registerAxios(userLoginDetails)
      .then((tokenData: TokenType) => {
        // send to reducer to log token in local storage
        //   and mark as authenticated
        dispatch({
          type: AUTH_REDUCER_ACTIONS.REGISTER_SUCCESS,
          payload: tokenData,
        });

        loadUser();
      })
      .catch((err: Error) => {
        // remove token from storage and mark as not authenticated
        //   and some other stuff
        dispatch({
          type: AUTH_REDUCER_ACTIONS.REGISTER_FAIL,
          error: err.message,
        });
      });
  };

  // type ErrorResponse = {
  //   response?: {data: string}
  //   request?: {response: string}
  // }

  // type ErrorTypes = {
  //   error: Error | ErrorResponse
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getError = (error: any) => {
    let data;
    let status = 500;

    if (error?.message) {
      data = error.message;
    } else if (error?.response) {
      // status code out of the range of 2xx
      data = error.response.data;
      status = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      data = JSON.parse(error.request.response);
    }
    return { status, data };
  };

  // Logout User
  const logout = () => {
    dispatch({ type: AUTH_REDUCER_ACTIONS.LOGOUT });
  };

  // Clear Errors
  const clearErrors = () => {
    dispatch({ type: AUTH_REDUCER_ACTIONS.CLEAR_ERRORS });
  };

  return {
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isValidated: state.isValidated,
    loading: state.loading,
    user: state.user,
    error: state.error,
    register,
    validateUser,
    sendValidationEmail,
    loadUser,
    login,
    logout,
    clearErrors,
  };
};

export type UseAuthContextType = ReturnType<typeof useAuthContext>;

const initAuthContextState: UseAuthContextType = {
  token: null,
  isAuthenticated: false,
  isValidated: false,
  loading: true,
  user: null,
  error: null,
  register: async () => {},
  validateUser: async () => {},
  sendValidationEmail: async () => {},
  loadUser: async () => {},
  login: async () => {},
  logout: () => {},
  clearErrors: () => {},
};

export const AuthContext =
  createContext<UseAuthContextType>(initAuthContextState);

// type ChildrenType = { children?: ReactElement | ReactElement[] };

export const AuthProvider = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <AuthContext.Provider value={useAuthContext(initAuthState)}>
      {children}
    </AuthContext.Provider>
  );
};
