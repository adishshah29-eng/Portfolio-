import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A repeating item selector list — when a `.reveal` block contains one or
// more of these, each one gets its own stagger step instead of the whole
// block moving as one unit. Covers every chapter's repeating content:
// Boot's stats, Stack's legend rows, Runtime's timeline stations, Modules'
// project cards, Deploy's link rows.
const REVEAL_ITEM_SELECTOR = '.stat, .row, .stn, .card, .lrow';

// Scroll-scrubbed entrance for a chapter's copy — eyebrow label, then the
// split heading (word-by-word by default, or letter-by-letter for any
// SplitHeading using splitBy="letter"), then .reveal blocks, staggered in
// that DOM order and tied directly to how far the section has scrolled
// into view. Replaces the old IntersectionObserver + CSS-transition
// version, which fired a fixed-duration fade the moment the section
// crossed a threshold and was then completely detached from scroll — this
// instead scrubs forward and backward exactly in step with the user's
// scroll position.
//
// Within each .reveal block, individual repeating items (see
// REVEAL_ITEM_SELECTOR) stagger in one at a time rather than the whole
// block fading in together — so a timeline, a project grid, or a list of
// links each reads as a sequence tied to scroll, not one flat block.
//
// Boot doesn't use this hook — its intro is a pinned sequence (see
// Boot.jsx) with different-enough requirements (plate-approach hold, text
// only starting after, everything scrubbed against a fixed pin distance
// rather than the eyebrow's viewport position) that it has its own
// bespoke timeline instead of a flag on this one.
export function useScrollReveal(sectionRef) {
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const revealTargets = [...root.querySelectorAll('.reveal')].flatMap((block) => {
        const items = block.querySelectorAll(REVEAL_ITEM_SELECTOR);
        return items.length ? [...items] : [block];
      });
      const targets = [
        ...root.querySelectorAll('.eyebrow'),
        ...root.querySelectorAll('.split-wrap .word, .split-wrap .letter'),
        ...revealTargets
      ];
      if (!targets.length) return;

      // Trigger off the first target (the eyebrow) rather than the section
      // itself — chapters taller than one viewport (150-160vh) center their
      // copy inside that box via justify-content:center, so the section's
      // own top edge can sit hundreds of px above where the text actually
      // appears. The eyebrow is always the first visible thing, so anchoring
      // to it tracks the real on-screen entrance regardless of section height.
      // Scale + blur ride along with the existing opacity/y - each item
      // settles into full focus rather than just sliding into place, which
      // reads as "coming into view" instead of "appearing." Kept subtle
      // (0.96 and 6px) since this scrubs both directions with scroll and a
      // heavier version would swim distractingly on a slow scroll back up.
      gsap.set(targets, { opacity: 0, y: 16, scale: 0.96, filter: 'blur(6px)' });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        stagger: 0.045,
        ease: 'none',
        scrollTrigger: { trigger: targets[0], start: 'top 92%', end: 'top 42%', scrub: 0.4 }
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
