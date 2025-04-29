import { DateTime, DurationUnit, DurationUnits } from "luxon";
import { ReactElement, ReactNode } from "react";
import { UpdateValueType } from "../context/ExerciseProvider";
import {
  ExerciseItemType,
  SessionItemType,
  SessionListItemType,
  SetItemType,
} from "../context/types";

export type ConfigJSONType = {
  headers: {
    "Content-Type": string;
  };
};

export const configJSON: ConfigJSONType = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getNowTime = () => {
  const time = new Date();
  return time.setSeconds(time.getSeconds());
};

export const getExpiryTime = (timeDefault = 90): DateTime => {
  const time = DateTime.local().plus({ seconds: timeDefault });
  return time.isValid ? time : DateTime.local();
  // const time = new Date();
  // time.setSeconds(time.getSeconds() + timeDefault);
  // return time;
};

export const dbMsg = (lvl: number, dbl: number, msg: string) => {
  const includeTime = false;
  const dbgLevel = dbl === null || dbl === undefined ? 0 : dbl;
  // let dtStamp = DateTime.now().toFormat("yyyy-LL-dd hh:mm:ss,");
  const dtStamp = DateTime.now().toFormat("yyyy-LL-dd hh:mm:ss.SSS");
  msg = includeTime ? dtStamp + ": " + msg : msg;
  if (dbgLevel >= lvl) console.log(msg);
};

export const dbMsgLarge = (
  lvl: number,
  dbl: number,
  msg: string,
  data: unknown
) => {
  const dbgLevel = dbl === null || dbl === undefined ? 0 : dbl;
  if (dbgLevel >= lvl) {
    if (msg) console.log(msg);
    if (data) console.log(data);
  }
};

export const existsNotNull = (item: unknown) =>
  item && item !== undefined && item !== null;

export const isCurrentSession = (
  currentSession: SessionItemType | SessionListItemType | null,
  sessionId: string
): boolean =>
  currentSession && currentSession?._id === sessionId ? true : false;

export const isCurrentExercise = (
  currentExercise: ExerciseItemType | null,
  exerciseId: number
): boolean =>
  currentExercise && currentExercise?.id === exerciseId ? true : false;

export const isCurrentSet = (
  currentSet: SetItemType | null,
  setId: number
): boolean => (currentSet && currentSet?.id === setId ? true : false);

export const classNames = {
  rowClasses: {
    notStarted: " text-black",
    started: "bg-warning text-black",
    completed: "bg-success text-white",
  },
  textClasses: {
    notStarted: " text-black",
    started: " text-black",
    completed: " text-white",
    delete: " text-danger",
  },
  headerRowClasses: {
    notStarted: "bg-primary text-white",
    started: "bg-primary text-white",
    completed: "bg-success text-white",
  },
  buttonClasses: {
    // base: "btn border-0 p-2 mx-1 ",
    base: "btn border-0 p-1 mx-2 my-1 ",

    notStarted: "bg-white text-black",
    started: "bg-warning text-black",
    completed: "bg-success text-white",
  },
  textClass: {
    notStarted: "text-black",
    started: "text-black",
    completed: "text-white",
  },
  headerTextClass: {
    notStarted: "text-white",
    started: "text-white",
    completed: "text-white",
  },
};

export const getClass = (
  rowOrHead: string,
  buttonNotText: boolean,
  item: ExerciseItemType | SetItemType
): string => {
  const { buttonClasses, rowClasses, headerRowClasses } = classNames;
  const className = buttonNotText ? classNames.buttonClasses.base : "";

  let classes = rowClasses;
  switch (rowOrHead) {
    case "row": {
      classes = buttonNotText ? buttonClasses : rowClasses;
      break;
    }
    case "header": {
      classes = headerRowClasses;
      break;
    }
  }

  return (
    className +
    (item?.completed
      ? classes.completed
      : item?.started
      ? classes.started
      : classes.notStarted)
  );
};

export const completedButtonClass = (completed: boolean): string =>
  "btn border-0 p-1 ms-1 " + (!completed ? "bg-white " : "bg-success ");

export const completedButtonHeaderClass = (completed: boolean): string =>
  " btn border-0 p-2 mx-1" + (!completed ? " bg-primary " : " bg-success ");

export const completedTextClass = (completed: boolean): string =>
  !completed ? " text-black " : " text-white ";

export const completedHeaderTextClass = (completed: boolean): string =>
  !completed ? " text-white " : " text-white ";

export const completedRowClass = (completed: boolean): string =>
  completed ? "bg-success text-white " : "";

export const completedHeaderRowClass = (completed: boolean): string =>
  completed ? " bg-success text-white " : " bg-primary text-white ";

const onBlurTest = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  console.log("onBlur");
};

export const cleanFilters = (filters: { [key: string]: string | number }) => {
  if (filters) {
    for (const property in filters)
      if (filters[property] === "" || filters[property] === null)
        delete filters[property];
  }
  return filters;
};

// const onChangeTest = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// ) => {
//   e.preventDefault();
//   // console.log("onBlur");
// };

// const onChangeSelectTest = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   e.preventDefault();
//   // console.log("onBlur");
// };

export const vOrR = (
  data:
    | SessionItemType
    | Partial<SessionItemType>
    | ExerciseItemType
    | SetItemType,
  fields: {
    field: string;
    type: string;
    title?: string;
    options?: string[];
  },
  edit: boolean,
  func: (
    data: SessionItemType | ExerciseItemType | SetItemType | unknown,
    id: string,
    update: UpdateValueType
  ) => void,
  id: string | null | undefined
): string | ReactElement | undefined => {
  if (id === undefined || id === null) return "";
  const { title, field, type } = fields;
  let value = data[field];
  const key = [id, field].join(".");
  value = value === null || value === undefined ? "" : value;

  switch (type.toLowerCase()) {
    case "text": {
      if (!edit) {
        return value.toString();
      }
      return (
        <div>
          {title && (
            <label
              key={key + ".label"}
              htmlFor="exampleFormControlInput1"
              className="form-label"
            >
              {title}
            </label>
          )}
          <input
            className="form-control"
            value={value.toString()}
            name={key}
            key={key}
            type={type}
            onChange={(e) =>
              func(data, id, { name: field, value: e.target.value })
            }
          />
        </div>
      );
    }
    case "date": {
      value = value.toString();
      if (!edit) return dateFormat(value);
      return (
        <div>
          {title && (
            <label
              key={key + ".label"}
              htmlFor="exampleFormControlInput1"
              className="form-label"
            >
              {title}
            </label>
          )}
          <input
            id="exampleFormControlInput1"
            className="form-control"
            value={value === "" ? value : dateFormatCtl(value)}
            name={key}
            key={key}
            type={type}
            onBlur={(e) => onBlurTest(e)}
            onChange={(e) =>
              func(data, id, { name: field, value: e.target.value })
            }
          />
        </div>
      );
    }
    case "select": {
      if (typeof value === "string") {
        if (!edit) return dateFormat(value);
      }
      value = value.toString();

      return (
        <div>
          {title && (
            <label
              key={key + ".label"}
              htmlFor="exampleFormControlInput1"
              className="form-label"
            >
              {title}
            </label>
          )}
          <select
            className="form-select form-select-sm"
            value={value}
            name={key}
            key={key}
            // onChange={(e) => onChangeSelectTest(e)}
            onChange={(e) =>
              func(data, id, { name: field, value: e.target.value })
            }
          >
            {!fields || !fields.options?.length
              ? ""
              : fields.options.map((option: string, idx: number): ReactNode => {
                  return (
                    <option
                      key={key + ".option." + idx.toString()}
                      value={option}
                    >
                      {option}
                    </option>
                  );
                })}
          </select>
        </div>
      );
    }
    default: {
      throw new Error("Field type not passed for valueOrRender");
    }
  }
};

export const emojiIcons = [
  { label: "woozy", icon: "🥴", value: 1 },
  // { label: "tired", icon: "😩", value: 2 },
  { label: "weary", icon: "😩", value: 2 },
  { label: "ok", icon: "😑", value: 3 },
  { label: "grinning", icon: "😀", value: 4 },
  { label: "flexed", icon: "💪", value: 5 },
];

export const getEmojiIcon = (value: number): string => {
  return emojiIcons.filter((icon) => icon.value === value)[0].icon;
};

export const dateFormat = (value: null | string): string => {
  if (!value) return "";
  const dateTime = DateTime.fromISO(value.toString());
  return dateTime.isValid
    ? dateTime.toFormat("dd-MMM-yy").toString()
    : value.toString();
};

export const dateFormatCtl = (value: null | string): string => {
  if (!value) return "";
  const dateTime = DateTime.fromISO(value.toString());
  return dateTime.isValid
    ? dateTime.toFormat("yyyy-LL-dd").toString()
    : value.toString();
};

export const agoDateString = (dateCompare: DateTime): string => {
  if (!dateCompare.isValid) return dateCompare.toString();

  let units: DurationUnits = ["years", "months", "weeks"];
  units = [...units, "days", "hours", "minutes", "seconds"];

  const dateNew = DateTime.now();
  const diff = dateNew.diff(dateCompare, units);
  let agoString: string = "";

  units.forEach((unit: DurationUnit) => {
    const unitValue = diff.get(unit);
    if (!agoString && unitValue >= 1) {
      const unitString =
        unitValue >= 2 ? unit : unit.substring(0, unit.length - 1);
      agoString = `${Math.round(unitValue)} ${unitString} ago`;
    }
  });
  return agoString || "moments ago";
};

// const dateFormat = (value: Date): string =>
//   new Intl.DateTimeFormat("en-AU").format(value);
