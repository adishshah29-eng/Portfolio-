import { useMemo, useRef } from 'react';
import { CHAPTER_IDS } from './content/chapterIds.js';
import { BOOT_PIN_DISTANCE } from './content/bootIntro.js';
import { STACK_PIN_DISTANCE, RUNTIME_PIN_DISTANCE, MODULES_PIN_DISTANCE, DEPLOY_PIN_DISTANCE } from './content/pinIntro.js';
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
    // Every chapter now runs the same pinned intro Boot does (see
    // pinIntro.js) — during the pin, the section's own top/bottom barely
    // move relative to the viewport, so the default scroll-linked trigger
    // (top bottom -> bottom top) would sit nearly frozen for the whole
    // hold. Scoping to the pin's own scroll range keeps the zoom/parallax
    // moving throughout instead.
    zoomRange: { start: 'top top', end: `+=${STACK_PIN_DISTANCE}` },
    layerRange: { start: 'top top', end: `+=${STACK_PIN_DISTANCE}` },
    // The skill legend's chip pills (see Stack.jsx) wrap across more lines
    // and cover more of the right column than the old flat comma-text did,
    // so the disc stack needs to sit further back to keep them legible.
    fgOpacity: 0.4,
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
  {
    src: '/plates/plate-03-runtime.webp',
    anchor: 'right',
    // The source ribbon fills nearly its whole frame edge-to-edge (unlike
    // Boot/Stack's source images, which have a lot of empty margin around
    // the object) — a smaller resting scale keeps it from sprawling across
    // the text column at full height:100%.
    scale: 0.65,
    zoomTo: 0.7,
    zoomRange: { start: 'top top', end: `+=${RUNTIME_PIN_DISTANCE}` },
    layerRange: { start: 'top top', end: `+=${RUNTIME_PIN_DISTANCE}` },
    foreground: true,
    parallaxX: 70,
    rotate: 4,
    aspectRatio: '1915 / 821',
    layers: [
      // Background layers are static under the cursor by default (no parallaxX) —
      // only the plate responds to mouse position now, same as Boot/Stack.
      { src: '/bg/runtime-far.webp', travel: 60, opacity: 0.5, scale: 1.0, blur: 3 },
      { src: '/bg/runtime-mid.webp', travel: 140, opacity: 0.75, scale: 1.04 },
      { src: '/bg/runtime-near.webp', travel: 260, opacity: 0.9, scale: 1.12 }
    ]
  }, // Runtime
  {
    src: '/plates/plate-04-modules.webp',
    anchor: 'right',
    // Foreground, matching Boot/Stack/Runtime — Modules' 2-column grid is
    // wider than those chapters' copy columns though, so a full scale-1
    // plate covered too much of it (that's why this was behind the copy
    // before); a smaller resting size keeps the cube cluster a clear
    // object on the right without burying the cards under it.
    scale: 0.55,
    zoomTo: 0.6,
    // Dialed back further than Boot/Stack/Runtime's plates - the cluster's
    // faces are fairly solid (less porous than a shard/ribbon), and this
    // chapter's own copy is the widest column on the site.
    fgOpacity: 0.5,
    zoomRange: { start: 'top top', end: `+=${MODULES_PIN_DISTANCE}` },
    layerRange: { start: 'top top', end: `+=${MODULES_PIN_DISTANCE}` },
    foreground: true,
    parallaxX: 70,
    rotate: 4,
    aspectRatio: '1915 / 821',
    layers: [
      // Background layers are static under the cursor by default (no parallaxX) —
      // only the plate responds to mouse position now, same as Boot/Stack/Runtime.
      { src: '/bg/modules-far.webp', travel: 60, opacity: 0.5, scale: 1.0, blur: 3 },
      { src: '/bg/modules-mid.webp', travel: 140, opacity: 0.75, scale: 1.04 },
      { src: '/bg/modules-near.webp', travel: 260, opacity: 0.9, scale: 1.12 }
    ]
  }, // Modules
  {
    src: '/plates/plate-05-deploy.webp',
    anchor: 'center',
    // Foreground, matching every other chapter now — the arch is one solid,
    // fully-filled shape sitting exactly where the centered copy sits, so
    // scale alone can't fix legibility here (shrinking it just moves a
    // still-opaque shape closer together with the text, not out of its way).
    // fgOpacity is what actually keeps this chapter readable: the arch
    // renders translucent in foreground mode, so the copy shows through it
    // instead of being covered by it.
    scale: 0.7,
    zoomTo: 0.76,
    fgOpacity: 0.45,
    zoomRange: { start: 'top top', end: `+=${DEPLOY_PIN_DISTANCE}` },
    layerRange: { start: 'top top', end: `+=${DEPLOY_PIN_DISTANCE}` },
    foreground: true,
    // No `rotate` — a tilting spire would read as off-balance rather than
    // deliberate; this one just pans, staying still and monument-like to
    // match the "ascension" close instead of the other chapters' more
    // kinetic turn.
    parallaxX: 40,
    aspectRatio: '1915 / 821',
    layers: [
      { src: '/bg/deploy-far.webp', travel: 60, opacity: 0.5, scale: 1.0, blur: 3 },
      { src: '/bg/deploy-mid.webp', travel: 140, opacity: 0.75, scale: 1.04 },
      { src: '/bg/deploy-near.webp', travel: 260, opacity: 0.9, scale: 1.12 }
    ]
  } // Deploy
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
        <Deploy sectionRef={deployRef} active={activeIndex === 4} foregroundHost={host} />
      </main>

      <footer>
        <h4>THE BUILD © 2026</h4>
        <h4>ADISH SHAH</h4>
      </footer>
    </div>
  );
}
