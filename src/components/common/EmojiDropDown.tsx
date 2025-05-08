import { Button, Col, Row } from "react-bootstrap";
import useExercise from "../../hooks/useExercise";
import { emojiIcons, getLabelText } from "../../utilities/common";
import Emoji from "./Emoji";

type EmojiDropDownProps = {
  id: string;
};

const EmojiDropDown = ({ id }: EmojiDropDownProps) => {
  const { rateExercise } = useExercise();
  const labelText = getLabelText(id);
  const key = id + "-emoji";

  return (
    <div className="dropdown-menu m-0 g-0 show" key={key + ".dropdown"}>
      <Row className="ms-1 g-0 align-items-baseline">
        {emojiIcons?.length &&
          emojiIcons.map((icon, idx) => (
            <Col key={key + ".col." + idx}>
              <Button
                aria-label={[...labelText, icon.label].join(" ")}
                className="border-0 bg-white m-0 p-0"
                // onClick={() => rateExercise}
                onClick={() => rateExercise(id, icon.value)}
                name={key + ".button." + icon.label}
                key={key + ".button." + idx}
              >
                <Emoji
                  key={key + ".icon." + idx}
                  symbol={icon.icon}
                  label={icon.label}
                />
              </Button>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default EmojiDropDown;
