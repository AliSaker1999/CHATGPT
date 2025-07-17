import axios from "axios";
import { UserDto } from "../Models/UserDto";

const api = "http://localhost:5004/api/account/";

export const getAllUsers = async (): Promise<UserDto[]> => {
  const token = localStorage.getItem("token");
  const response = await axios.get<UserDto[]>(api + "all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUserByUsername = async (username: string): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.delete(api + "delete/" + username, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProfile = async (): Promise<UserDto> => {
  const token = localStorage.getItem("token");
  const response = await axios.get<UserDto>(api + "profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export interface UpdateProfileDto {
  fullName: string;
  educationLevel: string;
  yearsOfExperience: number;
  specialty: string;
  currentRole: string;
  age: number;
  country: string;
  preferredLanguage: string;
  technologiesKnown: string;
  certifications: string;
  learningGoals: string;
}

export const updateProfile = async (data: UpdateProfileDto): Promise<UserDto> => {
  const token = localStorage.getItem("token");
  const response = await axios.put<UserDto>(api + "update-profile", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};