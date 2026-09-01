import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitHeading from '../components/SplitHeading.jsx';
import { BOOT_PIN_DISTANCE, BOOT_ZOOM_DISTANCE } from './bootIntro.js';

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
// layout, not JS-managed). While it's pinned: the first BOOT_ZOOM_DISTANCE
// px is the plate's own approach zoom (App.jsx's zoomRange) with no text
// yet, then the eyebrow, the name's letters, and the rest of the copy
// reveal in that order across the remaining distance — all scrubbed
// against the exact same #boot scroll range, so it never drifts out of
// sync with the plate.
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

      // A scrubbed timeline's total duration (in whatever units) is mapped
      // proportionally across the FULL scrollTrigger range — there's no
      // inherent 1:1 unit-to-pixel relationship. So the "hold" phase has to
      // be sized as a fraction of total timeline duration matching
      // BOOT_ZOOM_DISTANCE / BOOT_PIN_DISTANCE, not an arbitrary duration
      // value, or it drifts out of sync with the plate's own zoom (which IS
      // pixel-exact, via its own scrollRange). Computed here instead of
      // hand-tuned so it stays correct if either constant changes.
      const TOTAL = 100;
      const holdUnits = (BOOT_ZOOM_DISTANCE / BOOT_PIN_DISTANCE) * TOTAL;
      const textUnits = TOTAL - holdUnits;
      const eyebrowStart = holdUnits;
      const eyebrowDur = textUnits * 0.1;
      const lettersStart = eyebrowStart + eyebrowDur * 0.5;
      const lettersDur = textUnits * 0.55;
      const restStart = lettersStart + lettersDur * 0.7;
      const restDur = textUnits * 0.4;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: `+=${BOOT_PIN_DISTANCE}`, scrub: 0.5 }
      });

      tl.to(eyebrow, { opacity: 1, y: 0, duration: eyebrowDur }, eyebrowStart)
        .to(letters, { opacity: 1, y: 0, stagger: lettersDur / letters.length, duration: lettersDur }, lettersStart)
        .to(rest, { opacity: 1, y: 0, stagger: restDur / (rest.length || 1), duration: restDur }, restStart);
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="boot" ref={sectionRef} className="chapter">
      <div className="hero-pin" ref={pinRef}>
        <div className="hero">
          <div className="eyebrow"><div className="dot" />Chapter 01 — Boot</div>
          <SplitHeading text="Adish Shah" as="h1" className="name" splitBy="letter" />
          <div className="tagline reveal">AI &amp; ML Engineer — Full-Stack Developer</div>
          <p className="sub reveal d2">
            AI &amp; ML undergraduate with hands-on full-stack experience across Python, Java, and JavaScript —
            shipping real products with a proactive, results-driven approach.
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
