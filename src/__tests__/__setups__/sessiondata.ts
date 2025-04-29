import { test } from "vitest";
import sessionData from "../__data__/workouts.sessions.json";
// import setsData from "./data/sets.json"
import {
  ExerciseItemType,
  SessionItemType,
  SetItemType,
} from "../../context/types";

const sessions: SessionItemType[] = [];

export const testSession = test.extend({
  sessions: async ({}, use) => {
    // setup the fixture before each test function
    sessionData.forEach((session) => {
      let newSession = {
        ...session,
        date: new Date(session.date),
        created: new Date(session.created),
        updated: new Date(session.updated),
        exercises: session.exercises.map((exercise, idx): ExerciseItemType => {
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
          return {
            ...exercise,
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
        }),
      };
      sessions.push(newSession);
    });
    // sessions.push([...sessionData]);

    // use the fixture value
    await use(sessions);

    // cleanup the fixture after each test function
    sessions.length = 0;
  },
});
