import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Same repeating-item selector useScrollReveal uses - a `.reveal` block
// containing one or more of these gets its own per-item stagger step
// instead of moving as one unit.
const REVEAL_ITEM_SELECTOR = '.stat, .row, .stn, .card, .lrow';

// Generalized version of Boot's pinned-intro timeline (see Boot.jsx) for
// every other chapter: CSS position:sticky holds `pinRef`'s element at the
// top of the viewport for `pinDistance` px of scroll while the eyebrow,
// the heading's letters, and the .reveal content reveal in that order,
// scrubbed against that same range - then the section's extra height
// (pinDistance + breathing space, see pinIntro.js) holds the fully
// revealed chapter still for a beat before the next one begins. Boot keeps
// its own bespoke copy of this (it also drives a stat count-up tied to the
// same schedule) rather than using this hook directly.
export function usePinnedReveal(sectionRef, pinRef, pinDistance) {
  useLayoutEffect(() => {
    const root = sectionRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const ctx = gsap.context(() => {
      const eyebrow = pin.querySelector('.eyebrow');
      const letters = [...pin.querySelectorAll('.split-wrap .letter, .split-wrap .word')];
      const rest = [...pin.querySelectorAll('.reveal')].flatMap((block) => {
        const items = block.querySelectorAll(REVEAL_ITEM_SELECTOR);
        return items.length ? [...items] : [block];
      });
      const targets = [eyebrow, ...letters, ...rest].filter(Boolean);
      if (!targets.length) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 16, scale: 0.96, filter: 'blur(6px)' });

      const TOTAL = 100;
      const eyebrowStart = 0;
      const eyebrowDur = TOTAL * 0.12;
      const lettersStart = eyebrowStart + eyebrowDur * 0.5;
      const lettersDur = TOTAL * 0.4;
      const restStart = lettersStart + lettersDur * 0.6;
      const restDur = TOTAL - restStart;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: `+=${pinDistance}`, scrub: 0.5 }
      });

      const settle = { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' };
      tl.to(eyebrow, { ...settle, duration: eyebrowDur }, eyebrowStart)
        .to(letters, { ...settle, stagger: lettersDur / letters.length, duration: lettersDur }, lettersStart)
        .to(rest, { ...settle, stagger: restDur / (rest.length || 1), duration: restDur }, restStart);
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
