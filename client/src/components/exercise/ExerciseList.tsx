import ExerciseItem from "./ExerciseItem";
import { ExerciseItemType } from "../../context/types";

type ExerciseListProps = {
  exercises: ExerciseItemType[];
};

const ExerciseList = ({ exercises }: ExerciseListProps) => {
  return (
    <div className="h-100 scrollable overflow-auto">
      {exercises
        ? exercises.map((exercise: ExerciseItemType, i: number) => {
            return (
              <ExerciseItem
                key={"exercise." + i}
                id={"exercise." + i}
                exercise={exercise}
                isFirst={i == 0}
                isLast={i == exercises.length - 1}
              />
            );
          })
        : ""}
    </div>
  );
};

export default ExerciseList;
