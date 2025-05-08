import { render, screen } from "@testing-library/react";
import ExerciseList from "../../../src/components/exercise/ExerciseList";
import { ExerciseItemType } from "../../../src/context/types";
import { getExercisesInitialValues } from "../../utils/exerciseHelpers";

describe("ExerciseList", () => {
  const testExercises: ExerciseItemType[] = getExercisesInitialValues(3);

  const renderComponent = (testExercises: ExerciseItemType[]) => {
    render(<ExerciseList exercises={testExercises} />);
  };

  it.each(testExercises)(
    "should render the exercise list with exercise $id",
    ({ id }) => {
      renderComponent(testExercises);

      const exerciseRowName = ["exercise", id].join(".");
      const exerciseRow = screen.getByRole("row", { name: exerciseRowName });
      expect(exerciseRow).toBeInTheDocument();
    }
  );

  it("should not render the exercise row if no exercises are passed", () => {
    renderComponent([]);

    const exerciseRowName = ["exercise", 0].join(".");
    expect(() =>
      screen.getByRole("row", { name: exerciseRowName })
    ).toThrowError();
  });
});
