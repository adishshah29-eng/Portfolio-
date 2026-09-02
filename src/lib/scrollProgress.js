// Each chapter section is a tall pinned-scroll runway now (see
// usePinnedReveal.js / Boot.jsx): its sticky `.pin` content stays fully
// visible and unmoving for the section's whole height, then releases the
// instant scrollY reaches the NEXT section's top - sections are stacked
// with no gaps, so that top boundary IS the pin-release point. Returning
// each section's own top (not its center) lets activeIndexFromScroll pick
// the active chapter by that same boundary, so the PlateBackdrop crossfade
// (see App.jsx/PlateBackdrop.jsx) swaps at exactly the moment the pin
// actually releases - not at some geometric midpoint between two very
// differently-sized sections, which is what made the background swap look
// choppy (mistimed) once chapters became this tall.
export function measureAnchors(sectionEls) {
  const scrollY = window.scrollY || window.pageYOffset;
  return sectionEls.map((el) => el.getBoundingClientRect().top + scrollY);
}

// `tops` are each section's absolute scrollY boundary (see measureAnchors).
// The active chapter is simply the last one whose boundary we've scrolled
// past - a step function, not an interpolation, since a pinned chapter is
// either fully active (stuck on screen) or not; there's no in-between
// state worth blending toward.
export function activeIndexFromScroll(tops, scrollY) {
  if (!tops || !tops.length) return 0;
  let idx = 0;
  for (let i = 0; i < tops.length; i++) {
    if (scrollY >= tops[i] - 1) idx = i;
  }
  return idx;
}
