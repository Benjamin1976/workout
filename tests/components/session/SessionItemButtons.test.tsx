import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionButtons } from "../../../src/components/session/SessionItemButtons";
import { SessionItemType } from "../../../src/context/types";
import {
  completedButtonClass,
  completedTextClass,
} from "../../../src/utilities/common";
import {
  getButton,
  setEdit,
  spyManyFunctionValues,
  spyOneFunction,
} from "../../utils/commonHelper";
import {
  getSessionInitialValues,
  sessionItemButtonsAlternateInitialState,
  sessionItemButtonsInitialState,
} from "../../utils/exerciseHelpers";

describe("SessionItemButtons", () => {
  let testSession: SessionItemType = getSessionInitialValues(0);
  const buttonClass = completedButtonClass(false);
  const textClass = completedTextClass(false);

  beforeEach(() => {
    setEdit(false);
  });

  beforeAll(() => {
    testSession = getSessionInitialValues(0);
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  const renderComponent = (session: SessionItemType = testSession) => {
    const user = userEvent.setup();

    const clickButton = async (id: string, label: string) => {
      const button = getButton(label, id);
      await user.click(button);
    };

    render(<SessionButtons session={session} />);

    return { user, clickButton };
  };

  it.each(sessionItemButtonsInitialState)(
    "should render the $name button with correct class",
    ({ name }) => {
      renderComponent();

      const buttonName = getButton(name, testSession._id);
      expect(buttonName).toHaveClass(buttonClass);
      expect(buttonName).toHaveClass(textClass);
    }
  );

  it.each(sessionItemButtonsAlternateInitialState)(
    "should render the alternate $name button with correct class",
    ({ name }) => {
      setEdit(true);
      renderComponent();

      const buttonName = getButton(name, testSession._id);
      expect(buttonName).toHaveClass(buttonClass);
      expect(buttonName).toHaveClass(textClass);
    }
  );

  it.each(sessionItemButtonsInitialState)(
    "should render call the $name function clicking $title button",
    async ({ name, func }) => {
      spyOneFunction(name, func);
      const { clickButton } = renderComponent();

      await clickButton(testSession._id, name);

      expect(func).toHaveBeenCalled();
    }
  );

  it.each(sessionItemButtonsAlternateInitialState)(
    "should render call the alternate $name function clicking $title button",
    async ({ name, func }) => {
      spyManyFunctionValues({
        edit: true,
        [name]: func,
      });
      const { clickButton } = renderComponent();

      await clickButton(testSession._id, name);

      expect(func).toHaveBeenCalled();
    }
  );
});
