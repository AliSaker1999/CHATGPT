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
      const data = await getRandomQuestions();
      setQuestions(data);
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

  const progress =
    questions.length === 0
      ? 0
      : Math.round(
          (Object.keys(answers).length / questions.length) * 100
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 py-12">
      {/* Progress Bar Section */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-4xl font-black text-blue-700 tracking-tight flex items-center gap-2">
            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            Take the Quiz
          </h2>
          <span className="text-blue-700 text-lg font-bold drop-shadow">{progress}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-blue-100 overflow-hidden mb-6 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-green-400 to-green-300 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="max-w-2xl mx-auto space-y-10 px-4">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="relative bg-white shadow-xl p-8 rounded-2xl border border-blue-100 hover:shadow-2xl transition group"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-br from-blue-400 to-green-400 text-white font-extrabold text-lg px-5 py-2 rounded-full shadow-lg border-4 border-white">
                Q{index + 1}
              </span>
            </div>
            <div className="mt-8 flex items-start">
              <p className="font-bold text-gray-800 text-xl mb-3">
                {q.questionText}
              </p>
            </div>
            <div className="space-y-3 mt-2">
              {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt) => {
                const selected = answers[q.id] === opt;
                return (
                  <label
                    key={opt}
                    className={`
                      flex items-center px-5 py-3 rounded-xl border cursor-pointer
                      transition group
                      ${selected
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200 shadow-sm scale-[1.02]"
                        : "hover:border-blue-300 bg-gray-50"}
                    `}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={selected}
                      onChange={() => handleAnswer(q.id, opt)}
                      className="mr-4 accent-blue-600 w-5 h-5"
                    />
                    <span className="text-base text-gray-700 font-medium">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit button */}
        {questions.length > 0 && (
          <div className="text-center pt-6">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-4 rounded-xl font-bold shadow-xl hover:scale-105 hover:from-blue-600 hover:to-green-600 transition-all text-xl focus:outline-none active:scale-100"
              disabled={Object.keys(answers).length !== questions.length}
              title={
                Object.keys(answers).length !== questions.length
                  ? "Answer all questions to submit"
                  : undefined
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Submit Answers
            </button>
            {Object.keys(answers).length !== questions.length && (
              <div className="text-sm text-gray-400 mt-3">
                Please answer all questions to enable submit.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
