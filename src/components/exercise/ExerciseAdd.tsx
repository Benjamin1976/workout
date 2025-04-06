import { useState } from "react";
import {
  Button,
  Col,
  InputGroup,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  OffcanvasTitle,
  Row,
} from "react-bootstrap";

import useExercise from "../../hooks/useExercise";
import {
  ExerciseNameInitialValues,
  ExerciseNameType,
} from "../../context/types";

import ExerciseDropDown from "./ExerciseDropDown";

type NameReturnValue = {
  _id: string;
  name: string;
};

const ExerciseAdd = () => {
  const { add, showAddExercise, addExercise } = useExercise();
  const [exerciseName, setExerciseName] = useState<ExerciseNameType>(
    ExerciseNameInitialValues
  );

  const updateName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    values: NameReturnValue
  ) => {
    e.preventDefault();
    setExerciseName(values);
  };

  return (
    <Offcanvas show={add} onHide={showAddExercise} placement="end">
      <OffcanvasHeader closeButton>
        <OffcanvasTitle>Add Exercise</OffcanvasTitle>
      </OffcanvasHeader>
      <OffcanvasBody>
        <Row>
          <Col>
            <InputGroup>
              <ExerciseDropDown updateName={updateName} />
              <input
                type="text"
                name="name"
                onChange={(e) =>
                  updateName(e, { _id: "new", name: e.target.value })
                }
                value={exerciseName.name}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => addExercise(exerciseName)}>
              Add Exercise
            </Button>
          </Col>
        </Row>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default ExerciseAdd;
