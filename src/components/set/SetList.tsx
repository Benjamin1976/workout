import { SetItemType } from "../../context/types";
import SetItem from "./SetItem";

type SetListProps = {
  sets: SetItemType[];
  id: string;
};

const SetList = ({ sets, id }: SetListProps) =>
  sets
    ? sets.map((set, i) => {
        const newId = [id, "set", i].join(".");
        return <SetItem key={newId} id={newId} set={set} />;
      })
    : "";

export default SetList;
