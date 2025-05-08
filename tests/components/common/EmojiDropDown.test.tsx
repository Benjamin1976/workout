import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmojiDropDown from "../../../src/components/common/EmojiDropDown";
import * as ExerciseContextModule from "../../../src/hooks/useExercise";
import { getButton } from "../../utils/commonHelper";
import { mockExerciseProvider } from "../../utils/exerciseHelpers";

describe("EmojiDropDown", () => {
  type EmojiItemType = {
    label: string;
    icon: string;
    value: number;
  };

  const id = "exercise.0";

  const emojiIcons: EmojiItemType[] = [
    { label: "woozy", icon: "🥴", value: 1 },
    { label: "weary", icon: "😩", value: 2 },
    { label: "ok", icon: "😑", value: 3 },
    { label: "grinning", icon: "😀", value: 4 },
    { label: "flexed", icon: "💪", value: 5 },
  ];

  const renderComponent = () => {
    const rateExerciseMock = vi.fn();

    const user = userEvent.setup();

    vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
      ...mockExerciseProvider,
      rateExercise: rateExerciseMock,
    });

    render(<EmojiDropDown id={id} />);

    return { user, rateExerciseMock, getButton };
  };

  it.each(emojiIcons)(
    "should render the emoji imgs for $label",
    ({ label, icon }) => {
      renderComponent();

      const emojiElement = screen.getByRole("img", { name: label });
      expect(emojiElement).toBeInTheDocument();
      expect(screen.getByText(icon)).toBeInTheDocument();
    }
  );

  it.each(emojiIcons)(
    "should render the button for emoji $label",
    ({ label }) => {
      const { getButton } = renderComponent();

      expect(getButton(label, id)).toBeInTheDocument();
    }
  );

  it.each(emojiIcons)(
    "should execute the rateExercise function with parameters for emoji $label",
    async ({ label, value }) => {
      const { rateExerciseMock, getButton } = renderComponent();
      const user = userEvent.setup();
      const emojiButton = getButton(label, id);

      await user.click(emojiButton);

      expect(rateExerciseMock).toHaveBeenCalledWith(id, value);
    }
  );
});
