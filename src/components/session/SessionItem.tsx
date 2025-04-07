import { Button, Col, Container, Row } from "react-bootstrap";
import { sessionFlds, SessionItemType } from "../../context/types";

import useExercise from "../../hooks/useExercise";

import ExerciseList from "../exercise/ExerciseList";
import ExerciseHighlight from "../exercise/ExerciseHighlight";
import ExerciseAdd from "../exercise/ExerciseAdd";
import Icon from "../common/Icon";

import {
  completedButtonClass,
  completedTextClass,
  vOrR,
} from "../../utilities/common";
import { useEffect } from "react";

type SessionItemHeaderProps = {
  session: SessionItemType;
};

const SessionItem = ({ session }: SessionItemHeaderProps) => {
  const {
    edit,
    timerVisible,
    totalExercises,
    exercisesCompleted,
    showAddExercise,
    editSession,
    updateSession,
    saveCurrentSession,
    closeSession,
    showTimer,
    showHideExerciseAll,
    completeExercisesAll,
  } = useExercise();

  useEffect(() => {
    showTimer(true);
  }, []);

  const allCompleted = totalExercises === exercisesCompleted;
  const buttonClass = completedButtonClass(false);
  const textClass = completedTextClass(false);

  return (
    <>
      <Container className="container-fluid">
        <Row>
          <Col className="col-12 p-0 m-0">
            <div className="d-flex flex-column vh-100 overflow-hidden">
              <Row className="align-items-center mb-1 pe-1">
                <Col className="col-3">
                  {vOrR(
                    session,
                    sessionFlds.date,
                    edit,
                    updateSession,
                    session._id
                  )}
                </Col>
                <Col className="col-5">
                  {vOrR(
                    session,
                    sessionFlds.name,
                    edit,
                    updateSession,
                    session._id
                  )}{" "}
                  {!edit && <span>({totalExercises})</span>}
                </Col>
                <Col className="col-4 text-end">
                  <Button
                    className={buttonClass + textClass}
                    onClick={() => showTimer()}
                  >
                    <Icon icon={"fitness_center"} />
                  </Button>
                  {edit && (
                    <Button
                      className={buttonClass + textClass}
                      onClick={() => saveCurrentSession(session)}
                    >
                      <Icon icon={"save"} />
                    </Button>
                  )}
                  <Button
                    className={buttonClass + textClass}
                    onClick={() => editSession()}
                  >
                    <Icon icon={!edit ? "edit" : "close"} />
                  </Button>
                  <Button
                    className={buttonClass + textClass}
                    onClick={() => closeSession()}
                  >
                    <Icon icon={"arrow_back"} />
                  </Button>
                </Col>
              </Row>
              {timerVisible === undefined ||
              timerVisible === undefined ||
              !timerVisible ? (
                ""
              ) : (
                <ExerciseHighlight exercisesCompleted={allCompleted} />
              )}
              <Row
                className="align-items-middle p-1 my-0"
                // className="border border-1 align-items-middle p-1 my-0"
              >
                <Col className="col-6 h6" style={{ fontSize: "1.3rem" }}>
                  Exercises
                </Col>
                <Col className="col-6 text-end" style={{ fontWeight: "bold" }}>
                  <Button
                    className={buttonClass + textClass}
                    onClick={() => completeExercisesAll(!allCompleted)}
                  >
                    <Icon icon={allCompleted ? "check_circle" : "pending"} />
                  </Button>
                  <Button
                    className={buttonClass + textClass}
                    onClick={() => showAddExercise()}
                  >
                    <Icon icon={"add"} />
                  </Button>
                  <Button
                    className={buttonClass + textClass}
                    onClick={() => showHideExerciseAll(true)}
                  >
                    <Icon icon={"visibility"} />
                  </Button>

                  <Button
                    className={buttonClass + textClass}
                    onClick={() => showHideExerciseAll(false)}
                  >
                    <Icon icon={"visibility_off"} />
                  </Button>
                </Col>
              </Row>
              <div className="h-100 scrollable overflow-auto">
                <ExerciseList exercises={session.exercises} />
              </div>
            </div>
          </Col>
        </Row>
        <ExerciseAdd />
      </Container>
    </>
  );
};

export default SessionItem;
