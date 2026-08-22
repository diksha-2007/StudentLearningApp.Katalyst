import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/student/Dashboard";
import StudentTrainings from "./pages/student/Trainings";
import TrainingDetail from "./pages/student/TrainingDetail";
import StudentMeetings from "./pages/student/Meetings";
import StudentProfile from "./pages/student/Profile";
import StudentCertificates from "./pages/student/Certificates";
import StudentAIHub from "./pages/student/AIHub";
import StudentScholarships from "./pages/student/Scholarships";
import StudentNotifications from "./pages/student/Notifications";

import MentorDashboard from "./pages/mentor/Dashboard";
import MentorStudents from "./pages/mentor/Students";
import MentorMeetings from "./pages/mentor/Meetings";
import MentorNotifications from "./pages/mentor/Notifications";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminMentors from "./pages/admin/Mentors";
import AdminTrainings from "./pages/admin/Trainings";
import AdminMeetings from "./pages/admin/Meetings";
import AdminNotifications from "./pages/admin/Notifications";
import AdminReports from "./pages/admin/Reports";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/trainings" element={<ProtectedRoute roles={["student"]}><StudentTrainings /></ProtectedRoute>} />
            <Route path="/student/trainings/:id" element={<ProtectedRoute roles={["student"]}><TrainingDetail /></ProtectedRoute>} />
            <Route path="/student/meetings" element={<ProtectedRoute roles={["student"]}><StudentMeetings /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute roles={["student"]}><StudentNotifications /></ProtectedRoute>} />
            <Route path="/student/certificates" element={<ProtectedRoute roles={["student"]}><StudentCertificates /></ProtectedRoute>} />
            <Route path="/student/ai" element={<ProtectedRoute roles={["student"]}><StudentAIHub /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute roles={["student"]}><StudentProfile /></ProtectedRoute>} />

            {/* Mentor Routes */}
            <Route path="/mentor" element={<ProtectedRoute roles={["mentor"]}><MentorDashboard /></ProtectedRoute>} />
            <Route path="/mentor/students" element={<ProtectedRoute roles={["mentor"]}><MentorStudents /></ProtectedRoute>} />
            <Route path="/mentor/meetings" element={<ProtectedRoute roles={["mentor"]}><MentorMeetings /></ProtectedRoute>} />
            <Route path="/mentor/notifications" element={<ProtectedRoute roles={["mentor"]}><MentorNotifications /></ProtectedRoute>} />
            <Route path="/mentor/profile" element={<ProtectedRoute roles={["mentor"]}><StudentProfile /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute roles={["admin"]}><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin/mentors" element={<ProtectedRoute roles={["admin"]}><AdminMentors /></ProtectedRoute>} />
            <Route path="/admin/trainings" element={<ProtectedRoute roles={["admin"]}><AdminTrainings /></ProtectedRoute>} />
            <Route path="/admin/meetings" element={<ProtectedRoute roles={["admin"]}><AdminMeetings /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute roles={["admin"]}><AdminNotifications /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><AdminReports /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
