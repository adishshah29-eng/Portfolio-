// Visibly-marked placeholder standing in for a real project screenshot —
// swap for an <img> once real captures are supplied. Never dressed up to
// look like a genuine screenshot.
export default function ScreenshotPlaceholder({ title, accent = '#e0231c' }) {
  return (
    <div className="shot-card" style={{ '--accent': accent }}>
      <div className="shot-card__bar">
        <span /><span /><span />
      </div>
      <div className="shot-card__body">
        <div className="shot-card__label">Screenshot pending</div>
        <div className="shot-card__title">{title}</div>
      </div>
    </div>
  );
}
