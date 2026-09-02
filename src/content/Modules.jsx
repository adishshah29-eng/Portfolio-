import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitHeading from '../components/SplitHeading.jsx';
import { usePinnedReveal } from '../hooks/usePinnedReveal.js';
import ForegroundPlate from '../components/ForegroundPlate.jsx';
import { MODULES_PIN_DISTANCE } from './pinIntro.js';

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
//
// Also tracks cursor position within the card to tilt it in 3D
// (rotateX/rotateY) toward the pointer, on top of the lift/scale - the
// card reads as a physical tile you're tipping, not just a flat image
// sliding up. transformPerspective is baked once onto the card itself
// (not a shared ancestor, which would make it a new containing block for
// position:fixed/sticky descendants), so the rotation actually has depth
// to turn through instead of skewing flat.
//
// quickTo eases a plain proxy object here, not the card's own transform
// sub-properties directly — independent quickTo instances each owning a
// different transform sub-property on the SAME element fight over
// GSAP's per-element transform cache (silently, as a console warning:
// "scale not eligible for reset. Try splitting into individual
// properties"). Writing every value together in one gsap.set
// inside a shared onUpdate sidesteps it.
const CARD_TILT_MAX = 7;

function useCardHoverPhysics(gridRef) {
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion() || !hasFinePointer()) return;

    const cards = [...grid.querySelectorAll('.card')];
    gsap.set(cards, { transformPerspective: 900, transformOrigin: '50% 50%' });

    const cleanups = cards.map((card) => {
      const proxy = { y: 0, scale: 1, rotX: 0, rotY: 0 };
      const apply = () => gsap.set(card, { y: proxy.y, scale: proxy.scale, rotateX: proxy.rotX, rotateY: proxy.rotY });
      const setY = gsap.quickTo(proxy, 'y', { duration: 0.5, ease: 'back.out(1.6)', onUpdate: apply });
      const setScale = gsap.quickTo(proxy, 'scale', { duration: 0.5, ease: 'back.out(1.6)', onUpdate: apply });
      const setRotX = gsap.quickTo(proxy, 'rotX', { duration: 0.5, ease: 'power3.out', onUpdate: apply });
      const setRotY = gsap.quickTo(proxy, 'rotY', { duration: 0.5, ease: 'power3.out', onUpdate: apply });

      const onEnter = () => { setY(-6); setScale(1.015); };
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setRotY(px * CARD_TILT_MAX);
        setRotX(-py * CARD_TILT_MAX);
      };
      const onLeave = () => { setY(0); setScale(1); setRotX(0); setRotY(0); };

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      return () => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [gridRef]);
}

export default function Modules({ sectionRef, active, foregroundHost }) {
  const pinRef = useRef(null);
  usePinnedReveal(sectionRef, pinRef, MODULES_PIN_DISTANCE);
  const gridRef = useRef(null);
  useCardHoverPhysics(gridRef);

  return (
    <section id="modules" ref={sectionRef} className="chapter is-pinned">
      <ForegroundPlate host={foregroundHost} active={!!active} anchor="bottom-right">
        <img className="fg-cutout" src="/foreground/fg-modules-block.webp" alt="" aria-hidden="true" />
      </ForegroundPlate>
      <div className="pin" ref={pinRef}>
        <div>
          <div className="eyebrow"><div className="dot" />Chapter 04 · Modules</div>
          <SplitHeading text="Modules" as="h1" className="title" splitBy="letter" />
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
      </div>
    </section>
  );
}
