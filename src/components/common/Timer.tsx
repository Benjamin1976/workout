import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useTimer } from "react-timer-hook";

import useExercise from "../../hooks/useExercise";
import { ExerciseItemType, SetItemType } from "../../context/types";

import { getNowTime } from "../../utilities/common";

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
    currentSession,
    currentExercise,
  } = useExercise();
  const exercises: ExerciseItemType[] = currentSession?.exercises ?? [];

  useEffect(() => {
    if (localStorage.getItem("expiryTimestamp")) {
      restartFromStorage();
    }
  }, [timerDuration]);

  const restartTimer = (expiryDuration: number) => {
    let expiryTimestamp = getExpiryTime(expiryDuration);
    localStorage.setItem("expiryTimestamp", expiryTimestamp.toString());
    restart(expiryTimestamp);
  };

  const restartFromStorage = () => {
    let expiryTimeText = localStorage.getItem("expiryTimestamp");
    if (!expiryTimeText) return;

    let expiryTimestamp = parseInt(expiryTimeText);
    let nowTimestamp = getNowTime();

    if (expiryTimestamp > nowTimestamp) {
      restart(new Date(expiryTimestamp));
    }
  };

  const startTheSet = () => {
    startSet(set, setId);
    restart(getExpiryTime(timerDuration));
  };

  const completeTheSet = () => {
    completeSet(set, setId);
    if (currentExercise && set) {
      findNextSet(exercises, currentExercise.id, set.id);
      restart(getExpiryTime(timerDuration));
    }
  };

  const getExpiryTime = (timeDefault = 90): Date => {
    let time = new Date();
    time.setSeconds(time.getSeconds() + timeDefault);
    return time;
  };

  const padTimes = (value: number): string =>
    (value.toString().length === 1 ? "0" : "") + value.toString();

  let expiryTimestamp = getExpiryTime(timerDuration);

  const {
    seconds,
    minutes,
    // isRunning,
    // start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      localStorage.removeItem("expiryTimestamp");
      console.warn("onExpire called");
    },
  });

  return (
    <>
      <Container className="p-1 m-1">
        <Row>
          <Col className="text-center">
            <Button className="btn btn-sm  " onClick={() => startTheSet()}>
              Start
            </Button>
          </Col>
          <Col className="text-center h1">
            {padTimes(minutes)}:{padTimes(seconds)}
          </Col>
          <Col className="text-center">
            <Button
              className="btn btn-sm btn-primary"
              onClick={() => completeTheSet()}
            >
              Finish
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Button className="btn btn-sm" onClick={() => pause()}>
              Pause
            </Button>
            <Button className="btn btn-sm" onClick={() => resume()}>
              Resume
            </Button>
            <Button
              className="btn btn-sm"
              onClick={() => restartTimer(timerDuration)}
            >
              Restart
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Timer;
