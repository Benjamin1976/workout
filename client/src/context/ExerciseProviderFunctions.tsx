import { SetItemType, ExerciseItemType } from "./types";

export const setsCompleted = (sets: SetItemType[]): boolean =>
  !sets.find((set: SetItemType): boolean => !set?.completed);

export const exerciseCompleted = (exercise: ExerciseItemType): boolean => {
  if (!exercise?.sets?.length) return true;
  return setsCompleted(exercise.sets);
};
export const exercisesCompleted = (exercises: ExerciseItemType[]) => {
  if (!exercises?.length) return true;
  return !exercises.find(
    (exercise: ExerciseItemType) => !exerciseCompleted(exercise)
  );
};

export const reIndexExercises = (
  exercises: ExerciseItemType[]
): ExerciseItemType[] => {
  return exercises.map((exercise: ExerciseItemType, i: number) => ({
    ...exercise,
    order: i,
    id: i,
  }));
};

export const reIndexSets = (sets: SetItemType[]): SetItemType[] => {
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
    nextExercise = findNextSupersetExercise(
      exercises,
      exerciseId,
      setId,
      supersetNo
    );
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
//     nextExercise = findNextSupersetExercise(
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

export const findNextSet = (sets: SetItemType[]): SetItemType | undefined => {
  if (!sets?.length) return undefined;
  return sets.find((set) => !set?.completed);
};

export const findNextSupersetExercise = (
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
  exercises: ExerciseItemType[]
): ExerciseItemType | undefined => {
  if (!exercises?.length) return undefined;
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

type updateFieldPropTypes = {
  field: string;
  value: boolean | number | string | Date | null;
};

export const updateSetOnExercises = (
  exercises: ExerciseItemType[],
  setToFind: SetItemType,
  whatToUpdate: updateFieldPropTypes[]
): ExerciseItemType[] => {
  return exercises.map((exercise: ExerciseItemType) => {
    if (!exercise?.sets?.length) return exercise;

    return {
      ...exercise,
      sets: exercise.sets.map((set: SetItemType) => {
        if (set._id !== setToFind._id) return set;
        let setUpdated = { ...set };
        whatToUpdate.forEach((update) => {
          setUpdated[update.field] =
            update?.value === null ? null : update.value;
        });
        return setUpdated;
      }),
    };
  });
};

export const deleteSetOnExercises = (
  exercises: ExerciseItemType[],
  setToFind: SetItemType
): ExerciseItemType[] => {
  return exercises.map((exercise: ExerciseItemType) => {
    if (!exercise?.sets?.length) return exercise;

    let sets = exercise.sets.filter((set: SetItemType) => {
      if (set._id !== setToFind._id) return set;
    });

    sets = sets.map((set: SetItemType, i: number) => {
      return { ...set, no: i + 1 };
    });

    return {
      ...exercise,
      sets: sets,
    };
  });
};

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
  exercise: ExerciseItemType,
  markCompleted: boolean
): ExerciseItemType => {
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

// updates all the exercise to either started/startedWhen or completed/completedWhen
//    to either false/null or true/date
//    based on if the sets are started/complete
//  TO-DO: can enhance to update exercise.startedWhen = exercise.set[0].startedWhen
//      or conversely, exercise.completedWhen = exercise.set[set.length-1].completedWhen
export const checkSetsStatus = (
  exercise: ExerciseItemType,
  startComplete: { yes: object; no: object },
  what: string
): ExerciseItemType => {
  const sets = exercise.sets;
  if (!sets?.length) return { ...exercise, ...startComplete.no };

  let updatedEx = { ...exercise };
  // check if the sets are completed
  // and check if the exercise is started or completed
  const setsStartComplete = sets.filter((set) => set?.[what]).length > 0;
  const exStartedComplete = exercise?.[what];

  if (setsStartComplete && !exStartedComplete) {
    updatedEx = { ...updatedEx, ...startComplete.yes };
  } else if (!setsStartComplete && exStartedComplete) {
    updatedEx = { ...updatedEx, ...startComplete.no };
  }
  return updatedEx;
};

// updates all the sets either started/startedWhen or completed/completedWhen
//    to either false/null or true/date
export const setAllSetsStatus = (
  exercise: ExerciseItemType,
  startComplete: { yes: object; no: object },
  what: string,
  forceYes: boolean
): ExerciseItemType => {
  let updatedExercise = { ...exercise };
  let sets = updatedExercise.sets;
  if (!sets?.length) return exercise;

  sets = sets.map((set: SetItemType) => {
    // check if the set is started or completed
    //    and only update if data is not already there
    const setStartedCompleted = set?.[what];
    // if forcing "completed" or "started" values
    //    check if the set or exercise already has values before updatinr
    // OR ... if forcing "not completed" or "not started" values
    //    check if the set or exercise already has values before updatinr
    if (forceYes && !setStartedCompleted) {
      set = { ...set, ...startComplete.yes };
    } else if (!forceYes && setStartedCompleted) {
      set = { ...set, ...startComplete.no };
    }

    return set;
  });

  updatedExercise.sets = sets;
  return updatedExercise;
};

// update the exercise status based on status of all the sets
//   i.e. if all sets completed, update exercise to completed
//   i.e. if one set started, update exercise to completed started
export const updateExStatusFromSets = (
  exercise: ExerciseItemType
): ExerciseItemType => {
  let updatedExercise;
  updatedExercise = checkSetsStatus(exercise, started, "started");
  updatedExercise = checkSetsStatus(exercise, completed, "completed");
  return updatedExercise;
};

export const updateExercisesStatus = (
  exercises: ExerciseItemType[],
  statusToForce: boolean
): ExerciseItemType[] => {
  let updatedExercises = exercises.map((exercise) => {
    let updatedExercise = { ...exercise };

    // check if to update start
    if (statusToForce && !exercise?.started) {
      updatedExercise = { ...updatedExercise, ...started.yes };
    } else if (!statusToForce && exercise?.started) {
      updatedExercise = { ...updatedExercise, ...started.no };
    }

    // check if to update complete
    if (statusToForce && !exercise?.completed) {
      updatedExercise = { ...updatedExercise, ...completed.yes };
    } else if (!statusToForce && exercise?.completed) {
      updatedExercise = { ...updatedExercise, ...completed.no };
    }
    return updatedExercise;
  });
  return updatedExercises;
};

type ExerciseStartedType = {
  started: boolean;
  startedWhen: Date | null;
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

type ExerciseCompletedType = {
  completed: boolean;
  completedWhen: Date | null;
};

export const getExerciseCompletedValues = (
  exercise: ExerciseItemType
): ExerciseCompletedType => {
  if (!exercise?.sets?.length) return completed.no;
  const setsNotDone = exercise.sets.filter((set) => !set?.completed);
  const setsNotDoneLength = setsNotDone?.length;
  console.log(setsNotDone);

  // if any set is not done, mark exercise as not completed
  if (setsNotDoneLength) return completed.no;

  // if all sets is done and exercise is already completed
  //    updated exercise with last set value
  if (exercise.completed)
    return {
      ...completed.yes,
      completedWhen: setsNotDone[setsNotDoneLength - 1].completedWhen,
    };

  // otherwise just update with new values
  return completed.yes;
};

export const updateExercisesToStarted = (
  exercises: ExerciseItemType[]
): ExerciseItemType[] => {
  return exercises.map((exercise) => updateExerciseToStarted(exercise));
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

export const updateExerciseToStarted = (
  exercise: ExerciseItemType
): ExerciseItemType => {
  const startedUpdated = getExerciseStartedValues(exercise);
  return { ...exercise, ...startedUpdated };
};

export const updateExercisesToCompleted = (
  exercises: ExerciseItemType[]
): ExerciseItemType[] => {
  return exercises.map((exercise) => updateExerciseToCompleted(exercise));
};

export const updateExerciseToCompleted = (
  exercise: ExerciseItemType
): ExerciseItemType => {
  const completedUpdate = getExerciseCompletedValues(exercise);
  return { ...exercise, ...completedUpdate };
};

export const markSets = (
  exercise: ExerciseItemType,
  markCompleted: boolean
): ExerciseItemType => {
  let update = {
    completed: markCompleted,
    completedWhen: markCompleted ? new Date() : null,
  };
  let sets = exercise.sets.map((set: SetItemType) => {
    let completed = set?.completed;
    if ((completed && markCompleted) || (!completed && !markCompleted))
      return set;
    return { ...set, ...update };
  });
  return { ...exercise, ...update, sets: sets };
};

// function isOdd(num: number): boolean { return num & 1 ? true : false}
export const getIds = (
  idString: string
): { exerciseId: number; setId?: number | null } => {
  let idsString = idString.split(".").filter((_, i) => (i & 1 ? true : false));
  let ids = idsString.map((id) => parseInt(id));
  return { exerciseId: ids[0], setId: ids.length > 1 ? ids[1] : undefined };
};

const updateSetFieldValues = (
  objectToUpdate: SetItemType,
  whatToUpdate: updateFieldPropTypes[]
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

const updateExerciseFieldValues = (
  objectToUpdate: ExerciseItemType,
  whatToUpdate: updateFieldPropTypes[]
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
  whatToUpdate: updateFieldPropTypes[],
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
  whatToUpdate: updateFieldPropTypes[],
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
