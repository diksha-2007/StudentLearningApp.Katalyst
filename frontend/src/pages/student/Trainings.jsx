import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";
import { getTrainingThumbnail, DEFAULT_WEB_DEV_SVG } from "../../utils/trainingImages";

export default function StudentTrainings() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/trainings")
      .then((res) => setTrainings(res.data.trainings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(trainings.map((t) => t.category))];
  const filtered = filter === "all" ? trainings : trainings.filter((t) => t.category === filter);

  const enroll = async (id) => {
    try {
      await API.post(`/trainings/${id}/enroll`);
      alert("Enrolled successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  return (
    <DashboardLayout title="Trainings" subtitle="Student Portal">
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
              filter === cat ? "bg-katalyst-500 text-white" : "border"
            }`}
            style={filter !== cat ? { borderColor: "var(--border)" } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <div key={t._id} className="glass-card overflow-hidden transition-transform hover:-translate-y-1">
              <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                <img
                  src={getTrainingThumbnail(t)}
                  alt={t.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_WEB_DEV_SVG;
                  }}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-slate-700/60 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-lg">
                  <span>📺</span> {t.videoCount || t.videos?.length || 0} Lectures
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="badge">{t.category}</span>
                  <span className="text-xs text-slate-400">by {t.instructor || "Katalyst"}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold line-clamp-1">{t.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t.description}
                </p>
                <div className="mt-3 flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>📊 {t.level}</span>
                  <span>⏱ {t.duration || "Self-paced"}</span>
                  <span>📹 {t.videoCount || t.videos?.length || 0} Videos</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/student/trainings/${t._id}`} className="btn-primary flex-1 !py-2 text-sm text-center flex items-center justify-center gap-1.5">
                    <span>▶</span> Open Playlist
                  </Link>
                  <button onClick={() => enroll(t._id)} className="btn-secondary !py-2 text-sm">
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
