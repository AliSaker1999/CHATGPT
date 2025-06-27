import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ResultsPage from "../Pages/ResultsPage";

import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../Pages/AdminDashboard";
import QuestionsPage from "../Pages/QuestionsPage";
import UserResultPage from "../Pages/UserResultPage";
import Signup from "../Pages/Signup";
import User from "../Pages/User";


const AppRoutes = () => (
  <Router>
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
      <Route path="/admin/results" element={<ResultsPage />} />
      <Route path="questions" element={<QuestionsPage />} />
      {/* You can add more admin child routes here */}
    </Route>

    <Route
      path="/user"
      element={
        <ProtectedRoute role="User">
          <User />
        </ProtectedRoute>
      }
    />
      <Route
      path="/user/result"
      element={
        <ProtectedRoute role="User">
          <UserResultPage />
        </ProtectedRoute>
      }
    />
  </Routes>
  </Router>
);

export default AppRoutes;
