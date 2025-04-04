import { Button, Col, Row } from "react-bootstrap";

import useExercise from "../../hooks/useExercise";
import {
  // sessionFlds,
  SessionItemType,
} from "../../context/types";

import Icon from "../common/Icon";

import {
  agoDateString,
  completedButtonClass,
  completedTextClass,
  // vOrR,
} from "../../utilities/common";
import { DateTime } from "luxon";

type SessionListItemProps = {
  session: Partial<SessionItemType>;
};

const SessionListItem = ({ session }: SessionListItemProps) => {
  const {
    // edit,
    // updateSession,
    openSession,
    cloneSession,
  } = useExercise();

  const buttonClass = completedButtonClass(false);
  const textClass = completedTextClass(false);
  const dateAgoString: string = !session?.date
    ? ""
    : agoDateString(DateTime.fromISO(session.date.toString()));

  return (
    <Row className="border-bottom m-1 p-1 align-items-center">
      <Col className="col-3 small">
        {dateAgoString}
        {/* {!edit
          ? dateAgoString
          // : vOrR(session, sessionFlds.date, edit, updateSession, session?._id)} */}
      </Col>
      <Col className="col-6 small">
        {session.name ?? "Session Name"}
        {/* {vOrR(session, sessionFlds.name, edit, updateSession, session?._id)} */}
      </Col>
      <Col className="col-3">
        <Button
          className={buttonClass + textClass}
          onClick={() => cloneSession(session?._id)}
        >
          <Icon icon={"content_copy"} />
        </Button>
        <Button
          className={buttonClass + textClass}
          onClick={() => openSession(session?._id)}
        >
          <Icon icon={"arrow_forward"} />
        </Button>
      </Col>
    </Row>
  );
};

export default SessionListItem;
