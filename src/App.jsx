import { useEffect, useMemo, useRef, useState } from 'react';
import InterfaceWorld from './world/InterfaceWorld.jsx';
import { CHAPTER_IDS } from './world/chapters.js';
import { useScrollAnchors } from './hooks/useScrollAnchors.js';
import ForegroundHost, { useForegroundHost } from './components/ForegroundHost.jsx';
import Nav from './content/Nav.jsx';
import Boot from './content/Boot.jsx';
import Stack from './content/Stack.jsx';
import Runtime from './content/Runtime.jsx';
import Modules from './content/Modules.jsx';
import Deploy from './content/Deploy.jsx';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

export default function App() {
  const bootRef = useRef(null);
  const stackRef = useRef(null);
  const runtimeRef = useRef(null);
  const modulesRef = useRef(null);
  const deployRef = useRef(null);
  const sectionRefs = useMemo(() => [bootRef, stackRef, runtimeRef, modulesRef, deployRef], []);

  const { anchorsRef, activeIndex } = useScrollAnchors(sectionRefs, CHAPTER_IDS);
  const { hostRef, host } = useForegroundHost();

  const [webglOk, setWebglOk] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  useEffect(() => {
    setWebglOk(supportsWebGL());
  }, []);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const showWorld = webglOk && !contextLost;

  return (
    <div className={showWorld ? '' : 'no-webgl'}>
      {showWorld && (
        <div className="world-host">
          <InterfaceWorld anchorsRef={anchorsRef} reducedMotion={reducedMotion} onContextLost={() => setContextLost(true)} />
        </div>
      )}
      <div id="grain" aria-hidden="true" />
      <div id="vignette" aria-hidden="true" />
      <ForegroundHost hostRef={hostRef} />
      {!showWorld && <div id="fallback-note">3D world unavailable — showing story only</div>}

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
