import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll-scrubbed entrance for a chapter's copy — eyebrow label, split
// heading words, then .reveal blocks, staggered in that DOM order and
// tied directly to how far the section has scrolled into view. Replaces
// the old IntersectionObserver + CSS-transition version, which fired a
// fixed-duration fade the moment the section crossed a threshold and was
// then completely detached from scroll — this instead scrubs forward
// and backward exactly in step with the user's scroll position.
export function useScrollReveal(sectionRef) {
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = [
        ...root.querySelectorAll('.eyebrow'),
        ...root.querySelectorAll('.split-wrap .word'),
        ...root.querySelectorAll('.reveal')
      ];
      if (!targets.length) return;

      // Trigger off the first target (the eyebrow) rather than the section
      // itself — chapters taller than one viewport (150-160vh) center their
      // copy inside that box via justify-content:center, so the section's
      // own top edge can sit hundreds of px above where the text actually
      // appears. The eyebrow is always the first visible thing, so anchoring
      // to it tracks the real on-screen entrance regardless of section height.
      gsap.set(targets, { opacity: 0, y: 16 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        stagger: 0.035,
        ease: 'none',
        scrollTrigger: { trigger: targets[0], start: 'top 90%', end: 'top 55%', scrub: 0.4 }
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
