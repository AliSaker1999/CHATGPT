import { useNavigate } from "react-router-dom";
import HeroSection from "../Components/HeroSection";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-green-200 opacity-20 rounded-full blur-3xl animate-pulse z-0"></div>
      {/* Main Content */}
      <div className="z-10 flex flex-col items-center w-full">
        <HeroSection />
        <div className="space-x-6 mt-4 flex">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:scale-105 hover:bg-blue-700 transition-all duration-200 focus:outline-none"
          >
            {/* Login icon (SVG) */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M15 12H3m0 0l4-4m-4 4l4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Go to Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:scale-105 hover:bg-green-700 transition-all duration-200 focus:outline-none"
          >
            {/* Signup icon (SVG) */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
