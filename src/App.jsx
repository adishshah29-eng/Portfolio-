import { useMemo, useRef } from 'react';
import { CHAPTER_IDS } from './content/chapterIds.js';
import { useScrollAnchors } from './hooks/useScrollAnchors.js';
import ForegroundHost, { useForegroundHost } from './components/ForegroundHost.jsx';
import Nav from './content/Nav.jsx';
import Boot from './content/Boot.jsx';
import Stack from './content/Stack.jsx';
import Runtime from './content/Runtime.jsx';
import Modules from './content/Modules.jsx';
import Deploy from './content/Deploy.jsx';

export default function App() {
  const bootRef = useRef(null);
  const stackRef = useRef(null);
  const runtimeRef = useRef(null);
  const modulesRef = useRef(null);
  const deployRef = useRef(null);
  const sectionRefs = useMemo(() => [bootRef, stackRef, runtimeRef, modulesRef, deployRef], []);

  const { activeIndex } = useScrollAnchors(sectionRefs, CHAPTER_IDS);
  const { hostRef, host } = useForegroundHost();

  return (
    <div>
      <div id="grain" aria-hidden="true" />
      <div id="vignette" aria-hidden="true" />
      <ForegroundHost hostRef={hostRef} />

      <a className="sr-only" href="#boot">Skip to content</a>
      <Nav chapterIds={CHAPTER_IDS} activeIndex={activeIndex} />

      <main>
        <Boot sectionRef={bootRef} />
        <Stack sectionRef={stackRef} />
        <Runtime sectionRef={runtimeRef} />
        <Modules sectionRef={modulesRef} active={activeIndex === 3} foregroundHost={host} />
        <Deploy sectionRef={deployRef} />
      </main>

      <footer>
        <h4>THE BUILD © 2026</h4>
        <h4>ADISH SHAH</h4>
      </footer>
    </div>
  );
}
