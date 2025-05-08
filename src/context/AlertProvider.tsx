import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useReducer,
} from "react";
import { v4 as uuid } from "uuid";

import { AlertItemType } from "./types";

type AlertStateType = {
  alerts: AlertItemType[];
};

const initAlertState: AlertStateType = {
  alerts: [],
};

const ALERT_REDUCER_ACTION_TYPE = {
  SET_ALERT: "SET_ALERT",
  REMOVE_ALERT: "REMOVE_ALERT",
  REMOVE_ALL_ALERTS: "REMOVE_ALL_ALERTS",
};

export type AlertReducerActionType = typeof ALERT_REDUCER_ACTION_TYPE;

export type AlertReducerAction = {
  type: string;
  payload?: AlertItemType | string | null;
};

const reducer = (
  state: AlertStateType,
  action: AlertReducerAction
): AlertStateType => {
  switch (action.type) {
    case ALERT_REDUCER_ACTION_TYPE.SET_ALERT:
      if (!action.payload || typeof action.payload === "string")
        return { ...state };

      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };
    case ALERT_REDUCER_ACTION_TYPE.REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };

    case ALERT_REDUCER_ACTION_TYPE.REMOVE_ALL_ALERTS:
      return {
        ...state,
        alerts: [],
      };
    default:
      return state;
  }
};

// CONTEXT
const useAlertContext = (initAlertState: AlertStateType) => {
  const [state, dispatch] = useReducer(reducer, initAlertState);

  const ALERT_REDUCER_ACTIONS = useMemo(() => {
    return ALERT_REDUCER_ACTION_TYPE;
  }, []);

  const setAlert = (message: string, type: string, timeout = 5000) => {
    const id = uuid();

    dispatch({
      type: ALERT_REDUCER_ACTIONS.SET_ALERT,
      payload: { message, type, id },
    });
    setTimeout(
      () =>
        dispatch({
          type: ALERT_REDUCER_ACTIONS.REMOVE_ALERT,
          payload: id,
        }),
      timeout
    );
  };

  const clearAlerts = () => {
    dispatch({
      type: ALERT_REDUCER_ACTIONS.REMOVE_ALL_ALERTS,
    });
  };

  return { alerts: state.alerts, setAlert, clearAlerts };
  // return (
  //   <AlertContext.Provider
  //     value={{
  //       alerts: state.alerts,
  //       setAlert,
  //       clearAlerts,
  //     }}
  //   >
  //     {props.children}
  //   </AlertContext.Provider>
  // );
};

export type UseAlertContextType = ReturnType<typeof useAlertContext>;

const initAlertContextState: UseAlertContextType = {
  setAlert: () => {},
  clearAlerts: () => {},
  alerts: [],
};

export const AlertContext = createContext<UseAlertContextType>(
  initAlertContextState
);

// type ChildrenType = { children?: ReactElement | ReactElement[] };

export const AlertProvider = ({
  children,
}: PropsWithChildren): ReactElement => {
  return (
    <AlertContext.Provider value={useAlertContext(initAlertState)}>
      {children}
    </AlertContext.Provider>
  );
};
