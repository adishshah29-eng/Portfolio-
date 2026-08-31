import SplitHeading from '../components/SplitHeading.jsx';
import { useInView } from '../hooks/useInView.js';

export default function Deploy({ sectionRef }) {
  const { ref: viewRef, inView } = useInView();
  const setRefs = (el) => {
    sectionRef.current = el;
    viewRef.current = el;
  };

  return (
    <section id="deploy" ref={setRefs} className={`chapter${inView ? ' in' : ''}`}>
      <div className="eyebrow"><div className="dot" />Chapter 05 — Deploy</div>
      <SplitHeading text="Deploy" as="h1" className="fin" />
      <p className="manifesto reveal">
        Still compiling, always shipping. Open to full-stack and AI engineering roles — let's build something real.
      </p>
      <div className="links reveal d2">
        <div className="lrow"><div className="k">Email</div><a className="v" href="mailto:adishshah29@gmail.com">adishshah29@gmail.com</a></div>
        <div className="lrow"><div className="k">GitHub</div><a className="v" href="https://github.com/adishshah29-eng" target="_blank" rel="noopener">github.com/adishshah29-eng</a></div>
        <div className="lrow"><div className="k">LinkedIn</div><a className="v" href="https://linkedin.com/in/adishshah29" target="_blank" rel="noopener">linkedin.com/in/adishshah29</a></div>
      </div>
    </section>
  );
}
