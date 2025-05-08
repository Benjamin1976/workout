import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useTimer } from "react-timer-hook";

import { DateTime } from "luxon";
import { getExpiryTime } from "../../utilities/common";
import Icon from "./Icon";

type TimerProps = {
  timerDuration: number;
  timerExpiry?: string;
};

const Timer = ({ timerDuration = 90, timerExpiry }: TimerProps) => {
  const expiryTimestamp: Date = DateTime.local().toJSDate();

  useEffect(() => {
    if (timerExpiry) {
      restartFromExpiry(timerExpiry);
    } else {
      const expiryNew = getExpiryTime(timerDuration);
      restartFromExpiry(expiryNew.toISO()!.toString());
    }
  }, [timerDuration, timerExpiry]);

  const restartTimer = (expiryDuration: number) => {
    const expiryTimestamp = getExpiryTime(expiryDuration);
    restartFromExpiry(expiryTimestamp.toISODate()!.toString());
  };

  const restartFromExpiry = (expiryTimeText: string) => {
    const expiryTimestamp = DateTime.fromISO(expiryTimeText);
    const nowTimestamp = DateTime.local();

    if (expiryTimestamp.isValid && expiryTimestamp > nowTimestamp) {
      localStorage.setItem("expiryTimestamp", expiryTimeText);
      restart(expiryTimestamp.toJSDate());
    }
  };

  const padTimes = (value: number): string =>
    (value.toString().length === 1 ? "0" : "") + value.toString();

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      localStorage.removeItem("expiryTimestamp");
    },
  });

  return (
    <>
      <Col className="col-4 text-center m-0 p-0">
        <Container className="w-100 m-0 p-0">
          <Row>
            <Col className="text-center" style={{ fontSize: "2.5rem" }}>
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
    </>
  );
};

export default Timer;
