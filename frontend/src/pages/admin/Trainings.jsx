import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function AdminTrainings() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", level: "Beginner", duration: "", instructor: "",
  });

  const [videos, setVideos] = useState([{ title: "", url: "", duration: "15m" }]);

  const fetchTrainings = () => {
    API.get("/trainings")
      .then((res) => setTrainings(res.data.trainings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrainings(); }, []);

  const addVideoField = () => {
    setVideos([...videos, { title: "", url: "", duration: "15m" }]);
  };

  const updateVideo = (index, field, value) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };

  const removeVideoField = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const createTraining = async (e) => {
    e.preventDefault();
    const formattedVideos = videos
      .filter((v) => v.title.trim())
      .map((v, idx) => ({ ...v, order: idx + 1 }));

    try {
      await API.post("/trainings", { 
        ...form, 
        videos: formattedVideos, 
        quizzes: [
          { question: `What is the primary topic of ${form.title}?`, options: [form.category || "General", "Other", "None"], correctAnswer: 0 }
        ], 
        assignments: [] 
      });
      setShowCreate(false);
      setForm({ title: "", description: "", category: "", level: "Beginner", duration: "", instructor: "" });
      setVideos([{ title: "", url: "", duration: "15m" }]);
      fetchTrainings();
      alert("Training created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create training");
    }
  };

  const deleteTraining = async (id) => {
    if (!confirm("Delete this training?")) return;
    await API.delete(`/trainings/${id}`);
    fetchTrainings();
  };

  return (
    <DashboardLayout
      title="Manage Trainings"
      subtitle="Admin Portal"
      actions={<button onClick={() => setShowCreate(true)} className="btn-primary !py-2 text-sm">+ Add Training</button>}
    >
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((t) => (
            <div key={t._id} className="glass-card p-5">
              <span className="badge">{t.category}</span>
              <h3 className="mt-2 font-bold">{t.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>{t.description}</p>
              <div className="mt-3 flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{t.level}</span>
                <span>{t.duration}</span>
                <span>{t.enrolledStudents?.length || 0} enrolled</span>
              </div>
              <button onClick={() => deleteTraining(t._id)} className="btn-secondary mt-4 w-full !py-2 text-sm !text-red-500">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-xl font-bold">Create New Training</h3>
            <form onSubmit={createTraining} className="mt-4 space-y-3">
              {["title", "description", "category", "duration", "instructor"].map((f) => (
                <input key={f} className="input-field capitalize" placeholder={f} value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })} required />
              ))}
              <select className="input-field" value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l}>{l}</option>)}
              </select>

              {/* Video Lessons Section */}
              <div className="pt-2 border-t mt-4" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">📹 Course Lessons / Videos</h4>
                  <button type="button" onClick={addVideoField} className="text-xs text-katalyst-500 hover:underline">
                    + Add Lesson
                  </button>
                </div>
                {videos.map((vid, idx) => (
                  <div key={idx} className="space-y-2 mb-3 p-3 rounded-lg border text-xs" style={{ borderColor: "var(--border)" }}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Lesson #{idx + 1}</span>
                      {videos.length > 1 && (
                        <button type="button" onClick={() => removeVideoField(idx)} className="text-red-500 hover:underline">
                          Remove
                        </button>
                      )}
                    </div>
                    <input className="input-field !py-1.5 text-xs" placeholder="Lesson Title (e.g. Introduction to React)" value={vid.title}
                      onChange={(e) => updateVideo(idx, "title", e.target.value)} required />
                    <input className="input-field !py-1.5 text-xs" placeholder="Video URL (e.g. https://youtu.be/...)" value={vid.url}
                      onChange={(e) => updateVideo(idx, "url", e.target.value)} />
                    <input className="input-field !py-1.5 text-xs" placeholder="Duration (e.g. 20m)" value={vid.duration}
                      onChange={(e) => updateVideo(idx, "duration", e.target.value)} />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Training</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
