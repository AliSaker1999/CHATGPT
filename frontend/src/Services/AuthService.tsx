import axios from "axios";
import { UserProfileToken } from "../Models/User";
import { handleError } from "../Helpers/ErrorHandler";

const api = "http://localhost:5004/api/account/";

export const loginAPI = async (username: string, password: string) => {
  try {
    const res = await axios.post<UserProfileToken>(api + "login", { username, password });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  email: string,
  username: string,
  password: string
): Promise<UserProfileToken | null> => {
  try {
    const response = await axios.post<UserProfileToken>(api + "register", {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    alert(error.response?.data || "Registration failed");
    return null;
  }
};