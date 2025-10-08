
// Router.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ClassPage from "./pages/ClassPage";
import Lesson from "./pages/Lesson"; 
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";


export default function RouterComponent({ user, profile, setProfile, handleSignOut }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<App />} />

        <Route
          path="/teacher"
          element={<TeacherDashboard user={user} profile={profile} setProfile={setProfile} handleSignOut={handleSignOut} />}
        />
        <Route
          path="/student"
          element={<StudentDashboard user={user} profile={profile} setProfile={setProfile} handleSignOut={handleSignOut} />}
        />
        <Route
          path="/class/:classId"
          element={<ClassPage user={user} profile={profile} handleSignOut={handleSignOut} />}
        />
        <Route
          path="/lesson/:lessonId"
          element={<Lesson user={user} profile={profile} handleSignOut={handleSignOut} />}
        />
        <Route
          path="/profile"
          element={<Profile user={user} profile={profile} setProfile={setProfile} handleSignOut={handleSignOut} />}
        />
        {/*new */}
 <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
  path="/dashboard"
  element={<Dashboard user={user} profile={profile} setProfile={setProfile} handleSignOut={handleSignOut} />}
/>
 
      </Routes>
   </Router>

  );
  
}
