import {
  createContext,
  ReactElement,
  // useCallback,
  // useEffect,
  useMemo,
  useReducer,
} from "react";
import { AuthItemType, UserType } from "./types";
import axios from "axios";
import setAuthToken from "../utilities/setAuthToken";
import {
  configJSON,
  ConfigJSONType,
  dbMsg,
  dbMsgLarge,
} from "../utilities/common";

// import { AxiosResponse } from "axios";

let dbl = 0;
let dp = "context.auth";

// Register User
type LoginDetailsType = {
  name: string;
  email: string;
  password: string;
};

type AuthStateType = {
  token: string | null;
  isAuthenticated: boolean;
  isValidated: boolean;
  loading: boolean;
  user: UserType | null;
  error: string | null;
};

const initAuthState: AuthStateType = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isValidated: false,
  loading: true,
  user: null,
  error: null,
};

const AUTH_REDUCER_ACTION_TYPE = {
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

const reducer = (
  state: AuthStateType,
  action: AuthReducerAction
): AuthStateType => {
  switch (action.type) {
    case AUTH_REDUCER_ACTION_TYPE.VALIDATE_SUCCESS:
      if (
        action?.payload?.isValidated === undefined ||
        action?.payload?.isValidated === null
      ) {
        return { ...state };
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
        return { ...state };
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
        loading: false,
        token: null,
        user: null,
      };
    case AUTH_REDUCER_ACTION_TYPE.REGISTER_FAIL:
    case AUTH_REDUCER_ACTION_TYPE.AUTH_ERROR:
    case AUTH_REDUCER_ACTION_TYPE.LOGIN_FAIL:
    case AUTH_REDUCER_ACTION_TYPE.LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isValidated: false,
        loading: false,
        user: null,
        error: action?.error ?? null,
      };
    case AUTH_REDUCER_ACTION_TYPE.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

type TokenType = {
  token: string;
};

const validateUserCode = async (
  user: UserType,
  code: string,
  configJSON: ConfigJSONType
): Promise<TokenType> => {
  const { data } = await axios.post<TokenType>(
    "/api/users/validate",
    { user, code },
    configJSON
  );
  return data;
};

type SendValidationEmailType = {
  emailSent: boolean;
  newCode: string;
};

const sendValidationEmailAxios = async (
  user: UserType,
  configJSON: ConfigJSONType
): Promise<SendValidationEmailType> => {
  const { data } = await axios.post<SendValidationEmailType>(
    "/api/users/validateemail",
    { user },
    configJSON
  );
  return data;
};

type LoginType = { email: string; password: string };

const loginAxios = async (loginData: LoginType): Promise<TokenType> => {
  const { data } = await axios.post<TokenType>(
    "/api/auth",
    loginData,
    configJSON
  );
  return data;
};

const loadUserAxios = async (from: string): Promise<UserType> => {
  const { data } = await axios.get<UserType>(`/api/auth/${from}`);
  return data;
};

const registerAxios = async (
  userLoginDetails: Partial<UserType>
): Promise<TokenType> => {
  // try registering user with form data and json config
  const { data } = await axios.post<TokenType>(
    "/api/users",
    userLoginDetails,
    configJSON
  );
  return data;
};

// CONTEXT
const useAuthContext = (initAuthState: AuthStateType) => {
  const [state, dispatch] = useReducer(reducer, initAuthState);

  const AUTH_REDUCER_ACTIONS = useMemo(() => {
    return AUTH_REDUCER_ACTION_TYPE;
  }, []);

  const validateUser = (user: UserType, code: string) => {
    let lm = dp + ".validateUser: ";
    dbMsg(1, dbl, lm + "Starting");

    // try registering user with form data and json config
    dbMsg(1, dbl, lm + "Validating code with API");
    validateUserCode(user, code, configJSON)
      .then((token: TokenType): void => {
        if (!token) {
          dbMsg(1, dbl, lm + "Other Issue");
          dispatch({
            type: AUTH_REDUCER_ACTIONS.VALIDATE_FAIL,
          });
          return;
        }

        dbMsgLarge(1, dbl, lm + "User Validation result:-", token);
        loadUser("validateUser");
      })
      .catch((err: any) => {
        dispatch({
          type: AUTH_REDUCER_ACTIONS.AUTH_ERROR,
          error: err.msg,
        });
      });
  };

  const sendValidationEmail = async (user: UserType) => {
    let lm = dp + ".sendValidationEmail: ";

    dbMsg(1, dbl, lm + "Starting");
    sendValidationEmailAxios(user, configJSON)
      .then((emailResult: SendValidationEmailType) => {
        // try registering user with form data and json config
        console.log(emailResult);
        dbMsg(1, dbl, lm + "Validating code with API");
      })
      .catch((err: any) => {
        dispatch({
          type: AUTH_REDUCER_ACTIONS.AUTH_ERROR,
          payload: err,
        });
      });
  };

  // Login User
  const login = async (loginData: LoginType) => {
    let lm = dp + ".login: ";

    // try registering user with form data and json config
    dbMsg(1, dbl, lm + "Starting login");
    dbMsg(1, dbl, lm + "Posting form for login");
    dbMsgLarge(1, dbl, lm + "formData:-", loginData);
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
          dbMsg(1, dbl, lm + "Load User");
          loadUser("login");
        }
      })
      .catch((err: any) => {
        let errMsg = getError(err);
        dbMsgLarge(1, dbl, lm + "Error:-", errMsg);
        dbMsg(1, dbl, lm + "Finish");
        dispatch({
          type: AUTH_REDUCER_ACTIONS.LOGIN_FAIL,
          payload: errMsg.data.msg,
        });
      });
  };

  // Load User
  const loadUser = async (from: string) => {
    let lm = dp + ".loadUser: ";

    dbMsg(1, dbl, lm + "Starting from: " + from);

    const token = localStorage.getItem("token");
    if (token) {
      dbMsg(1, dbl, lm + "Token Exists, setting in header");
      setAuthToken(token);
    }

    // try getting user from auth
    dbMsg(1, dbl, lm + "Getting user data from auth");
    loadUserAxios(from)
      .then((user: UserType) => {
        dbMsgLarge(1, dbl, lm + "User result:-", user ?? "no data returned");
        if (!user) {
          dbMsg(1, dbl, lm + "User not loaded");
          dispatch({ type: AUTH_REDUCER_ACTIONS.USER_NOT_LOADED });
          return;
        }

        // send user to reducer and mark as authenticated
        dbMsg(1, dbl, lm + "User loaded");
        dispatch({
          type: AUTH_REDUCER_ACTIONS.USER_LOADED,
          user: user,
        });
        dbMsg(1, dbl, lm + "Finish");
      })
      .catch((err: any) => {
        dbMsgLarge(1, dbl, lm + "Error:-", err.toString());
        dbMsg(1, dbl, lm + "Finish");
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

        loadUser("register");
      })
      .catch((err: any) => {
        // remove token from storage and mark as not authenticated
        //   and some other stuff
        dispatch({
          type: AUTH_REDUCER_ACTIONS.REGISTER_FAIL,
          payload: err.msg,
        });
      });
  };

  const getError = (error: any) => {
    let data;
    let status = 500;
    if (error.response) {
      // status code out of the range of 2xx
      data = error.response.data;
      status = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      data = JSON.parse(error.request.response);
    } else {
      // Error on setting up the request
      data = error.message;
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

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const AuthProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <AuthContext.Provider value={useAuthContext(initAuthState)}>
      {children}
    </AuthContext.Provider>
  );
};
