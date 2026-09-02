import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitHeading from '../components/SplitHeading.jsx';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The regenerated shard cutout (public/foreground/fg-boot-shard.webp) reads
// as a fragment breaking off the plate — but the plate itself is now a
// dense chrome-shard explosion, so a second similar shard anywhere near it
// either clashes with or gets lost inside the plate's own cluster. Dropping
// it from Boot rather than force a placement that fights the hero image;
// the asset's still available if a later chapter has a quieter backdrop for it.

// Boot is the very first thing anyone sees, with zero scroll yet
// performed — unlike every other chapter (which the visitor only reaches
// by already scrolling), so its reveal can't be gated behind scroll
// progress the way usePinnedReveal.js's generalized version is. Doing
// that left the whole hero (name, tagline, stats) invisible for as long
// as the visitor sat still, reading as a half-loaded/blank page rather
// than a hero. Instead this timeline just plays once on mount, like a
// normal hero intro — CSS position:sticky still holds .pin at the top of
// the viewport for BOOT_PIN_DISTANCE px of scroll (safer to reason about
// than GSAP's own pin option, and immune to the usual
// GSAP-pin-vs-smooth-scroll-library friction since it's native layout,
// not JS-managed), which now reads as a held beat after the intro has
// already finished rather than the thing revealing it.
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

      // Same transformPerspective + z pop treatment as usePinnedReveal.js
      // (see that file for why perspective is baked per-element rather than
      // set on a shared ancestor) — kept in sync by hand since Boot owns its
      // own timeline for the stat count-up below.
      gsap.set(targets, { transformPerspective: 700, opacity: 0, y: 16, z: -160, scale: 0.96, filter: 'blur(6px)' });

      // Same relative schedule this used as a 0-100 scrub range, just
      // reinterpreted as real seconds now that it plays on a timer instead
      // of against scroll position.
      const TOTAL = 1.6;
      const eyebrowStart = 0;
      const eyebrowDur = TOTAL * 0.12;
      const lettersStart = eyebrowStart + eyebrowDur * 0.5;
      const lettersDur = TOTAL * 0.55;
      const restStart = lettersStart + lettersDur * 0.7;
      const restDur = TOTAL * 0.4;

      const tl = gsap.timeline({ delay: 0.15 });

      const settle = { opacity: 1, y: 0, z: 0, scale: 1, filter: 'blur(0px)' };
      tl.to(eyebrow, { ...settle, duration: eyebrowDur }, eyebrowStart)
        .to(letters, { ...settle, stagger: lettersDur / letters.length, duration: lettersDur }, lettersStart)
        .to(rest, { ...settle, stagger: restDur / (rest.length || 1), duration: restDur }, restStart);

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
    <section id="boot" ref={sectionRef} className="chapter is-pinned">
      <div className="pin" ref={pinRef}>
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
