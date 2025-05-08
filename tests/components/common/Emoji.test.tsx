import { render, screen } from "@testing-library/react";
import Emoji from "../../../src/components/common/Emoji";

describe("Emoji", () => {
  type EmojiItemType = {
    label: string;
    icon: string;
    value: number;
  };

  const emojiIcons: EmojiItemType[] = [
    { label: "woozy", icon: "🥴", value: 1 },
    { label: "weary", icon: "😩", value: 2 },
    { label: "ok", icon: "😑", value: 3 },
    { label: "grinning", icon: "😀", value: 4 },
    { label: "flexed", icon: "💪", value: 5 },
  ];

  const renderComponent = (emoji: { label: string; icon: string }) => {
    render(<Emoji label={emoji.label} symbol={emoji.icon} />);
  };

  it.each(emojiIcons)(
    "should render the emoji imgs for $label",
    ({ label, icon }) => {
      renderComponent({ icon, label });

      const emojiElement = screen.getByRole("img", { name: label });
      expect(emojiElement).toBeInTheDocument();
      expect(screen.getByText(icon)).toBeInTheDocument();
    }
  );
});
