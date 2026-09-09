import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";
import { getTrainingThumbnail, DEFAULT_WEB_DEV_SVG, CATEGORY_PRESET_IMAGES } from "../../utils/trainingImages";

export default function AdminTrainings() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Web Development",
    level: "Beginner",
    duration: "",
    instructor: "",
    thumbnail: "",
  });

  const [videos, setVideos] = useState([{ title: "", url: "", duration: "15m" }]);

  const fetchTrainings = () => {
    API.get("/trainings")
      .then((res) => setTrainings(res.data.trainings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      category: "Web Development",
      level: "Beginner",
      duration: "6 weeks",
      instructor: "",
      thumbnail: CATEGORY_PRESET_IMAGES["Web Development"],
    });
    setVideos([{ title: "Lesson 1: Introduction", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", duration: "15m" }]);
    setShowModal(true);
  };

  const openEditModal = async (trainingSummary) => {
    try {
      const res = await API.get(`/trainings/${trainingSummary._id}`);
      const full = res.data.training;
      setIsEditing(true);
      setEditingId(full._id);
      setForm({
        title: full.title || "",
        description: full.description || "",
        category: full.category || "Web Development",
        level: full.level || "Beginner",
        duration: full.duration || "",
        instructor: full.instructor || "",
        thumbnail: full.thumbnail || "",
      });
      setVideos(
        full.videos && full.videos.length > 0
          ? full.videos.map((v) => ({ title: v.title, url: v.url, duration: v.duration || "15m" }))
          : [{ title: "", url: "", duration: "15m" }]
      );
      setShowModal(true);
    } catch (err) {
      alert("Failed to load training details for editing.");
    }
  };

  const addVideoField = () => {
    setVideos([...videos, { title: `Lesson ${videos.length + 1}`, url: "", duration: "20m" }]);
  };

  const updateVideo = (index, field, value) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };

  const moveVideo = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= videos.length) return;
    const updated = [...videos];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setVideos(updated);
  };

  const removeVideoField = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const saveTraining = async (e) => {
    e.preventDefault();
    const formattedVideos = videos
      .filter((v) => v.title.trim())
      .map((v, idx) => ({ ...v, order: idx + 1 }));

    try {
      if (isEditing) {
        await API.put(`/trainings/${editingId}`, {
          ...form,
          videos: formattedVideos,
        });
        alert("Training & Playlist updated successfully!");
      } else {
        await API.post("/trainings", {
          ...form,
          videos: formattedVideos,
          quizzes: [
            {
              question: `What is the primary topic of ${form.title}?`,
              options: [form.category || "General", "Advanced Concepts", "None"],
              correctAnswer: 0,
            },
          ],
          assignments: [],
        });
        alert("Training created successfully!");
      }
      setShowModal(false);
      fetchTrainings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save training");
    }
  };

  const deleteTraining = async (id) => {
    if (!confirm("Are you sure you want to delete this training course and playlist?")) return;
    try {
      await API.delete(`/trainings/${id}`);
      fetchTrainings();
    } catch (err) {
      alert("Failed to delete training");
    }
  };

  return (
    <DashboardLayout
      title="Manage Trainings & Playlists"
      subtitle="Admin Portal"
      actions={
        <button onClick={openCreateModal} className="btn-primary !py-2 text-sm flex items-center gap-1.5">
          <span>+</span> Create New Course Playlist
        </button>
      }
    >
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((t) => (
            <div key={t._id} className="glass-card overflow-hidden flex flex-col justify-between">
              <div>
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
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md rounded-md px-2 py-0.5 text-[11px] font-semibold text-white">
                    📺 {t.videoCount || t.videos?.length || 0} Lessons
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="badge">{t.category}</span>
                    <span className="text-xs text-slate-400 font-medium">by {t.instructor || "Katalyst"}</span>
                  </div>
                  <h3 className="mt-2 font-bold text-base line-clamp-1">{t.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {t.description}
                  </p>
                  <div className="mt-3 flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>📊 {t.level}</span>
                    <span>⏱ {t.duration || "Self-paced"}</span>
                    <span>👥 {t.enrolledStudents?.length || t.enrollmentCount || 0} enrolled</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => openEditModal(t)}
                  className="btn-primary flex-1 !py-1.5 text-xs text-center"
                >
                  ✏️ Edit & Playlist
                </button>
                <button
                  onClick={() => deleteTraining(t._id)}
                  className="btn-secondary !py-1.5 text-xs !text-red-400 hover:!border-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Training Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto my-8 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? "✏️ Edit Course & Playlist" : "➕ Create New Udemy-Style Course"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure course details and curate the video lecture playlist.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveTraining} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Course Title</label>
                <input
                  className="input-field mt-1 text-sm"
                  placeholder="e.g. Master React & Redux Toolkit Complete Bootcamp"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Course Description</label>
                <textarea
                  className="input-field mt-1 min-h-[70px] text-sm"
                  placeholder="Comprehensive curriculum covering core principles, hands-on coding..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    className="input-field mt-1 text-sm"
                    value={form.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setForm({
                        ...form,
                        category: newCat,
                        thumbnail: form.thumbnail || CATEGORY_PRESET_IMAGES[newCat] || "",
                      });
                    }}
                  >
                    {["Web Development", "Data Science", "DSA", "Cloud", "AI/ML", "Soft Skills", "Other"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Difficulty Level</label>
                  <select
                    className="input-field mt-1 text-sm"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Total Duration</label>
                  <input
                    className="input-field mt-1 text-sm"
                    placeholder="e.g. 6 weeks / 12 hours"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Instructor Name</label>
                  <input
                    className="input-field mt-1 text-sm"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Thumbnail Image URL</label>
                <div className="flex gap-2 mt-1">
                  <input
                    className="input-field text-xs"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        thumbnail: CATEGORY_PRESET_IMAGES[form.category] || CATEGORY_PRESET_IMAGES["Web Development"],
                      })
                    }
                    className="btn-secondary whitespace-nowrap !py-1 text-xs"
                  >
                    Preset Image
                  </button>
                </div>
              </div>

              {/* Udemy-Style Playlist Management Section */}
              <div className="pt-3 border-t border-slate-700/60 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>📺</span> Video Lectures & Playlist ({videos.length})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Add YouTube URLs or embed links in sequence like Udemy lectures.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVideoField}
                    className="btn-secondary !py-1 !px-3 text-xs text-katalyst-400 hover:text-katalyst-300"
                  >
                    + Add Lecture
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {videos.map((vid, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-700/80 bg-slate-900/60 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-katalyst-400 bg-katalyst-500/10 px-2 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                          <span className="text-slate-300 font-medium">Lecture {idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveVideo(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveVideo(idx, 1)}
                            disabled={idx === videos.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            ▼
                          </button>
                          {videos.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVideoField(idx)}
                              className="p-1 text-red-400 hover:text-red-300 ml-1"
                              title="Delete Lecture"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-2">
                        <input
                          className="input-field sm:col-span-2 !py-1 text-xs"
                          placeholder="Lesson Title (e.g. 01 - Getting Started with React)"
                          value={vid.title}
                          onChange={(e) => updateVideo(idx, "title", e.target.value)}
                          required
                        />
                        <input
                          className="input-field !py-1 text-xs"
                          placeholder="Duration (e.g. 18m)"
                          value={vid.duration}
                          onChange={(e) => updateVideo(idx, "duration", e.target.value)}
                        />
                      </div>

                      <input
                        className="input-field !py-1 text-xs font-mono"
                        placeholder="Video URL (e.g. https://www.youtube.com/watch?v=...)"
                        value={vid.url}
                        onChange={(e) => updateVideo(idx, "url", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 !py-2 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 !py-2 text-sm">
                  {isEditing ? "Save Changes" : "Create Course Playlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
