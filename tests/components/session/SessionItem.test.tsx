import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionItem from "../../../src/components/session/SessionItem";
import { SessionItemType } from "../../../src/context/types";
import {
  getButton,
  setEdit,
  spyManyFunctionValues,
} from "../../utils/commonHelper";
import {
  exerciseListButtonsInitialState,
  getSessionsInitialValues,
  sessionInputValues,
  sessionItemButtonsInitialState,
} from "../../utils/exerciseHelpers";

describe("SessionItem", () => {
  const mockUpdateSession = vi.fn();
  let testSessions: SessionItemType[] = getSessionsInitialValues(2);

  beforeEach(() => {
    testSessions = getSessionsInitialValues(2);
  });

  //   afterEach(() => {
  //     vi.resetAllMocks();
  //   });

  const renderComponent = (session: SessionItemType = testSessions[0]) => {
    const user = userEvent.setup();

    render(<SessionItem session={session} />);

    const addExerciseRow = screen.queryByRole("row", {
      name: "AddExercise",
    });

    const exerciseHighlightRow = screen.queryByRole("row", {
      name: "ExerciseHighlight",
    });

    const getTextInput = (id: string, name: string) => {
      const fieldName = [id, name].join(".");
      const textInput = screen.getByRole("textbox", { name: fieldName });
      return textInput;
    };

    const getDateInput = (id: string, name: string) => {
      const fieldName = [id, name].join(".");
      const dateInput = screen.getByTestId(fieldName) as HTMLInputElement;
      return dateInput;
    };

    const nameInput = () => getTextInput(testSessions[0]._id, "name");

    const dateInput = () => getDateInput(testSessions[0]._id, "date");

    const showTimerButton = getButton("showTimer", testSessions[0]._id);

    return {
      user,
      nameInput,
      dateInput,
      addExerciseRow,
      exerciseHighlightRow,
      showTimerButton,
    };
  };

  it("should render the Session Item row", () => {
    renderComponent();

    const rowName = ["SessionItem", testSessions[0]._id].join(".");
    const sessionRow = screen.getByRole("row", { name: rowName });

    expect(sessionRow).toBeInTheDocument();
  });

  it.each(sessionInputValues(testSessions[0]))(
    "should render the $fld value in display mode",
    ({ value }) => {
      renderComponent();

      const textValue = screen.getByText(value.toString());

      expect(textValue).toBeInTheDocument();
    }
  );

  it.each(sessionInputValues(testSessions[0]))(
    "should render the field input fields in edit mode",
    ({ fld, ctlValue }) => {
      setEdit(true);
      const { nameInput, dateInput } = renderComponent();

      let input;
      if (fld === "name") {
        input = nameInput();
        expect(input).toHaveValue(ctlValue!.toString());
      } else if (fld === "date") {
        input = dateInput();
        // input = screen.getByRole(role, { name: fieldName });
      }
      expect(input).toBeInTheDocument();
    }
  );

  it("should call the updateSession function when updating a field", async () => {
    spyManyFunctionValues({
      edit: true,
      updateSession: mockUpdateSession,
    });
    const { user, nameInput } = renderComponent();

    await user.type(nameInput(), "hello");

    expect(mockUpdateSession).toHaveBeenCalledTimes(5);
  });

  it("should call the updateSession function when clicking the date field", async () => {
    spyManyFunctionValues({
      edit: true,
      updateSession: mockUpdateSession,
    });
    const { user, dateInput } = renderComponent();

    await user.type(dateInput(), "2024-01-01");

    expect(mockUpdateSession).toHaveBeenCalledTimes(7);
  });

  it("should render the Exercise Highlight component on initial load", async () => {
    const { exerciseHighlightRow } = renderComponent();

    expect(exerciseHighlightRow).toBeInTheDocument();
  });

  it("should not render the Exercise Highlight component on initial load if timerVisible = false", async () => {
    spyManyFunctionValues({
      timerVisible: false,
    });
    const { exerciseHighlightRow } = renderComponent();

    expect(exerciseHighlightRow).not.toBeInTheDocument();
  });

  it.todo(
    "should hide the Exercise Highlight component when clicked",
    async () => {
      const { user, showTimerButton, exerciseHighlightRow } = renderComponent();

      await user.click(showTimerButton);

      expect(exerciseHighlightRow).not.toBeInTheDocument();
    }
  );

  it.todo("should show the Timer component when clicked", async () => {
    const { user, showTimerButton, exerciseHighlightRow } = renderComponent();

    await user.click(showTimerButton);

    expect(exerciseHighlightRow).not.toBeInTheDocument();
  });

  it("should render the exercise count in display mode", () => {
    spyManyFunctionValues({ totalExercises: 3 });

    renderComponent();

    expect(screen.getByText("(3)")).toBeInTheDocument();
  });

  it("should render not render the exercise count in edit mode", () => {
    spyManyFunctionValues({
      edit: true,
      totalExercises: 3,
    });

    renderComponent();

    expect(screen.queryByText("(3)")).not.toBeInTheDocument();
  });

  it.each(sessionItemButtonsInitialState)(
    "should render the session button $name",
    ({ name }) => {
      renderComponent();

      expect(getButton(name, testSessions[0]._id)).toBeInTheDocument();
    }
  );

  it.each(exerciseListButtonsInitialState)(
    "should render the Exercise List Button $title",
    ({ label }) => {
      renderComponent();

      const button = screen.getByRole("button", { name: label });

      expect(button).toBeInTheDocument();
    }
  );

  it("should render the Exercise List", () => {
    renderComponent();

    const exerciseList = screen.getByRole("row", { name: "exercise.0" });

    expect(exerciseList).toBeInTheDocument();
  });

  it("should render the Exercise Add Form on add = true", () => {
    spyManyFunctionValues({
      add: true,
    });

    const { addExerciseRow } = renderComponent();

    expect(addExerciseRow).toBeInTheDocument();
  });

  it("should not render the Exercise Add Form on first render", () => {
    spyManyFunctionValues({
      add: false,
    });
    const { addExerciseRow } = renderComponent();

    expect(addExerciseRow).not.toBeInTheDocument();
  });
});
