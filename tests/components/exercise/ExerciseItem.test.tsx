import userEvent from "@testing-library/user-event";
import ExerciseItem from "../../../src/components/exercise/ExerciseItem";
import { ExerciseItemType } from "../../../src/context/types";

import { render, screen } from "@testing-library/react";
import { getClass } from "../../../src/utilities/common";
import { getButton, setEdit, spyOneFunction } from "../../utils/commonHelper";
import {
  buttonsBottomInitialState,
  buttonsDropDownInitialState as buttonsDropDown,
  buttonsTopAlternateState,
  buttonsTopInitialState,
  completed,
  completedHeaderClass,
  exerciseInputValues,
  getExerciseInitialValues,
  notCompleted,
  notStarted,
  notStartedHeaderClass,
  setInputValues,
  started,
} from "../../utils/exerciseHelpers";

describe("ExerciseItem", () => {
  // - Test Display Mode to show data
  // - Test Edit Mode for input fields
  // - Test Buttons appear on the page
  // - Test Buttons are clicked when pressed
  // - Test Dropdown Buttons are render when Dropdown button pressed

  const id = "exercise.0";
  let testExercise: ExerciseItemType = getExerciseInitialValues(0);
  let alternateExercise: ExerciseItemType = getExerciseInitialValues(1);

  beforeEach(() => {
    testExercise = getExerciseInitialValues(0);
    alternateExercise = getExerciseInitialValues(1);
    setEdit(false);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (
    exercise: ExerciseItemType = testExercise,
    isFirst: boolean = false,
    isLast: boolean = false
  ) => {
    render(
      <ExerciseItem
        exercise={exercise}
        id={id}
        isFirst={isFirst}
        isLast={isLast}
      />
    );

    const rowClass = getClass("header", false, exercise);

    const user = userEvent.setup();

    const completeButton = getButton("completeExercise", id);

    const checkRowClass = (expectedClass: string) => {
      const exerciseRow = screen.getByRole("row", { name: id });
      expect(exerciseRow).toHaveClass(expectedClass);
    };

    const clickButton = async (id: string, name: string) => {
      const button = getButton(name, id);
      await user.click(button);
    };

    return {
      user,
      checkRowClass,
      rowClass,
      completeButton,
      clickButton,
      clickCompleted: () => user.click(completeButton),
    };
  };

  describe("Display Mode", () => {
    it("should render the Exercise Title", () => {
      renderComponent();

      const exerciseTitle = screen.getByRole("heading", {
        name: /Exercise 1/i,
      });

      expect(exerciseTitle).toBeInTheDocument();
    });

    it.each(exerciseInputValues(testExercise))(
      "should render the exercise readonly text for $fld",
      ({ fld, value }) => {
        renderComponent();

        if (value !== undefined && value !== null) {
          const cellName = [id, fld].join(".");
          const exerciseCell = screen.getByRole("cell", { name: cellName });

          expect(exerciseCell).toHaveTextContent(value);
        }
      }
    );

    it.each(exerciseInputValues(alternateExercise))(
      "should render the alternate exercise readonly text for $fld",
      ({ fld, value }) => {
        renderComponent(alternateExercise);

        if (value !== undefined && value !== null) {
          const cellName = [id, fld].join(".");
          const exerciseCell = screen.getByRole("cell", { name: cellName });

          expect(exerciseCell).toHaveTextContent(value);
        }
      }
    );

    it("should render the set list", () => {
      renderComponent(testExercise, false, false);

      testExercise.sets.forEach((_, idx) => {
        const setRowName = [id, "set", idx].join(".");
        const setRow = screen.getByRole("row", { name: setRowName });
        expect(setRow).toBeInTheDocument();
      });
    });
  });

  describe("Edit Mode", () => {
    it.each(exerciseInputValues(testExercise))(
      "should render the input field for $fld",
      ({ fld, value, hasInput }) => {
        if (!hasInput) return;

        setEdit(true);

        renderComponent();

        const fieldName = [id, fld].join(".");
        const inputField = screen.getByRole("textbox", { name: fieldName });

        if (value !== undefined && value !== null) {
          expect(inputField).toHaveValue(value);
        } else {
          expect(inputField).toHaveValue("");
        }
      }
    );

    it.each(exerciseInputValues(alternateExercise))(
      "should render the input field for $fld",
      ({ fld, value, hasInput }) => {
        if (!hasInput) return;

        setEdit(true);

        renderComponent(alternateExercise);

        const fieldName = [id, fld].join(".");
        const inputField = screen.getByRole("textbox", { name: fieldName });

        if (value !== undefined && value !== null) {
          expect(inputField).toHaveValue(value);
        } else {
          expect(inputField).toHaveValue("");
        }
      }
    );

    it.skip.each(exerciseInputValues(alternateExercise))(
      "should render the alternate exercise readonly text for $fld",
      ({ value }) => {
        renderComponent(alternateExercise);

        if (value !== undefined && value !== null) {
          const textInPage = screen.getAllByText(value!.toString());

          expect(textInPage.length).toBeGreaterThanOrEqual(1);
        }
      }
    );

    it("should render the set list input fields", () => {
      setEdit(true);

      renderComponent(testExercise, false, false);

      const testSet = setInputValues(testExercise.sets[0]);
      testSet.forEach((setItem) => {
        if (setItem.hasInput) {
          const setInputName = [id, "set", 0, setItem.fld].join(".");
          const setInput = screen.getByRole("textbox", { name: setInputName });
          expect(setInput).toBeInTheDocument();
        }
      });
    });
  });

  describe("Button Validation", () => {
    const buttonsInitial = [
      ...buttonsTopInitialState,
      ...buttonsBottomInitialState,
    ];

    it.each(buttonsInitial)(
      "should render the button $title",
      ({ name, icon }) => {
        renderComponent();

        const button = getButton(name, id);

        expect(button).toHaveTextContent(icon);
      }
    );

    it("should render the alternate button icons based on value", () => {
      testExercise.completed = true;
      testExercise.visible = false;
      renderComponent(testExercise);

      buttonsTopAlternateState.forEach(({ name, icon }) => {
        const button = getButton(name, id);

        expect(button).toHaveTextContent(icon);
      });
    });

    it.each(buttonsInitial)(
      "call $name function on clicking $title",
      async ({ name, func }) => {
        testExercise.completed = false;
        testExercise.visible = true;
        spyOneFunction(name, func);
        const { clickButton } = renderComponent(testExercise);

        await clickButton(id, name);

        expect(func).toHaveBeenCalledTimes(1);
      }
    );

    it.each(buttonsDropDown)(
      "renders $title dropdown button menus ",
      async ({ name, buttons }) => {
        const { clickButton } = renderComponent(testExercise);

        await clickButton(id, name);

        buttons.forEach(({ label, icon }) => {
          const buttonInDropDown = getButton(label, id);

          expect(buttonInDropDown).toHaveTextContent(icon);
        });
      }
    );

    it("should disable the up order button if exercise is the first", () => {
      renderComponent(testExercise, true, false);

      const button = getButton("reorderExerciseUp", id);

      expect(button).toBeDisabled();
    });

    it("should disable the down order button if exercise is the first", () => {
      renderComponent(testExercise, false, true);

      const button = getButton("reorderExerciseDown", id);

      expect(button).toBeDisabled();
    });
  });

  describe("Complete function", () => {
    it("should render the exercise with non-green styling on first load", async () => {
      testExercise = {
        ...testExercise,
        ...notStarted,
        ...notCompleted,
        visible: true,
      };

      const { checkRowClass } = renderComponent(testExercise, false, false);

      checkRowClass(notStartedHeaderClass);
    });

    it("should render with green styling if exercise is completed", async () => {
      testExercise = {
        ...testExercise,
        ...started,
        ...completed,
        visible: true,
      };

      const { completeButton, checkRowClass } = renderComponent(
        testExercise,
        false,
        false
      );
      expect(completeButton).toHaveTextContent("check_circle");

      checkRowClass(completedHeaderClass);

      // const { completeExercise } = useExercise();
      // expect(completeExercise).toHaveBeenCalledTimes(1);
    });

    it("should render with non-green styling if exercise is not completed", async () => {
      testExercise = {
        ...testExercise,
        ...notStarted,
        ...notCompleted,
        visible: true,
      };
      const { completeButton, checkRowClass } = renderComponent(
        testExercise,
        false,
        false
      );

      expect(completeButton).toHaveTextContent("pending");

      checkRowClass(notStartedHeaderClass);
      // await clickCompleted();
    });
  });
});
