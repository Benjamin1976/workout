import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import useExercise from "../../hooks/useExercise";
import { ExerciseItemType, SetItemType } from "../../context/types";

import SetItem from "../set/SetItem";
import Timer from "../common/Timer";
import Spinner from "../common/Spinner";

type ExerciseHighlightProps = {
  exercisesCompleted: boolean;
};

const ExerciseHighlight = ({ exercisesCompleted }: ExerciseHighlightProps) => {
  const { currentSession, currentExercise, currentSet, findNextSet } =
    useExercise();
  const exercises = currentSession?.exercises ?? [];
  const bgColor = exercisesCompleted ? "success" : "warning";
  const textColor = exercisesCompleted ? "white" : "black";

  useEffect(() => {
    if (!currentExercise) {
      findNextSet(exercises, 0, 0);
    }
  }, [currentExercise, currentSet]);

  if (exercisesCompleted)
    return (
      <div className={`border border-2 border-${bgColor} px-2 mb-2`}>
        <Row className={`bg-${bgColor} p-0 text-${textColor}`}>
          <Col className="py-1 mt-1 h6 text-center">
            {"All Exercises Completed"}
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3 mt-1">
            <span
              className="material-symbols-outlined text-success"
              style={{ fontSize: "5em" }}
            >
              {"task_alt"}
            </span>
          </Col>
        </Row>
      </div>
    );

  if (!currentExercise || !currentSet)
    return (
      <div className={`border border-2 border-${bgColor} px-2 mb-2`}>
        <Row className={`bg-${bgColor} p-0 text-${textColor}`}>
          <Col className="py-1 mt-1 h6 text-center">&nbsp;</Col>
        </Row>
        <Row>
          <Col>
            <Spinner />
          </Col>
        </Row>
        <Row>&nbsp;</Row>
      </div>
    );

  const createSetId = (e: ExerciseItemType, s: SetItemType): string => {
    if (!e || !s) return "";
    return ["exercise", e.order, "set", s.order].join(".");
  };
  const setId = createSetId(currentExercise, currentSet);

  return (
    <div className={`border border-2 border-${bgColor} px-2 mb-2`}>
      <Row className={`bg-${bgColor} p-0 text-${textColor}`}>
        <Col className="py-1 mt-1 h6 text-center">
          {currentExercise?.name?.name ?? "Name"}
        </Col>
      </Row>
      <Row>
        <Col>
          <SetItem set={currentSet} id={setId} />
        </Col>
      </Row>
      <Row>
        <Timer timerDuration={90} set={currentSet} setId={setId} />
      </Row>
    </div>
  );
};

export default ExerciseHighlight;
