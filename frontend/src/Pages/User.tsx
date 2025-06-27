import { useEffect, useState } from "react";
import { getRandomQuestions } from "../Services/QuestionService";
import { QuestionDto } from "../Models/Question";
import { useNavigate } from "react-router-dom";
import { submitQuizResult } from "../Services/QuizResultService";

const User = () => {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getRandomQuestions();
        setQuestions(data);
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          navigate("/user/result"); // already submitted
        }
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });

    await submitQuizResult(correct);
    setQuestions([]);
    setAnswers({});
    navigate("/user/result", {
      state: { score: correct },
      replace: true,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-blue-700">Take the Quiz</h2>

      {questions.map((q, index) => (
        <div
          key={q.id}
          className="bg-white shadow-md p-4 rounded-md border border-gray-200"
        >
          <p className="font-semibold text-gray-800 mb-2">
            Q{index + 1}: {q.questionText}
          </p>
          <div className="space-y-2">
            {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt) => (
              <label
                key={opt}
                className="block bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded border cursor-pointer transition"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleAnswer(q.id, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default User;
