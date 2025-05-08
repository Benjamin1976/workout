import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useReducer,
} from "react";

// --- Types ---
type State = {
  count: number;
};

const initialState: State = { count: 0 };

// const ACTION_TYPE = { type: "INCREMENT" };
const ACTION_TYPE = { INCREMENT: "INCREMENT" };

// --- Context Setup ---
export type MyReducerType = typeof ACTION_TYPE;

export type MyReducerAction = {
  type: string;
};

function myReducer(state: State, action: MyReducerAction): State {
  switch (action.type) {
    case ACTION_TYPE.INCREMENT:
      return { count: state.count + 1 };
    default:
      return state;
  }
}

export type UseMyContextType = ReturnType<typeof useMyContext>;

const useMyContext = (initialState: State) => {
  const [state, dispatch] = useReducer(myReducer, initialState);

  const increment = () => dispatch({ type: "INCREMENT" });

  return { count: state.count, increment };
};

// --- Hook ---

// type ContextType = {
//     count: State;
//     increment: () => void;
//   };

const initialContextState: UseMyContextType = { count: 0, increment: () => {} };

export const MyContext = createContext<UseMyContextType>(initialContextState);

// export const MyProvider = (): ContextType => {
//     const context = useContext(MyContext);
//     if (!context) {
//       throw new Error("useMyContext must be used within a MyProvider");
//     }
//     return context;
//   };

// --- Provider ---
export const MyProvider = ({ children }: PropsWithChildren): ReactElement => {
  //   const [state, dispatch] = useReducer(myReducer, initialState);

  return (
    // <MyContext.Provider value={{ state, increment }}>
    <MyContext.Provider value={useMyContext(initialState)}>
      {children}
    </MyContext.Provider>
  );
};

// import {
//   createContext,
//   Dispatch,
//   ReactNode,
//   useContext,
//   useReducer,
// } from "react";

// // --- Types ---
// type State = {
//   count: number;
// };

// type Action = { type: "INCREMENT" };

// type ContextType = {
//   state: State;
//   dispatch: Dispatch<Action>;
// };

// // --- Context Setup ---
// const MyContext = createContext<ContextType | undefined>(undefined);

// const initialState: State = { count: 0 };

// function myReducer(state: State, action: Action): State {
//   switch (action.type) {
//     case "INCREMENT":
//       return { count: state.count + 1 };
//     default:
//       return state;
//   }
// }

// // --- Provider ---
// export const MyProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(myReducer, initialState);
//   return (
//     <MyContext.Provider value={{ state, dispatch }}>
//       {children}
//     </MyContext.Provider>
//   );
// };

// // --- Hook ---
// export const useMyContext = (): ContextType => {
//   const context = useContext(MyContext);
//   if (!context) {
//     throw new Error("useMyContext must be used within a MyProvider");
//   }
//   return context;
// };
