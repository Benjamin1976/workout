import { render, screen } from "@testing-library/react";
import Icon from "../../../src/components/common/Icon";

describe("Icon", () => {
  const icon = "edit";
  const renderComponent = () => {
    render(<Icon icon={icon} />);
  };

  it("should render the icon correctly", async () => {
    renderComponent();
    const iconElement = screen.getByLabelText(new RegExp(icon, "i"));

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass("material-symbols-outlined");
  });
});
