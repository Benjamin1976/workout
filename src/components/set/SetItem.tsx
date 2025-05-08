import { Button, Col, Row } from "react-bootstrap";

import { setFlds, SetItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";

import Icon from "../common/Icon";

import { classNames, getClass, getLabelText } from "../../utilities/common";
import TextInput from "../common/TextInput";

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
  const labelText = getLabelText(id);

  return (
    <Row
      role="row"
      aria-label={id}
      className={`${rowClass} border border-1 align-items-center`}
      style={{ fontSize: "0.75rem" }}
    >
      <Col
        className="col-2 text-center"
        role="cell"
        aria-label={[id, "no"].join(".")}
      >
        {set?.no ? set.no : 1}
      </Col>
      <Col
        className="col-2 text-center"
        role="cell"
        aria-label={[id, "reps"].join(".")}
      >
        <TextInput
          value={set.reps}
          fieldOptions={setFlds.reps}
          edit={edit}
          onchange={updateSet}
          id={id}
        />
      </Col>
      <Col
        className="col-2 text-center"
        role="cell"
        aria-label={[id, "weight"].join(".")}
      >
        <TextInput
          value={set.weight}
          fieldOptions={setFlds.weight}
          edit={edit}
          onchange={updateSet}
          id={id}
        />
      </Col>
      <Col
        className="col-2 text-center"
        role="cell"
        aria-label={[id, "unit"].join(".")}
      >
        <TextInput
          value={set.unit}
          fieldOptions={setFlds.unit}
          edit={edit}
          onchange={updateSet}
          id={id}
        />
      </Col>
      <Col className="col ps-0 ms-0 text-end">
        <Button
          name="completeSet"
          aria-label={[...labelText, "completeSet"].join(" ")}
          className={buttonClass}
          onClick={() => completeSet(set, id)}
        >
          <Icon icon={!set?.completed ? "pending" : "check_circle"} />
        </Button>
        <Button
          name="linkSet"
          aria-label={[...labelText, "linkSet"].join(" ")}
          className={buttonClass}
          onClick={() => linkSet(set, id)}
        >
          <Icon icon={set.link ? "link" : "link_off"} />
        </Button>

        <Button
          name="deleteSet"
          aria-label={[...labelText, "deleteSet"].join(" ")}
          className={rowClass + (deletePressedOnMe ? deleteClass : buttonClass)}
          onClick={() => deleteSet(id)}
        >
          <Icon icon="delete" />
        </Button>
      </Col>
    </Row>
  );
};

export default SetItem;
