import { Button } from "react-bootstrap";
import { ExerciseItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";
import { getClass, getLabelText } from "../../utilities/common";
import Icon from "../common/Icon";
import { DropDownWrapper } from "./DropDownWrapper";
import { EmojiDropDownWrapper } from "./EmojiDropDownWrapper";

type ExerciseButtonsBottomProps = {
  exercise: ExerciseItemType;
  id: string;
  isLast: boolean;
};

const ExerciseButtonsBottom = ({
  exercise,
  id,
  isLast,
}: ExerciseButtonsBottomProps) => {
  const { linkExercise, reorderExercise } = useExercise();

  const buttonClass = getClass("header", true, exercise);
  const labelText = getLabelText(id);

  return (
    <>
      <EmojiDropDownWrapper
        id={id}
        buttonClass={buttonClass}
        rating={exercise?.rating ?? 0}
      />
      <Button
        aria-label={[...labelText, "reorderExerciseDown"].join(" ")}
        className={buttonClass}
        disabled={isLast}
        onClick={() => reorderExercise(id, "down")}
      >
        <Icon icon={"arrow_downward"} />
      </Button>
      <Button
        aria-label={[...labelText, "unlinkExercise"].join(" ")}
        className={buttonClass}
        onClick={() => linkExercise(exercise, id, false)}
      >
        <Icon icon={"link_off"} />
      </Button>

      <DropDownWrapper id={id} buttonClass={buttonClass} exercise={exercise} />
    </>
  );
};

export default ExerciseButtonsBottom;
