import { useMemo, useRef } from 'react';
import { CHAPTER_IDS } from './content/chapterIds.js';
import { BOOT_PIN_DISTANCE } from './content/bootIntro.js';
import { useScrollAnchors } from './hooks/useScrollAnchors.js';
import { useLenis } from './hooks/useLenis.js';
import ForegroundHost, { useForegroundHost } from './components/ForegroundHost.jsx';
import PlateBackdrop from './components/PlateBackdrop.jsx';

// Per-chapter scene plates (Kage-style persistent backdrops). Add entries as
// the rest of the GPT-generated plates arrive; a null slot leaves the base
// ink background visible for that chapter.
const PLATES = [
  {
    src: '/plates/plate-01-boot.webp',
    anchor: 'right',
    scale: 1.0, // static resting size — no approach zoom, the plate just sits there
    // Background layers keep drifting across the pinned text-reveal distance,
    // so there's still visible motion throughout the intro.
    layerRange: { start: 'top top', end: `+=${BOOT_PIN_DISTANCE}` },
    foreground: true, // renders above the DOM copy (alpha-cut plate) instead of behind it
    parallaxX: 70, // the plate is the one thing that moves with the cursor now
    rotate: 4, // subtle tilt in degrees, so it reads as an object turning, not just sliding
    layers: [
      // Background layers are static under the cursor by default (no parallaxX) —
      // only the plate responds to mouse position now.
      { src: '/bg/boot-far.webp', travel: 90, opacity: 0.5, scale: 1.0, blur: 3 },
      { src: '/bg/boot-mid.webp', travel: 200, opacity: 0.8, scale: 1.04 },
      { src: '/bg/boot-near.webp', travel: 360, opacity: 0.95, scale: 1.12 }
    ]
  }, // Boot
  {
    src: '/plates/plate-02-stack.webp',
    anchor: 'right',
    scale: 1.0,
    zoomTo: 1.05,
    foreground: true,
    parallaxX: 70,
    rotate: 4,
    aspectRatio: '1672 / 941',
    layers: [
      // Background layers are static under the cursor by default (no parallaxX) —
      // only the plate responds to mouse position now, same as Boot.
      { src: '/bg/stack-far.webp', travel: 60, opacity: 0.5, scale: 1.0, blur: 3 },
      { src: '/bg/stack-mid.webp', travel: 140, opacity: 0.75, scale: 1.04 },
      { src: '/bg/stack-near.webp', travel: 260, opacity: 0.9, scale: 1.12 }
    ]
  }, // Stack
  null, // Runtime — pending
  null, // Modules — pending
  null  // Deploy — pending
];
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
  const { hostRef: plateFgHostRef, host: plateFgHost } = useForegroundHost();
  useLenis();

  return (
    <div>
      <PlateBackdrop plates={PLATES} activeIndex={activeIndex} chapterIds={CHAPTER_IDS} foregroundHost={plateFgHost} />
      <div id="grain" aria-hidden="true" />
      <div id="vignette" aria-hidden="true" />
      <ForegroundHost hostRef={hostRef} />
      <div className="plate-foreground" ref={plateFgHostRef} aria-hidden="true" />

      <a className="sr-only" href="#boot">Skip to content</a>
      <Nav chapterIds={CHAPTER_IDS} activeIndex={activeIndex} />

      <main>
        <Boot sectionRef={bootRef} />
        <Stack sectionRef={stackRef} active={activeIndex === 1} foregroundHost={host} />
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
