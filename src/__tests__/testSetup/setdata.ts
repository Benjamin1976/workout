import { test } from "vitest";
import setsData from "../data/sets.json";
import { SetItemType } from "../../context/types";

const sets: SetItemType[] = [];

export const testSet = test.extend({
  sets: async ({}, use) => {
    // setup the fixture before each test function
    setsData.forEach((set) => {
      let newSet = {
        ...set,
        startedWhen: new Date(set.startedWhen),
        completedWhen: new Date(set.completedWhen),
      };
      sets.push(newSet);
    });

    // use the fixture value
    await use(sets);

    // cleanup the fixture after each test function
    sets.length = 0;
  },
});
