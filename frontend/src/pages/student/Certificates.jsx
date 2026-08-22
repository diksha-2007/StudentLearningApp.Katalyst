import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/students/certificates")
      .then((res) => setCertificates(res.data.certificates || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Certificates" subtitle="Student Portal">
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-katalyst-200 border-t-katalyst-500" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-5xl">🏆</p>
          <p className="mt-4 font-medium">No certificates yet</p>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Complete trainings to earn certificates!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div key={cert._id} className="glass-card overflow-hidden text-center transition-transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-katalyst-400 to-katalyst-600 p-8 text-white">
                <p className="text-4xl">🏆</p>
                <h3 className="mt-3 text-lg font-bold">{cert.trainingTitle}</h3>
                <p className="mt-1 text-sm opacity-80">{cert.studentName}</p>
              </div>
              <div className="p-4">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
                <p className="mt-1 font-mono text-xs text-katalyst-500">{cert.certificateId}</p>
                <button
                  onClick={() => {
                    const content = `Katalyst Certificate\n\n${cert.studentName}\n${cert.trainingTitle}\nID: ${cert.certificateId}\nDate: ${new Date(cert.issuedAt).toLocaleDateString()}`;
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `certificate-${cert.certificateId}.txt`;
                    a.click();
                  }}
                  className="btn-primary mt-3 w-full !py-2 text-sm"
                >
                  Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
