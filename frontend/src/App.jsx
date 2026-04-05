import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateQuiz from './pages/CreateQuiz';
import StudentDashboard from './pages/StudentDashboard';
import QuizAttempt from './pages/QuizAttempt';
import QuizAnalytics from './pages/QuizAnalytics'; // NEW IMPORT

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
        <Route path="/teacher/analytics/:quizId" element={<QuizAnalytics />} /> {/* NEW ROUTE */}
        
        {/* Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/attempt/:attemptId" element={<QuizAttempt />} />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}