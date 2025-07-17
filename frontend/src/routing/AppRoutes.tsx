import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ResultsPage from "../Pages/ResultsPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../Pages/AdminDashboard";
import QuestionsPage from "../Pages/QuestionsPage";
import UserResultPage from "../Pages/UserResultPage";
import Signup from "../Pages/Signup";
import User from "../Pages/User";
import QuizRedirect from "../Pages/QuizRedirect";
import UserBestResultPage from "../Pages/UserBestResultPage";
import ManageUsersPage from "../Pages/ManageUsersPage";
import RetakeRequestsPage from "../Pages/RetakeRequestsPage";
import UserQuiz from "../Pages/UserQuiz";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute role="Admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    >
      <Route path="/admin/retake-requests" element={<RetakeRequestsPage />} />
      <Route path="/admin/results" element={<ResultsPage />} />
      <Route path="questions" element={<QuestionsPage />} />
      {/* More admin child routes here if needed */}
    </Route>

    <Route
      path="/user"
      element={
        <ProtectedRoute role="User" mustNotBeTaken={false}>
          <User />
        </ProtectedRoute>
      }
    />
    <Route
      path="/user/quiz"
      element={
        <ProtectedRoute role="User" mustNotBeTaken={true}>
          <UserQuiz />
        </ProtectedRoute>
      }
    />
    <Route path="/user/result" element={<UserResultPage />}/>

    <Route
      path="/user/best-result"
      element={
        <ProtectedRoute role="User" mustBeTaken={true}>
          <UserBestResultPage />
        </ProtectedRoute>
      }
    />
    <Route path="/quiz-redirect"element={<QuizRedirect />}/>

    <Route path="/admin/users"element={<ManageUsersPage />}/>
    
  </Routes>
);

export default AppRoutes;







