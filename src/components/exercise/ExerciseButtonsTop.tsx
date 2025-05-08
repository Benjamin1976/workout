import { Button } from "react-bootstrap";
import { ExerciseItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";
import { getClass, getLabelText } from "../../utilities/common";
import Icon from "../common/Icon";

type ExerciseButtonsTopPros = {
  exercise: ExerciseItemType;
  id: string;
  isFirst: boolean;
};

const ExerciseButtonsTop = ({
  exercise,
  id,
  isFirst,
}: ExerciseButtonsTopPros) => {
  const { completeExercise, linkExercise, reorderExercise, showHideExercise } =
    useExercise();

  const buttonClass = getClass("header", true, exercise);
  const labelText = getLabelText(id);

  return (
    <>
      <Button
        className={buttonClass}
        onClick={() => completeExercise(exercise, id)}
        aria-label={[...labelText, "completeExercise"].join(" ")}
      >
        <Icon icon={exercise?.completed ? "check_circle" : "pending"} />
      </Button>
      <Button
        aria-label={[...labelText, "reorderExerciseUp"].join(" ")}
        className={buttonClass}
        disabled={isFirst}
        onClick={() => reorderExercise(id, "up")}
      >
        <Icon icon={"arrow_upward"} />
      </Button>
      <Button
        aria-label={[...labelText, "linkExercise"].join(" ")}
        type="button"
        name="linkExercise"
        className={buttonClass}
        onClick={() => linkExercise(exercise, id, true)}
      >
        <Icon icon={"link"} />
      </Button>
      <Button
        aria-label={[...labelText, "showHideExercise"].join(" ")}
        name="showHideExercise"
        className={buttonClass}
        onClick={() => showHideExercise(exercise, id)}
      >
        <Icon icon={!exercise?.visible ? "visibility" : "visibility_off"} />
      </Button>
    </>
  );
};

export default ExerciseButtonsTop;
