import { useContext } from "react";
import {
  SessionContext,
  UseSessionContextType,
} from "../context/SessionProvider";

const useSession = (): UseSessionContextType => {
  return useContext(SessionContext);
};

export default useSession;
