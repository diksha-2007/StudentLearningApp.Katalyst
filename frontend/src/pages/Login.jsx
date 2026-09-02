import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset password state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (demoRole) => {
    setError("");
    setLoading(true);
    let demoEmail = "";
    let demoPass = "";

    if (demoRole === "student") {
      demoEmail = "diksha@katalyst.io";
      demoPass = "Student@123";
    } else if (demoRole === "mentor") {
      demoEmail = "sarah@katalyst.io";
      demoPass = "Mentor@123";
    } else if (demoRole === "admin") {
      demoEmail = "admin@katalyst.io";
      demoPass = "Admin@123";
    }

    setEmail(demoEmail);
    setPassword(demoPass);
    setRole(demoRole);

    try {
      const res = await API.post("/auth/login", { 
        email: demoEmail, 
        password: demoPass, 
        role: demoRole 
      });
      login(res.data.user, res.data.token);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { 
        email: email.trim().toLowerCase(), 
        password: password.trim(), 
        role 
      });
      login(res.data.user, res.data.token);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage("");
    try {
      const res = await API.post("/auth/reset-password", {
        email: resetEmail.trim().toLowerCase(),
        newPassword: newPassword.trim(),
      });
      setResetMessage(res.data.message);
      setEmail(resetEmail);
      setPassword(newPassword);
      setTimeout(() => {
        setShowReset(false);
        setResetMessage("");
      }, 2000);
    } catch (err) {
      setResetMessage(err.response?.data?.message || "Reset failed");
    }
  };

  const roles = [
    { id: "student", label: "🎓 Student" },
    { id: "mentor", label: "👨‍🏫 Mentor" },
    { id: "admin", label: "🛡️ Admin" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <div className="absolute right-6 top-6"><ThemeToggle /></div>

      <div className="glass-card w-full max-w-md p-8 animate-fade-in">
        <Link to="/" className="text-sm font-medium text-katalyst-500 hover:underline">
          ← Back to Katalyst
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Welcome <span className="text-katalyst-500">Back.</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Login to continue your Katalyst journey.
        </p>

        {/* 1-Click Instant Demo Login */}
        <div className="mt-5 rounded-xl border p-3" style={{ borderColor: "var(--border)", background: "var(--accent-light)" }}>
          <p className="text-xs font-bold text-center mb-2 text-katalyst-500 uppercase tracking-wider">
            🚀 One-Click Instant Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("student")}
              className="btn-primary !py-1.5 text-xs font-semibold"
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("mentor")}
              className="btn-primary !py-1.5 text-xs font-semibold"
            >
              👨‍🏫 Mentor Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="btn-primary !py-1.5 text-xs font-semibold"
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`rounded-xl border px-2 py-3 text-sm font-medium transition-all ${
                role === r.id
                  ? "border-katalyst-500 bg-katalyst-500 text-white"
                  : "border-transparent hover:border-katalyst-300"
              }`}
              style={role !== r.id ? { background: "var(--bg-secondary)" } : {}}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="you@email.com" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Password</label>
              <button 
                type="button" 
                onClick={() => { setResetEmail(email); setShowReset(true); }} 
                className="text-xs text-katalyst-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="••••••••" required />
          </div>

          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : `Login as ${role} →`}
          </button>
        </form>

        <p className="mt-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          New here?{" "}
          <Link to="/register" className="font-medium text-katalyst-500 hover:underline">
            Create account
          </Link>
        </p>
      </div>

      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold">Reset Password</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Enter your email and a new password below.
            </p>
            <form onSubmit={handleResetPassword} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium">Account Email</label>
                <input 
                  type="email" 
                  className="input-field mt-1" 
                  placeholder="registered@email.com" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-medium">New Password</label>
                <input 
                  type="password" 
                  className="input-field mt-1" 
                  placeholder="New password (min 6 characters)" 
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
              </div>

              {resetMessage && (
                <p className="text-xs font-semibold text-katalyst-500">{resetMessage}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowReset(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
