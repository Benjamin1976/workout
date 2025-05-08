import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "react-bootstrap";
import ButtonDropDown from "../../../src/components/common/ButtonDropDown";
import Icon from "../../../src/components/common/Icon";
import { ExerciseItemType } from "../../../src/context/types";
import { getLabelText } from "../../../src/utilities/common";
import { getButton } from "../../utils/commonHelper";
import { getExerciseInitialValues } from "../../utils/exerciseHelpers";

// testing the buttons as they confirm the dropdown menu is visible
describe("ButtonDropDown", () => {
  const addSet = vi.fn();
  const deleteExercise = vi.fn();

  const id = "exercise.0";
  const labelText = getLabelText(id);

  const exercise: ExerciseItemType = getExerciseInitialValues(0);

  const buttonClass = "btn btn-outline-secondary btn-sm";
  const buttonClassDelete = "btn btn-outline-danger btn-sm";

  const renderComponent = (deletePressedOnMe: boolean = false) => {
    // const deletePressedOnMe = false;
    const user = userEvent.setup();

    const buttons = () => {
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
      user,
      addButton: getButton("addSet", id),
      deleteButton: getButton("deleteSet", id),
    };
  };

  it("should render the dropdown menu", () => {
    renderComponent();

    const menuRow = screen.getByRole("row", { name: /dropdown/i });
    expect(menuRow).toBeInTheDocument();
  });

  it("should render the add buttons", () => {
    const { addButton } = renderComponent();
    const iconName = "add";

    expect(addButton).toBeInTheDocument();
    expect(addButton.textContent).toBe(iconName);
  });

  it("should call the add function when pressed", async () => {
    const { user, addButton } = renderComponent();

    await user.click(addButton);
    expect(addSet).toHaveBeenCalledWith(exercise, id);
  });

  it("should render the delete buttons", () => {
    const { deleteButton } = renderComponent();
    const iconName = "delete";

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.textContent).toBe(iconName);
    expect(deleteButton.className).toBe(buttonClass + " btn btn-primary");
  });

  it("should call the delete function when pressed", async () => {
    const { user, deleteButton } = renderComponent();

    await user.click(deleteButton);
    expect(deleteExercise).toHaveBeenCalledWith(id);
  });

  it("should render the with red styling on pressed", () => {
    const { deleteButton } = renderComponent(true);

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.className).toBe(buttonClassDelete + " btn btn-primary");
  });
});
