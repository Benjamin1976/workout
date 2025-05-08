import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionListItem from "../../../src/components/session/SessionListItem";
import { SessionItemType } from "../../../src/context/types";
import {
  completedButtonClass,
  completedTextClass,
} from "../../../src/utilities/common";
import { getButton, spyOneFunction } from "../../utils/commonHelper";
import {
  getSessionInitialValues,
  sessionButtonsInitialState,
} from "../../utils/exerciseHelpers";

describe("SessionListItem", () => {
  let testSession: SessionItemType = getSessionInitialValues(0);
  const buttonClass = completedButtonClass(false);
  const textClass = completedTextClass(false);

  beforeAll(() => {
    testSession = getSessionInitialValues(0);
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  const renderComponent = (session: SessionItemType = testSession) => {
    const user = userEvent.setup();

    render(<SessionListItem session={session} />);

    return { user };
  };

  it("should render with the dateAgo String", () => {
    renderComponent();

    expect(screen.getByText("5 days ago")).toBeInTheDocument();
  });

  it("should render empty string for dateAgo if no date in data", () => {
    // @ts-expect-error comment
    renderComponent({ ...testSession, date: null });

    expect(screen.queryByText("5 days ago")).not.toBeInTheDocument();
  });

  it("should render the session name if it exists", () => {
    renderComponent();

    expect(screen.getByText(testSession.name)).toBeInTheDocument();
  });

  it('should render the "Session Name" if no name exists', () => {
    renderComponent({ ...testSession, name: "" });

    expect(screen.getByText("Session Name")).toBeInTheDocument();
  });

  it.each(sessionButtonsInitialState)(
    "should render the $name button with correct class",
    ({ name }) => {
      renderComponent();

      const buttonName = getButton(name, testSession._id);
      expect(buttonName).toHaveClass(buttonClass);
      expect(buttonName).toHaveClass(textClass);
    }
  );

  it.each(sessionButtonsInitialState)(
    "should render call the $name function clicking $title button",
    async ({ name, func }) => {
      spyOneFunction(name, func);
      const { user } = renderComponent();

      const buttonName = getButton(name, testSession._id);
      await user.click(buttonName);

      expect(func).toHaveBeenCalled();
    }
  );
});
