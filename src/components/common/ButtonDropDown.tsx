import { JSX } from "react";
import { Col, Row } from "react-bootstrap";

type ButtonDropDownProps = {
  buttons: () => JSX.Element;
};

const ButtonDropDown = ({ buttons }: ButtonDropDownProps) => {
  return (
    <div
      className="dropdown-menu p-o m-0 g-0 show"
      aria-labelledby="ButtonsDropDown"
    >
      <Row
        className="ms-1 g-0 align-items-baseline"
        aria-label="Dropdown Buttons"
        role="row"
      >
        <Col>{buttons()}</Col>
      </Row>
    </div>
  );
};

export default ButtonDropDown;
