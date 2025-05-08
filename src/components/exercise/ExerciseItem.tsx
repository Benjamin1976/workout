import { Col, Row } from "react-bootstrap";

import { exerciseFlds, ExerciseItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";
import TextInput from "../common/TextInput";
import SetList from "../set/SetList";

import { getClass } from "../../utilities/common";
import ExerciseButtonsBottom from "./ExerciseButtonsBottom";
import ExerciseButtonsTop from "./ExerciseButtonsTop";

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
  const { edit, updateExercise } = useExercise();

  const rowClass = getClass("header", false, exercise);
  const { object, type, supersetNo, comments } = exercise;

  return (
    <>
      <Row
        aria-label={id}
        role="row"
        className={rowClass + " border border-bottom-1 align-items-center"}
      >
        <Col
          className="col-6 px-4 "
          role="cell"
          aria-label={[id, "name"].join(".")}
        >
          <h4>{exercise?.name?.name}</h4>
        </Col>
        <Col className="col-6">
          <Row className="text-end">
            <Col className="col-12">
              <ExerciseButtonsTop
                exercise={exercise}
                id={id}
                isFirst={isFirst}
              />
            </Col>
          </Row>
          <Row className="text-end">
            <Col className="col-12">
              <ExerciseButtonsBottom
                exercise={exercise}
                id={id}
                isLast={isLast}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {exercise?.visible && (
        <>
          <SetList sets={exercise.sets ?? []} id={id} />
          <Row className="m-1 " style={{ fontSize: ".8rem" }}>
            <Col
              className="col-4"
              role="cell"
              aria-label={[id, "object"].join(".")}
            >
              <TextInput
                edit={edit}
                value={object}
                fieldOptions={exerciseFlds.object}
                id={id}
                onchange={updateExercise}
              />
            </Col>
            <Col
              className="col-4"
              role="cell"
              aria-label={[id, "type"].join(".")}
            >
              <TextInput
                edit={edit}
                value={type}
                fieldOptions={exerciseFlds.type}
                id={id}
                onchange={updateExercise}
              />
            </Col>
            <Col
              className="col-4"
              role="cell"
              aria-label={[id, "supersetNo"].join(".")}
            >
              <TextInput
                edit={edit}
                value={supersetNo}
                fieldOptions={exerciseFlds.supersetNo}
                id={id}
                onchange={updateExercise}
              />
            </Col>
          </Row>
          <Row className="m-1" style={{ fontSize: ".8rem" }}>
            <Col
              className="col-12"
              role="cell"
              aria-label={[id, "comments"].join(".")}
            >
              <TextInput
                edit={edit}
                value={comments}
                fieldOptions={exerciseFlds.comments}
                id={id}
                onchange={updateExercise}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ExerciseItem;
