import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function MentorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: "", category: "general" });

  useEffect(() => {
    API.get("/mentors/students")
      .then((res) => setStudents(res.data.students || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const giveFeedback = async (studentId) => {
    try {
      await API.post("/mentors/feedback", { studentId, ...feedback });
      alert("Feedback submitted!");
      setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <DashboardLayout title="My Students" subtitle="Mentor Portal">
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : students.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl">🎓</p>
          <p className="mt-4">No students assigned yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => (
            <div key={s._id} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-katalyst-500 text-lg font-bold text-white">
                  {s.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.email}</p>
                </div>
              </div>
              {s.progress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-bold text-katalyst-500">{s.progress.overallScore || 0}%</span>
                  </div>
                  <div className="progress-bar mt-1">
                    <div className="progress-bar-fill" style={{ width: `${s.progress.overallScore || 0}%` }} />
                  </div>
                </div>
              )}
              {s.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.skills.slice(0, 3).map((sk) => (
                    <span key={sk} className="badge !text-[10px]">{sk}</span>
                  ))}
                </div>
              )}
              <button onClick={() => setSelected(s._id)} className="btn-secondary mt-4 w-full !py-2 text-sm">
                Give Feedback
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card w-full max-w-md p-6">
            <h3 className="text-xl font-bold">Give Feedback</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm">Rating (1-5)</label>
                <input type="number" min={1} max={5} className="input-field" value={feedback.rating}
                  onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })} />
              </div>
              <textarea className="input-field" rows={3} placeholder="Your feedback..."
                value={feedback.comment} onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => giveFeedback(selected)} className="btn-primary flex-1">Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
