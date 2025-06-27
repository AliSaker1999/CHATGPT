import axios from "axios";

export const submitQuizResult = async (score: number) => {
  const response = await axios.post(
    "http://localhost:5004/api/quizresult",
    { score },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

