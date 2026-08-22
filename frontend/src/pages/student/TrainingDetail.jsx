import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function TrainingDetail() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const [userEnrollment, setUserEnrollment] = useState(null);

  const fetchTrainingDetails = () => {
    API.get(`/trainings/${id}`)
      .then((res) => {
        setTraining(res.data.training);
        setUserEnrollment(res.data.userEnrollment);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrainingDetails();
  }, [id]);

  const completeVideo = async (videoIndex) => {
    try {
      const res = await API.post(`/trainings/${id}/complete-video`, { videoIndex });
      alert(res.data.message || "Video marked complete!");
      fetchTrainingDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark video as completed");
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
      alert(`Quiz Submitted! Score: ${res.data.score}/${res.data.maxScore}`);
      fetchTrainingDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Quiz submission failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Training" subtitle="Student Portal">
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!training) {
    return (
      <DashboardLayout title="Not Found" subtitle="Student Portal">
        <p>Training not found.</p>
      </DashboardLayout>
    );
  }

  const completedVideos = userEnrollment?.completedVideos || [];

  return (
    <DashboardLayout title={training.title} subtitle={training.category}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Videos */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">📹 Video Lessons</h3>
              <span className="text-xs font-semibold text-katalyst-500">
                {completedVideos.length} / {training.videos?.length || 0} Completed
              </span>
            </div>
            <div className="space-y-3">
              {(training.videos || []).map((v, i) => {
                const isCompleted = completedVideos.includes(i);
                return (
                  <div key={i} className="flex items-center justify-between rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", backgroundColor: isCompleted ? "rgba(16, 185, 129, 0.05)" : "transparent" }}>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {isCompleted && <span className="text-green-500">✓</span>}
                        {v.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{v.duration}</p>
                    </div>
                    <div className="flex gap-2">
                      {v.url && (
                        <a href={v.url} target="_blank" rel="noreferrer" className="btn-secondary !py-1.5 text-xs">
                          Watch Video
                        </a>
                      )}
                      <button 
                        onClick={() => completeVideo(i)} 
                        disabled={isCompleted}
                        className={`!py-1.5 text-xs ${isCompleted ? "btn-secondary opacity-60 cursor-not-allowed" : "btn-primary"}`}
                      >
                        {isCompleted ? "Completed" : "Mark Done"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz */}
          {(training.quizzes || []).length > 0 && (
            <div className="glass-card p-6">
              <h3 className="section-title mb-4">📝 Quiz</h3>
              {training.quizzes.map((q, qi) => (
                <div key={qi} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  <div className="mt-2 space-y-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:border-katalyst-400"
                        style={{ borderColor: "var(--border)" }}>
                        <input type="radio" name={`q${qi}`}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [qi]: oi })} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitQuiz} className="btn-primary">Submit Quiz</button>
              {quizResult && (
                <p className="mt-3 text-sm font-semibold text-katalyst-500">
                  Result: {quizResult.score}/{quizResult.maxScore} ({quizResult.percentage}%)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-bold">Course Info</h3>
            <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <p>📊 Level: {training.level}</p>
              <p>⏱ Duration: {training.duration}</p>
              <p>👨‍🏫 Instructor: {training.instructor}</p>
              <p>📹 Videos: {training.videos?.length || 0}</p>
              <p>📝 Assignments: {training.assignments?.length || 0}</p>
            </div>
          </div>

          {(training.assignments || []).length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold mb-3">📋 Assignments</h3>
              {training.assignments.map((a, i) => (
                <div key={i} className="mb-3 rounded-lg p-3" style={{ background: "var(--accent-light)" }}>
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{a.description}</p>
                  <p className="text-xs mt-1 text-katalyst-500">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
