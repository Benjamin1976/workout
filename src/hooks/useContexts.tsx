import { useContext } from "react";
// import {
//   ExerciseContext,
//   UseExerciseContextType,
// } from "../context/ExerciseProvider";
import { MyContext, UseMyContextType } from "../context/MyContext";

export const useContexts = (): UseMyContextType => {
  return useContext(MyContext);
};

export default useContexts;
