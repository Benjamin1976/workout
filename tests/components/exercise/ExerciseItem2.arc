import userEvent from "@testing-library/user-event";
import ExerciseItem from "../../../src/components/exercise/ExerciseItem";
import { ExerciseItemType } from "../../../src/context/types";

import { render, screen } from "@testing-library/react";
import * as ExerciseContextModule from "../../../src/hooks/useExercise";
import { getClass } from "../../../src/utilities/common";
import {
  buttonsBottomInitialState,
  buttonsDropDownInitialState as buttonsDropDown,
  buttonsTopAlternateState,
  buttonsTopInitialState,
  completed,
  completedRowClass,
  getExerciseInitialValues,
  mockExerciseProvider,
  notCompleted,
  notCompletedHeaderClass,
  notCompletedRowClass,
  notStarted,
  started,
  textInputValues,
} from "../../utils/exerciseHelpers";

describe("ExerciseItem", () => {
  // - Test Display Mode to show data
  // - Test Edit Mode for input fields
  // - Test Buttons appear on the page
  // - Test Buttons are clicked when pressed
  // - Test Dropdown Buttons are render when Dropdown button pressed

  const id = "exercise.0";
  let testExercise: ExerciseItemType = getExerciseInitialValues(0);
  beforeAll(() => {
    testExercise = getExerciseInitialValues(0);
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

    return {
      user: userEvent.setup(),
      rowClass,
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

    it.each(textInputValues(testExercise))(
      "should render the exercise readonly text for $fld",
      ({ value }) => {
        renderComponent();

        if (value !== undefined && value !== null) {
          const textInPage = screen.getAllByText(value!.toString());

          expect(textInPage.length).toBeGreaterThanOrEqual(1);
        }
      }
    );

    const alternateExercise = getExerciseInitialValues(1);
    it.each(textInputValues(alternateExercise))(
      "should render the alternate exercise readonly text for $fld",
      ({ value }) => {
        renderComponent(alternateExercise);

        if (value !== undefined && value !== null) {
          const textInPage = screen.getAllByText(value!.toString());

          expect(textInPage.length).toBeGreaterThanOrEqual(1);
        }
      }
    );

    it.todo("should render the set list", () => {});
  });

  describe("Button Validation", () => {
    const buttonsInitial = [
      ...buttonsTopInitialState,
      ...buttonsBottomInitialState,
    ];

    it.each(buttonsInitial)("should render the button $title", ({ icon }) => {
      renderComponent();

      const buttons = screen.getAllByRole("button", {
        name: icon,
      });

      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it("should render the alternate button icons based on value", () => {
      testExercise.completed = true;
      testExercise.visible = false;
      renderComponent(testExercise);

      buttonsTopAlternateState.forEach(({ icon }) => {
        const buttons = screen.getAllByRole("button", {
          name: icon,
        });

        expect(buttons.length).toBeGreaterThanOrEqual(1);
      });
    });

    it.each(buttonsInitial)(
      "call $name function on clicking $title",
      async ({ name, icon, func }) => {
        testExercise.completed = false;
        testExercise.visible = true;

        // Mock the useContexts hook
        vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
          ...mockExerciseProvider,
          [name]: func,
        });

        const { user } = renderComponent(testExercise);

        const exerciseButtons = screen.getAllByRole("button", {
          name: new RegExp(icon, "i"),
        });

        await user.click(exerciseButtons[0]);
        expect(func).toHaveBeenCalledTimes(1);
      }
    );

    it.each(buttonsDropDown)(
      "renders $title dropdown button menus ",
      async ({ icon, buttons }) => {
        const { user } = renderComponent(testExercise);
        const ddButtons = screen.getAllByRole("button", {
          name: new RegExp(icon, "i"),
        });
        await user.click(ddButtons[0]);

        buttons.forEach((button) => {
          const buttonInPage = screen.getAllByRole("button", {
            name: button.label,
          });
          expect(buttonInPage[0]).toBeInTheDocument();
        });
      }
    );

    it("should disable the up order button if exercise is the first", () => {
      renderComponent(testExercise, true, false);

      const button = screen.getByRole("button", {
        name: "arrow_upward",
      });

      expect(button).toBeDisabled();
    });

    it("should disable the down order button if exercise is the first", () => {
      renderComponent(testExercise, false, true);

      const button = screen.getByRole("button", {
        name: "arrow_downward",
      });

      expect(button).toBeDisabled();
    });
  });

  describe("Complete function", () => {
    // const expectStartedCompleted = (exerciseOrSet: ExerciseItemType  | SetItemType, started?: boolean, completed?: boolean) => {

    //   if (started !== undefined) {
    //   if (started) {
    //   expect(exerciseOrSet.started).toBe(true);
    //   expect(exerciseOrSet.startedWhen).not.toBeNull();
    // } else {
    //     expect(exerciseOrSet.started).toBe(false);
    //     expect(exerciseOrSet.startedWhen).toBeNull();
    //   }
    // }

    //   if (completed !== undefined) {
    //   if (completed) {
    //     expect(exerciseOrSet.completed).toBe(true);
    //     expect(exerciseOrSet.completedWhen).not.toBeNull();
    //   } else {
    //     expect(exerciseOrSet.completed).toBe(false);
    //     expect(exerciseOrSet.completedWhen).toBeNull();
    //   }
    // }
    // }

    it("should mark the exercise as completed if clicked completed", async () => {
      testExercise = {
        ...testExercise,
        ...notStarted,
        ...notCompleted,
        visible: true,
      };

      vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
        ...mockExerciseProvider,
        // [name]: func,
      });
      // vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
      //   ...mockExerciseProvider,
      //   // [name]: func,
      // });

      const { user } = renderComponent(testExercise, false, false);

      const button = screen.getByRole("button", {
        name: "exercise 0 completeExercise",
      });
      console.debug();
      expect(button).toBeInTheDocument();

      // // const completedButton = screen.getByRole("button", {name: "completeExercise"})
      // const completedButton = screen.getByRole("button", { name: "pending" });
      // await user.click(completedButton);

      // const completedClass = completedHeaderClass;
      // const exerciseRow = screen.getByRole("row", { name: id });
      // expect(exerciseRow).toHaveClass(completedClass);

      // const notCompletedButton = screen.getByRole("button", {
      //   name: "check_circle",
      // });
      // expect(notCompletedButton).toBeInTheDocument();

      // expect(testExercise.started).toBe(true);
      // expect(testExercise.startedWhen).not.toBeNull();
      // expect(testExercise.completed).toBe(true);
      // expect(testExercise.completedWhen).not.toBeNull();
    });

    it.todo(
      "should mark the exercise as not completed if unclicked completed",
      async () => {
        testExercise = {
          ...testExercise,
          started: true,
          startedWhen: new Date(),
          completed: true,
          completedWhen: new Date(),
          visible: true,
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = notCompletedHeaderClass;
        const exerciseRow = screen.getByRole("row", { name: id });
        expect(exerciseRow).toHaveClass(notCompletedClass);

        expect(testExercise.started).toBe(true);
        expect(testExercise.startedWhen).not.toBeNull();
        expect(testExercise.completed).toBe(false);
        expect(testExercise.completedWhen).toBeNull();
      }
    );

    it.todo(
      "should mark all sets as completed if clicked completed",
      async () => {
        testExercise = {
          ...testExercise,
          ...notStarted,
          ...notCompleted,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...notStarted, ...notCompleted };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", { name: "pending" });
        await user.click(completedButton);

        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(completedRowClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should mark all sets as not completed if clicked uncompleted",
      async () => {
        testExercise = {
          ...testExercise,
          ...started,
          ...completed,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...started, ...completed };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = notCompletedRowClass;
        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(notCompletedClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should not change the started status when marking uncompleted",
      async () => {
        testExercise = {
          ...testExercise,
          ...started,
          ...completed,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...started, ...completed };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = "";
        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(notCompletedClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should mark the started status completed when marking completed",
      async () => {}
    );

    it.todo(
      "should not change the started status when marking uncompleted",
      async () => {}
    );
  });
});
