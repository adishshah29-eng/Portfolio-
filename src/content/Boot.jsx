import SplitHeading from '../components/SplitHeading.jsx';
import { useInView } from '../hooks/useInView.js';

// The regenerated shard cutout (public/foreground/fg-boot-shard.webp) reads
// as a fragment breaking off the plate — but the plate itself is now a
// dense chrome-shard explosion, so a second similar shard anywhere near it
// either clashes with or gets lost inside the plate's own cluster. Dropping
// it from Boot rather than force a placement that fights the hero image;
// the asset's still available if a later chapter has a quieter backdrop for it.

export default function Boot({ sectionRef }) {
  const { ref: viewRef, inView } = useInView();
  const setRefs = (el) => {
    sectionRef.current = el;
    viewRef.current = el;
  };

  return (
    <section id="boot" ref={setRefs} className={`chapter${inView ? ' in' : ''}`}>
      <div className="hero">
        <div className="eyebrow"><div className="dot" />Chapter 01 — Boot</div>
        <SplitHeading text="Adish Shah" as="h1" className="name" />
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
    </section>
  );
}
