import { UpdateValueType } from "../../context/ExerciseProvider";
import { FieldOptionsType } from "../../context/types";
import { dateFormat, dateFormatCtl } from "../../utilities/common";

type DateInputProps = {
  value: string | null;
  id: string;
  edit: boolean;
  fieldOptions: FieldOptionsType;
  onchange: (id: string, update: UpdateValueType) => void;
};

const DateInput = ({
  edit,
  value,
  fieldOptions,
  id,
  onchange,
}: DateInputProps) => {
  const { title, field } = fieldOptions;
  const key = [id, field].join(".");
  const fieldName = [id, field].join(".");

  if (!edit) return !value ? "" : dateFormat(value);

  return (
    <div>
      {title && (
        <label
          key={key + ".label"}
          htmlFor="dateFormControl"
          className="form-label"
        >
          {title}
        </label>
      )}
      <input
        id="dateFormControl"
        className="form-control"
        aria-label={fieldName}
        data-testid={fieldName}
        value={value === "" ? value : dateFormatCtl(value)}
        placeholder={title}
        name={id}
        key={id}
        type="Date"
        onChange={(e) => onchange(id, { name: field, value: e.target.value })}
      />
    </div>
  );
};

export default DateInput;
