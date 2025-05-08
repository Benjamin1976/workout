import { Button } from "react-bootstrap";
import useExercise from "../../hooks/useExercise";
import {
  completedButtonClass,
  completedTextClass,
} from "../../utilities/common";
import Icon from "../common/Icon";

const buttonClass = completedButtonClass(false);
const textClass = completedTextClass(false);

// type ExerciseListButtonsType = {
//     allCompleted: boolean;
// }

// export const ExerciseListButtons = ({allCompleted}: ExerciseListButtonsType) => {
export const ExerciseListButtons = () => {
  const {
    totalExercises,
    exercisesCompleted,
    showAddExercise,
    showHideExerciseAll,
    completeExercisesAll,
  } = useExercise();

  const allCompleted = totalExercises === exercisesCompleted;

  return (
    <>
      <Button
        aria-label={"completeExercisesAll"}
        className={buttonClass + textClass}
        onClick={() => completeExercisesAll(!allCompleted)}
      >
        <Icon icon={allCompleted ? "check_circle" : "pending"} />
      </Button>
      <Button
        aria-label={"showAddExercise"}
        className={buttonClass + textClass}
        onClick={() => showAddExercise()}
      >
        <Icon icon={"add"} />
      </Button>
      <Button
        aria-label={"showExerciseAll"}
        className={buttonClass + textClass}
        onClick={() => showHideExerciseAll(true)}
      >
        <Icon icon={"visibility"} />
      </Button>

      <Button
        aria-label={"hideExerciseAll"}
        className={buttonClass + textClass}
        onClick={() => showHideExerciseAll(false)}
      >
        <Icon icon={"visibility_off"} />
      </Button>
    </>
  );
};
