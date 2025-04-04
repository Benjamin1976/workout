import { useContext } from "react";
import { AuthContext, UseAuthContextType } from "../context/AuthProvider";

const useAuth = (): UseAuthContextType => {
  return useContext(AuthContext);
};

export default useAuth;
