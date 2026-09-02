import SplitHeading from '../components/SplitHeading.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import ForegroundPlate from '../components/ForegroundPlate.jsx';

const PROJECTS = [
  {
    title: 'VisuallyLearn',
    desc: 'A full-stack interactive physics learning platform. Python scripts scraped, cleaned, and structured 10,000+ MCQs to power practice tests. Adopted by a coaching class for student practice.',
    tags: 'React.js · Supabase · Python',
    href: 'https://physics-visual-learning.vercel.app',
    label: 'physics-visual-learning.vercel.app →'
  },
  {
    title: 'Resunova',
    desc: 'AI resume tailoring platform. Contributed UI/UX improvements and shipped new features after joining, including a CV/resume builder tool.',
    tags: 'Next.js · Full Stack',
    href: 'https://resunova.io',
    label: 'resunova.io →'
  },
  {
    title: 'Parmar Properties',
    desc: 'Scroll-based animated real estate landing page with GSAP and Framer Motion, using Supabase as a backend CMS to manage and dynamically serve blog content.',
    tags: 'Next.js · Supabase · GSAP · Framer Motion',
    href: 'https://parmar-properties-two.vercel.app',
    label: 'parmar-properties-two.vercel.app →'
  },
  {
    title: 'DJS ASTRA',
    desc: "Official website for DJSCE's combat robotics team, plus a Python email automation pipeline (smtplib, openpyxl) driving sponsorship outreach.",
    tags: 'Web · Python Automation',
    href: 'https://djs-astra.vercel.app',
    label: 'djs-astra.vercel.app →'
  }
];

export default function Modules({ sectionRef, active, foregroundHost }) {
  useScrollReveal(sectionRef);

  return (
    <section id="modules" ref={sectionRef} className="chapter">
      <ForegroundPlate host={foregroundHost} active={!!active} anchor="bottom-right">
        <img className="fg-cutout" src="/foreground/fg-modules-block.webp" alt="" aria-hidden="true" />
      </ForegroundPlate>
      <div>
        <div className="eyebrow"><div className="dot" />Chapter 04 · Modules</div>
        <SplitHeading text="Modules" as="h1" className="title" />
        <div className="grid reveal d2">
          {PROJECTS.map((p) => (
            <div className="card" key={p.title}>
              <div className="top"><div className="node-dot" /><div className="title2">{p.title}</div></div>
              <div className="desc">{p.desc}</div>
              <div className="tags">{p.tags}</div>
              <a className="link" href={p.href} target="_blank" rel="noopener">{p.label}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
