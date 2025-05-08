import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import MyComponent from "../src/components/MyComponent";
import { MyProvider } from "../src/context/MyContext";
import * as useContextsModule from "../src/hooks/useContexts"; // Adjust the import path as necessary

describe("MyComponent with mocked context", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders count and calls increment on click", () => {
    const mockIncrement = vi.fn();

    // Mock the useContexts hook
    vi.spyOn(useContextsModule, "default").mockReturnValue({
      count: 99,
      increment: mockIncrement,
    });

    render(<MyComponent />);

    expect(screen.getByTestId("count")).toHaveTextContent("99");

    fireEvent.click(screen.getByText(/increment/i));
    expect(mockIncrement).toHaveBeenCalledTimes(1);
  });

  it("renders count and calls increment on click", async () => {
    render(
      <MyProvider>
        <MyComponent />
      </MyProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("0");

    const user = userEvent.setup();

    await user.click(screen.getByText(/increment/i));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  // it("can simulate a state update manually", () => {
  //   let count = 0;
  //   const mockIncrement = vi.fn(() => {
  //     count++;
  //   });

  //   const renderWithMockContext = () => {
  //     vi.spyOn(useContextsModule, "default").mockReturnValue({
  //       count,
  //       increment: mockIncrement,
  //     });
  //     render(<MyComponent />);
  //   };

  //   renderWithMockContext();
  //   expect(screen.getByTestId("count")).toHaveTextContent("0");

  //   fireEvent.click(screen.getByText(/increment/i));
  //   mockIncrement(); // simulate the count increment manually
  //   // renderWithMockContext(); // simulate re-render with updated count
  //   expect(screen.getByTestId("count")).toHaveTextContent("1");
  // });
});
