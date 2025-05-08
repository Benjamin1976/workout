import { JSX, useState } from "react";
import { Button } from "react-bootstrap";
import { ExerciseItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";
import { classNames, getLabelText } from "../../utilities/common";
import ButtonDropDown from "../common/ButtonDropDown";
import Icon from "../common/Icon";

type DropDownWrapperProps = {
  id: string;
  buttonClass: string;
  exercise: ExerciseItemType;
};

export const DropDownWrapper = ({
  id,
  exercise,
  buttonClass,
}: DropDownWrapperProps) => {
  const { deletePressed, deleteExercise, addSet } = useExercise();

  const [dropDownVisible, setDropDownVisible] = useState(false);

  const labelText = getLabelText(id);

  const buttons = (): JSX.Element => {
    const buttonClass = classNames.buttonClasses.base + " bg-white text-black ";
    const buttonClassDelete =
      classNames.buttonClasses.base + " bg-white text-danger ";

    const deletePressedOnMe = deletePressed && deletePressed === id;

    return (
      <>
        <Button
          aria-label={[...labelText, "add"].join(" ")}
          type="button"
          className={buttonClass + " text-black "}
          onClick={() => addSet(exercise, id)}
        >
          <Icon icon="add" />
        </Button>
        <Button
          aria-label={[...labelText, "deleteExercise"].join(" ")}
          className={deletePressedOnMe ? buttonClassDelete : buttonClass}
          onClick={() => deleteExercise(id)}
        >
          <Icon icon="delete" />
        </Button>
      </>
    );
  };

  return (
    <span className="dropdown">
      <Button
        role="button"
        aria-label={[...labelText, "buttonsDropDown"].join(" ")}
        className={buttonClass}
        // id="ButtonsDropDown"
        // data-bs-toggle="dropdown"
        // aria-expanded="false"
        onClick={() => setDropDownVisible(!dropDownVisible)}
        onBlur={() => setDropDownVisible(false)}
      >
        <Icon icon={"menu"} />
      </Button>
      {dropDownVisible && <ButtonDropDown buttons={buttons} />}
    </span>
  );

  // return (
  //   <span className="dropdown">
  //     <Button
  //       name="emojiDropDown"
  //       className={buttonClass}
  //       id="EmojiDropDown"
  //       onClick={() => setDropDownVisible(!dropDownVisible)}
  //       onBlur={() => setDropDownVisible(false)}
  //     >
  //       {rating && rating > 0 ? (
  //         <Emoji
  //           symbol={getEmojiIcon(rating)}
  //           label={`toughness was ${rating}`}
  //         />
  //       ) : (
  //         <Icon icon={"thumb_up"} />
  //       )}
  //     </Button>
  //     {dropDownVisible && (
  //       <EmojiDropDown key={id + "-emoji-dropdown"} id={id} />
  //     )}
  //   </span>
  // );
};
