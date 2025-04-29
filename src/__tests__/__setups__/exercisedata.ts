import { test } from "vitest";
import exerciseData from "../__data__/exercises.json";
import {
  ExerciseItemType,
  ExerciseNameType,
  SetItemType,
} from "../../context/types";

let expectedExSetOrder = [
  [2, 0],
  [2, 1],
  [2, 2],
  [3, 0],
  [4, 0],
  [3, 1],
  [4, 1],
  [3, 2],
  [4, 2],
  [5, 0],
  [6, 0],
  [5, 1],
  [6, 1],
  [5, 2],
  [6, 2],
  [7, 0],
  [7, 1],
  [7, 2],
  [8, 0],
  [9, 0],
  [8, 1],
  [9, 1],
  [8, 2],
  [9, 2],
];

export type CompletedType = {
  started: boolean;
  startedWhen: Date | null;
  completed: boolean;
  completedWhen: Date | null;
};

const exercises: ExerciseItemType[] = [];
const nextExercises: ExerciseItemType[] = [];
const notCompletedSetExs: number[][] = expectedExSetOrder;
const dateStamp = new Date(new Date().toDateString());
let completed: CompletedType = {
  started: true,
  startedWhen: dateStamp,
  completed: true,
  completedWhen: dateStamp,
};
let notCompleted: CompletedType = {
  started: false,
  startedWhen: null,
  completed: false,
  completedWhen: null,
};

// const notCompletedExs: number[][] = expectedExOrder;

export const fillExerciseTestData = (
  exerciseData: ExerciseItemType[] | any
) => {
  const getName = (ex: ExerciseItemType, idx: number) => {
    let exName: ExerciseNameType = ex.name;
    let exerciseName: ExerciseNameType = {
      _id: exName._id,
      name: exName?.name ?? "Exercise " + idx,
    };
    if (exName.created) exerciseName.created = new Date(exName.created);
    if (exName.updated) exerciseName.updated = new Date(exName.updated);
    return exerciseName;
  };

  let dateStamp = new Date(new Date().toDateString());
  let exercises: ExerciseItemType[] = [];
  exerciseData.forEach((ex: ExerciseItemType, idx: number) => {
    let newExercise: ExerciseItemType = {
      ...ex,
      name: getName(ex, idx),
      supersetNo: !ex?.supersetNo ? null : ex.supersetNo.toString(),
      startedWhen: !ex?.startedWhen ? null : dateStamp,
      completedWhen: !ex?.completedWhen ? null : dateStamp,
      // startedWhen: !ex?.startedWhen ? null : new Date(ex.startedWhen),
      // completedWhen: !ex?.completedWhen ? null : new Date(ex.completedWhen),
      sets: !ex?.sets?.length
        ? []
        : ex.sets.map((set): SetItemType => {
            return {
              ...set,
              // startedWhen: !set?.startedWhen ? null : new Date(set.startedWhen),
              // completedWhen: !set?.completedWhen
              //   ? null
              //   : new Date(set.completedWhen),
              startedWhen: !set?.startedWhen ? null : dateStamp,
              completedWhen: !set?.completedWhen ? null : dateStamp,
            };
          }),
    };
    exercises.push(newExercise);
  });
  return exercises;
};

export const setExsSetsNotStarted = (exercises: ExerciseItemType[] | any) => {
  let startExSet = [2, 1];
  return exercises.map((exercise: ExerciseItemType, eIdx: number) => {
    let firstEx = eIdx === startExSet[0];
    let greaterThanFirst = eIdx >= startExSet[0];
    if (!greaterThanFirst) return exercise;

    return {
      ...exercise,
      started: false,
      startedWhen: null,
      completed: false,
      completedWhen: null,
      sets: !exercise?.sets.length
        ? []
        : exercise.sets.map((set: SetItemType, setIdx: number) => {
            if (firstEx && setIdx < startExSet[1]) return set;
            return {
              ...set,
              started: false,
              startedWhen: null,
              completed: false,
              completedWhen: null,
            };
          }),
    };
  });
};

export const testExercise = test.extend({
  exercises: async ({}, use) => {
    // setup the fixture before each test function
    let newExercises = fillExerciseTestData(exerciseData);
    exercises.push(...newExercises);

    // use the fixture value
    await use(exercises);

    // cleanup the fixture after each test function
    exercises.length = 0;
  },
  nextExercises: async ({}, use) => {
    // console.log("here1:");
    // console.log(exerciseData[1]);
    let nextExs = setExsSetsNotStarted(exerciseData);
    // console.log("here2:");
    // console.log(nextExs[1]);
    nextExercises.push(...nextExs);

    // use the fixture value
    await use(nextExercises);

    // cleanup the fixture after each test function
    nextExercises.length = 0;
  },
  notCompletedSetExs: async ({}, use) => {
    // notCompletedSetExs.push(...expectedExSetOrder);

    // use the fixture value
    await use(notCompletedSetExs);

    // cleanup the fixture after each test function
    notCompletedSetExs.length = 0;
  },
  completed: async ({}, use) => {
    // use the fixture value
    await use(completed);

    // cleanup the fixture after each test function
    // completed = null;
  },
  notCompleted: async ({}, use) => {
    // use the fixture value
    await use(notCompleted);

    // cleanup the fixture after each test function
    // notCompleted = null;
  },
});
