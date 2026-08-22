import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
        role,
      });

      if (!res.data.token || !res.data.user) {
        throw new Error("Server did not return token or user data");
      }

      login(res.data.user, res.data.token);

      navigate(`/${res.data.user.role}`);
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "student", label: "🎓 Student" },
    { id: "mentor", label: "👨‍🏫 Mentor" },
    { id: "admin", label: "🛡️ Admin" },
  ];

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="glass-card w-full max-w-md p-8 animate-fade-in">
        <Link
          to="/"
          className="text-sm font-medium text-katalyst-500 hover:underline"
        >
          ← Back to Katalyst
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Join <span className="text-katalyst-500">Katalyst.</span>
        </h1>

        <p
          className="mt-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Create your account as {role} and start learning.
        </p>

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
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="Optional"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating account..." : `Register as ${role} →`}
          </button>
        </form>

        <p
          className="mt-4 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-katalyst-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}