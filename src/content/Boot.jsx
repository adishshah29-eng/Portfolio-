import SplitHeading from '../components/SplitHeading.jsx';
import { useInView } from '../hooks/useInView.js';

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
