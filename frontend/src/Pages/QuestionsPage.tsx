import { useEffect, useState } from "react";
import {
  addQuestion,
  deleteQuestion,
  getAllQuestions,
} from "../Services/QuestionService";
import { AddQuestionDto, QuestionDto } from "../Models/Question";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [newQuestion, setNewQuestion] = useState<AddQuestionDto>({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  });

  const fetchQuestions = async () => {
    const data = await getAllQuestions();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    await addQuestion(newQuestion);
    setNewQuestion({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    });
    fetchQuestions();
  };

  const handleDelete = async (id: number) => {
    await deleteQuestion(id);
    fetchQuestions();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Manage Questions</h2>

      {/* Add New Question Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-md shadow">
        <input
          placeholder="Question"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newQuestion.questionText}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, questionText: e.target.value })
          }
        />
        <input
          placeholder="Option A"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newQuestion.optionA}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, optionA: e.target.value })
          }
        />
        <input
          placeholder="Option B"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newQuestion.optionB}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, optionB: e.target.value })
          }
        />
        <input
          placeholder="Option C"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newQuestion.optionC}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, optionC: e.target.value })
          }
        />
        <input
          placeholder="Option D"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newQuestion.optionD}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, optionD: e.target.value })
          }
        />
        <input
          placeholder="Correct Answer"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={newQuestion.correctAnswer}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
          }
        />
        <button
          onClick={handleAdd}
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Question
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-md shadow p-4 border border-gray-200"
          >
            <p className="text-sm text-gray-500">ID: {q.id}</p>
            <p className="font-semibold text-gray-800 mb-2">{q.questionText}</p>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              <li>A. {q.optionA}</li>
              <li>B. {q.optionB}</li>
              <li>C. {q.optionC}</li>
              <li>D. {q.optionD}</li>
            </ul>
            <p className="mt-2 text-green-600 font-medium">
              Correct Answer: {q.correctAnswer}
            </p>
            <button
              onClick={() => handleDelete(q.id)}
              className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsPage;
