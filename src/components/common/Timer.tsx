import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useTimer } from "react-timer-hook";

import { ExerciseItemType, SetItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";

import { DateTime } from "luxon";
import { getExpiryTime } from "../../utilities/common";
import Icon from "./Icon";

type TimerProps = {
  timerDuration: number;
  set: SetItemType;
  setId: string;
};

const Timer = ({ timerDuration = 90, set, setId }: TimerProps) => {
  const {
    startSet,
    completeSet,
    findNextSet,
    timerExpiry,
    currentSession,
    currentExercise,
  } = useExercise();

  const exercises: ExerciseItemType[] = currentSession?.exercises ?? [];
  const expiryTimestamp: Date = DateTime.local().toJSDate();

  useEffect(() => {
    const expiryFromStorage = localStorage.getItem("expiryTimestamp");
    if (timerExpiry) {
      restartFromExpiry(timerExpiry);
    } else if (expiryFromStorage) {
      restartFromExpiry(expiryFromStorage);
    } else {
      const expiryNew = getExpiryTime(timerDuration);
      restartFromExpiry(expiryNew.toISO()!.toString());
    }
  }, [timerDuration, timerExpiry]);

  const restartFromExpiry = (expiryTimeText: string) => {
    const expiryTimestamp = DateTime.fromISO(expiryTimeText);
    const nowTimestamp = DateTime.local();

    if (expiryTimestamp.isValid && expiryTimestamp > nowTimestamp) {
      localStorage.setItem(
        "expiryTimestamp",
        expiryTimestamp.toISO().toString()
      );
      restart(expiryTimestamp.toJSDate());
    }
  };

  const restartTimer = (expiryDuration: number) => {
    const expiryTimestamp = getExpiryTime(expiryDuration);
    localStorage.setItem("expiryTimestamp", expiryTimestamp.toString());
    restart(expiryTimestamp.toJSDate());
  };

  const startTheSet = () => {
    startSet(set, setId);
    restartTimer(timerDuration);
  };

  const completeTheSet = () => {
    completeSet(set, setId);
    if (currentExercise && set) {
      findNextSet(exercises, currentExercise.id, set.id);
      restartTimer(timerDuration);
    }
  };

  const padTimes = (value: number): string =>
    (value.toString().length === 1 ? "0" : "") + value.toString();

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      localStorage.removeItem("expiryTimestamp");
      // console.warn("onExpire called");
    },
  });

  return (
    <>
      <Container className="p-1 m-1">
        <Row className="m-0 p-0 align-items-middle">
          <Col className="col-4 text-end">
            <button className="btn btn-sm  h-100 w-100" onClick={startTheSet}>
              Start
            </button>
          </Col>
          <Col className="col-4 text-center m-0 p-0">
            <Container className="w-100 m-0 p-0">
              <Row>
                <Col
                  role="cell"
                  aria-label="Timer"
                  className="text-center"
                  style={{ fontSize: "2.5rem" }}
                >
                  {padTimes(minutes)}:{padTimes(seconds)}
                </Col>
              </Row>
              <Row className="text-center">
                <Col>
                  <Button className="btn btn-sm" onClick={() => pause()}>
                    <Icon icon="pause" />
                  </Button>
                  <Button className="btn btn-sm" onClick={() => resume()}>
                    <Icon icon="play_arrow" />
                  </Button>
                  <Button
                    className="btn btn-sm"
                    onClick={() => restartTimer(timerDuration)}
                  >
                    <Icon icon="refresh" />
                  </Button>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col className="col-4 text-center">
            <Button
              className="btn btn-sm btn-primary h-100 w-100"
              onClick={() => completeTheSet()}
            >
              Finish
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Timer;
