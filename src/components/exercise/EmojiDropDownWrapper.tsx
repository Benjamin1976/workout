import { useState } from "react";
import { Button } from "react-bootstrap";
import { getEmojiIcon, getLabelText } from "../../utilities/common";
import Emoji from "../common/Emoji";
import EmojiDropDown from "../common/EmojiDropDown";
import Icon from "../common/Icon";

type EmojiDropDownWrapperProps = {
  id: string;
  rating: number;
  buttonClass: string;
};

export const EmojiDropDownWrapper = ({
  id,
  rating,
  buttonClass,
}: EmojiDropDownWrapperProps) => {
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const labelText = getLabelText(id);

  return (
    <span className="dropdown">
      <Button
        aria-label={[...labelText, "emojiDropDown"].join(" ")}
        className={buttonClass}
        id="EmojiDropDown"
        onClick={() => setDropDownVisible(!dropDownVisible)}
        onBlur={() => setDropDownVisible(false)}
      >
        {rating && rating > 0 ? (
          <Emoji
            symbol={getEmojiIcon(rating)}
            label={`toughness was ${rating}`}
          />
        ) : (
          <Icon icon={"thumb_up"} />
        )}
      </Button>
      {dropDownVisible && (
        <EmojiDropDown key={id + "-emoji-dropdown"} id={id} />
      )}
    </span>
  );
};
