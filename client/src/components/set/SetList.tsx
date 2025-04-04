import SetItem from "./SetItem";
import { SetItemType } from "../../context/types";

type SetListProps = {
  sets: SetItemType[];
  id: string;
};

const SetList = ({ sets, id }: SetListProps) =>
  sets
    ? sets.map((set, i) => {
        let newId = [id, "set", i].join(".");
        return <SetItem key={newId} id={newId} set={set} />;
      })
    : "";

export default SetList;
