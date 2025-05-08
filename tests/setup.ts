import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/* 

ExerciseItemButtonsBottom: react bootstrap dropdown testing
- convert bootstrap dropdown to react dropdown
- or: mock the dropdown state

SessionItem:
- Work out how to validate the date in the date dropdown fiel

ExerciseDropDownButtons: *** Check if this is required as it's also tested in the common component tests: ButtonsDropDown.test.tsx 
- it.todo("should render the dropdown menu when clicked", () => {});
- it.todo("should hide the dropdown menu when clicked again", () => {});
- it.todo("should hide the dropdown menu when clicked away", () => {});
- it.todo("should render the buttons on the dropdown menu", () => {});
- it.todo("should render the buttons on the dropdown menu", () => {});

ExerciseItem
- Display Mode
    - checking for text value in page may not be the best way to test.  e.g. for null valuest etc 


Timer:
- test time buttons are executed

Complete Exercise
- somehow mock the session, and check the status of the exercise


      vi.mock("../../../src/hooks/useExercise", { spy: true });
      // vi.mock('./src/calculator.ts', { spy: true })

      // calculator(1, 2)

      // expect(calculator).toHaveBeenCalledWith(1, 2)
      // expect(calculator).toHaveReturned(3)


          //   vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
    //     ...mockExerciseProvider,
    //     // [name]: func,
    //   });



    
    it.todo(
      "should mark all sets as completed if clicked completed",
      async () => {
        testExercise = {
          ...testExercise,
          ...notStarted,
          ...notCompleted,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...notStarted, ...notCompleted };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", { name: "pending" });
        await user.click(completedButton);

        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(completedRowClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should mark all sets as not completed if clicked uncompleted",
      async () => {
        testExercise = {
          ...testExercise,
          ...started,
          ...completed,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...started, ...completed };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = notStartedHeaderClass;
        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(notCompletedClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should not change the started status when marking uncompleted",
      async () => {
        testExercise = {
          ...testExercise,
          ...started,
          ...completed,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...started, ...completed };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = "";
        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(notCompletedClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should mark the started status completed when marking completed",
      async () => {}
    );

    it.todo(
      "should not change the started status when marking uncompleted",
      async () => {}
    );
  });





















 describe("Complete function", () => {
    // const expectStartedCompleted = (exerciseOrSet: ExerciseItemType  | SetItemType, started?: boolean, completed?: boolean) => {

    //   if (started !== undefined) {
    //   if (started) {
    //   expect(exerciseOrSet.started).toBe(true);
    //   expect(exerciseOrSet.startedWhen).not.toBeNull();
    // } else {
    //     expect(exerciseOrSet.started).toBe(false);
    //     expect(exerciseOrSet.startedWhen).toBeNull();
    //   }
    // }

    //   if (completed !== undefined) {
    //   if (completed) {
    //     expect(exerciseOrSet.completed).toBe(true);
    //     expect(exerciseOrSet.completedWhen).not.toBeNull();
    //   } else {
    //     expect(exerciseOrSet.completed).toBe(false);
    //     expect(exerciseOrSet.completedWhen).toBeNull();
    //   }
    // }
    // }

    it("should mark the exercise with green styling if clicked completed", async () => {
      const mockCurrentSession = getSessionInitialValues(1)
      
      testExercise = {
        ...testExercise,
        ...notStarted,
        ...notCompleted,
        visible: true,
      };

      const { clickCompleted, checkRowClass } = renderComponent(
        testExercise,
        false,
        false
      );

      await clickCompleted();

      checkRowClass(completedHeaderClass);

      const { completeExercise } = useExercise();
      expect(completeExercise).toHaveBeenCalledTimes(1);
    });

    it("should mark the exercise with non-green styling if clicked not complete", async () => {
      testExercise = {
        ...testExercise,
        ...started,
        ...completed,
        visible: true,
      };

      const { clickCompleted, checkRowClass } = renderComponent(
        testExercise,
        false,
        false
      );

      await clickCompleted();

      checkRowClass(notCompletedHeaderClass);

      // expect(testExercise.started).toBe(true);
      // expect(testExercise.startedWhen).not.toBeNull();
      // expect(testExercise.completed).toBe(true);
      // expect(testExercise.completedWhen).not.toBeNull();
    });

    // it("should mark the exercise as completed if clicked completed", async () => {
    //   testExercise = {
    //     ...testExercise,
    //     ...notStarted,
    //     ...notCompleted,
    //     visible: true,
    //   };

    //   vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
    //     ...mockExerciseProvider,
    //     // [name]: func,
    //   });
    //   // vi.spyOn(ExerciseContextModule, "default").mockReturnValue({
    //   //   ...mockExerciseProvider,
    //   //   // [name]: func,
    //   // });

    //   const { user } = renderComponent(testExercise, false, false);

    //   const completeButton = getButton(id, "completeExercise");
    //   expect(completeButton).toHaveTextContent("pending");

    //   await user.click(completeButton);

    //   const completedClass = completedHeaderClass;
    //   const exerciseRow = screen.getByRole("row", { name: id });
    //   expect(exerciseRow).toHaveClass(completedClass);

    //   // expect(testExercise.started).toBe(true);
    //   // expect(testExercise.startedWhen).not.toBeNull();
    //   // expect(testExercise.completed).toBe(true);
    //   // expect(testExercise.completedWhen).not.toBeNull();
    // });

    it.todo(
      "should mark the exercise as not completed if unclicked completed",
      async () => {
        testExercise = {
          ...testExercise,
          started: true,
          startedWhen: new Date(),
          completed: true,
          completedWhen: new Date(),
          visible: true,
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = notCompletedHeaderClass;
        const exerciseRow = screen.getByRole("row", { name: id });
        expect(exerciseRow).toHaveClass(notCompletedClass);

        expect(testExercise.started).toBe(true);
        expect(testExercise.startedWhen).not.toBeNull();
        expect(testExercise.completed).toBe(false);
        expect(testExercise.completedWhen).toBeNull();
      }
    );

    it.todo(
      "should mark all sets as completed if clicked completed",
      async () => {
        testExercise = {
          ...testExercise,
          ...notStarted,
          ...notCompleted,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...notStarted, ...notCompleted };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", { name: "pending" });
        await user.click(completedButton);

        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(completedRowClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should mark all sets as not completed if clicked uncompleted",
      async () => {
        testExercise = {
          ...testExercise,
          ...started,
          ...completed,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...started, ...completed };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = notCompletedRowClass;
        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(notCompletedClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should not change the started status when marking uncompleted",
      async () => {
        testExercise = {
          ...testExercise,
          ...started,
          ...completed,
          visible: true,
          sets: testExercise.sets.map((set) => {
            return { ...set, ...started, ...completed };
          }),
        };

        const { user } = renderComponent(testExercise, false, false);

        // const completedButton = screen.getByRole("button", {name: "completeExercise"})
        const completedButton = screen.getByRole("button", {
          name: "check_circle",
        });
        await user.click(completedButton);

        const notCompletedClass = "";
        testExercise.sets.forEach((set, idx) => {
          const setRow = screen.getByRole("row", {
            name: [id, "set", idx].join("."),
          });
          expect(setRow).toHaveClass(notCompletedClass);

          expect(set.started).toBe(true);
          expect(set.startedWhen).not.toBeNull();
          expect(set.completed).toBe(true);
          expect(set.completedWhen).not.toBeNull();
        });
      }
    );

    it.todo(
      "should mark the started status completed when marking completed",
      async () => {}
    );

    it.todo(
      "should not change the started status when marking uncompleted",
      async () => {}
    );
  });


*/
