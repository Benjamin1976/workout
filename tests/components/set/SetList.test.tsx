import { render, screen } from "@testing-library/react";
import SetList from "../../../src/components/set/SetList";
import { SetItemType } from "../../../src/context/types";
import { getSetsInitialValues } from "../../utils/exerciseHelpers";

describe("SetList", () => {
  const exerciseId = "exercise.0";
  const testSets: SetItemType[] = getSetsInitialValues(3);

  const renderComponent = (testSets: SetItemType[]) => {
    render(<SetList id={exerciseId} sets={testSets} />);
  };

  it.each(testSets)("should render the set list set id $id", ({ id }) => {
    renderComponent(testSets);

    const setRowName = [exerciseId, "set", id].join(".");
    const setRow = screen.getByRole("row", { name: setRowName });
    expect(setRow).toBeInTheDocument();
  });

  it("should not render the set row if no sets are passed", () => {
    renderComponent([]);

    const setRowName = [exerciseId, "set", 0].join(".");
    expect(() => screen.getByRole("row", { name: setRowName })).toThrowError();
  });
});
