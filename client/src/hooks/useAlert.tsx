import { useContext } from "react";
import { AlertContext, UseAlertContextType } from "../context/AlertProvider";

const useAlert = (): UseAlertContextType => {
  return useContext(AlertContext);
};

export default useAlert;
