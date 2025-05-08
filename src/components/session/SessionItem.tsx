import { Col, Container, Row } from "react-bootstrap";
import { sessionFlds, SessionItemType } from "../../context/types";

import useExercise from "../../hooks/useExercise";

import ExerciseAdd from "../exercise/ExerciseAdd";
import ExerciseHighlight from "../exercise/ExerciseHighlight";
import ExerciseList from "../exercise/ExerciseList";

import { useEffect } from "react";
import DateInput from "../common/DateInput";
import TextInput from "../common/TextInput";
import { ExerciseListButtons } from "./ExerciseListButtons";
import { SessionButtons } from "./SessionItemButtons";

type SessionItemHeaderProps = {
  session: SessionItemType;
};

const SessionItem = ({ session }: SessionItemHeaderProps) => {
  const {
    edit,
    timerVisible,
    totalExercises,
    exercisesCompleted,
    updateSession,
    showTimer,
  } = useExercise();

  useEffect(() => {
    showTimer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allCompleted = totalExercises === exercisesCompleted;

  return (
    <>
      <Container className="container-fluid">
        <Row role="row" aria-label={["SessionItem", session._id].join(".")}>
          <Col className="col-12 p-0 m-0">
            <div className="d-flex flex-column vh-100 overflow-hidden">
              <Row className="align-items-center mb-1 pe-1">
                <Col
                  className="col-3"
                  role="cell"
                  aria-label={[session._id, "date"].join(".")}
                >
                  <DateInput
                    edit={edit}
                    value={session.date.toString()}
                    fieldOptions={sessionFlds.date}
                    id={session._id}
                    onchange={updateSession}
                  />
                </Col>
                <Col
                  className="col-5"
                  role="cell"
                  aria-label={[session._id, "name"].join(".")}
                >
                  <TextInput
                    edit={edit}
                    value={session.name}
                    fieldOptions={sessionFlds.name}
                    id={session._id}
                    onchange={updateSession}
                  />{" "}
                  {!edit && <span>({totalExercises})</span>}
                </Col>
                <Col className="col-4 text-end">
                  <SessionButtons session={session} />
                </Col>
              </Row>
              {timerVisible === undefined ||
              timerVisible === null ||
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
                  <ExerciseListButtons />
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
