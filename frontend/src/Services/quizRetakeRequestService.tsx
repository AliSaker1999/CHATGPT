// src/services/quizRetakeRequestService.ts
import axios from "axios";

// Change the API base URL if needed
const API_BASE = "http://localhost:5004/api/QuizRetakeRequests";

export interface QuizRetakeRequestDto {
  id: number;
  userName: string;
  email: string;
  message: string;
  requestedAt: string;
  isApproved: boolean | null;
  decisionAt: string | null;
}

export interface CreateQuizRetakeRequestDto {
  message: string;
}

// Set token for authenticated requests
const getAuthHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/**
 * User: Submit a new retake request
 */
export const submitRetakeRequest = async (
  dto: CreateQuizRetakeRequestDto,
  token: string
) => {
  await axios.post(`${API_BASE}`, dto, getAuthHeaders(token));
};

/**
 * Admin: Get all retake requests
 */
export const getAllRetakeRequests = async (token: string): Promise<QuizRetakeRequestDto[]> => {
  const response = await axios.get(`${API_BASE}`, getAuthHeaders(token));
  return response.data;
};

/**
 * Admin: Approve a retake request (removes user's quiz result)
 */
export const approveRetakeRequest = async (id: number, token: string) => {
  await axios.post(`${API_BASE}/${id}/approve`, null, getAuthHeaders(token));
};

/**
 * Admin: Deny a retake request
 */
export const denyRetakeRequest = async (id: number, token: string) => {
  await axios.post(`${API_BASE}/${id}/deny`, null, getAuthHeaders(token));
};
// User: Get their own retake requests
export const getMyRetakeRequests = async (token: string) => {
  const res = await axios.get("http://localhost:5004/api/QuizRetakeRequests/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as QuizRetakeRequestDto[];
};
