import { useLayoutEffect } from 'react';
import gsap from 'gsap';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Turns the background-layer stack and the foreground plate into a shared
// 3D scene that reacts to how you scroll, not to the cursor - a camera
// being carried through the story rather than something you have to hover
// to notice (Kage does this: the whole backdrop pitches and rolls with
// scroll speed and direction, settling flat the moment you stop). Driven
// by Lenis's own `velocity` (see useLenis.js, which now returns a ref to
// the live instance), read once per GSAP ticker frame rather than via a
// scroll event listener - continuous and frame-synced instead of bursty.
//
// The foreground plate reacts more than the background layers, same "near
// moves more than far" depth cue used by the mouse-driven pan/rotate each
// plate already has (see PlateBackdrop.jsx) - this is layered on top of
// that per-plate motion, not a replacement for it, since it targets the
// OUTER fixed containers rather than the plate/layer elements those
// animations already own.
//
// Deliberately does NOT set CSS `perspective` on any shared ancestor
// (body, the app root, etc) - that property makes the ancestor a new
// containing block for position:fixed/sticky descendants, which would
// silently break the fixed nav, the grain/vignette overlays, and every
// chapter's pinned-intro sticky wrapper. GSAP's `transformPerspective`
// bakes the perspective into each target's OWN transform instead, so only
// that element gets 3D depth - safe on .plate-backdrop/.plate-foreground,
// both position:fixed but neither an ancestor of anything that needs its
// own fixed/sticky positioning to survive.
export function useSceneTilt(plateFgHostRef, lenisRef) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const backdrop = document.querySelector('.plate-backdrop');
    const foreground = plateFgHostRef?.current;
    const layers = [
      { el: backdrop, kPitch: 0.4, kRoll: 0.24, max: 3.5 },
      { el: foreground, kPitch: 0.75, kRoll: 0.42, max: 6 }
    ].filter((l) => l.el);
    if (!layers.length) return;

    // A fixed, viewport-sized box that rotates around its own center pulls
    // its far edge in from the viewport bounds - scaled up once here as a
    // constant safety margin (never re-set after, so it survives every
    // later rotateX/rotateZ write below untouched) so that edge always
    // stays outside the viewport at any angle these clamps allow, instead
    // of a bare sliver of the page background flashing in at the corner.
    gsap.set(
      layers.map((l) => l.el),
      { transformPerspective: 1400, transformOrigin: '50% 50%', scale: 1.18 }
    );

    // quickTo animates a plain proxy object here, not the element's rotateX/
    // rotateZ directly — two independent quickTo instances both targeting
    // different 3D transform components on the SAME DOM element fight over
    // GSAP's per-element transform cache (silently, as a console warning:
    // "rotateX not eligible for reset") and the second one's writes get
    // dropped. Easing a plain number instead, then writing pitch + roll
    // together in one gsap.set call on every update, sidesteps that
    // entirely.
    const setters = layers.map(({ el, kPitch, kRoll, max }) => {
      const proxy = { pitch: 0, roll: 0 };
      const apply = () => gsap.set(el, { rotateX: proxy.pitch, rotateZ: proxy.roll });
      return {
        setPitch: gsap.quickTo(proxy, 'pitch', { duration: 0.9, ease: 'power2.out', onUpdate: apply }),
        setRoll: gsap.quickTo(proxy, 'roll', { duration: 1.1, ease: 'power2.out', onUpdate: apply }),
        kPitch,
        kRoll,
        max
      };
    });

    function tick() {
      const v = lenisRef?.current?.velocity ?? 0;
      setters.forEach(({ setPitch, setRoll, kPitch, kRoll, max }) => {
        setPitch(gsap.utils.clamp(-max, max, -v * kPitch));
        setRoll(gsap.utils.clamp(-max * 0.7, max * 0.7, v * kRoll));
      });
    }
    gsap.ticker.add(tick);

    return () => gsap.ticker.remove(tick);
  }, [plateFgHostRef, lenisRef]);
}
