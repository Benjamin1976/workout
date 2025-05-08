import { render, screen } from "@testing-library/react";
import Session from "../../../src/components/session/Session";
import { SessionItemType, UserType } from "../../../src/context/types";
import * as AuthContextModule from "../../../src/hooks/useAuth";
import * as ExerciseContextModule from "../../../src/hooks/useExercise";
import {
  getMockUser,
  getSessionsInitialValues,
  mockAuthProvider,
  mockExerciseProvider,
} from "../../utils/exerciseHelpers";

describe("Session", () => {
  const mockGetSessions = vi.fn();
  const testSessions: SessionItemType[] = getSessionsInitialValues(3);
  const testUser: UserType = getMockUser();

  const renderComponent = () => {
    vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
      ...mockExerciseProvider,
      getSessions: mockGetSessions,
      sessions: testSessions,
    });

    vi.spyOn(AuthContextModule, "default").mockReturnValue({
      ...mockAuthProvider,
      user: testUser,
    });

    render(<Session />);

    return {
      mockGetSessions,
    };
  };

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should render the session list on load", () => {
    renderComponent();

    const sessionsName = ["SessionListItem", testSessions[0]._id].join(".");

    expect(screen.getByRole("row", { name: sessionsName })).toBeInTheDocument();
  });

  it("should call getSessions on load with user value", () => {
    const { mockGetSessions } = renderComponent();

    expect(mockGetSessions).toHaveBeenLastCalledWith(testUser, { date: -1 }, 1);
    expect(mockGetSessions).toBeCalledTimes(2);
  });
});
