import quizImg from "./quiz.svg";

const HeroSection = () => (
  <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-8 mb-8 max-w-3xl mx-auto">
    {/* Illustration - you can change the image to whatever you like! */}
    <img
      src={quizImg}
      alt="Quiz Illustration"
      className="w-52 h-52 object-contain mb-6 md:mb-0 md:mr-10"
    />
    {/* Text Content */}
    <div>
      <h2 className="text-3xl font-extrabold text-blue-700 mb-3">
        Welcome to Quizify!
      </h2>
      <p className="text-lg text-gray-700 mb-2">
        Challenge yourself with our latest quizzes.<br />
        Track your results and become a quiz master!
      </p>
      <p className="text-sm text-gray-400">
        Fast, fun, and free for everyone.
      </p>
    </div>
  </div>
);

export default HeroSection;
