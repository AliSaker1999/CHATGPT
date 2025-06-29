import axios from "axios";
import { QuizResultDto } from "../Models/QuizResult";

const api="http://localhost:5004/api/quizresult";

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

// export const getResultsByUsername = async (username: string): Promise<QuizResultDto[]> => {
//   try {
//     const res = await axios.get<QuizResultDto[]>(
//       api + "user/username/" + username,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     return [];
//   }
// };

