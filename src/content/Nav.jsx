const LABELS = { boot: 'Boot', stack: 'Stack', runtime: 'Runtime', modules: 'Modules', deploy: 'Deploy' };

export default function Nav({ chapterIds, activeIndex }) {
  return (
    <nav className="nav" aria-label="Chapters">
      <div className="brand">
        <b>THE BUILD</b>
        <i>ADISH SHAH, PORTFOLIO</i>
      </div>
      <ul className="nav-links">
        {chapterIds.map((id, i) => (
          <li key={id}>
            <a
              className="nav-link"
              href={`#${id}`}
              aria-current={i === activeIndex ? 'page' : undefined}
            >
              {LABELS[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
