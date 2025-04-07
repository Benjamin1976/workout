import axios from "axios";
import { UserType } from "../context/types";
import { configJSON, ConfigJSONType } from "../utilities/common";

export type TokenType = {
  token: string;
};

export const validateUserCode = async (
  user: UserType,
  code: string,
  configJSON: ConfigJSONType
): Promise<TokenType> => {
  const { data } = await axios.post<TokenType>(
    "/api/users/validate",
    { user, code },
    configJSON
  );
  return data;
};

export type SendValidationEmailType = {
  emailSent: boolean;
  newCode: string;
};

export const sendValidationEmailAxios = async (
  user: UserType,
  configJSON: ConfigJSONType
): Promise<SendValidationEmailType> => {
  const { data } = await axios.post<SendValidationEmailType>(
    "/api/users/validateemail",
    { user },
    configJSON
  );
  return data;
};

export type LoginType = { email: string; password: string };

export const loginAxios = async (loginData: LoginType): Promise<TokenType> => {
  const { data } = await axios.post<TokenType>(
    "/api/auth",
    loginData,
    configJSON
  );
  return data;
};

export const loadUserAxios = async (): Promise<UserType | null> => {
  // try {
  console.log("loadUserAxios: Start");
  const { data } = await axios.post<UserType | null>(`/api/auth/user/load`);
  return data;
};

// export const loadUserAxios = async (): Promise<UserType | null> => {
//   // try {
//   console.log("loadUserAxios: Start");
//   const result = await axios
//     .post(`/api/auth/user/load`)
//     .then((result) => {
//       console.log(result);
//       return result;
//     })
//     .catch((err) => console.log(err));
//   if (result?.data) {
//     const { data } = result;
//     console.log("loadUserAxios: Finish with data");
//     return data;
//   }
//   console.log("loadUserAxios: Finish no data");
//   return null;
//   // } catch (err: any) {
//   // console.log(err);
//   // }
// };

export const registerAxios = async (
  userLoginDetails: Partial<UserType>
): Promise<TokenType> => {
  // try registering user with form data and json config
  const { data } = await axios.post<TokenType>(
    "/api/users",
    userLoginDetails,
    configJSON
  );
  return data;
};
