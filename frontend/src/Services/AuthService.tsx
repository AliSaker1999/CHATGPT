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

// Updated to accept new user profile fields
export const registerAPI = async (
  email: string,
  username: string,
  password: string,
  fullName: string,
  educationLevel: string,
  yearsOfExperience: number,
  specialty: string,
  currentRole: string,
  age: number,
  country: string,
  preferredLanguage: string,
  technologiesKnown: string,
  certifications: string,
  learningGoals: string
): Promise<UserProfileToken | null> => {
  try {
    const response = await axios.post<UserProfileToken>(api + "register", {
      email,
      username,
      password,
      fullName,
      educationLevel,
      yearsOfExperience,
      specialty,
      currentRole,
      age,
      country,
      preferredLanguage,
      technologiesKnown,
      certifications,
      learningGoals
    });
    return response.data;
  } catch (error: any) {
    const backend = error.response?.data;
    if (Array.isArray(backend)) {
      throw backend.map((err: any) => err.description || err.code || err.toString());
    }
    throw [backend?.toString() || "Registration failed"];
  }
};
