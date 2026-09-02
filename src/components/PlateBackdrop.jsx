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
// under the cursor by default, and the plate is the one thing that moves:
// pan on `x`, tilt on `rotation`, a slow idle sway on `y` that never stops —
// three different transform components so GSAP composes them instead of
// fighting over one value. The pan/tilt ease with a slight overshoot
// (`back.out`) rather than settling flat, so the object reads as having
// some weight being pushed around rather than just interpolating to a target.
//
// A plate can also set `glow: true` to add a soft light that follows the
// cursor across the chrome, masked to the plate's own alpha channel (see
// `mask-image` below) so it only ever touches actual chrome pixels, never
// the transparent gaps or whatever's showing through them.
//
// A plate can also set `foreground: true` to render its image (alpha
// channel required) in a layer ABOVE the DOM copy instead of behind it —
// portaled into `foregroundHost`, a fixed container with a higher z-index
// than <main>. That's how the plate can visually "emerge in front of" the
// hero text instead of sitting as a backdrop behind it. A shard/disc/
// ribbon plate is porous enough (lots of transparent gaps) that this alone
// keeps text readable; a plate that's mostly one solid, filled shape (an
// arch, a block) can additionally set `fgOpacity` (0-1) to dial back how
// opaque it renders specifically in foreground mode, so text underneath
// the shape itself stays legible without needing an even smaller scale.

const CROSSFADE_MS = 650;
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
  const {
    src,
    anchor = 'right',
    scale = 1,
    zoomTo,
    zoomRange,
    layerRange,
    parallaxX: plateParallaxX = 0,
    rotate: plateRotate = 0,
    glow,
    aspectRatio,
    foreground,
    fgOpacity = 1,
    layers
  } = plate;
  const rootRef = useRef(null);
  const fgRootRef = useRef(null);
  const plateImgRef = useRef(null);
  const glowRef = useRef(null);
  const layerEls = useRef([]);
  layerEls.current = [];

  const usesForeground = foreground && foregroundHost;
  const usesGlow = glow;

  useLayoutEffect(() => {
    let removePointer = () => {};
    let breatheTween = null;

    const ctx = gsap.context(() => {
      // Everything that moves the plate object (centering, static scale, the
      // scroll zoom, the mouse pan/tilt) applies identically to the image and
      // the glow overlay, so the two stay perfectly registered — the glow's
      // mask only lines up with the chrome if it moves exactly as one rigid
      // object with it.
      const objTargets = [plateImgRef.current, usesGlow ? glowRef.current : null].filter(Boolean);
      const xPercent = anchor === 'center' ? -50 : 0;
      // When the scroll-driven zoom below won't run (reduced motion, or
      // this plate isn't the active one), settle directly at `zoomTo`
      // rather than the animation's starting `scale` — otherwise a plate
      // whose intro scale is deliberately tiny (Boot's approach zoom starts
      // at 0.42) would be stuck small forever instead of at its intended
      // resting size.
      const skipsZoomAnim = !isActive || !chapterId || prefersReducedMotion();
      const restingScale = skipsZoomAnim && zoomTo ? zoomTo : scale;
      if (objTargets.length) {
        gsap.set(objTargets, { yPercent: -50, xPercent, scale: restingScale });
        if (usesForeground && fgOpacity < 1) gsap.set(plateImgRef.current, { opacity: fgOpacity });
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
      //
      // Plain opacity only — no filter:blur here. Animating CSS blur means
      // re-rasterizing this whole fixed full-viewport layer (several
      // layered images, one with mix-blend-mode:screen) every frame, which
      // is exactly the kind of thing that drops frames and reads as
      // laggy. Opacity alone is cheap (GPU-composited) and the crossfade
      // still reads as a proper dissolve without it.
      const fadeTargets = [rootRef.current, usesForeground ? fgRootRef.current : null].filter(Boolean);
      fadeTargets.forEach((el) => {
        if (prefersReducedMotion()) {
          gsap.set(el, { opacity: state === 'out' ? 0 : 1 });
        } else if (state === 'out') {
          gsap.fromTo(el, { opacity: 1 }, { opacity: 0, duration: CROSSFADE_MS / 1000, ease: 'power1.out' });
        } else {
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: CROSSFADE_MS / 1000, ease: 'power1.out' });
        }
      });

      if (!isActive || !chapterId || prefersReducedMotion()) return;

      // Default: scrub across the whole chapter (top bottom -> bottom top,
      // i.e. from the moment it starts entering the viewport to the moment
      // it's fully left it). A plate can override either the zoom's or the
      // layers' range independently via `zoomRange`/`layerRange` — Boot uses
      // this to scope its plate-approach zoom to just the first slice of its
      // pinned intro, while its background layers keep drifting across the
      // whole pinned distance.
      const defaultTrigger = { trigger: `#${chapterId}`, start: 'top bottom', end: 'bottom top', scrub: 0.6 };
      const zoomTrigger = zoomRange ? { trigger: `#${chapterId}`, scrub: 1, ...zoomRange } : defaultTrigger;
      const layerTrigger = layerRange ? { trigger: `#${chapterId}`, scrub: 1, ...layerRange } : defaultTrigger;

      if (objTargets.length && zoomTo) {
        gsap.fromTo(objTargets, { scale }, { scale: zoomTo, ease: 'none', scrollTrigger: zoomTrigger });
      }
      layers?.forEach((layer, i) => {
        const el = layerEls.current[i];
        if (!el || !layer.travel) return;
        gsap.fromTo(el, { y: -layer.travel / 2 }, { y: layer.travel / 2, ease: 'none', scrollTrigger: layerTrigger });
      });

      // Idle sway: a slow, continuous vertical breathe on the plate object so
      // it's never fully still, independent of the cursor (rides `y`, which
      // nothing else on this object touches — the mouse pan/tilt use `x` and
      // `rotation`, so none of these fight over the same value).
      if (objTargets.length) {
        breatheTween = gsap.fromTo(
          objTargets,
          { y: -7 },
          { y: 7, duration: 3.6, ease: 'sine.inOut', repeat: -1, yoyo: true }
        );
      }

      if (!hasFinePointer()) return;

      const panners = [];
      let setRotate = null;
      let setGlowX = null;
      let setGlowY = null;
      if (objTargets.length && plateParallaxX) {
        panners.push({ strength: plateParallaxX, setX: gsap.quickTo(objTargets, 'x', { duration: 0.85, ease: 'back.out(1.4)' }) });
      }
      if (objTargets.length && plateRotate) {
        setRotate = gsap.quickTo(objTargets, 'rotation', { duration: 0.9, ease: 'back.out(1.4)' });
      }
      if (usesGlow && glowRef.current) {
        // Establish the unit ("%") on these custom properties before
        // quickTo starts feeding them plain numbers each frame — GSAP infers
        // the unit from this initial set and keeps applying it, the same way
        // it does for any other unit-bearing CSS property.
        gsap.set(glowRef.current, { '--gx': '50%', '--gy': '50%' });
        setGlowX = gsap.quickTo(glowRef.current, '--gx', { duration: 0.4, ease: 'power2.out' });
        setGlowY = gsap.quickTo(glowRef.current, '--gy', { duration: 0.4, ease: 'power2.out' });
      }
      layers?.forEach((layer, i) => {
        const el = layerEls.current[i];
        if (el && layer.parallaxX) {
          panners.push({ strength: layer.parallaxX, setX: gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' }) });
        }
      });
      if (!panners.length && !setRotate && !setGlowX) return;

      const onMove = (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
        panners.forEach(({ strength, setX }) => setX(nx * strength));
        if (setRotate) setRotate(nx * plateRotate);
        if (setGlowX && setGlowY && plateImgRef.current) {
          const r = plateImgRef.current.getBoundingClientRect();
          if (r.width && r.height) {
            setGlowX(((e.clientX - r.left) / r.width) * 100);
            setGlowY(((e.clientY - r.top) / r.height) * 100);
          }
        }
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      removePointer = () => window.removeEventListener('mousemove', onMove);
    }, rootRef);

    return () => {
      removePointer();
      breatheTween?.kill();
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
  const objStyle = aspectRatio ? { aspectRatio } : undefined;

  const plateObjEl = src && (
    <>
      <img className="plate-img" ref={plateImgRef} src={src} style={objStyle} alt="" />
      {usesGlow && (
        <div
          className="plate-glow"
          ref={glowRef}
          style={{ ...objStyle, maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
        />
      )}
    </>
  );

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
      {!usesForeground && plateObjEl}
      {usesForeground &&
        createPortal(
          <div className={`plate plate--fg ${anchorCls}`} ref={fgRootRef}>
            {plateObjEl}
          </div>,
          foregroundHost
        )}
    </div>
  );
}
