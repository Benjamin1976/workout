import { PropsWithChildren } from "react";
import { AlertProvider } from "./context/AlertProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ExerciseProvider } from "./context/ExerciseProvider";

const AllProviders = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ExerciseProvider>
        <AlertProvider>{children}</AlertProvider>
      </ExerciseProvider>
    </AuthProvider>
  );
};

export default AllProviders;
