import { useRef } from 'react';
import SplitHeading from '../components/SplitHeading.jsx';
import { usePinnedReveal } from '../hooks/usePinnedReveal.js';
import ForegroundPlate from '../components/ForegroundPlate.jsx';
import { DEPLOY_PIN_DISTANCE } from './pinIntro.js';

export default function Deploy({ sectionRef, active, foregroundHost }) {
  const pinRef = useRef(null);
  usePinnedReveal(sectionRef, pinRef, DEPLOY_PIN_DISTANCE);

  return (
    <section id="deploy" ref={sectionRef} className="chapter is-pinned">
      <ForegroundPlate host={foregroundHost} active={!!active} anchor="bottom-right">
        <img className="fg-cutout" src="/foreground/fg-deploy-ember.webp" alt="" aria-hidden="true" />
      </ForegroundPlate>
      <div className="pin" ref={pinRef}>
        <div className="eyebrow"><div className="dot" />Chapter 05 · Deploy</div>
        <SplitHeading text="Deploy" as="h1" className="fin" splitBy="letter" />
        <p className="manifesto reveal">
          Still compiling, always shipping. Open to full-stack and AI engineering roles. Let's build something real.
        </p>
        <div className="links reveal d2">
          <div className="lrow"><div className="k">Email</div><a className="v" href="mailto:adishshah29@gmail.com">adishshah29@gmail.com</a></div>
          <div className="lrow"><div className="k">GitHub</div><a className="v" href="https://github.com/adishshah29-eng" target="_blank" rel="noopener">github.com/adishshah29-eng</a></div>
          <div className="lrow"><div className="k">LinkedIn</div><a className="v" href="https://linkedin.com/in/adishshah29" target="_blank" rel="noopener">linkedin.com/in/adishshah29</a></div>
        </div>
      </div>
    </section>
  );
}
