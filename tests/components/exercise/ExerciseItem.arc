
  //   // have checked all elements exist in display mode
  //   // TO-DO:
  //   // - need click the appropriate buttons and see the effect of clicking
  //   // - need to somehow mock edit mode and check all fields exist in edit mode
  //   // - need to work out how to mock the onclick functions to see if clicked and any result on state

  //   describe("Testing Testing", () => {
  //     it("mock the context and check function called", async () => {
  //       const mockAddSet = vi.fn();
  //       const mockReorderExercise = vi.fn();

  //       // Mock the hook
  //       vi.spyOn(ExerciseContextModule, "useExercise").mockReturnValue({
  //         state: {
  //           currentSession: { exercises: [{ sets: [{ no: 1 }, { no: 2 }] }] },
  //         },
  //         addSet: mockAddSet,
  //         reorderExercise: mockReorderExercise,
  //       });

  //       const { user } = renderComponent(testExercise, false, false);
  //       const addSetButton = screen.getByRole("button", {
  //         name: "arrow_upward",
  //         // name: "add",
  //       });

  //       // fireEvent.click(addSetButton);
  //       await user.click(addSetButton);

  //       expect(mockReorderExercise).toHaveBeenCalledTimes(1);
  //       // expect(mockAddSet).toHaveBeenCalledTimes(1);
  //     });
  //   });

  //   describe.skip("Edit mode", () => {
  //     it.todo("should render the textbox fields", () => {});

  //     it.todo("should render the select field", () => {});

  //     it.todo("should update the input fields when data is entered", () => {});

  //     it.todo(
  //       "should show a validation error when if missing or incorrect data entered",
  //       () => {}
  //     );
  //   });

