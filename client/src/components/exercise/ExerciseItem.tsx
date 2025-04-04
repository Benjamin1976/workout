import { JSX } from "react";
import { Button, Col, Row } from "react-bootstrap";

import { exerciseFlds, ExerciseItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";

import SetList from "../set/SetList";
import Icon from "../common/Icon";
import Emoji from "../common/Emoji";
import EmojiDropDown from "../common/EmojiDropDown";
import ButtonDropDown from "../common/ButtonDropDown";

import {
  classNames,
  getClass,
  getEmojiIcon,
  vOrR,
} from "../../utilities/common";

type ExerciseItemHeaderProps = {
  exercise: ExerciseItemType;
  id: string;
  isFirst: boolean;
  isLast: boolean;
};

const ExerciseItem = ({
  exercise,
  id,
  isFirst,
  isLast,
}: ExerciseItemHeaderProps) => {
  const {
    edit,
    deletePressed,
    addSet,
    updateExercise,
    deleteExercise,
    completeExercise,
    linkExercise,
    reorderExercise,
    showHideExercise,
  } = useExercise();

  const deletePressedOnMe = deletePressed && deletePressed === id;
  const rowClass = getClass("header", false, exercise);
  const buttonClass = getClass("header", true, exercise);

  const buttons = (): JSX.Element => {
    const buttonClass = classNames.buttonClasses.base + " bg-white text-black ";
    const buttonClassDelete =
      classNames.buttonClasses.base + " bg-white text-danger ";

    return (
      <>
        <Button
          className={buttonClass + " text-black "}
          onClick={() => addSet(exercise, id)}
        >
          <Icon icon="add" />
        </Button>
        <Button
          className={deletePressedOnMe ? buttonClassDelete : buttonClass}
          onClick={() => deleteExercise(id)}
        >
          <Icon icon="delete" />
        </Button>
      </>
    );
  };

  return (
    <>
      <Row className={rowClass + " border border-bottom-1 align-items-center"}>
        <Col className="col-7 px-4">
          <h4>{exercise?.name?.name}</h4>
          {/* <h4>{vOrR(exercise, exerciseFlds.name, edit, updateExercise, id)}</h4> */}
        </Col>
        <Col className="col-5">
          <Row className="text-end">
            <Col className="col-12">
              <Button
                className={buttonClass}
                onClick={() => completeExercise(exercise, id)}
              >
                <Icon icon={exercise?.completed ? "check_circle" : "pending"} />
              </Button>
              <Button
                className={buttonClass}
                disabled={isFirst}
                onClick={() => reorderExercise(id, "up")}
              >
                <Icon icon={"arrow_upward"} />
              </Button>
              <Button
                className={buttonClass}
                onClick={() => linkExercise(exercise, id, true)}
              >
                <Icon icon={"link"} />
              </Button>
              <Button
                className={buttonClass}
                onClick={() => showHideExercise(exercise, id)}
              >
                <Icon
                  icon={!exercise?.visible ? "visibility" : "visibility_off"}
                />
              </Button>
            </Col>
          </Row>
          <Row className="text-end">
            <Col className="col-12">
              <span className="dropdown">
                <Button
                  className={buttonClass}
                  id="EmojiDropDown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {exercise?.rating && exercise?.rating > 0 ? (
                    <Emoji
                      symbol={getEmojiIcon(exercise.rating)}
                      label={`toughness was ${exercise.rating}`}
                    />
                  ) : (
                    <Icon icon={"thumb_up"} />
                  )}
                </Button>
                <EmojiDropDown key={id + "-emoji-dropdown"} id={id} />
              </span>
              <Button
                className={buttonClass}
                disabled={isLast}
                onClick={() => reorderExercise(id, "down")}
              >
                <Icon icon={"arrow_downward"} />
              </Button>
              <Button
                className={buttonClass}
                onClick={() => linkExercise(exercise, id, false)}
              >
                <Icon icon={"link_off"} />
              </Button>
              <span className="dropdown">
                <Button
                  className={buttonClass}
                  id="ButtonsDropDown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Icon icon={"menu"} />
                </Button>
                <ButtonDropDown buttons={buttons} />
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      {exercise?.visible && (
        <>
          <SetList sets={exercise.sets ?? []} id={id} />
          <Row className="m-1 " style={{ fontSize: ".8rem" }}>
            <Col className="col-4">
              {vOrR(exercise, exerciseFlds.object, edit, updateExercise, id)}
            </Col>
            <Col className="col-4">
              {vOrR(exercise, exerciseFlds.type, edit, updateExercise, id)}
            </Col>
            <Col className="col-4">
              {vOrR(
                exercise,
                exerciseFlds.supersetNo,
                edit,
                updateExercise,
                id
              )}
            </Col>
          </Row>
          <Row className="m-1" style={{ fontSize: ".8rem" }}>
            <Col className="col-12">
              {vOrR(exercise, exerciseFlds.comments, edit, updateExercise, id)}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ExerciseItem;
