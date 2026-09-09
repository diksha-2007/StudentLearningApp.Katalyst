import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";
import { getTrainingThumbnail, DEFAULT_WEB_DEV_SVG } from "../../utils/trainingImages";

export default function TrainingDetail() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEnrollment, setUserEnrollment] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [markingDone, setMarkingDone] = useState(false);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url;
  };

  const fetchTrainingDetails = (keepActiveIndex = true) => {
    API.get(`/trainings/${id}`)
      .then((res) => {
        const tr = res.data.training;
        const enroll = res.data.userEnrollment;
        setTraining(tr);
        setUserEnrollment(enroll);

        if (!keepActiveIndex && tr?.videos?.length > 0) {
          const completed = enroll?.completedVideos || [];
          const firstIncomplete = tr.videos.findIndex((_, idx) => !completed.includes(idx));
          setActiveVideoIndex(firstIncomplete !== -1 ? firstIncomplete : 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrainingDetails(false);
    const savedNotes = localStorage.getItem(`course_notes_${id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [id]);

  const saveNotes = () => {
    localStorage.setItem(`course_notes_${id}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const completeVideo = async (videoIndex, autoAdvance = false) => {
    setMarkingDone(true);
    try {
      await API.post(`/trainings/${id}/complete-video`, { videoIndex });
      fetchTrainingDetails(true);
      if (autoAdvance && training?.videos && videoIndex + 1 < training.videos.length) {
        setActiveVideoIndex(videoIndex + 1);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark lesson as completed");
    } finally {
      setMarkingDone(false);
    }
  };

  const submitQuiz = async () => {
    const formattedAnswers = Object.entries(quizAnswers).map(([qIdx, optIdx]) => ({
      questionIndex: Number(qIdx),
      selectedOption: Number(optIdx),
    }));

    try {
      const res = await API.post(`/trainings/${id}/submit-quiz`, { answers: formattedAnswers });
      setQuizResult(res.data);
      alert(`Quiz Submitted! Score: ${res.data.score}/${res.data.maxScore} (${res.data.percentage}%)`);
      fetchTrainingDetails(true);
    } catch (err) {
      alert(err.response?.data?.message || "Quiz submission failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading Course..." subtitle="Student Portal">
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!training) {
    return (
      <DashboardLayout title="Course Not Found" subtitle="Student Portal">
        <div className="glass-card p-8 text-center">
          <p className="text-lg">Training course not found or unavailable.</p>
          <Link to="/student/trainings" className="btn-primary mt-4 inline-block">
            ← Back to Trainings
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const videos = training.videos || [];
  const completedVideos = userEnrollment?.completedVideos || [];
  const currentVideo = videos[activeVideoIndex] || videos[0];
  const progressPercent = videos.length > 0 ? Math.round((completedVideos.length / videos.length) * 100) : 0;
  const isCurrentCompleted = completedVideos.includes(activeVideoIndex);

  const filteredVideos = videos.map((v, originalIndex) => ({ ...v, originalIndex })).filter((v) =>
    v.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <DashboardLayout title={training.title} subtitle={`${training.category} • Playlist & Course Player`}>
      {/* Top Breadcrumb & Quick Info Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link to="/student/trainings" className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
            ← Back to Courses
          </Link>
          <span className="badge">{training.category}</span>
          <span className="text-xs text-slate-400">Level: {training.level}</span>
        </div>

        {/* Course Completion Meter */}
        <div className="flex items-center gap-3 glass-card !py-1.5 !px-4 text-xs">
          <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-katalyst-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-semibold text-emerald-400">
            {completedVideos.length}/{videos.length} completed ({progressPercent}%)
          </span>
          {progressPercent === 100 && (
            <Link to="/student/certificates" className="badge !bg-emerald-500/20 !text-emerald-400 hover:underline">
              🏆 Certificate Ready
            </Link>
          )}
        </div>
      </div>

      {/* Udemy-Style Main Stage Grid: Video Player (Left 2/3) + Playlist Sidebar (Right 1/3) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Video Player + Controls + Tabs (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Video Screen */}
          <div className="glass-card overflow-hidden p-0 rounded-2xl shadow-2xl border border-slate-700/50 bg-slate-950">
            {currentVideo?.url ? (
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <iframe
                  key={currentVideo.url + activeVideoIndex}
                  src={getYouTubeEmbedUrl(currentVideo.url)}
                  title={currentVideo.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
                <span className="text-4xl mb-2">📹</span>
                <p className="font-semibold text-white">No video attached to this lesson.</p>
                <p className="text-xs mt-1 text-slate-400">Please review lecture materials or notes below.</p>
              </div>
            )}

            {/* Video Player Action Bar */}
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900/90">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge !py-0.5 !px-2 text-[11px] !bg-katalyst-500/20 !text-katalyst-400">
                    Lesson {activeVideoIndex + 1} of {videos.length}
                  </span>
                  {isCurrentCompleted && (
                    <span className="badge !py-0.5 !px-2 text-[11px] !bg-emerald-500/20 !text-emerald-400 flex items-center gap-1">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {currentVideo?.title || "Course Video"}
                </h3>
              </div>

              {/* Player Navigation Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveVideoIndex(Math.max(0, activeVideoIndex - 1))}
                  disabled={activeVideoIndex === 0}
                  className="btn-secondary !py-1.5 !px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ⏮ Prev
                </button>

                <button
                  onClick={() => completeVideo(activeVideoIndex, true)}
                  disabled={markingDone || isCurrentCompleted}
                  className={`!py-1.5 !px-3 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                    isCurrentCompleted
                      ? "btn-secondary !text-emerald-400 !border-emerald-500/40"
                      : "btn-primary !bg-emerald-600 hover:!bg-emerald-500 text-white"
                  }`}
                >
                  {isCurrentCompleted ? "✓ Completed" : "Mark Done & Next ⏭"}
                </button>

                <button
                  onClick={() => setActiveVideoIndex(Math.min(videos.length - 1, activeVideoIndex + 1))}
                  disabled={activeVideoIndex >= videos.length - 1}
                  className="btn-secondary !py-1.5 !px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next ⏭
                </button>

                {currentVideo?.url && (
                  <a
                    href={currentVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary !py-1.5 !px-2.5 text-xs text-slate-400 hover:text-white"
                    title="Open directly in YouTube"
                  >
                    ↗ YouTube
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Course Tabs (Overview, Notes, Quiz, Assignments) */}
          <div className="glass-card p-5">
            <div className="flex border-b border-slate-700/60 pb-2 gap-2 sm:gap-4 overflow-x-auto text-sm">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 px-2 font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-katalyst-500 text-katalyst-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                📖 Course Overview
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`pb-2 px-2 font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === "notes"
                    ? "border-katalyst-500 text-katalyst-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                📝 My Notes
              </button>
              {(training.quizzes || []).length > 0 && (
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`pb-2 px-2 font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === "quiz"
                      ? "border-katalyst-500 text-katalyst-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ❓ Quizzes ({training.quizzes.length})
                </button>
              )}
              {(training.assignments || []).length > 0 && (
                <button
                  onClick={() => setActiveTab("assignments")}
                  className={`pb-2 px-2 font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === "assignments"
                      ? "border-katalyst-500 text-katalyst-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  📋 Assignments ({training.assignments.length})
                </button>
              )}
            </div>

            <div className="mt-4">
              {/* Tab: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-white text-base mb-1">About this Course</h4>
                    <p className="text-slate-300 leading-relaxed">{training.description}</p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 pt-2">
                    <div className="rounded-xl border border-slate-700/60 p-3 bg-slate-900/40">
                      <p className="text-xs text-slate-400">Instructor</p>
                      <p className="font-semibold text-white mt-0.5">{training.instructor || "Katalyst Faculty"}</p>
                    </div>
                    <div className="rounded-xl border border-slate-700/60 p-3 bg-slate-900/40">
                      <p className="text-xs text-slate-400">Duration & Lectures</p>
                      <p className="font-semibold text-white mt-0.5">
                        {training.duration || "Self-Paced"} • {videos.length} Lectures
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700/60 p-3 bg-slate-900/40">
                      <p className="text-xs text-slate-400">Skill Level</p>
                      <p className="font-semibold text-white mt-0.5">{training.level}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Notes */}
              {activeTab === "notes" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400">
                      Take notes while watching lectures. Saved automatically to your browser.
                    </p>
                    {notesSaved && <span className="text-xs text-emerald-400 font-semibold animate-pulse">✓ Saved!</span>}
                  </div>
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type key timestamps, code snippets, questions, or summary points here..."
                    className="input-field font-mono text-sm leading-relaxed"
                  />
                  <button onClick={saveNotes} className="btn-primary !py-2 text-xs">
                    💾 Save Course Notes
                  </button>
                </div>
              )}

              {/* Tab: Quiz */}
              {activeTab === "quiz" && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-base">Course Knowledge Check</h4>
                    {quizResult && (
                      <span className="badge !bg-emerald-500/20 !text-emerald-400 font-bold">
                        Score: {quizResult.score}/{quizResult.maxScore} ({quizResult.percentage}%)
                      </span>
                    )}
                  </div>
                  {training.quizzes.map((q, qi) => (
                    <div key={qi} className="rounded-xl border border-slate-700/60 p-4 bg-slate-900/30">
                      <p className="font-medium text-white text-sm">
                        {qi + 1}. {q.question}
                      </p>
                      <div className="mt-3 space-y-2">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer text-xs sm:text-sm transition-all ${
                              quizAnswers[qi] === oi
                                ? "border-katalyst-500 bg-katalyst-500/10 text-white"
                                : "border-slate-700/60 hover:border-slate-500 text-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz_q_${qi}`}
                              checked={quizAnswers[qi] === oi}
                              onChange={() => setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={submitQuiz} className="btn-primary !py-2.5 text-sm">
                    Submit Quiz & Record Score
                  </button>
                </div>
              )}

              {/* Tab: Assignments */}
              {activeTab === "assignments" && (
                <div className="space-y-4">
                  {training.assignments.map((a, i) => (
                    <div key={i} className="rounded-xl border border-slate-700/60 p-4 bg-slate-900/40">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm">{a.title}</h4>
                        <span className="badge !bg-amber-500/20 !text-amber-400 text-xs">
                          Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "Flexible"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{a.description}</p>
                      <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                        <span>Max Score: {a.maxScore || 100} pts</span>
                        <span className="text-emerald-400 font-semibold">Submit through Mentor Session</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Udemy-Style Playlist Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-700/60 sticky top-4">
            {/* Playlist Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                  <span>📺</span> Course Curriculum
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {videos.length} video lectures • {training.duration || "Self-Paced"}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                {progressPercent}% Done
              </span>
            </div>

            {/* Quick search in playlist */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="input-field !py-1.5 text-xs"
              />
            </div>

            {/* Playlist Video Items List */}
            <div className="mt-3 space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredVideos.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 text-center">No lectures found matching search.</p>
              ) : (
                filteredVideos.map((vid) => {
                  const idx = vid.originalIndex;
                  const isCompleted = completedVideos.includes(idx);
                  const isActive = idx === activeVideoIndex;

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveVideoIndex(idx)}
                      className={`group relative rounded-xl border p-3 cursor-pointer transition-all ${
                        isActive
                          ? "border-katalyst-500 bg-katalyst-500/15 shadow-md ring-1 ring-katalyst-500/40"
                          : isCompleted
                          ? "border-emerald-500/30 bg-emerald-500/5 hover:border-slate-600"
                          : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            completeVideo(idx, false);
                          }}
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-600 hover:border-katalyst-400 text-transparent"
                          }`}
                          title={isCompleted ? "Completed" : "Mark as completed"}
                        >
                          ✓
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-semibold text-slate-400">
                              Lesson {idx + 1}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ⏱ {vid.duration || "15m"}
                            </span>
                          </div>

                          <p
                            className={`text-xs sm:text-sm font-medium line-clamp-2 mt-0.5 ${
                              isActive ? "text-katalyst-300 font-bold" : "text-slate-200"
                            }`}
                          >
                            {vid.title}
                          </p>

                          {/* Playing Status Pill */}
                          {isActive && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-katalyst-400">
                              <span className="inline-block h-2 w-2 animate-ping rounded-full bg-katalyst-400" />
                              <span>Now Playing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Course Certificate Callout */}
            {progressPercent === 100 && (
              <div className="mt-4 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-center animate-fade-in">
                <p className="text-xs font-bold text-emerald-300">🎉 Course Completed!</p>
                <p className="text-[11px] text-slate-300 mt-0.5">You have completed all video lectures.</p>
                <Link to="/student/certificates" className="btn-primary !py-1.5 !px-3 text-xs mt-2 inline-block">
                  View Certificate 🏆
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
