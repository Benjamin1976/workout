import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";
import TextInput from "../../../src/components/common/TextInput";
import { FieldOptionsType } from "../../../src/context/types";

describe("TextInput", () => {
  const onchange = vi.fn();
  const id = "textfield1";

  const fieldOptions: FieldOptionsType = {
    field: "Text Field",
    type: "text",
    title: "Text Field Title",
  };

  const data = "Field Data";

  const renderComponent = (value: string | null, edit: boolean) => {
    render(
      <TextInput
        value={value}
        id={id}
        edit={edit}
        fieldOptions={fieldOptions}
        onchange={onchange}
      />
    );

    return {
      textInput: screen.queryByPlaceholderText(
        new RegExp(fieldOptions.title!, "i")
      ),
    };
  };

  describe("display mode", () => {
    it("should show the name in the input fieldformat", () => {
      const expectedValue = data;

      renderComponent(expectedValue, false);

      const textDisplay = screen.getByText(expectedValue);
      expect(textDisplay.textContent).toBe(expectedValue);
    });

    it("should show not show any value if there is no value", async () => {
      const expectedValue = data;

      renderComponent("", false);

      expect(screen.queryByText(expectedValue)).not.toBeInTheDocument();
    });
  });

  describe("edit mode", () => {
    it("should render the input field with correct value", async () => {
      const expectedValue = data;

      const { textInput } = renderComponent(expectedValue, true);

      expect(textInput).toBeInTheDocument();
      expect(textInput).toHaveValue(expectedValue);
    });

    it("should render no value in no value is passed", async () => {
      const expectedValue = "";

      const { textInput } = renderComponent(expectedValue, true);

      expect(textInput).toBeInTheDocument();
      expect(textInput).toHaveValue(expectedValue);
    });

    it("should have the correct value in the text input", async () => {
      const expectedValue = "this is the value";

      const { textInput } = renderComponent(expectedValue, true);
      const user = userEvent.setup();
      await user.type(textInput!, expectedValue + "1");

      expect(onchange).toHaveBeenCalledWith(id, {
        name: fieldOptions.field,
        value: expectedValue + "1",
      });
      expect(textInput).toHaveValue(expectedValue);
    });

    it("should render the correct label for the text field", async () => {
      const expectedValue = fieldOptions.title;

      renderComponent(expectedValue!, true);

      expect(screen.getByText(expectedValue!)).toBeInTheDocument();
    });
  });
});
