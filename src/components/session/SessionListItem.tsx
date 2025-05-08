import { Button, Col, Row } from "react-bootstrap";

import {
  // sessionFlds,
  SessionItemType,
} from "../../context/types";
import useExercise from "../../hooks/useExercise";

import Icon from "../common/Icon";

import { DateTime } from "luxon";
import {
  agoDateString,
  completedButtonClass,
  completedTextClass,
} from "../../utilities/common";

type SessionListItemProps = {
  session: Partial<SessionItemType>;
};

const SessionListItem = ({ session }: SessionListItemProps) => {
  const { openSession, cloneSession } = useExercise();

  const buttonClass = completedButtonClass(false);
  const textClass = completedTextClass(false);
  // const dateAgoString = !session?.date ? "" : session.date.toString();
  const dateAgoString: string = !session?.date
    ? ""
    : agoDateString(DateTime.fromJSDate(session.date));

  return (
    <Row
      className="border-bottom m-1 p-1 align-items-center"
      role="row"
      aria-label={["SessionListItem", session._id].join(".")}
    >
      <Col className="col-3 small">
        {dateAgoString}
        {/* {!edit
          ? dateAgoString
          // : vOrR(session, sessionFlds.date, edit, updateSession, session?._id)} */}
      </Col>
      <Col className="col-6 small">
        {session?.name || "Session Name"}
        {/* {vOrR(session, sessionFlds.name, edit, updateSession, session?._id)} */}
      </Col>
      <Col className="col-3">
        <Button
          aria-label={[session._id, "cloneSession"].join(" ")}
          className={buttonClass + textClass}
          onClick={() => cloneSession(session?._id)}
        >
          <Icon icon={"content_copy"} />
        </Button>
        <Button
          aria-label={[session._id, "openSession"].join(" ")}
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
