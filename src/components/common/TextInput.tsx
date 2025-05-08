import { UpdateValueType } from "../../context/ExerciseProvider";
import { FieldOptionsType } from "../../context/types";

type TextInputProps = {
  id: string;
  edit: boolean;
  value: string | number | Date | boolean | null | undefined;
  fieldOptions: FieldOptionsType;
  onchange: (id: string, update: UpdateValueType) => void;
};

const TextInput = ({
  edit,
  value,
  fieldOptions,
  id,
  onchange,
}: TextInputProps) => {
  const { title, field } = fieldOptions;
  const key = [id, field].join(".");
  const fieldName = [id, field].join(".");

  value = value ? value.toString() : "";

  if (!edit) return value;

  return (
    <div>
      {title && (
        <label key={key + ".label"} htmlFor={fieldName} className="form-label">
          {title}
        </label>
      )}
      <input
        aria-label={fieldName}
        name={fieldName}
        id={fieldName}
        className="form-control"
        placeholder={title}
        value={value}
        key={id}
        type="text"
        // onBlur={(e) => onBlurTest(e)}
        onChange={(e) => onchange(id, { name: field, value: e.target.value })}
      />
    </div>
  );
};

export default TextInput;
