import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay } from "msw";
import AllProviders from "../../../src/AllProviders";
import Timer from "../../../src/components/common/Timer";
import { SetItemInitialValues, SetItemType } from "../../../src/context/types";

describe("Timer", () => {
  const set: SetItemType = { ...SetItemInitialValues };

  const buttons = [
    { name: "Start", text: "Start" },
    { name: "Pause", text: "pause" },
    { name: "Play", text: "play_arrow" },
    { name: "Restart", text: "refresh" },
    { name: "Finish", text: "Finish" },
  ];

  const renderComponent = () => {
    render(<Timer timerDuration={90} set={set} setId={"exercise.0.set.0"} />, {
      wrapper: AllProviders,
    });
  };

  it.each(buttons)("should render the $name button", ({ text }) => {
    renderComponent();
    const button = screen.getByRole("button", { name: new RegExp(text, "i") });
    expect(button).toBeInTheDocument();
  });

  it("should render the timer component", () => {
    renderComponent();

    const timerComponent = screen.getByRole("cell", { name: /timer/i });
    expect(timerComponent).toBeInTheDocument();
    expect(timerComponent.textContent).toBe("01:30");
  });

  it("should countdown the timer", async () => {
    renderComponent();

    const timerComponent = screen.getByRole("cell", { name: /timer/i });
    await delay(1500);
    expect(timerComponent.textContent).not.toBe("01:30");
  });

  it.todo("should execute the startTheSet function once clicked", async () => {
    // not finished yet.  still need to workout how to mock the function / state
    renderComponent();

    const button = screen.getByRole("button", {
      name: new RegExp("start", "i"),
    });

    const user = userEvent.setup();
    await user.click(button);
  });
});
