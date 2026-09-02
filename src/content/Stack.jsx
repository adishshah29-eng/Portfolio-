import SplitHeading from '../components/SplitHeading.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import ForegroundPlate from '../components/ForegroundPlate.jsx';

const SKILLS = [
  { cat: 'Languages', items: ['Python', 'Java', 'JavaScript'] },
  { cat: 'Frontend', items: ['React.js', 'Next.js', 'GSAP', 'Framer Motion', 'HTML/CSS'] },
  { cat: 'Backend & Data', items: ['Node.js', 'Firebase', 'Supabase'] },
  { cat: 'AI & Automation', items: ['n8n', 'Vapi.ai', 'Twilio', 'Cursor AI', 'Claude', 'Antigravity IDE'] },
  { cat: 'Tools', items: ['Git', 'Vercel'] }
];

export default function Stack({ sectionRef, active, foregroundHost }) {
  useScrollReveal(sectionRef);

  return (
    <section id="stack" ref={sectionRef} className="chapter">
      <ForegroundPlate host={foregroundHost} active={!!active} anchor="bottom-right">
        <img className="fg-cutout" src="/foreground/fg-stack-plate.webp" alt="" aria-hidden="true" />
      </ForegroundPlate>
      <div className="content-grid panel">
        <div>
          <div className="eyebrow"><div className="dot" />Chapter 02 · Stack</div>
          <SplitHeading text="Stack" as="h1" className="title" />
          <p className="bio reveal">
            Full-stack development experience across Python, Java, and JavaScript, applied to data-driven
            applications with a proactive, results-driven approach to real-world engineering problems.
          </p>
          <div className="edu reveal d2">
            <div className="role">B.Tech, Artificial Intelligence &amp; Machine Learning</div>
            <div className="org">Dwarkadas J. Sanghvi College of Engineering, Mumbai</div>
            <div className="yr">2024-Present</div>
          </div>
        </div>
        <div className="legend reveal d2">
          {SKILLS.map(({ cat, items }) => (
            <div className="row" key={cat}>
              <div className="cat"><div className="node-dot" />{cat}</div>
              <div className="chip-list">
                {items.map((item) => <span className="chip" key={item}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
