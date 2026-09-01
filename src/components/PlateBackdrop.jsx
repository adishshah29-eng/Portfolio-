import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Kage's persistent scene-plate layer: a fixed full-viewport backdrop
// that swaps its image per active chapter with a slow cross-fade. Each
// plate has its own composition (position/scale) so it doesn't clash
// with the DOM copy layout for that chapter.
//
// Plates are declared as an ordered list — one per chapter index. Missing
// entries render as null (chapter has no plate yet, leaving the base
// #ink background visible), which is how we can ship progressively as
// GPT-generated plates arrive.
//
// Motion is GSAP ScrollTrigger-driven, scrubbed against the chapter's own
// section element: background layers drift a real, visible distance
// (per-layer `travel`, far layers less than near ones) and the plate
// slowly zooms (`scale` → `zoomTo`) across the full time that chapter is
// on screen.
//
// Mouse position drives a second, independent motion, but only on the
// elements that opt into it via `parallaxX` — background layers are static
// under the cursor by default, and the plate is the one thing that moves,
// with a slight rotation added so it reads as a physical object turning
// toward the viewer rather than a flat layer sliding.
//
// A plate can also set `foreground: true` to render its image (alpha
// channel required) in a layer ABOVE the DOM copy instead of behind it —
// portaled into `foregroundHost`, a fixed container with a higher z-index
// than <main>. That's how the plate can visually "emerge in front of" the
// hero text instead of sitting as a backdrop behind it.

const CROSSFADE_MS = 900;
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

export default function PlateBackdrop({ plates, activeIndex, chapterIds, foregroundHost }) {
  const [current, setCurrent] = useState(activeIndex);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    if (activeIndex === current) return;
    setPrev(current);
    setCurrent(activeIndex);
    const t = setTimeout(() => setPrev(null), CROSSFADE_MS);
    return () => clearTimeout(t);
  }, [activeIndex, current]);

  const currentPlate = plates[current];
  const prevPlate = prev !== null ? plates[prev] : null;

  return (
    <div className="plate-backdrop" aria-hidden="true">
      {prevPlate && (
        <PlateImage
          key={`prev-${prev}`}
          plate={prevPlate}
          state="out"
          chapterId={chapterIds[prev]}
          isActive={false}
          foregroundHost={foregroundHost}
        />
      )}
      {currentPlate && (
        <PlateImage
          key={`cur-${current}`}
          plate={currentPlate}
          state="in"
          chapterId={chapterIds[current]}
          isActive
          foregroundHost={foregroundHost}
        />
      )}
    </div>
  );
}

function PlateImage({ plate, state, chapterId, isActive, foregroundHost }) {
  const { src, anchor = 'right', scale = 1, zoomTo, parallaxX: plateParallaxX = 0, rotate: plateRotate = 0, foreground, layers } = plate;
  const rootRef = useRef(null);
  const fgRootRef = useRef(null);
  const plateImgRef = useRef(null);
  const layerEls = useRef([]);
  layerEls.current = [];

  const usesForeground = foreground && foregroundHost;

  useLayoutEffect(() => {
    let removePointer = () => {};

    const ctx = gsap.context(() => {
      const xPercent = anchor === 'center' ? -50 : 0;
      if (plateImgRef.current) {
        gsap.set(plateImgRef.current, { yPercent: -50, xPercent, scale });
      }
      layers?.forEach((layer, i) => {
        const el = layerEls.current[i];
        if (el) gsap.set(el, { scale: layer.scale ?? 1 });
      });

      // Crossfade: GSAP-driven rather than a CSS-transition class swap.
      // Each plate is a fresh component mount with a new `key` on chapter
      // change, so it's present in the DOM at its target opacity from the
      // very first render — a CSS transition has no prior painted state to
      // animate from and just pops. gsap.fromTo sets an explicit `from`
      // value itself, so it always actually animates. Applied to both the
      // inline root (bg layers) and the portaled foreground root (plate),
      // kept in lockstep on the same duration/ease.
      const fadeTargets = [rootRef.current, usesForeground ? fgRootRef.current : null].filter(Boolean);
      fadeTargets.forEach((el) => {
        if (prefersReducedMotion()) {
          gsap.set(el, { opacity: state === 'out' ? 0 : 1 });
        } else if (state === 'out') {
          gsap.fromTo(el, { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(14px)', duration: CROSSFADE_MS / 1000, ease: 'power2.out' });
        } else {
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: CROSSFADE_MS / 1000, ease: 'power2.out' });
        }
      });

      if (!isActive || !chapterId || prefersReducedMotion()) return;

      const scrollTrigger = { trigger: `#${chapterId}`, start: 'top bottom', end: 'bottom top', scrub: 0.6 };

      if (plateImgRef.current && zoomTo) {
        gsap.fromTo(plateImgRef.current, { scale }, { scale: zoomTo, ease: 'none', scrollTrigger });
      }
      layers?.forEach((layer, i) => {
        const el = layerEls.current[i];
        if (!el || !layer.travel) return;
        gsap.fromTo(el, { y: -layer.travel / 2 }, { y: layer.travel / 2, ease: 'none', scrollTrigger });
      });

      if (!hasFinePointer()) return;

      const panners = [];
      let setRotate = null;
      if (plateImgRef.current && plateParallaxX) {
        panners.push({ strength: plateParallaxX, setX: gsap.quickTo(plateImgRef.current, 'x', { duration: 0.7, ease: 'power3.out' }) });
      }
      if (plateImgRef.current && plateRotate) {
        setRotate = gsap.quickTo(plateImgRef.current, 'rotation', { duration: 0.8, ease: 'power3.out' });
      }
      layers?.forEach((layer, i) => {
        const el = layerEls.current[i];
        if (el && layer.parallaxX) {
          panners.push({ strength: layer.parallaxX, setX: gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' }) });
        }
      });
      if (!panners.length && !setRotate) return;

      const onMove = (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
        panners.forEach(({ strength, setX }) => setX(nx * strength));
        if (setRotate) setRotate(nx * plateRotate);
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      removePointer = () => window.removeEventListener('mousemove', onMove);
    }, rootRef);

    return () => {
      removePointer();
      ctx.revert();
    };
    // usesForeground starts false (the foreground host ref isn't attached to
    // a real DOM node until after the first commit) and flips to true at
    // most once, right after — re-running the whole setup on that flip is
    // what makes it target the portaled plate-img instead of the inline one
    // that briefly existed before the host was ready. Everything else here
    // (anchor/scale/layers/etc.) is a static plate config, not meant to
    // re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usesForeground]);

  const anchorCls = `plate--${anchor} plate--${state}`;
  const plateImgEl = src && <img className="plate-img" ref={plateImgRef} src={src} alt="" />;

  return (
    <div className={`plate ${anchorCls}`} ref={rootRef}>
      {layers &&
        layers.map((layer, i) => {
          const filter = `saturate(1.08)${layer.blur ? ` blur(${layer.blur}px)` : ''}`;
          return (
            <div
              className="bg-layer"
              key={layer.src}
              ref={(el) => (layerEls.current[i] = el)}
              style={{ zIndex: i, opacity: layer.opacity ?? 1 }}
            >
              <img src={layer.src} style={{ filter }} alt="" />
            </div>
          );
        })}
      {!usesForeground && plateImgEl}
      {usesForeground &&
        createPortal(
          <div className={`plate plate--fg ${anchorCls}`} ref={fgRootRef}>
            {plateImgEl}
          </div>,
          foregroundHost
        )}
    </div>
  );
}
