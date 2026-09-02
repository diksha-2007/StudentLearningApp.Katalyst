import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";
import { getTrainingThumbnail, DEFAULT_WEB_DEV_SVG, CATEGORY_PRESET_IMAGES } from "../../utils/trainingImages";

export default function AdminTrainings() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Web Development", level: "Beginner", duration: "", instructor: "", thumbnail: "",
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
      setForm({ title: "", description: "", category: "Web Development", level: "Beginner", duration: "", instructor: "", thumbnail: "" });
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
            <div key={t._id} className="glass-card overflow-hidden">
              <div className="relative h-36 w-full overflow-hidden bg-slate-800">
                <img
                  src={getTrainingThumbnail(t)}
                  alt={t.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_WEB_DEV_SVG;
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
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
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-xl font-bold">Create New Training</h3>
            <form onSubmit={createTraining} className="mt-4 space-y-3">
              <input
                className="input-field"
                placeholder="Training Title (e.g. Web Development Masterclass)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <textarea
                className="input-field min-h-[80px]"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Category</label>
                  <select
                    className="input-field mt-1"
                    value={form.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setForm({
                        ...form,
                        category: newCat,
                        thumbnail: form.thumbnail || CATEGORY_PRESET_IMAGES[newCat] || ""
                      });
                    }}
                  >
                    {["Web Development", "Data Science", "DSA", "Cloud", "AI/ML", "Soft Skills", "Other"].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400">Level</label>
                  <select
                    className="input-field mt-1"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  className="input-field"
                  placeholder="Duration (e.g. 6 weeks)"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Instructor Name"
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Training Picture URL (Optional)</label>
                <div className="flex gap-2 mt-1">
                  <input
                    className="input-field text-xs"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, thumbnail: CATEGORY_PRESET_IMAGES[form.category] || CATEGORY_PRESET_IMAGES["Web Development"] })}
                    className="btn-secondary whitespace-nowrap !py-1 text-xs"
                  >
                    Use Preset Image
                  </button>
                </div>
                {form.thumbnail && (
                  <div className="mt-2 h-24 w-full overflow-hidden rounded-lg border border-slate-700">
                    <img src={form.thumbnail} alt="Preview" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = DEFAULT_WEB_DEV_SVG; }} />
                  </div>
                )}
              </div>

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
