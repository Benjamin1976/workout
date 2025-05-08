import { render, screen } from "@testing-library/react";
import Spinner from "../../../src/components/common/Spinner";

describe("Spinner", () => {
  const renderComponent = () => {
    render(<Spinner />);
  };

  it("should render the spinner correctly", async () => {
    renderComponent();
    const spinnerElement = screen.getByText(/loading/i);

    expect(spinnerElement).toBeInTheDocument();
  });
});
