export default function BrandMark({ compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? "brand-lockup-compact" : ""}`} aria-label="Katalyst">
      <span className="brand-symbol" aria-hidden="true">
        <span className="brand-letter">K</span>
        <span className="brand-butterfly brand-butterfly-one">✦</span>
        <span className="brand-butterfly brand-butterfly-two">✦</span>
      </span>
      {!compact && <span className="brand-wordmark">Katalyst</span>}
    </div>
  );
}
