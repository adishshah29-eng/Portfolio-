import SplitHeading from '../components/SplitHeading.jsx';
import { useInView } from '../hooks/useInView.js';

export default function Stack({ sectionRef }) {
  const { ref: viewRef, inView } = useInView();
  const setRefs = (el) => {
    sectionRef.current = el;
    viewRef.current = el;
  };

  return (
    <section id="stack" ref={setRefs} className={`chapter${inView ? ' in' : ''}`}>
      <div className="content-grid panel">
        <div>
          <div className="eyebrow"><div className="dot" />Chapter 02 — Stack</div>
          <SplitHeading text="Stack" as="h1" className="title" />
          <p className="bio reveal">
            AI &amp; ML undergraduate at DJSCE with hands-on full-stack development experience across Python, Java,
            and JavaScript — building data-driven applications with a proactive, results-driven approach to
            real-world engineering problems.
          </p>
          <div className="edu reveal d2">
            <div className="role">B.Tech, Artificial Intelligence &amp; Machine Learning</div>
            <div className="org">Dwarkadas J. Sanghvi College of Engineering, Mumbai</div>
            <div className="yr">2024 — Present</div>
          </div>
        </div>
        <div className="legend reveal d2">
          <div className="row"><div className="cat"><div className="node-dot" />Languages</div><div className="items">Python, Java, JavaScript</div></div>
          <div className="row"><div className="cat"><div className="node-dot" />Frontend</div><div className="items">React.js, Next.js, GSAP, Framer Motion, HTML/CSS</div></div>
          <div className="row"><div className="cat"><div className="node-dot" />Backend &amp; Data</div><div className="items">Node.js, Firebase, Supabase</div></div>
          <div className="row"><div className="cat"><div className="node-dot" />AI &amp; Automation</div><div className="items">n8n, Vapi.ai, Twilio, Cursor AI, Claude, Antigravity IDE</div></div>
          <div className="row"><div className="cat"><div className="node-dot" />Tools</div><div className="items">Git, Vercel</div></div>
        </div>
      </div>
    </section>
  );
}
