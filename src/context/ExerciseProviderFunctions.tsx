import {
  SetItemType,
  ExerciseItemType,
  ExerciseStartedType,
  ExerciseCompletedType,
  UpdateFieldPropTypes,
} from "./types";

export const setsCompleted = (sets: SetItemType[] | null): boolean => {
  if (!sets || !sets?.length) return true;
  return !sets.find((set: SetItemType): boolean => !set?.completed);
};

export const exerciseCompleted = (
  exercise: ExerciseItemType | null
): boolean => {
  if (!exercise?.sets || !exercise?.sets?.length) return true;
  return setsCompleted(exercise.sets);
};

export const exercisesCompleted = (exercises: ExerciseItemType[] | null) => {
  if (!exercises || !exercises?.length) return true;
  return !exercises.find(
    (exercise: ExerciseItemType) => !exerciseCompleted(exercise)
  );
};

export const reIndexExercises = (
  exercises: ExerciseItemType[] | null
): ExerciseItemType[] => {
  if (!exercises || !exercises.length) return [];
  return exercises.map((exercise: ExerciseItemType, i: number) => ({
    ...exercise,
    order: i,
    id: i,
  }));
};

export const reIndexSets = (sets: SetItemType[] | null): SetItemType[] => {
  if (!sets || !sets.length) return [];
  return sets.map((set: SetItemType, i: number) => ({
    ...set,
    no: i + 1,
    id: i,
    order: i,
  }));
};

export const getNextExerciseAndSet = (
  exercises: ExerciseItemType[],
  exerciseId: number,
  setId: number
): { nextExercise: ExerciseItemType | null; nextSet: SetItemType | null } => {
  // return { nextExercise: nextExercise ?? exercise, nextSet: nextSet ?? startingSet };
  if (!exercises?.length) return { nextExercise: null, nextSet: null };

  const exercise = exercises[exerciseId];
  const startingSet = exercises[exerciseId].sets[setId];
  const supersetNo = exercise?.supersetNo ?? null;

  let nextExercise, nextSet;
  if (supersetNo) {
    nextExercise = findNextSupersetEx(exercises, exerciseId, setId, supersetNo);
  }
  if (!nextExercise) {
    nextExercise = findNextExercise(exercises);
  }
  if (nextExercise) {
    let nexExerciseId = nextExercise.order;
    nextSet = findNextSet(exercises[nexExerciseId].sets);
  }
  return {
    nextExercise: nextExercise ?? exercise,
    nextSet: nextSet ?? startingSet,
  };
};
// export const getNextExerciseAndSet = (
//   exercises: ExerciseItemType[],
//   exercise: ExerciseItemType | null,
//   set: SetItemType | null
// ): { nextExercise: ExerciseItemType | null; nextSet: SetItemType | null } => {
//   const exerciseId = exercise?.order ? exercise.order : 0;
//   const setId = set?.order ? set.order : 0;
//   const supersetNo = exercise?.supersetNo ?? null;

//   let nextExercise, nextSet;
//   if (supersetNo) {
//     nextExercise = findNextSupersetEx(
//       exercises,
//       exerciseId,
//       setId,
//       supersetNo
//     );
//   }
//   if (!nextExercise) {
//     nextExercise = findNextExercise(exercises);
//   }
//   if (nextExercise) {
//     let nexExerciseId = nextExercise.order;
//     nextSet = findNextSet(exercises[nexExerciseId].sets);
//   }
//   return { nextExercise: nextExercise ?? exercise, nextSet: nextSet ?? set };
// };

export const findNextSet = (
  sets: SetItemType[] | null
): SetItemType | undefined => {
  if (!sets || !sets?.length) return undefined;
  return sets.find((set) => !set?.completed);
};

export const findNextSupersetEx = (
  exercises: ExerciseItemType[],
  exerciseId: number,
  setId: number,
  supersetNo: string
): ExerciseItemType | undefined => {
  if (!exercises?.length) return undefined;
  return exercises.find((exercise, idx) => {
    const isPriorExercise = idx < exerciseId + 1;
    const hasSets = !!exercise?.sets?.length;
    const nextExDoesntHaveSetId = exercise.sets.length - 1 < setId;
    const isSuperSet = exercise?.supersetNo;
    const sameSuperSet = exercise.supersetNo === supersetNo;
    const setCompleted = exercise.sets[setId]?.completed;
    if (
      isPriorExercise ||
      !hasSets ||
      nextExDoesntHaveSetId ||
      !isSuperSet ||
      !sameSuperSet ||
      setCompleted
    )
      return undefined;
    return true;
  });
};

export const findNextExercise = (
  exercises: ExerciseItemType[] | null
): ExerciseItemType | undefined => {
  if (!exercises || !exercises?.length) return undefined;
  return exercises.find((exercise) => {
    if (!exercise?.sets?.length) return undefined;
    return !setsCompleted(exercise?.sets);
  });
};
// export const findNextExercise = (
//   exercises: ExerciseItemType[],
//   exerciseId: number,
//   getNextNotFirst: boolean
// ): ExerciseItemType | undefined => {
//   if (!exercises?.length) return undefined;
//   return exercises.find((exercise, idx) => {
//     if (!exercise?.sets?.length) return undefined;
//     if (getNextNotFirst && idx < exerciseId) return undefined;
//     let setNotDone = findNextSet(exercise.sets);
//     return setNotDone;
//   });
// };

export const started = {
  text: "started",
  yes: { started: true, startedWhen: new Date() },
  no: { started: false, startedWhen: null },
};

export const completed = {
  text: "completed",
  yes: { completed: true, completedWhen: new Date() },
  no: { completed: false, completedWhen: null },
};

export const updateTheExerciseStatus = (
  exercise: ExerciseItemType | null,
  markCompleted: boolean
): ExerciseItemType | null => {
  if (exercise === null || exercise === undefined) return exercise;

  exercise.sets = exercise.sets.map((set: SetItemType) => {
    if (markCompleted) {
      if (!set?.started) {
        set = { ...set, ...started.yes };
      }
      if (!set?.completed) {
        set = { ...set, ...completed.yes };
      }
    } else {
      if (set?.started) {
        set = { ...set, ...started.no };
      }
      if (set?.completed) {
        set = { ...set, ...completed.no };
      }
    }
    return set;
  });
  if (markCompleted) {
    if (!exercise?.started) {
      if (!exercise?.started) {
        exercise = { ...exercise, ...started.yes };
      }
      if (!exercise?.completed) {
        exercise = { ...exercise, ...completed.yes };
      }
    }
  } else {
    if (exercise?.started) {
      exercise = { ...exercise, ...started.no };
    }
    if (exercise?.completed) {
      exercise = { ...exercise, ...completed.no };
    }
  }
  return exercise;
};

export const updateAllExsStatus = (
  exercises: ExerciseItemType[],
  makeCompleted: boolean
): ExerciseItemType[] => {
  if (exercises === null || exercises === undefined) return exercises;

  return exercises.map((exercise) => {
    let updatedEx = { ...exercise };
    let sets = updatedEx.sets;
    updatedEx.sets = sets.map((set) => {
      let setStarted = set?.started;
      let setCompleted = set?.completed;

      if (makeCompleted) {
        if (!setStarted) {
          set = { ...set, ...started.yes };
        }
        if (!setCompleted) {
          set = { ...set, ...completed.yes };
        }
      } else {
        if (setStarted) {
          set = { ...set, ...started.no };
        }
        if (setCompleted) {
          set = { ...set, ...completed.no };
        }
      }
      return set;
    });
    if (makeCompleted) {
      if (!updatedEx?.started) {
        updatedEx = { ...updatedEx, ...started.yes };
      }
      if (!updatedEx?.completed) {
        updatedEx = { ...updatedEx, ...completed.yes };
      }
    } else {
      if (updatedEx?.started) {
        updatedEx = { ...updatedEx, ...started.no };
      }
      if (updatedEx?.completed) {
        updatedEx = { ...updatedEx, ...completed.no };
      }
    }
    return updatedEx;
  });
};

export const getExerciseStartedValues = (
  exercise: ExerciseItemType
): ExerciseStartedType => {
  if (!exercise?.sets?.length) return started.no;
  const setsstarted = exercise.sets.filter((set) => set?.started);

  // if a set has started, update exercise with start from 1st set
  if (setsstarted?.length)
    return { ...started.yes, startedWhen: setsstarted[0].startedWhen };

  // else if not started, mark no
  return started.no;
};

export const getExerciseCompletedValues = (
  exercise: ExerciseItemType
): ExerciseCompletedType => {
  if (!exercise?.sets || !exercise?.sets?.length) return completed.yes;
  const setsNotDone = exercise.sets.filter((set) => !set?.completed);
  const setsNotDoneLength = setsNotDone?.length;
  const lastSet = setsNotDone?.[setsNotDoneLength - 1];

  // if any set is not done, mark exercise as not completed
  if (setsNotDoneLength > 0) return completed.no;

  // if all sets is done and exercise is already completed
  //    updated exercise with last set value
  if (exercise.completed && lastSet?.completedWhen) {
    return {
      ...completed.yes,
      completedWhen: setsNotDone[setsNotDoneLength - 1].completedWhen,
    };
  }

  // otherwise just update with new values
  return completed.yes;
};

export const updateExerciseStartedCompleted = (
  updateWhat: string,
  exercise: ExerciseItemType
): ExerciseItemType => {
  const updateStarted = updateWhat === "started";
  const startCompleteValues = updateStarted
    ? getExerciseStartedValues(exercise)
    : getExerciseCompletedValues(exercise);
  return { ...exercise, ...startCompleteValues };
};

// function isOdd(num: number): boolean { return num & 1 ? true : false}
export const getIds = (
  idString: string
): { exerciseId: number; setId?: number | null } => {
  let idsString = idString.split(".").filter((_, i) => (i & 1 ? true : false));
  let ids = idsString.map((id) => parseInt(id));
  return { exerciseId: ids[0], setId: ids.length > 1 ? ids[1] : undefined };
};

export const updateSetFieldValues = (
  objectToUpdate: SetItemType,
  whatToUpdate: UpdateFieldPropTypes[]
) => {
  let objUpdated = { ...objectToUpdate };
  whatToUpdate.forEach((update) => {
    if (update.field in objUpdated) {
      objUpdated[update.field] =
        update?.value !== undefined && update?.value !== null
          ? update.value
          : null;
    }
  });
  return objUpdated;
};

export const updateExerciseFieldValues = (
  objectToUpdate: ExerciseItemType,
  whatToUpdate: UpdateFieldPropTypes[]
) => {
  let objUpdated = { ...objectToUpdate };
  whatToUpdate.forEach((update) => {
    if (update.field in objUpdated) {
      objUpdated[update.field] = update?.value !== null ? update.value : null;
    }
  });
  return objUpdated;
};

export const updateSetItem = (
  ids: string,
  exercises: ExerciseItemType[],
  whatToUpdate: UpdateFieldPropTypes[],
  updateAllItems: boolean = false
): ExerciseItemType[] => {
  let { exerciseId, setId } = getIds(ids);

  if (!updateAllItems && (setId === null || setId === undefined)) {
    throw new Error("setId missing in Update Set function");
  }

  let newExercises = [...exercises];
  let sets = newExercises[exerciseId].sets;
  sets = sets.map((set, idx) => {
    if (idx === setId || updateAllItems) {
      return updateSetFieldValues(set, whatToUpdate);
    } else {
      return set;
    }
  });
  newExercises[exerciseId].sets = sets;
  return newExercises;
};

export const updateExerciseItem = (
  ids: string,
  exercises: ExerciseItemType[],
  whatToUpdate: UpdateFieldPropTypes[],
  updateAllItems: boolean = false
): ExerciseItemType[] => {
  let { exerciseId } = getIds(ids);

  if (!updateAllItems && (exerciseId === null || exerciseId === undefined)) {
    throw new Error("exerciseId missing in Update Exercise function");
  }

  let newExercises = [...exercises];
  newExercises = newExercises.map(
    (exercise: ExerciseItemType, idx: number): ExerciseItemType => {
      if (idx === exerciseId || updateAllItems) {
        return updateExerciseFieldValues(exercise, whatToUpdate);
      } else {
        return exercise;
      }
    }
  );
  return newExercises;
};
