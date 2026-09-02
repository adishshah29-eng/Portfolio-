import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitHeading from '../components/SplitHeading.jsx';
import { BOOT_PIN_DISTANCE } from './bootIntro.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The regenerated shard cutout (public/foreground/fg-boot-shard.webp) reads
// as a fragment breaking off the plate — but the plate itself is now a
// dense chrome-shard explosion, so a second similar shard anywhere near it
// either clashes with or gets lost inside the plate's own cluster. Dropping
// it from Boot rather than force a placement that fights the hero image;
// the asset's still available if a later chapter has a quieter backdrop for it.

// Boot's intro is a pinned sequence, not the word/letter-on-entry pattern
// the other chapters use (see useScrollReveal) — CSS position:sticky holds
// .hero-pin in place at the top of the viewport for BOOT_PIN_DISTANCE px of
// scroll (safer to reason about than GSAP's own pin option, and immune to
// the usual GSAP-pin-vs-smooth-scroll-library friction since it's native
// layout, not JS-managed). While it's pinned, the eyebrow, the name's
// letters, and the rest of the copy reveal in that order, scrubbed against
// that same #boot scroll range. #boot's height reserves extra scroll beyond
// BOOT_PIN_DISTANCE (see BOOT_BREATHING_SPACE in bootIntro.js) so the fully
// revealed hero holds still for a beat before Stack begins.
export default function Boot({ sectionRef }) {
  const pinRef = useRef(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const ctx = gsap.context(() => {
      const eyebrow = pin.querySelector('.eyebrow');
      const letters = [...pin.querySelectorAll('.split-wrap .letter')];
      const rest = [...pin.querySelectorAll('.reveal')].flatMap((block) => {
        const items = block.querySelectorAll('.stat');
        return items.length ? [...items] : [block];
      });
      const targets = [eyebrow, ...letters, ...rest].filter(Boolean);
      if (!targets.length) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 16 });

      const TOTAL = 100;
      const eyebrowStart = 0;
      const eyebrowDur = TOTAL * 0.12;
      const lettersStart = eyebrowStart + eyebrowDur * 0.5;
      const lettersDur = TOTAL * 0.55;
      const restStart = lettersStart + lettersDur * 0.7;
      const restDur = TOTAL * 0.4;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: `+=${BOOT_PIN_DISTANCE}`, scrub: 0.5 }
      });

      tl.to(eyebrow, { opacity: 1, y: 0, duration: eyebrowDur }, eyebrowStart)
        .to(letters, { opacity: 1, y: 0, stagger: lettersDur / letters.length, duration: lettersDur }, lettersStart)
        .to(rest, { opacity: 1, y: 0, stagger: restDur / (rest.length || 1), duration: restDur }, restStart);

      // Count the stat numbers up in step with their own fade-in instead of
      // just popping in as static text - draws a beat of attention to the
      // actual credentials rather than motion for its own sake. Piggybacks
      // on the exact same stagger schedule as the `rest` tween above (each
      // item starts restDur/rest.length apart, runs for the full restDur)
      // so the count finishes exactly as that item's fade/scale settle.
      const statEls = rest.filter((el) => el.classList?.contains('stat'));
      if (statEls.length) {
        const step = restDur / rest.length;
        const firstStatIndex = rest.length - statEls.length;
        statEls.forEach((statEl, i) => {
          const numEl = statEl.querySelector('b');
          if (!numEl) return;
          const raw = numEl.textContent;
          const target = parseInt(raw, 10);
          const pad = /^0/.test(raw) ? raw.length : 0;
          const counter = { v: 0 };
          tl.to(counter, {
            v: target,
            duration: restDur,
            snap: { v: 1 },
            onUpdate: () => {
              numEl.textContent = pad ? String(Math.round(counter.v)).padStart(pad, '0') : String(Math.round(counter.v));
            }
          }, restStart + (firstStatIndex + i) * step);
        });
      }
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="boot" ref={sectionRef} className="chapter">
      <div className="hero-pin" ref={pinRef}>
        <div className="hero">
          <div className="eyebrow"><div className="dot" />Chapter 01 · Boot</div>
          <SplitHeading text="Adish Shah" as="h1" className="name" splitBy="letter" />
          <div className="tagline reveal">AI &amp; ML Engineer, Full-Stack Developer</div>
          <p className="sub reveal d2">
            AI &amp; ML undergraduate with hands-on full-stack experience across Python, Java, and JavaScript.
            Ships real products with a proactive, results-driven approach.
          </p>
          <div className="stats reveal d3">
            <div className="stat"><b>03</b><span>Internships</span></div>
            <div className="stat"><b>04</b><span>Shipped Projects</span></div>
            <div className="stat"><b>2024</b><span>AI/ML Cohort</span></div>
          </div>
        </div>
        <div className="scrollcue" aria-hidden="true"><div className="lbl">SCROLL</div><div className="stem" /></div>
      </div>
    </section>
  );
}
