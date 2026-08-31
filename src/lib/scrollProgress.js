export function measureAnchors(sectionEls) {
  const scrollY = window.scrollY || window.pageYOffset;
  const viewportH = window.innerHeight;
  return sectionEls.map((el) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const center = top + rect.height / 2 - viewportH / 2;
    return center;
  });
}

// Convert a raw anchors array (section centers) into a fractional chapter
// value: 0 at the first chapter, (n-1) at the last, piecewise-linear between.
export function exactProgressFromScroll(anchors, scrollY) {
  if (!anchors || anchors.length === 0) return 0;
  if (anchors.length === 1) return 0;
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  const clamped = Math.min(Math.max(scrollY, first), last);
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (clamped >= a && clamped <= b) {
      const t = b === a ? 0 : (clamped - a) / (b - a);
      return i + t;
    }
  }
  return anchors.length - 1;
}

export function dampTo(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
