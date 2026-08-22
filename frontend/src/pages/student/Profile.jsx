import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", bio: "", skills: "" });
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    API.get("/students/profile")
      .then((res) => {
        const s = res.data.student;
        setProfile(s);
        setForm({ name: s.name, phone: s.phone || "", bio: s.bio || "", skills: (s.skills || []).join(", ") });
      })
      .catch(console.error);
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put("/students/profile", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setProfile(res.data.student);
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    const fd = new FormData();
    fd.append("resume", resumeFile);
    try {
      const res = await API.post("/students/resume", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile({ ...profile, resumeUrl: res.data.resumeUrl });
      alert("Resume uploaded!");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <DashboardLayout title="Profile" subtitle="Student Portal">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Personal Information</h3>
          <form onSubmit={saveProfile} className="space-y-4">
            {["name", "phone"].map((f) => (
              <div key={f}>
                <label className="mb-1 block text-sm font-medium capitalize">{f}</label>
                <input className="input-field" value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-sm font-medium">Bio</label>
              <textarea className="input-field" rows={3} value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Skills (comma separated)</label>
              <input className="input-field" value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="section-title mb-4">📄 Resume</h3>
            {profile?.resumeUrl ? (
              <a href={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${profile.resumeUrl}`} target="_blank" rel="noreferrer"
                className="text-katalyst-500 hover:underline text-sm">
                View current resume →
              </a>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No resume uploaded yet.</p>
            )}
            <div className="mt-4">
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])}
                className="text-sm" />
              <button onClick={uploadResume} disabled={!resumeFile} className="btn-primary mt-3 !py-2 text-sm">
                Upload Resume
              </button>
            </div>
          </div>

          {profile?.assignedMentor && (
            <div className="glass-card p-6">
              <h3 className="section-title mb-4">👨‍🏫 Assigned Mentor</h3>
              <p className="font-bold">{profile.assignedMentor.name}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {profile.assignedMentor.designation} · {profile.assignedMentor.company}
              </p>
              <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                {profile.assignedMentor.expertise?.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
