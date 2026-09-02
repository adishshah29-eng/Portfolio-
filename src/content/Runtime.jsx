import { useRef } from 'react';
import SplitHeading from '../components/SplitHeading.jsx';
import { usePinnedReveal } from '../hooks/usePinnedReveal.js';
import { RUNTIME_PIN_DISTANCE } from './pinIntro.js';

export default function Runtime({ sectionRef }) {
  const pinRef = useRef(null);
  usePinnedReveal(sectionRef, pinRef, RUNTIME_PIN_DISTANCE);

  return (
    <section id="runtime" ref={sectionRef} className="chapter is-pinned">
      <div className="pin" ref={pinRef}>
        <div className="panel">
          <div className="eyebrow"><div className="dot" />Chapter 03 · Runtime</div>
          <SplitHeading text="Runtime" as="h1" className="title" splitBy="letter" />
          <div className="timeline reveal d2">
            <div className="rail" />
            <div className="stn">
              <div className="node-dot" />
              <div className="yr">2026-Present</div>
              <div className="role">Full Stack Intern</div>
              <div className="org">Resunova.io (USA-based)</div>
              <div className="desc">
                Ship features for an AI-powered resume scoring &amp; job-matching platform; use Antigravity IDE and
                Claude to navigate the codebase; work a Git-based team workflow: branching, pull requests, code
                review.
              </div>
            </div>
            <div className="stn">
              <div className="node-dot" />
              <div className="yr">Jun 2026-Present</div>
              <div className="role">Web Development Intern</div>
              <div className="org">Parmar Properties</div>
              <div className="desc">
                Building a Next.js/Supabase/GSAP/Framer Motion marketing site with scroll-based animation;
                Supabase-backed blog CMS; developing a 99acres-style property listings platform.
              </div>
            </div>
            <div className="stn">
              <div className="node-dot" />
              <div className="yr">Jun 2025-Aug 2025</div>
              <div className="role">AI &amp; Tech Intern</div>
              <div className="org">Parmar Properties</div>
              <div className="desc">
                Built Callnex, a VoIP Android telecalling app (Java, Firebase); deployed an n8n + Vapi.ai voice bot
                via Twilio to automate inbound inquiries, IVR, and callback scheduling.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
