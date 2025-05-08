import { render, screen } from "@testing-library/react";
import ExerciseDropDown from "../../../src/components/exercise/ExerciseDropDown";
import { spyManyFunctionValues } from "../../utils/commonHelper";

describe("ExerciseDropDown", () => {
  const updateSession = vi.fn();
  const mockExerciseList = Array(10)
    .fill(10)
    .map((_, i) => ({ id: i, name: "Exercise " + i }));

  const renderComponent = () => {
    render(<ExerciseDropDown updateName={updateSession} />);
  };

  it("should render the select message", () => {
    renderComponent();

    const selectOption = screen.getByRole("option", {
      name: /select existing/i,
    });

    expect(selectOption).toBeInTheDocument();
  });

  it("should render the list of exercises", () => {
    spyManyFunctionValues({
      exercisesAll: mockExerciseList,
    });
    renderComponent();

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(mockExerciseList.length + 1);

    const optionsText: string[] = options.map((o) => o?.textContent ?? "Name");
    mockExerciseList.forEach((ex) => {
      expect(optionsText.includes(ex.name)).toBe(true);
    });
  });

  it("should render only select option if no exercises exist", () => {
    spyManyFunctionValues({
      exercisesAll: [],
    });
    renderComponent();

    const options = screen.getAllByRole("option");

    expect(options.length).toBe(1);
  });
});
