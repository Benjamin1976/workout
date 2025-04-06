import { useEffect } from "react";

import useExercise from "../../hooks/useExercise";
import useAuth from "../../hooks/useAuth";

import SessionList from "./SessionList";

const Session = () => {
  const { getSessions } = useExercise();
  const { user } = useAuth();

  useEffect(() => {
    getSessions(user, { date: -1 }, 1);
  }, []);

  return <SessionList />;
};

export default Session;
