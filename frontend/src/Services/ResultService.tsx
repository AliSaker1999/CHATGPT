import axios from "axios";
import { QuizResultDto } from "../Models/QuizResult";

const BASE = "http://localhost:5004/api/quizresult";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllResults = async (): Promise<QuizResultDto[]> => {
  const res = await axios.get(BASE, authHeader());
  return res.data;
};

export const getResultsByUsername = async (username: string): Promise<QuizResultDto[]> => {
  const res = await axios.get(`${BASE}/user/username/${username}`, authHeader());
  return res.data;
};

export const deleteResultById = async (id: number) => {
  await axios.delete(`${BASE}/${id}`, authHeader());
};
