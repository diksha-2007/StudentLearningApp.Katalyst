import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function MentorProfile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    expertise: "",
    designation: "",
    company: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get("/mentors/profile")
      .then((res) => {
        const mentor = res.data.mentor;
        setForm({
          name: mentor.name || "",
          phone: mentor.phone || "",
          bio: mentor.bio || "",
          expertise: (mentor.expertise || []).join(", "),
          designation: mentor.designation || "",
          company: mentor.company || "",
        });
      })
      .catch(console.error);
  }, []);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await API.put("/mentors/profile", {
        ...form,
        expertise: form.expertise.split(",").map((item) => item.trim()).filter(Boolean),
      });
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile" subtitle="Mentor Portal">
      <div className="glass-card max-w-3xl p-6">
        <h3 className="section-title mb-4">Personal Information</h3>
        <form onSubmit={saveProfile} className="space-y-4">
          {[
            ["name", "Name"],
            ["phone", "Phone"],
            ["designation", "Designation"],
            ["company", "Company"],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              <input
                className="input-field"
                value={form[field]}
                onChange={(event) => updateField(field, event.target.value)}
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea
              className="input-field"
              rows={4}
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Expertise (comma separated)</label>
            <input
              className="input-field"
              value={form.expertise}
              onChange={(event) => updateField("expertise", event.target.value)}
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}