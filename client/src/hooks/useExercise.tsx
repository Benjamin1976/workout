import { useContext } from "react";
import {
  ExerciseContext,
  UseExerciseContextType,
} from "../context/ExerciseProvider";

const useExercise = (): UseExerciseContextType => {
  return useContext(ExerciseContext);
};

export default useExercise;
