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
      <Route path="/admin/results" element={<ResultsPage />} />
      <Route path="questions" element={<QuestionsPage />} />
      {/* More admin child routes here if needed */}
    </Route>

    <Route
      path="/user"
      element={
        <ProtectedRoute role="User" mustNotBeTaken={true}>
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
    <Route
      path="/user/best-result"
      element={
        <ProtectedRoute role="User" mustBeTaken={true}>
          <UserBestResultPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/quiz-redirect"
      element={
        <ProtectedRoute role="User">
          <QuizRedirect />
        </ProtectedRoute>
      }
    />
    <Route
  path="/admin/users"
  element={
    <ProtectedRoute role="Admin">
      <ManageUsersPage />
    </ProtectedRoute>
  }
/>
  </Routes>
);

export default AppRoutes;









// import { BrowserRouter as Router, Route, Routes, createBrowserRouter } from "react-router-dom";
// import Home from "../Pages/Home";
// import Login from "../Pages/Login";
// import ResultsPage from "../Pages/ResultsPage";
// import ProtectedRoute from "./ProtectedRoute";
// import AdminDashboard from "../Pages/AdminDashboard";
// import QuestionsPage from "../Pages/QuestionsPage";
// import UserResultPage from "../Pages/UserResultPage";
// import Signup from "../Pages/Signup";
// import User from "../Pages/User";
// import QuizRedirect from "../Pages/QuizRedirect";
// import UserBestResultPage from "../Pages/UserBestResultPage"; // <-- Add this line
// import App from "../App";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "", element: <Home /> },
//       { path: "login", element: <Login /> },
//       { path: "register", element: <Signup /> },
//       {
//         path: "admin",
//         element: (
//           <ProtectedRoute role="Admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "admin/results",
//         element: (
//           <ProtectedRoute role="Admin">
//             <ResultsPage />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "questions",
//         element: (
//           <ProtectedRoute role="Admin">
//             <QuestionsPage />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "user",
//         element: (
//           <ProtectedRoute role="User" mustNotBeTaken={true}>
//             <User />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "user/result",
//         element: (
//           <ProtectedRoute role="User">
//             <UserResultPage />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "user/best-result",
//         element: (
//           <ProtectedRoute role="User" mustBeTaken={true}>
//             <UserBestResultPage />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "quiz-redirect",
//         element: (
//           <ProtectedRoute role="User">
//             <QuizRedirect />
//           </ProtectedRoute>
//         ),
//       },

//     ],
//   },
// ]);


