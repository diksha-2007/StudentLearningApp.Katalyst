import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";
import { Plus, Edit2, Trash2, ExternalLink, Search, Landmark, GraduationCap, BookCheck, FileText, Laptop, MapPin } from "lucide-react";

export default function AdminEmpowermentHub() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    type: "scheme",
    titleEn: "",
    titleMr: "",
    descriptionEn: "",
    descriptionMr: "",
    category: "Higher Education",
    badge: "Government Scheme",
    icon: "🏛️",
    benefitsEn: "",
    benefitsMr: "",
    eligibilityEn: "",
    eligibilityMr: "",
    documentsRequiredEn: "",
    documentsRequiredMr: "",
    applicationStepsEn: "",
    applicationStepsMr: "",
    officialUrl: "",
    portalName: "MahaDBT / National Portal",
    district: "All Maharashtra Districts",
  });

  const fetchResources = () => {
    API.get("/empowerment")
      .then((res) => setResources(res.data.resources || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      type: "scheme",
      titleEn: "",
      titleMr: "",
      descriptionEn: "",
      descriptionMr: "",
      category: "Higher Education",
      badge: "Government Scheme",
      icon: "🏛️",
      benefitsEn: "",
      benefitsMr: "",
      eligibilityEn: "Family income under ₹8 Lakhs\nMaharashtra Domicile required",
      eligibilityMr: "कुटुंबाचे उत्पन्न ₹८ लाखांच्या आत\nमहाराष्ट्र अधिवास प्रमाणपत्र आवश्यक",
      documentsRequiredEn: "Income Certificate, Domicile, CAP Allotment Letter",
      documentsRequiredMr: "उत्पन्नाचा दाखला, अधिवास दाखला, प्रवेश वाटप पत्र",
      applicationStepsEn: "Register on portal\nUpload documents\nSubmit for verification",
      applicationStepsMr: "पोर्टलवर नोंदणी करा\nकागदपत्रे अपलोड करा\nछाननीसाठी सबमिट करा",
      officialUrl: "https://mahadbt.maharashtra.gov.in",
      portalName: "MahaDBT Portal",
      district: "All Maharashtra Districts",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setForm({
      type: item.type || "scheme",
      titleEn: item.titleEn || "",
      titleMr: item.titleMr || "",
      descriptionEn: item.descriptionEn || "",
      descriptionMr: item.descriptionMr || "",
      category: item.category || "General",
      badge: item.badge || "Government Scheme",
      icon: item.icon || "🏛️",
      benefitsEn: item.benefitsEn || "",
      benefitsMr: item.benefitsMr || "",
      eligibilityEn: (item.eligibilityEn || []).join("\n"),
      eligibilityMr: (item.eligibilityMr || []).join("\n"),
      documentsRequiredEn: (item.documentsRequiredEn || []).join(", "),
      documentsRequiredMr: (item.documentsRequiredMr || []).join(", "),
      applicationStepsEn: (item.applicationStepsEn || []).join("\n"),
      applicationStepsMr: (item.applicationStepsMr || []).join("\n"),
      officialUrl: item.officialUrl || "",
      portalName: item.portalName || "MahaDBT",
      district: item.district || "All Maharashtra Districts",
    });
    setShowModal(true);
  };

  const saveResource = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      eligibilityEn: form.eligibilityEn.split("\n").map((s) => s.trim()).filter(Boolean),
      eligibilityMr: form.eligibilityMr.split("\n").map((s) => s.trim()).filter(Boolean),
      documentsRequiredEn: form.documentsRequiredEn.split(",").map((s) => s.trim()).filter(Boolean),
      documentsRequiredMr: form.documentsRequiredMr.split(",").map((s) => s.trim()).filter(Boolean),
      applicationStepsEn: form.applicationStepsEn.split("\n").map((s) => s.trim()).filter(Boolean),
      applicationStepsMr: form.applicationStepsMr.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await API.put(`/empowerment/${editingId}`, payload);
        alert("Resource updated successfully!");
      } else {
        await API.post("/empowerment", payload);
        alert("New resource added successfully!");
      }
      setShowModal(false);
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save resource");
    }
  };

  const deleteResource = async (id) => {
    if (!confirm("Are you sure you want to delete this resource entry?")) return;
    try {
      await API.delete(`/empowerment/${id}`);
      fetchResources();
    } catch (err) {
      alert("Failed to delete resource");
    }
  };

  const filtered = resources.filter((item) => {
    if (activeFilter !== "all" && item.type !== activeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.titleEn?.toLowerCase().includes(q) ||
        item.titleMr?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <DashboardLayout
      title="Manage Schemes & Rural Learning Hub"
      subtitle="Admin Portal • Add, Edit & Manage Marathi & English Schemes, Exams & Scholarships"
      actions={
        <button onClick={openCreateModal} className="btn-primary !py-2 text-sm flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add New Scheme / Resource</span>
        </button>
      }
    >
      {/* Category Pills & Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Items" },
            { id: "scheme", label: "🏛️ Govt Schemes" },
            { id: "scholarship", label: "🎓 Scholarships" },
            { id: "exam", label: "📝 Exams (MPSC/UPSC)" },
            { id: "form_guide", label: "📄 Form Guides" },
            { id: "digital_skill", label: "🧑‍💻 Digital Skills" },
            { id: "opportunity", label: "📍 Local Radar" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                activeFilter === cat.id ? "bg-katalyst-500 text-white shadow-md" : "border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-9 !py-1.5 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item._id} className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-slate-600 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge text-[11px]">{item.type.toUpperCase()}</span>
                  <span className="text-[11px] text-slate-400 font-mono">📍 {item.district}</span>
                </div>

                <h4 className="font-bold text-sm text-white mt-3 line-clamp-1">{item.titleEn}</h4>
                <p className="text-xs text-katalyst-400 mt-0.5 line-clamp-1 font-medium">{item.titleMr}</p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">{item.descriptionEn}</p>

                {item.benefitsEn && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                    <span className="font-bold">Benefit: </span>
                    <span className="line-clamp-2">{item.benefitsEn}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="btn-primary flex-1 !py-1.5 text-xs flex items-center justify-center gap-1"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteResource(item._id)}
                  className="btn-secondary !py-1.5 !px-3 text-xs !text-red-400 hover:!border-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto my-8 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? "✏️ Edit Scheme / Opportunity Entry" : "➕ Add Scheme / Rural Resource"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish verified government schemes, exam syllabi, scholarships in English & Marathi.
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={saveResource} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Resource Type</label>
                  <select
                    className="input-field mt-1 text-sm"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="scheme">🏛️ Government Scheme (सरकारी योजना)</option>
                    <option value="scholarship">🎓 Scholarship (शिष्यवृत्ती)</option>
                    <option value="exam">📝 Competitive Exam (MPSC/UPSC/Bank)</option>
                    <option value="form_guide">📄 Govt Certificate Form Guide</option>
                    <option value="digital_skill">🧑‍💻 Digital Skill (Excel/Cyber)</option>
                    <option value="opportunity">📍 Local Opportunity / Training</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">District / Region</label>
                  <input
                    className="input-field mt-1 text-sm"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="All Maharashtra Districts or Pune, Nagpur..."
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Title in English 🇬🇧</label>
                  <input
                    className="input-field mt-1 text-sm"
                    value={form.titleEn}
                    onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                    placeholder="e.g. MahaDBT Rajarshi Shahu Maharaj Scholarship"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Title in Marathi 🇮🇳</label>
                  <input
                    className="input-field mt-1 text-sm font-medium"
                    value={form.titleMr}
                    onChange={(e) => setForm({ ...form, titleMr: e.target.value })}
                    placeholder="उदा. राजर्षी शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Description (English)</label>
                  <textarea
                    rows={3}
                    className="input-field mt-1 text-xs"
                    value={form.descriptionEn}
                    onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                    placeholder="Summary of the scheme and objective..."
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Description (Marathi)</label>
                  <textarea
                    rows={3}
                    className="input-field mt-1 text-xs font-medium"
                    value={form.descriptionMr}
                    onChange={(e) => setForm({ ...form, descriptionMr: e.target.value })}
                    placeholder="योजनेचा उद्देश व माहिती मराठीत..."
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Key Benefits (English)</label>
                  <input
                    className="input-field mt-1 text-xs"
                    value={form.benefitsEn}
                    onChange={(e) => setForm({ ...form, benefitsEn: e.target.value })}
                    placeholder="e.g. 50% Tuition fee reimbursement"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Key Benefits (Marathi)</label>
                  <input
                    className="input-field mt-1 text-xs font-medium"
                    value={form.benefitsMr}
                    onChange={(e) => setForm({ ...form, benefitsMr: e.target.value })}
                    placeholder="उदा. ५०% शैक्षणिक शुल्क प्रतिपूर्ती"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Eligibility (English - one per line)</label>
                  <textarea
                    rows={3}
                    className="input-field mt-1 text-xs"
                    value={form.eligibilityEn}
                    onChange={(e) => setForm({ ...form, eligibilityEn: e.target.value })}
                    placeholder="Annual Income under ₹8 Lakhs&#10;Maharashtra Domicile"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Eligibility (Marathi - एक प्रति ओळ)</label>
                  <textarea
                    rows={3}
                    className="input-field mt-1 text-xs font-medium"
                    value={form.eligibilityMr}
                    onChange={(e) => setForm({ ...form, eligibilityMr: e.target.value })}
                    placeholder="वार्षिक उत्पन्न ₹८ लाखांच्या आत&#10;महाराष्ट्र अधिवास दाखला आवश्यक"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Required Documents (English - comma separated)</label>
                  <input
                    className="input-field mt-1 text-xs"
                    value={form.documentsRequiredEn}
                    onChange={(e) => setForm({ ...form, documentsRequiredEn: e.target.value })}
                    placeholder="Income Certificate, Domicile, Marksheet"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Required Documents (Marathi - स्वल्पविरामाने वेगळे करा)</label>
                  <input
                    className="input-field mt-1 text-xs font-medium"
                    value={form.documentsRequiredMr}
                    onChange={(e) => setForm({ ...form, documentsRequiredMr: e.target.value })}
                    placeholder="उत्पन्नाचा दाखला, अधिवास दाखला, गुणपत्रिका"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Official Portal Apply Link</label>
                  <input
                    className="input-field mt-1 text-xs font-mono"
                    value={form.officialUrl}
                    onChange={(e) => setForm({ ...form, officialUrl: e.target.value })}
                    placeholder="https://mahadbt.maharashtra.gov.in"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Portal / Authority Name</label>
                  <input
                    className="input-field mt-1 text-xs"
                    value={form.portalName}
                    onChange={(e) => setForm({ ...form, portalName: e.target.value })}
                    placeholder="MahaDBT / Social Justice Dept"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-700">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 !py-2 text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 !py-2 text-sm font-bold">
                  {isEditing ? "Save Changes" : "Publish to Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
