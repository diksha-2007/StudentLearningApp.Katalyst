import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("student");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "student") {
      navigate("/student-dashboard");
    } else if (role === "mentor") {
      navigate("/mentor-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="back-link">
          ← KATALYST
        </Link>

        <h1>
          Welcome <span>Back.</span>
        </h1>

        <p className="auth-subtitle">
          Login to continue your Katalyst journey.
        </p>

        <div className="role-container">

          <button
            type="button"
            className={role === "student" ? "role active" : "role"}
            onClick={() => setRole("student")}
          >
            🎓 Student
          </button>

          <button
            type="button"
            className={role === "mentor" ? "role active" : "role"}
            onClick={() => setRole("mentor")}
          >
            👨‍🏫 Mentor
          </button>

          <button
            type="button"
            className={role === "admin" ? "role active" : "role"}
            onClick={() => setRole("admin")}
          >
            🛡️ Admin
          </button>

        </div>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Login as {role} →
          </button>

        </form>

        <p className="demo-text">
          Demo mode — any valid email and password will continue.
        </p>

      </div>
    </div>
  );
}

export default Login;