import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitHeading from '../components/SplitHeading.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import ForegroundPlate from '../components/ForegroundPlate.jsx';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

const PROJECTS = [
  {
    title: 'VisuallyLearn',
    desc: 'A full-stack interactive physics learning platform. Python scripts scraped, cleaned, and structured 10,000+ MCQs to power practice tests. Adopted by a coaching class for student practice.',
    tags: ['React.js', 'Supabase', 'Python'],
    href: 'https://physics-visual-learning.vercel.app',
    label: 'physics-visual-learning.vercel.app →'
  },
  {
    title: 'Resunova',
    desc: 'AI resume tailoring platform. Contributed UI/UX improvements and shipped new features after joining, including a CV/resume builder tool.',
    tags: ['Next.js', 'Full Stack'],
    href: 'https://resunova.io',
    label: 'resunova.io →'
  },
  {
    title: 'Parmar Properties',
    desc: 'Scroll-based animated real estate landing page with GSAP and Framer Motion, using Supabase as a backend CMS to manage and dynamically serve blog content.',
    tags: ['Next.js', 'Supabase', 'GSAP', 'Framer Motion'],
    href: 'https://parmar-properties-two.vercel.app',
    label: 'parmar-properties-two.vercel.app →'
  },
  {
    title: 'DJS ASTRA',
    desc: "Official website for DJSCE's combat robotics team, plus a Python email automation pipeline (smtplib, openpyxl) driving sponsorship outreach.",
    tags: ['Web', 'Python Automation'],
    href: 'https://djs-astra.vercel.app',
    label: 'djs-astra.vercel.app →'
  }
];

// Card lift/tilt on hover: quickTo-driven so it eases with a slight
// spring overshoot (matching PlateBackdrop's own mouse-driven feel)
// instead of a flat CSS transition. Skipped for touch/reduced-motion,
// same guards used everywhere else GSAP drives pointer-following motion.
function useCardHoverPhysics(gridRef) {
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion() || !hasFinePointer()) return;

    const cards = [...grid.querySelectorAll('.card')];
    const cleanups = cards.map((card) => {
      const setY = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'back.out(1.6)' });
      const setScale = gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'back.out(1.6)' });
      const onEnter = () => { setY(-6); setScale(1.015); };
      const onLeave = () => { setY(0); setScale(1); };
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointerleave', onLeave);
      return () => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointerleave', onLeave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [gridRef]);
}

export default function Modules({ sectionRef, active, foregroundHost }) {
  useScrollReveal(sectionRef);
  const gridRef = useRef(null);
  useCardHoverPhysics(gridRef);

  return (
    <section id="modules" ref={sectionRef} className="chapter">
      <ForegroundPlate host={foregroundHost} active={!!active} anchor="bottom-right">
        <img className="fg-cutout" src="/foreground/fg-modules-block.webp" alt="" aria-hidden="true" />
      </ForegroundPlate>
      <div>
        <div className="eyebrow"><div className="dot" />Chapter 04 · Modules</div>
        <SplitHeading text="Modules" as="h1" className="title" />
        <div className="grid reveal d2" ref={gridRef}>
          {PROJECTS.map((p) => (
            <div className="card" key={p.title}>
              <div className="top"><div className="node-dot" /><div className="title2">{p.title}</div></div>
              <div className="desc">{p.desc}</div>
              <div className="tags chip-list">
                {p.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
              </div>
              <a className="link" href={p.href} target="_blank" rel="noopener">{p.label}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
