export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="glass-card animate-fade-in p-5 transition-transform hover:-translate-y-1">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {title}
        </p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <h3 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </h3>
      {subtitle && (
        <p className="mt-1 text-sm font-medium text-katalyst-500">{subtitle}</p>
      )}
    </div>
  );
}
