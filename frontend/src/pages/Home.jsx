import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import BrandMark from "../components/BrandMark";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="public-page min-h-screen overflow-hidden">
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12"
        style={{ borderColor: "var(--border)", background: "var(--bg-glass)", backdropFilter: "blur(16px)" }}
      >
        <BrandMark />
        <div className="hidden items-center gap-8 text-xs font-medium text-slate-600 md:flex">
          <a href="#focus" className="transition-colors hover:text-katalyst-600">About</a>
          <a href="#programs" className="transition-colors hover:text-katalyst-600">Programs</a>
          <a href="#mission" className="transition-colors hover:text-katalyst-600">Impact</a>
          <a href="#join" className="transition-colors hover:text-katalyst-600">Get Involved</a>
          <a href="#programs" className="transition-colors hover:text-katalyst-600">Resources</a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/register" className="btn-primary !rounded-full !px-4 !py-2 text-xs">Join the Program <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="badge mb-8">Student • Mentor • Growth</div>

        <h2 className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
          Learn.<br />
          Connect.<br />
          <span className="text-katalyst-500">Grow.</span>
        </h2>

        <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Katalyst is your all-in-one student–mentor learning platform. Track progress,
          book mentorship sessions, earn certificates, and unlock AI-powered career insights.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/register" className="btn-primary text-lg">Start Learning →</Link>
          <Link to="/login" className="btn-secondary text-lg">Try Demo Accounts 🚀</Link>
        </div>

        <div className="glass-card mt-12 border-l-4 border-l-katalyst-500 p-6">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <span>✨</span> Instant Demo Access for New Users
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Explore the platform instantly with zero setup using pre-configured role demos:
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary !py-2 text-xs">🎓 Try Student Portal Demo</Link>
            <Link to="/login" className="btn-secondary !py-2 text-xs">👨‍🏫 Try Mentor Portal Demo</Link>
            <Link to="/login" className="btn-secondary !py-2 text-xs">🛡️ Try Admin Portal Demo</Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "📚", title: "Structured Trainings", desc: "Videos, quizzes, assignments & certificates" },
            { icon: "👨‍🏫", title: "Expert Mentorship", desc: "Book sessions, get feedback & track growth" },
            { icon: "🤖", title: "AI Career Tools", desc: "Resume analyzer, roadmap & scholarship finder" },
            { icon: "📊", title: "Progress Analytics", desc: "Real-time placement readiness scoring" },
            { icon: "🏆", title: "Certificates", desc: "Earn & download completion certificates" },
            { icon: "🔔", title: "Smart Notifications", desc: "Stay updated on meetings & milestones" },
          ].map((f) => (
            <div key={f.title} className="glass-card p-6 transition-transform hover:-translate-y-1">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card mt-16 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center lg:p-12">
          <div>
            <p className="section-subtitle">Platform Portals</p>
            <h3 className="mt-2 text-2xl font-bold lg:text-3xl">Multi-Role Learning & Mentorship</h3>
            <p className="mt-3 max-w-md" style={{ color: "var(--text-secondary)" }}>
              Students learn and grow. Mentors guide and track. Admins manage the entire ecosystem.
            </p>
          </div>
          <div className="flex gap-4">
            {["🎓", "👨‍🏫", "🛡️"].map((e, i) => (
              <div key={i} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-katalyst-500 text-2xl text-white shadow-glass">
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
