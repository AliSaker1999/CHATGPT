import { useEffect, useState } from "react";
import { addQuestion, deleteQuestion, getAllQuestions } from "../Services/QuestionService";
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
    if (
      !newQuestion.questionText.trim() ||
      !newQuestion.optionA.trim() ||
      !newQuestion.optionB.trim() ||
      !newQuestion.optionC.trim() ||
      !newQuestion.optionD.trim() ||
      !newQuestion.correctAnswer.trim()
    ) {
      alert("Fill all fields!");
      return;
    }
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
    if (window.confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion(id);
      fetchQuestions();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 10h.01M12 14h.01M16 10h.01" />
          </svg>
          Manage Questions
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 via-green-400 to-purple-500 rounded-full mb-6"></div>
      </div>
      {/* Add New Question Card */}
      <div className="bg-white/80 rounded-2xl shadow-xl p-7 mb-6 border border-blue-100">
        <h3 className="text-xl font-bold text-blue-700 mb-4">Add New Question</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Question"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
            value={newQuestion.questionText}
            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
          />
          <input
            placeholder="Option A"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={newQuestion.optionA}
            onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
          />
          <input
            placeholder="Option B"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={newQuestion.optionB}
            onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
          />
          <input
            placeholder="Option C"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={newQuestion.optionC}
            onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
          />
          <input
            placeholder="Option D"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={newQuestion.optionD}
            onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
          />
          <input
            placeholder="Correct Answer"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-bold rounded-xl shadow hover:scale-[1.03] transition"
        >
          Add Question
        </button>
      </div>
      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 && (
          <div className="text-center text-gray-400 italic">No questions yet. Add your first one above!</div>
        )}
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-xl shadow flex flex-col md:flex-row md:items-center justify-between px-6 py-5 border border-gray-100 hover:shadow-lg transition"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 font-semibold rounded mr-2">ID: {q.id}</span>
                <span className="font-semibold text-gray-800">{q.questionText}</span>
              </div>
              <ul className="ml-2 mt-1 text-sm text-gray-700">
                <li><span className="font-bold text-gray-700">A.</span> {q.optionA}</li>
                <li><span className="font-bold text-gray-700">B.</span> {q.optionB}</li>
                <li><span className="font-bold text-gray-700">C.</span> {q.optionC}</li>
                <li><span className="font-bold text-gray-700">D.</span> {q.optionD}</li>
              </ul>
              <p className="mt-2 flex items-center gap-2 text-green-600 font-semibold">
                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Correct Answer: <span className="text-green-700 font-bold">{q.correctAnswer}</span>
              </p>
            </div>
            <button
              onClick={() => handleDelete(q.id)}
              className="mt-4 md:mt-0 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold shadow transition"
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
