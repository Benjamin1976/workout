import { Button, Col, Row } from "react-bootstrap";
import Emoji from "./Emoji";
import useExercise from "../../hooks/useExercise";
import { emojiIcons } from "../../utilities/common";

type EmojiDropDownProps = {
  id: string;
};

const EmojiDropDown = ({ id }: EmojiDropDownProps) => {
  const { rateExercise } = useExercise();
  let key = id + "-emoji";

  return (
    <div
      className="dropdown-menu p-o m-0 g-0"
      aria-labelledby="EmojiDropDown"
      key={key + ".dropdown"}
    >
      <Row className="ms-1 g-0  align-items-baseline">
        {emojiIcons?.length &&
          emojiIcons.map((icon, idx) => (
            <Col key={key + ".col." + idx}>
              <Button
                className="border-0 bg-white m-0 p-0"
                onClick={() => rateExercise(id, icon.value)}
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
