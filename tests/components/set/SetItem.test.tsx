import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SetItem from "../../../src/components/set/SetItem";
import { SetItemType } from "../../../src/context/types";
import { getButton, setEdit, spyOneFunction } from "../../utils/commonHelper";
import {
  completed,
  getSetInitialValues,
  notCompleted,
  setButtonsAlternateState,
  setButtonsInitialState,
  //   mockExerciseProvider,
  setInputValues,
} from "../../utils/exerciseHelpers";

describe("SetItem", () => {
  let id: string = "exercise.0.set.0";
  let testSet: SetItemType = getSetInitialValues(0);

  beforeEach(() => {
    id = "exercise.0.set.0";
    testSet = getSetInitialValues(0);
    setEdit(false);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (id: string, set: SetItemType) => {
    render(<SetItem set={set} id={id} />);

    const getInputOrCell = (id: string, fld: string, type: string) => {
      const rowName = [id, fld].join(".");
      const setRow = screen.getByRole(type, { name: rowName });
      return setRow;
    };

    const user = userEvent.setup();

    const clickButton = async (id: string, name: string) => {
      const button = getButton(name, id);
      await user.click(button);
    };

    return {
      clickButton,
      getInputOrCell,
    };
  };

  it("should render the set row", () => {
    renderComponent(id, testSet);

    const setRow = screen.getByRole("row", { name: id });

    expect(setRow).toBeInTheDocument();
  });

  it.each(setInputValues(testSet))(
    "should render the $fld value in display mode",
    ({ fld, value }) => {
      const { getInputOrCell } = renderComponent(id, testSet);

      const setRow = getInputOrCell(id, fld, "cell");

      expect(setRow).toHaveTextContent(value.toString());
    }
  );

  it.each(setInputValues(testSet))(
    "should render the $fld input field value in display mode",
    ({ fld, value, hasInput }) => {
      if (!hasInput) return;
      setEdit(true);
      const { getInputOrCell } = renderComponent(id, testSet);

      const setInput = getInputOrCell(id, fld, "textbox");

      expect(setInput).toHaveValue(value.toString());
    }
  );

  it.each(setButtonsInitialState)(
    "should render the button $title with $icon",
    ({ name, icon }) => {
      testSet = { ...testSet, ...notCompleted };
      testSet.link = true;
      renderComponent(id, testSet);

      const button = getButton(name, id);

      expect(button).toHaveTextContent(icon);
    }
  );

  it.each(setButtonsAlternateState)(
    "should render the alternate button $title with $icon",
    ({ name, icon }) => {
      testSet = { ...testSet, ...completed };
      testSet.link = false;
      renderComponent(id, testSet);

      const button = getButton(name, id);

      expect(button).toHaveTextContent(icon);
    }
  );

  it.each(setButtonsInitialState)(
    "calls $name function when clicking $title",
    async ({ name, func }) => {
      testSet.completed = false;
      testSet.link = false;
      spyOneFunction(name, func);
      const { clickButton } = renderComponent(id, testSet);

      await clickButton(id, name);

      expect(func).toHaveBeenCalledTimes(1);
    }
  );

  it.todo.each(setButtonsAlternateState)(
    "calls $name function when clicking $title",
    async ({ name, func }) => {
      testSet.completed = true;
      testSet.link = true;
      spyOneFunction(name, func);
      const { clickButton } = renderComponent(id, testSet);

      await clickButton(id, name);

      expect(func).toHaveBeenCalledTimes(1);
    }
  );
});
