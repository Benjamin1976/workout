import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExerciseListButtons } from "../../../src/components/session/ExerciseListButtons";
import {
  completedButtonClass,
  completedTextClass,
} from "../../../src/utilities/common";
import {
  spyManyFunctionValues,
  spyOneFunction,
} from "../../utils/commonHelper";
import {
  exerciseListButtonsAlternateInitialState,
  exerciseListButtonsInitialState,
} from "../../utils/exerciseHelpers";

describe("ExerciseListButtons", () => {
  const buttonClass = completedButtonClass(false);
  const textClass = completedTextClass(false);

  afterAll(() => {
    vi.resetAllMocks();
  });

  const renderComponent = () => {
    const user = userEvent.setup();

    const clickButton = async (name: string) => {
      const button = screen.getByRole("button", { name });
      await user.click(button);
    };

    render(<ExerciseListButtons />);

    return { user, clickButton };
  };

  it.each([...exerciseListButtonsInitialState])(
    "should render the $name button with correct class",
    ({ label, icon }) => {
      spyManyFunctionValues({
        totalExercises: 3,
        exercisesCompleted: 2,
      });

      renderComponent();

      const button = screen.getByRole("button", { name: label });
      expect(button).toHaveClass(buttonClass);
      expect(button).toHaveClass(textClass);
      expect(button).toHaveTextContent(icon);
    }
  );

  it.each(exerciseListButtonsAlternateInitialState)(
    "should render the alternate $name button with correct class",
    ({ label, icon }) => {
      spyManyFunctionValues({
        totalExercises: 3,
        exercisesCompleted: 3,
      });

      renderComponent();

      const button = screen.getByRole("button", { name: label });
      expect(button).toHaveClass(buttonClass);
      expect(button).toHaveClass(textClass);
      expect(button).toHaveTextContent(icon);
    }
  );

  it.each(exerciseListButtonsInitialState)(
    "should call the $name function clicking $title button",
    async ({ label, name, func }) => {
      spyOneFunction(name, func);
      const { clickButton } = renderComponent();

      await clickButton(label);

      expect(func).toHaveBeenCalled();
    }
  );

  it.each(exerciseListButtonsAlternateInitialState)(
    "should render call the alternate $name function clicking $title button",
    async ({ label, name, func }) => {
      spyManyFunctionValues({
        edit: true,
        [name]: func,
      });
      const { clickButton } = renderComponent();

      await clickButton(label);

      expect(func).toHaveBeenCalled();
    }
  );
});
