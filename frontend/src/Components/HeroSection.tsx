import quizImg from "./quiz.svg";

const HeroSection = () => (
  <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-2xl p-10 mb-10 max-w-3xl mx-auto border border-blue-100 relative animate-fadeIn z-10">
    {/* Glowing border */}
    <div className="absolute inset-0 rounded-3xl border-4 border-blue-200 opacity-30 pointer-events-none"></div>
    <img
      src={quizImg}
      alt="Quiz Illustration"
      className="w-56 h-56 object-contain mb-6 md:mb-0 md:mr-12 drop-shadow-lg"
      draggable={false}
    />
    <div>
      <h2 className="text-4xl font-extrabold text-blue-700 mb-4 relative inline-block">
        Welcome to Quizify!
        <span className="block w-2/3 h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-300 absolute left-0 -bottom-1 z-0 animate-pulse"></span>
      </h2>
      <p className="text-xl text-gray-700 mb-3 font-medium">
        Challenge yourself with our latest quizzes.<br />
        Track your results and become a quiz master!
      </p>
      <p className="text-base text-gray-400">
        Fast, fun, and free for everyone.
      </p>
    </div>
  </div>
);

export default HeroSection;
