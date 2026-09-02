import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";
import {
  Award,
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgePercent,
  Coins,
  ArrowUpRight,
  X,
  HelpCircle,
  RefreshCw,
} from "lucide-react";

export default function StudentScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'Public', 'Private', 'saved'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default"); // 'default', 'amount-desc', 'deadline'

  // Selected scholarship for modal
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Bookmarks (Saved scholarships)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("katalyst_saved_scholarships");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Eligibility Checker Drawer / State
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);
  const [eligibilityForm, setEligibilityForm] = useState({
    gender: "Female",
    annualIncome: "300000",
    percentage: "78",
    course: "B.Tech",
    isDisability: false,
    domicile: "All India",
  });
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [evaluatingEligibility, setEvaluatingEligibility] = useState(false);

  // Load scholarships from backend API
  const fetchScholarships = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/scholarships");
      if (res.data && res.data.scholarships) {
        setScholarships(res.data.scholarships);
      } else {
        setScholarships([]);
      }
    } catch (err) {
      console.error("Failed to load scholarships:", err);
      setError("Unable to connect to scholarship service. Showing cached/fallback data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Save/Unsave toggle
  const toggleSave = (id) => {
    let updated;
    if (savedIds.includes(id)) {
      updated = savedIds.filter((item) => item !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    try {
      localStorage.setItem("katalyst_saved_scholarships", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Run eligibility evaluator
  const handleCheckEligibility = async (e) => {
    if (e) e.preventDefault();
    setEvaluatingEligibility(true);
    try {
      const res = await API.post("/scholarships/check-eligibility", {
        gender: eligibilityForm.gender,
        annualIncome: Number(eligibilityForm.annualIncome) || 0,
        percentage: Number(eligibilityForm.percentage) || 0,
        course: eligibilityForm.course,
        isDisability: eligibilityForm.isDisability,
        domicile: eligibilityForm.domicile,
      });

      if (res.data && res.data.results) {
        setEligibilityResults(res.data.results);
      }
    } catch (err) {
      console.error("Failed to calculate eligibility:", err);
      alert("Failed to evaluate eligibility. Please check your inputs.");
    } finally {
      setEvaluatingEligibility(false);
    }
  };

  // Filter and sort scholarships
  const filteredScholarships = useMemo(() => {
    let list = [...scholarships];

    // Saved only filter
    if (typeFilter === "saved") {
      list = list.filter((s) => savedIds.includes(s.id));
    } else if (typeFilter !== "all") {
      list = list.filter((s) => s.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter((s) => {
        const cat = (s.category || "").toLowerCase();
        const qCat = categoryFilter.toLowerCase();
        if (qCat === "women") return cat.includes("women") || s.eligibility?.gender === "Female";
        if (qCat === "merit") return cat.includes("merit");
        if (qCat === "need") return cat.includes("need") || cat.includes("means") || cat.includes("minority");
        if (qCat === "pwd") return cat.includes("abled") || cat.includes("pwd");
        return cat.includes(qCat);
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    if (sortBy === "amount-desc") {
      list.sort((a, b) => (b.amountNumeric || 0) - (a.amountNumeric || 0));
    } else if (sortBy === "deadline") {
      list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    return list;
  }, [scholarships, typeFilter, categoryFilter, searchQuery, sortBy, savedIds]);

  // Quick stats
  const totalCount = scholarships.length;
  const publicCount = scholarships.filter((s) => s.type === "Public").length;
  const privateCount = scholarships.filter((s) => s.type === "Private").length;
  const savedCount = savedIds.length;

  return (
    <DashboardLayout title="Scholarship Portal" subtitle="Student Portal">
      {/* Top Banner / Hero Stats */}
      <div className="mb-8 rounded-2xl border p-6 lg:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(147,51,234,0.08) 100%)",
          borderColor: "var(--border)",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 mb-3 border border-blue-200 dark:border-blue-800">
              <Sparkles className="h-3.5 w-3.5" /> 100% Verified Scholarships & Grants
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Higher Education & Financial Aid Portal
            </h1>
            <p className="mt-2 text-sm lg:text-base" style={{ color: "var(--text-secondary)" }}>
              Explore Government schemes (AICTE, NSP, PMSSS) and premier Corporate CSR grants (Google, Reliance, Tata, Kotak, Infosys). Check your eligibility instantly to unlock funding for your education.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setShowEligibilityChecker(!showEligibilityChecker);
                if (!eligibilityResults) handleCheckEligibility();
              }}
              className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all !py-3"
            >
              <Sparkles className="h-4 w-4" />
              <span>{showEligibilityChecker ? "Hide Match Calculator" : "⚡ AI Eligibility Matcher"}</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border p-4 backdrop-blur-sm"
            style={{ background: "var(--bg-glass)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Schemes</p>
                <p className="text-xl font-bold">{totalCount} Active</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4 backdrop-blur-sm"
            style={{ background: "var(--bg-glass)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Govt / Public</p>
                <p className="text-xl font-bold">{publicCount} Schemes</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4 backdrop-blur-sm"
            style={{ background: "var(--bg-glass)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Corporate CSR</p>
                <p className="text-xl font-bold">{privateCount} Grants</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4 backdrop-blur-sm"
            style={{ background: "var(--bg-glass)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Max Grant Value</p>
                <p className="text-xl font-bold">Up to ₹6 Lakhs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Eligibility Matcher Panel */}
      {showEligibilityChecker && (
        <div className="mb-8 rounded-2xl border p-6 animate-fade-in shadow-xl relative"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--accent)",
          }}
        >
          <div className="flex items-center justify-between border-b pb-4 mb-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Interactive Scholarship Eligibility Calculator</h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Enter your academic and family criteria to instantly calculate probability scores and requirements match.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEligibilityChecker(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                Gender
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={eligibilityForm.gender}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, gender: e.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other / All</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                Annual Family Income (₹)
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={eligibilityForm.annualIncome}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, annualIncome: e.target.value })}
              >
                <option value="150000">Under ₹1.5 Lakhs</option>
                <option value="250000">₹2.5 Lakhs</option>
                <option value="400000">₹4.0 Lakhs</option>
                <option value="600000">₹6.0 Lakhs</option>
                <option value="800000">₹8.0 Lakhs</option>
                <option value="1500000">Above ₹8 Lakhs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                Academic Score (%)
              </label>
              <input
                type="number"
                min="35"
                max="100"
                className="input-field !py-2 text-sm"
                value={eligibilityForm.percentage}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, percentage: e.target.value })}
                placeholder="e.g. 78"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                Degree / Course
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={eligibilityForm.course}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, course: e.target.value })}
              >
                <option value="B.Tech">B.Tech / B.E (Engineering)</option>
                <option value="BCA">BCA / B.Sc Computer Science</option>
                <option value="MBBS">MBBS / Healthcare</option>
                <option value="Diploma">Polytechnic / Diploma</option>
                <option value="B.Com">B.Com / B.A / BBA</option>
                <option value="M.Tech">M.Tech / MBA (Postgraduate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                Domicile / Region
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={eligibilityForm.domicile}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, domicile: e.target.value })}
              >
                <option value="All India">All India / Any State</option>
                <option value="Jammu & Kashmir">J&K or Ladakh</option>
                <option value="Andhra Pradesh">Andhra / Telangana</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold mb-3 cursor-pointer select-none" style={{ color: "var(--text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={eligibilityForm.isDisability}
                  onChange={(e) => setEligibilityForm({ ...eligibilityForm, isDisability: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Specially-Abled (PwD ≥40%)</span>
              </label>
              <button
                type="submit"
                disabled={evaluatingEligibility}
                className="btn-primary !py-2 text-xs w-full flex items-center justify-center gap-1.5"
              >
                {evaluatingEligibility ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Evaluating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Re-calculate Match
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results preview banner */}
          {eligibilityResults && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  🎯 Highly Matched Opportunities for You ({eligibilityResults.length} Found):
                </p>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Sorted by Compatibility Score
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {eligibilityResults.slice(0, 3).map((match) => (
                  <div
                    key={match.id}
                    className="p-3 rounded-xl border flex flex-col justify-between"
                    style={{ background: "var(--accent-light)", borderColor: "var(--border)" }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {match.matchPercentage}% Match ({match.matchStatus})
                        </span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {match.amount}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold line-clamp-1">{match.title}</h4>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-secondary)" }}>
                        {match.matchReasons[0] || "Meets primary eligibility criteria"}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedScholarship(match)}
                      className="mt-2 text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      View Details & Instructions →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Filter & Search Controls */}
      <div className="glass-card mb-6 p-4 lg:p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by scholarship, provider, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 !py-2 text-sm w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Scope tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "all", label: `All (${totalCount})` },
              { id: "Public", label: `🏛️ Government (${publicCount})` },
              { id: "Private", label: `🏢 Corporate CSR (${privateCount})` },
              { id: "saved", label: `⭐ Saved (${savedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  typeFilter === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
                style={typeFilter !== tab.id ? { borderColor: "var(--border)", color: "var(--text-secondary)" } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field !py-1.5 !px-3 text-xs w-auto"
            >
              <option value="default">Sort: Recommended</option>
              <option value="amount-desc">Sort: Highest Grant Amount</option>
              <option value="deadline">Sort: Application Deadline</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-2" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs font-semibold text-gray-400 mr-1">Categories:</span>
          {[
            { id: "all", label: "All Categories" },
            { id: "women", label: "👩‍🎓 Women in STEM" },
            { id: "merit", label: "🌟 Merit-Based" },
            { id: "need", label: "🤝 Need-Based / Means" },
            { id: "pwd", label: "♿ Specially-Abled (PwD)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                categoryFilter === cat.id
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-700"
                  : "border text-gray-600 dark:text-gray-300 hover:border-gray-400"
              }`}
              style={categoryFilter !== cat.id ? { borderColor: "var(--border)" } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex h-48 flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading verified scholarships...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredScholarships.length === 0 && (
        <div className="glass-card p-12 text-center my-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold">No scholarships found</h3>
          <p className="mt-1 text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            No scholarships match your current search query or filter options. Try clearing filters or searching with different keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setTypeFilter("all");
              setCategoryFilter("all");
            }}
            className="btn-secondary mt-4 !py-2 text-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Scholarships Grid */}
      {!loading && filteredScholarships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredScholarships.map((s) => {
            const isSaved = savedIds.includes(s.id);
            const isGovt = s.type === "Public";

            return (
              <div
                key={s.id}
                className="glass-card flex flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl relative border"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  {/* Top Bar: Provider Tag & Bookmark button */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          isGovt
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {isGovt ? "🏛️ Government" : "🏢 Corporate CSR"}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                        {s.category}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSave(s.id)}
                      title={isSaved ? "Remove from bookmarks" : "Save scholarship"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved
                          ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                          : "text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="h-5 w-5 fill-current" /> : <Bookmark className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Title & Provider */}
                  <h3 className="text-base font-bold leading-snug line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedScholarship(s)}
                  >
                    {s.title}
                  </h3>
                  <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
                    {s.provider}
                  </p>

                  {/* Amount & Deadline Highlight Box */}
                  <div
                    className="mt-4 mb-4 rounded-xl p-3.5 border flex items-center justify-between"
                    style={{ background: "var(--accent-light)", borderColor: "var(--border)" }}
                  >
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                        Scholarship Amount
                      </p>
                      <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                        {s.amount}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                        Deadline
                      </p>
                      <p className="text-xs font-semibold flex items-center gap-1 mt-0.5 text-gray-700 dark:text-gray-300">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        {new Date(s.deadline).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: "var(--text-secondary)" }}>
                    {s.description}
                  </p>

                  {/* Quick Eligibility Requirements Pill Checklist */}
                  <div className="space-y-1.5 text-xs mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Eligibility Snapshot:</p>
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">
                        <strong>Course:</strong> {s.course}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>
                        <strong>Max Income:</strong> Up to ₹{(s.eligibility.maxFamilyIncome / 100000).toFixed(1)} Lakhs/yr
                      </span>
                    </div>
                    {s.eligibility.gender === "Female" && (
                      <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span>Exclusive for Female Students</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t flex items-center gap-2 mt-2" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => setSelectedScholarship(s)}
                    className="btn-secondary !py-2 !px-3 text-xs font-semibold flex-1 text-center"
                  >
                    View Details
                  </button>
                  <a
                    href={s.officialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary !py-2 !px-3 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>Apply</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Scholarship Details Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 lg:p-8 shadow-2xl"
            style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedScholarship(null)}
              className="absolute top-5 right-5 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                    selectedScholarship.type === "Public"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  }`}
                >
                  {selectedScholarship.type === "Public" ? "Government Scheme" : "Corporate CSR Grant"}
                </span>
                <span className="badge">{selectedScholarship.category}</span>
                <span className="text-xs text-gray-400">Portal: {selectedScholarship.portalName}</span>
              </div>

              <h2 className="text-xl lg:text-2xl font-extrabold">{selectedScholarship.title}</h2>
              <p className="text-sm font-medium mt-1" style={{ color: "var(--text-muted)" }}>
                Offered by: {selectedScholarship.provider}
              </p>
            </div>

            {/* Grant & Deadline Box */}
            <div
              className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl p-4 border"
              style={{ background: "var(--accent-light)", borderColor: "var(--border)" }}
            >
              <div>
                <p className="text-xs font-semibold text-gray-500">Scholarship Benefit</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {selectedScholarship.amount}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Application Deadline</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                  {new Date(selectedScholarship.deadline).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Target Education Level</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                  {selectedScholarship.educationLevel}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Program Overview</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {selectedScholarship.description}
              </p>
            </div>

            {/* Detailed Eligibility Criteria */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Eligibility Criteria Checklist
              </h3>
              <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: "var(--border)" }}>
                {selectedScholarship.eligibility?.criteriaList?.map((crit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span style={{ color: "var(--text-secondary)" }}>{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Key Benefits & Allowances
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                {selectedScholarship.benefits?.map((b, idx) => (
                  <li key={idx} className="leading-relaxed">{b}</li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Mandatory Documents to Prepare</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedScholarship.documentsRequired?.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border flex items-center gap-2"
                    style={{ background: "var(--bg-glass)", borderColor: "var(--border)" }}
                  >
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Steps */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Step-by-Step Application Workflow
              </h3>
              <div className="space-y-2">
                {selectedScholarship.applicationProcess?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <p className="mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSave(selectedScholarship.id)}
                  className="btn-secondary !py-2.5 text-xs flex items-center gap-1.5"
                >
                  {savedIds.includes(selectedScholarship.id) ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 text-amber-500 fill-current" />
                      <span>Saved in Bookmarks</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>Save for Later</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="btn-secondary !py-2.5 text-xs flex-1 sm:flex-initial"
                >
                  Close
                </button>
                <a
                  href={selectedScholarship.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary !py-2.5 text-xs flex-1 sm:flex-initial flex items-center justify-center gap-2"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
