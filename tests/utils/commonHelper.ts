import { screen } from "@testing-library/react";
import * as ExerciseContextModule from "../../src/hooks/useExercise";
import { getLabelText } from "../../src/utilities/common";
import { mockExerciseProvider } from "./exerciseHelpers";

export const getButton = (label: string, id?: string) => {
  const buttonName = !id ? label : [...getLabelText(id), label].join(" ");

  const button = screen.getByRole("button", {
    name: new RegExp(buttonName, "i"),
  });
  return button;
};

export const getAllButtons = (id: string, label: string) => {
  const labelText = getLabelText(id);
  const buttonName = [...labelText, label].join(" ");
  const emojiButtons = screen.getAllByRole("button", {
    name: new RegExp(buttonName, "i"),
  });
  return emojiButtons;
};

export const setEdit = (edit: boolean) => {
  vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
    ...mockExerciseProvider,
    edit: edit,
  });
};

export const spyOneFunction = (name: string, func: () => void) => {
  vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
    ...mockExerciseProvider,
    [name]: func,
  });
};

// type mockFunctionValuesType = {
//   name: string;
//   func: () => void | string | boolean | number | Date;
//   edit?: boolean;
// };

export const spyOneFunctionEdit = (
  edit: boolean,
  name: string,
  func: () => void
) => {
  vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
    ...mockExerciseProvider,
    edit: edit,
    [name]: func,
  });
};

type FunctionValuesType = {
  [key: string]:
    | boolean
    | number
    | string[]
    | { id: number; name: string }[]
    | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((...args: any[]) => any);
  edit?: boolean;
};

export const spyManyFunctionValues = (functionValues: FunctionValuesType) => {
  vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
    ...mockExerciseProvider,
    ...functionValues,
  });
};
