import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InterviewPrep from "./pages/InterviewPrep";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <InterviewPrep />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
