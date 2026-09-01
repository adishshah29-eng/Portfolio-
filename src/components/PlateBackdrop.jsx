import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
// on screen — not the old fixed-multiplier drift, which moved a few px
// over an entire chapter and read as static.

const CROSSFADE_MS = 900;
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PlateBackdrop({ plates, activeIndex, chapterIds }) {
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
        <PlateImage key={`prev-${prev}`} plate={prevPlate} state="out" chapterId={chapterIds[prev]} isActive={false} />
      )}
      {currentPlate && (
        <PlateImage
          key={`cur-${current}`}
          plate={currentPlate}
          state="in"
          chapterId={chapterIds[current]}
          isActive
        />
      )}
    </div>
  );
}

function PlateImage({ plate, state, chapterId, isActive }) {
  const { src, anchor = 'right', scale = 1, zoomTo, layers } = plate;
  const rootRef = useRef(null);
  const plateImgRef = useRef(null);
  const layerEls = useRef([]);
  layerEls.current = [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const xPercent = anchor === 'center' ? -50 : 0;
      if (plateImgRef.current) {
        gsap.set(plateImgRef.current, { yPercent: -50, xPercent, scale });
      }
      layers?.forEach((layer, i) => {
        const el = layerEls.current[i];
        if (el) gsap.set(el, { scale: layer.scale ?? 1 });
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
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cls = `plate plate--${anchor} plate--${state}`;
  return (
    <div className={cls} ref={rootRef}>
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
      {src && <img className="plate-img" ref={plateImgRef} src={src} alt="" />}
    </div>
  );
}
