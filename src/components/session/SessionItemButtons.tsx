import { Button } from "react-bootstrap";
import { SessionItemType } from "../../context/types";
import useExercise from "../../hooks/useExercise";
import {
  completedButtonClass,
  completedTextClass,
} from "../../utilities/common";
import Icon from "../common/Icon";

const buttonClass = completedButtonClass(false);
const textClass = completedTextClass(false);

type SessionButtonType = {
  session: SessionItemType;
};

export const SessionButtons = ({ session }: SessionButtonType) => {
  const { edit, editSession, saveCurrentSession, closeSession, showTimer } =
    useExercise();

  return (
    <>
      <Button
        aria-label={[session._id, "showTimer"].join(" ")}
        className={buttonClass + textClass}
        onClick={() => showTimer()}
      >
        <Icon icon={"fitness_center"} />
      </Button>
      {edit && (
        <Button
          aria-label={[session._id, "saveCurrentSession"].join(" ")}
          className={buttonClass + textClass}
          onClick={() => saveCurrentSession(session!)}
        >
          <Icon icon={"save"} />
        </Button>
      )}
      <Button
        aria-label={[session._id, "editSession"].join(" ")}
        className={buttonClass + textClass}
        onClick={() => editSession()}
      >
        <Icon icon={!edit ? "edit" : "close"} />
      </Button>
      <Button
        aria-label={[session._id, "closeSession"].join(" ")}
        className={buttonClass + textClass}
        onClick={() => closeSession()}
      >
        <Icon icon={"arrow_back"} />
      </Button>
    </>
  );
};
