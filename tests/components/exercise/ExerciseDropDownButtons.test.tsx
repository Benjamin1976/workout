import { render } from "@testing-library/react";
import { Button } from "react-bootstrap";
import ButtonDropDown from "../../../src/components/common/ButtonDropDown";
import Icon from "../../../src/components/common/Icon";
import { ExerciseItemType } from "../../../src/context/types";
import { getLabelText } from "../../../src/utilities/common";
import { getButton } from "../../utils/commonHelper";
import { getExerciseInitialValues } from "../../utils/exerciseHelpers";

describe.todo("ExerciseDropDownButtons", () => {
  const id = "exercise.0";
  const renderComponent = () => {
    const addSet = vi.fn();
    const deleteExercise = vi.fn();
    const exercise: ExerciseItemType = getExerciseInitialValues(0);
    const buttonClass = "btn btn-outline-secondary btn-sm";
    const buttonClassDelete = "btn btn-outline-danger btn-sm";
    const deletePressedOnMe = false;

    const buttons = () => {
      const labelText = getLabelText(id);
      return (
        <>
          <Button
            aria-label={[...labelText, "addSet"].join(" ")}
            className={buttonClass + " text-black "}
            onClick={() => addSet(exercise, id)}
          >
            <Icon icon="add" />
          </Button>
          <Button
            aria-label={[...labelText, "deleteSet"].join(" ")}
            className={deletePressedOnMe ? buttonClassDelete : buttonClass}
            onClick={() => deleteExercise(id)}
          >
            <Icon icon="delete" />
          </Button>
        </>
      );
    };

    render(<ButtonDropDown buttons={buttons} />);

    return {
      addButton: getButton(id, "addSet"),
      deleteSet: getButton(id, "deleteSet"),
    };
  };

  it("should render the hamburger button", () => {
    renderComponent();

    const dropdownButton = getButton(id, "buttonsDropDown");

    expect(dropdownButton).toBeInTheDocument();
  });

  it.todo("should render the dropdown menu when clicked", () => {});
  it.todo("should hide the dropdown menu when clicked again", () => {});
  it.todo("should hide the dropdown menu when clicked away", () => {});
  it.todo("should render the buttons on the dropdown menu", () => {});
  it.todo("should render the buttons on the dropdown menu", () => {});
});
