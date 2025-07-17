import axios from "axios";
import { AddQuestionDto, QuestionDto } from "../Models/Question";

const api = "http://localhost:5004/api/questions"; // adjust port if needed

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const addQuestion = async (question: AddQuestionDto) => {
  const response = await axios.post(api, question, { headers: getAuthHeader() });
  return response.data;
};

export const getAllQuestions = async () => {
  const response = await axios.get<QuestionDto[]>(api, { headers: getAuthHeader() });
  return response.data;
};

export const getQuestionById = async (id: number) => {
  const response = await axios.get<QuestionDto>(`${api}/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export const deleteQuestion = async (id: number) => {
  await axios.delete(`${api}/${id}`, { headers: getAuthHeader() });
};

export const getRandomQuestions = async () => {
  const response = await axios.get<QuestionDto[]>(
    "http://localhost:5004/api/questions/random/10",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const getAIQuestions = async (): Promise<QuestionDto[]> => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get<QuestionDto[]>(`${api}/ai-questions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error("You're requesting AI questions too quickly. Please wait a bit and try again.");
    }
    throw error;
  }
};