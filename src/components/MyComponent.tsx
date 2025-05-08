import useContexts from "../hooks/useContexts";
// import { useMyContext } from "../context/MyContext";

const MyComponent = () => {
  const { count, increment } = useContexts();

  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default MyComponent;

// import React from "react";
// import { useMyContext } from "../context/MyContext";

// const TestComponent: React.FC = () => {
//   const { state, dispatch } = useMyContext();

//   return (
//     <div>
//       <p data-testid="count">{state.count}</p>
//       <button onClick={() => dispatch({ type: "INCREMENT" })}>Increment</button>
//     </div>
//   );
// };

// export default TestComponent;
