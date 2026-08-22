import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get("/admin/students"), API.get("/admin/mentors")])
      .then(([s, m]) => {
        setStudents(s.data.students || []);
        setMentors(m.data.mentors || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const assignMentor = async (studentId, mentorId) => {
    await API.post("/admin/assign-mentor", { studentId, mentorId });
    const res = await API.get("/admin/students");
    setStudents(res.data.students || []);
  };

  const toggleActive = async (id, isActive) => {
    await API.put(`/admin/students/${id}`, { isActive: !isActive });
    const res = await API.get("/admin/students");
    setStudents(res.data.students || []);
  };

  const deleteStudent = async (id) => {
    if (!confirm("Delete this student?")) return;
    await API.delete(`/admin/students/${id}`);
    setStudents(students.filter((s) => s._id !== id));
  };

  return (
    <DashboardLayout title="Manage Students" subtitle="Admin Portal">
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Name", "Email", "Mentor", "Status", "Actions"].map((h) => (
                  <th key={h} className="p-4 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4" style={{ color: "var(--text-secondary)" }}>{s.email}</td>
                  <td className="p-4">
                    <select
                      value={s.assignedMentor?._id || ""}
                      onChange={(e) => e.target.value && assignMentor(s._id, e.target.value)}
                      className="input-field !py-1.5 text-xs"
                    >
                      <option value="">Assign mentor</option>
                      {mentors.map((m) => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${s.isActive ? "!bg-green-100 !text-green-700" : "!bg-red-100 !text-red-700"}`}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => toggleActive(s._id, s.isActive)} className="btn-secondary !py-1 text-xs">
                        {s.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => deleteStudent(s._id)} className="btn-secondary !py-1 text-xs !text-red-500">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
