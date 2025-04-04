import { Button, Col, Row } from "react-bootstrap";

import useExercise from "../../hooks/useExercise";
import { setFlds, SetItemType } from "../../context/types";

import Icon from "../common/Icon";

import { classNames, getClass, vOrR } from "../../utilities/common";

type SetItemHeaderProps = {
  set: SetItemType;
  id: string;
};

const SetItem = ({ set, id }: SetItemHeaderProps) => {
  const { edit, linkSet, completeSet, deleteSet, updateSet, deletePressed } =
    useExercise();
  const buttonClass = getClass("row", true, set);
  const rowClass = getClass("row", false, set);
  const deleteClass = classNames.buttonClasses.base + " bg-white text-danger";
  const deletePressedOnMe = deletePressed && deletePressed === id;

  return (
    <Row
      className={`${rowClass} border border-1 align-items-center`}
      style={{ fontSize: "0.75rem" }}
    >
      <Col className="col-2 text-center">{set?.no ? set.no : 1}</Col>
      <Col className="col-2 text-center">
        {vOrR(set, setFlds.reps, edit, updateSet, id)}
      </Col>
      <Col className="col-2 text-center">
        {vOrR(set, setFlds.weight, edit, updateSet, id)}
      </Col>
      <Col className="col-2 text-center">
        {vOrR(set, setFlds.unit, edit, updateSet, id)}
      </Col>
      <Col className="col-4 text-end  align-items-center">
        <Button className={buttonClass} onClick={() => completeSet(set, id)}>
          <Icon icon={!set?.completed ? "pending" : "check_circle"} />
        </Button>
        <Button className={buttonClass} onClick={() => linkSet(set, id)}>
          <Icon icon={set?.link ? "link" : "link_off"} />
        </Button>
        <Button
          className={rowClass + (deletePressedOnMe ? deleteClass : buttonClass)}
          onClick={() => deleteSet(id)}
          // onClick={() => deleteSet(set, id)}
        >
          <Icon icon="delete" />
        </Button>
      </Col>
    </Row>
  );
};

export default SetItem;
