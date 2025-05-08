import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";
// import userEvent from "@testing-library/user-event";
import DateInput from "../../../src/components/common/DateInput";
import { FieldOptionsType } from "../../../src/context/types";

describe("DateInput", () => {
  const onchange = vi.fn();
  const id = "datefield1";

  const fieldOptions: FieldOptionsType = {
    field: "Date Field",
    type: "date",
    title: "Date Field Title",
  };
  const renderComponent = (value: string | null, edit: boolean) => {
    render(
      <DateInput
        value={value}
        id={id}
        edit={edit}
        fieldOptions={fieldOptions}
        onchange={onchange}
      />
    );

    return {
      dateInput: screen.queryByPlaceholderText(
        new RegExp(fieldOptions.title!, "i")
      ),
    };
  };

  describe("display mode", () => {
    it("should show the date value in dd-mmm-yy format", () => {
      const expectedValue = "02-Oct-24";
      //   dateFormat.mockReturnValue(expectedValue);

      renderComponent("2024-10-02", false);

      const dateDisplay = screen.getByText(expectedValue);
      expect(dateDisplay.textContent).toBe(expectedValue);
    });

    it("should show not show the date if the data is not entered", async () => {
      const expectedValue = "02-Oct-24";

      renderComponent("", false);

      expect(screen.queryByText(expectedValue)).not.toBeInTheDocument();
    });
  });

  describe("edit mode", () => {
    it("should render the date picker with correct value", async () => {
      const expectedValue = "2024-10-02";

      const { dateInput } = renderComponent(expectedValue, true);
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveValue(expectedValue);
    });

    it("should render no date in the picker if no date is passed", async () => {
      const expectedValue = "";

      const { dateInput } = renderComponent(expectedValue, true);

      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveValue(expectedValue);
    });

    // it("should set the correct value of the date selected in the picker", async () => {
    //   const expectedValue = "";

    //   const { dateInput } = renderComponent(expectedValue, true);
    //   const user = userEvent.setup();
    //     await user.click(dateInput)

    // //   await user.dblClick(dateInput!);
    // //   screen.debug();
    //   //   expect(dateInput).toBeInTheDocument();
    //   //   expect(dateInput).toHaveValue(expectedValue);
    // });

    it("should render the correct label for the data picker", async () => {
      const expectedValue = "2024-10-02";

      renderComponent(expectedValue, true);

      expect(screen.getByText(fieldOptions.title!)).toBeInTheDocument();
    });
  });
});
