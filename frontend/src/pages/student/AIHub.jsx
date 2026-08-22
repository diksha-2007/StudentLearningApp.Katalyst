import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function StudentAIHub() {
  const [tab, setTab] = useState("roadmap");
  const [roadmap, setRoadmap] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [scholarships, setScholarships] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const res = await API.post("/ai/career-roadmap");
      setRoadmap(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return alert("Paste your resume content");
    setLoading(true);
    try {
      const res = await API.post("/ai/resume-analyze", { content: resumeText });
      setResumeResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const getScholarships = async () => {
    setLoading(true);
    try {
      const res = await API.post("/ai/scholarships", {
        interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setScholarships(res.data.recommendations);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    setLoading(true);
    try {
      const res = await API.get("/students/progress");
      setProgress(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "roadmap", label: "🗺️ Career Roadmap", action: loadRoadmap },
    { id: "resume", label: "📄 Resume Analyzer", action: null },
    { id: "scholarships", label: "🎓 Scholarships", action: null },
    { id: "readiness", label: "📊 Placement Readiness", action: loadProgress },
  ];

  return (
    <DashboardLayout title="AI Hub" subtitle="Student Portal">
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); t.action?.(); }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              tab === t.id ? "bg-katalyst-500 text-white" : "border"
            }`}
            style={tab !== t.id ? { borderColor: "var(--border)" } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex h-20 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      )}

      {!loading && tab === "roadmap" && (
        <div className="space-y-4">
          {!roadmap ? (
            <div className="glass-card p-8 text-center">
              <button onClick={loadRoadmap} className="btn-primary">Generate Career Roadmap</button>
            </div>
          ) : (
            <>
              <div className="glass-card p-6">
                <h3 className="font-bold">Skills: {roadmap.skills?.join(", ") || "None yet"}</h3>
              </div>
              {roadmap.roadmap?.map((step, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-katalyst-500 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold">{step.title}</h4>
                      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{step.description}</p>
                      <p className="mt-2 text-xs text-katalyst-500">Target: {new Date(step.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {!loading && tab === "resume" && (
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Paste Your Resume Content</h3>
          <textarea className="input-field mb-4" rows={8} value={resumeText}
            onChange={(e) => setResumeText(e.target.value)} placeholder="Paste resume text here..." />
          <button onClick={analyzeResume} className="btn-primary">Analyze Resume</button>
          {resumeResult && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl p-4" style={{ background: "var(--accent-light)" }}>
                <h4 className="font-bold text-green-700">✅ Strengths</h4>
                <ul className="mt-2 space-y-1 text-sm">{resumeResult.strengths?.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--accent-light)" }}>
                <h4 className="font-bold text-orange-600">⚠️ Improve</h4>
                <ul className="mt-2 space-y-1 text-sm">{resumeResult.improvementAreas?.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--accent-light)" }}>
                <h4 className="font-bold text-katalyst-600">💡 Actions</h4>
                <ul className="mt-2 space-y-1 text-sm">{resumeResult.actionItems?.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && tab === "scholarships" && (
        <div className="glass-card p-6">
          <input className="input-field mb-4" placeholder="Interests (e.g. Technology, AI/ML)"
            value={interests} onChange={(e) => setInterests(e.target.value)} />
          <button onClick={getScholarships} className="btn-primary">Find Scholarships</button>
          {scholarships && (
            <div className="mt-6 space-y-4">
              {scholarships.map((s, i) => (
                <div key={i} className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                  <h4 className="font-bold">{s.name}</h4>
                  <span className="badge mt-1">{s.category}</span>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && tab === "readiness" && progress && (
        <div className="glass-card p-8 text-center">
          <p className="text-6xl font-bold text-katalyst-500">{progress.progress?.placementReadiness || 0}%</p>
          <p className="mt-2 text-lg font-medium">Placement Readiness Score</p>
          <div className="progress-bar mx-auto mt-6 max-w-md">
            <div className="progress-bar-fill" style={{ width: `${progress.progress?.placementReadiness || 0}%` }} />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {[
              { label: "Training", val: progress.progress?.trainingCompletion },
              { label: "Meetings", val: progress.progress?.meetingsAttended },
              { label: "Assignments", val: progress.progress?.assignmentsSubmitted },
              { label: "Attendance", val: progress.progress?.attendanceRate },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-4" style={{ background: "var(--accent-light)" }}>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                <p className="text-2xl font-bold">{item.val || 0}{item.label === "Meetings" || item.label === "Assignments" ? "" : "%"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
