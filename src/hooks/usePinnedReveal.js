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

      // .card elements also carry a hover-driven lift (see
      // useCardHoverPhysics in Modules.jsx) that writes `y`/`scale` via a
      // proxy object + gsap.set rather than driving the card's own
      // transform through quickTo directly, specifically so a second GSAP
      // instance — this timeline — can also animate the card's transform
      // (the pop-in below) without the two fighting over the DOM element's
      // per-element transform cache (two GSAP instances each owning a
      // different transform sub-property on the same element silently
      // drop each other's writes — surfaces as a console warning like
      // "scale not eligible for reset").
      //
      // transformPerspective is set once, per-element (not a shared
      // ancestor — that would make the ancestor a new containing block for
      // position:fixed/sticky descendants, breaking the nav/pin machinery),
      // so the `z` component below actually has depth to move through:
      // each item starts pulled back behind the screen plane and pushes
      // forward to z:0 as it settles, reading as "emerging toward the
      // viewer" rather than just fading up in 2D.
      gsap.set(targets, { transformPerspective: 700, opacity: 0, y: 16, z: -160, scale: 0.96, filter: 'blur(6px)' });

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

      const settle = { opacity: 1, y: 0, z: 0, scale: 1, filter: 'blur(0px)' };
      tl.to(eyebrow, { ...settle, duration: eyebrowDur }, eyebrowStart)
        .to(letters, { ...settle, stagger: lettersDur / letters.length, duration: lettersDur }, lettersStart);
      if (rest.length) {
        tl.to(rest, { ...settle, stagger: restDur / rest.length, duration: restDur }, restStart);
      }
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
