import useExercise from "../../hooks/useExercise";
import { ExerciseNameType } from "../../context/types";

type NameReturnValue = {
  _id: string;
  name: string;
};
type ExerciseDropDownType = {
  updateName: (
    e: React.ChangeEvent<HTMLSelectElement>,
    values: NameReturnValue
  ) => void;
};

const ExerciseDropDown = ({ updateName }: ExerciseDropDownType) => {
  const { exercisesAll } = useExercise();

  const exercises: ExerciseNameType[] = exercisesAll ?? [];
  const selectMsg = (
    <option key={"select"} value={"select"}>
      Select Existing or enter a name
    </option>
  );
  const optionValues = exercises.map((exercise: ExerciseNameType) => {
    const { _id, name } = exercise;
    return (
      <option key={_id} value={_id}>
        {name}
      </option>
    );
  });

  return (
    <select
      onChange={(e) =>
        updateName(e, {
          _id: e.target.value,
          name: e.target.selectedOptions[0].text,
        })
      }
      defaultValue={"select"}
    >
      {[selectMsg, ...optionValues]}
    </select>
  );
};

export default ExerciseDropDown;
