import { render, screen } from "@testing-library/react";
import SessionList from "../../../src/components/session/SessionList";
import { SessionItemType } from "../../../src/context/types";
import * as ExerciseContextModule from "../../../src/hooks/useExercise";
import {
  getSessionInitialValues,
  getSessionsInitialValues,
  mockExerciseProvider,
} from "../../utils/exerciseHelpers";

describe("SessionList", () => {
  const testSessions: Partial<SessionItemType>[] = getSessionsInitialValues(3);
  const testSession: SessionItemType = getSessionInitialValues(10);
  let mockLoadLastSession = vi.fn();

  beforeEach(() => {
    mockLoadLastSession = vi.fn();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (
    sessions: Partial<SessionItemType>[],
    currentSession: SessionItemType | null
  ) => {
    vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
      ...mockExerciseProvider,
      loadLastSession: mockLoadLastSession,
      currentSession,
      sessions,
    });

    render(<SessionList />);

    return { mockLoadLastSession };
  };

  it.each(testSessions)("should render the list of sessions", ({ _id }) => {
    renderComponent(testSessions, null);

    const listItemName = ["SessionListItem", _id].join(".");
    const sessionListItem = screen.getByRole("row", { name: listItemName });

    expect(sessionListItem).toBeInTheDocument();
  });

  it("should render the current session if it exists", () => {
    renderComponent(testSessions, testSession);

    const sessionName = ["SessionItem", testSession._id].join(".");
    const sessionItem = screen.getByRole("row", { name: sessionName });

    expect(sessionItem).toBeInTheDocument();
  });

  it("should render nothing if no sessions exist", () => {
    renderComponent([], null);

    const listItemName = ["SessionListItem", testSessions[0]._id].join(".");

    expect(() =>
      screen.getByRole("row", { name: listItemName })
    ).toThrowError();
  });

  it("should execute loadLastSession on first load", () => {
    const { mockLoadLastSession } = renderComponent(testSessions, null);

    expect(mockLoadLastSession).toBeCalledTimes(1);
  });

  it("should execute loadLastSession on context change", () => {
    renderComponent(testSessions, null);

    // spyOneFunction("sessions", [testSession]);
    // renderComponent([testSession], null);
    vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
      ...mockExerciseProvider,
      loadLastSession: mockLoadLastSession,
      sessions: [testSession],
    });

    renderComponent([testSession], null);
    renderComponent([testSession], { ...testSession, _id: "new" });

    expect(mockLoadLastSession).toBeCalledTimes(3);
  });
});
