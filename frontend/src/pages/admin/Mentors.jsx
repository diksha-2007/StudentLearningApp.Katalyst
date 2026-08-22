import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function AdminMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", expertise: "", designation: "", company: "" });

  const fetchMentors = () => {
    API.get("/admin/mentors")
      .then((res) => setMentors(res.data.mentors || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMentors(); }, []);

  const createMentor = async (e) => {
    e.preventDefault();
    await API.post("/admin/mentors", {
      ...form,
      expertise: form.expertise.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setShowCreate(false);
    fetchMentors();
  };

  const deleteMentor = async (id) => {
    if (!confirm("Delete this mentor?")) return;
    await API.delete(`/admin/mentors/${id}`);
    fetchMentors();
  };

  return (
    <DashboardLayout
      title="Manage Mentors"
      subtitle="Admin Portal"
      actions={<button onClick={() => setShowCreate(true)} className="btn-primary !py-2 text-sm">+ Add Mentor</button>}
    >
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m) => (
            <div key={m._id} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-katalyst-500 text-lg font-bold text-white">
                  {m.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{m.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.designation}</p>
                </div>
              </div>
              <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>{m.email}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                Students: {m.assignedStudents?.length || 0} · Rating: {m.rating || 5}/5
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {m.expertise?.slice(0, 3).map((e) => (
                  <span key={e} className="badge !text-[10px]">{e}</span>
                ))}
              </div>
              <button onClick={() => deleteMentor(m._id)} className="btn-secondary mt-4 w-full !py-2 text-sm !text-red-500">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold">Create Mentor</h3>
            <form onSubmit={createMentor} className="mt-4 space-y-3">
              {["name", "email", "password", "designation", "company"].map((f) => (
                <input key={f} className="input-field" placeholder={f} type={f === "password" ? "password" : "text"}
                  value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={f !== "company"} />
              ))}
              <input className="input-field" placeholder="Expertise (comma separated)" value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
