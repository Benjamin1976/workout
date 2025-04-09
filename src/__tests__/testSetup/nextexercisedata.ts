import { test } from "vitest";
import exerciseData from "../data/exercises.json";
import { ExerciseItemType, SetItemType } from "../../context/types";

const exercises: ExerciseItemType[] = [];

export const testExercise = test.extend({
  exercises: async ({}, use) => {
    // setup the fixture before each test function
    exerciseData.forEach((exercise, idx) => {
      let exerciseName: {
        _id: string;
        name: string;
        comments?: string;
        created?: Date;
        updated?: Date;
      } = {
        _id: exercise.name._id,
        name: exercise?.name?.name ?? "Exercise " + idx,
      };
      if (exercise.name.created)
        exerciseName.created = new Date(exercise.name.created);
      if (exercise.name.updated)
        exerciseName.updated = new Date(exercise.name.updated);
      let newExercise: ExerciseItemType = {
        ...exercise,
        supersetNo: !exercise?.supersetNo
          ? null
          : exercise.supersetNo.toString(),
        name: exerciseName,
        startedWhen: !exercise?.startedWhen
          ? null
          : new Date(exercise.startedWhen),
        completedWhen: !exercise?.completedWhen
          ? null
          : new Date(exercise.completedWhen),
        sets: exercise.sets.map((set): SetItemType => {
          return {
            ...set,
            startedWhen: !exercise?.startedWhen
              ? null
              : new Date(exercise.startedWhen),
            completedWhen: !exercise?.completedWhen
              ? null
              : new Date(exercise.completedWhen),
          };
        }),
      };
      exercises.push(newExercise);
    });

    // use the fixture value
    await use(exercises);

    // cleanup the fixture after each test function
    exercises.length = 0;
  },
});
