import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage.jsx";
import StudentLogin from "./components/StudentLogin.jsx";
import StudentSignup from "./components/StudentSignup.jsx";
import FacultyLogin from "./components/FacultyLogin.jsx";
import FacultySignup from "./components/FacultySignup.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminSignup from "./components/AdminSignup.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* AuthPage wraps all login/signup pages */}
        <Route path="/" element={<AuthPage />}>
          {/* Student */}
          <Route path="student/login" element={<StudentLogin />} />
          <Route path="student/signup" element={<StudentSignup />} />

          {/* Faculty */}
          <Route path="faculty/login" element={<FacultyLogin />} />
          <Route path="faculty/signup" element={<FacultySignup />} />

          {/* Admin */}
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin/signup" element={<AdminSignup />} />
        </Route>

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
