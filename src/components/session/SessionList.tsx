import { useEffect } from "react";

import useExercise from "../../hooks/useExercise";

import SessionItem from "./SessionItem";
import SessionListItem from "./SessionListItem";

const SessionList = () => {
  const { sessions, currentSession, loadLastSession } = useExercise();

  useEffect(() => {
    loadLastSession();
  }, [sessions, currentSession?._id]);

  if (currentSession) return <SessionItem session={currentSession} />;
  if (!sessions) return "";
  return sessions.map((session) => (
    <SessionListItem key={session._id} session={session} />
  ));
};

export default SessionList;
