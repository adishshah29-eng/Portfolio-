import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Smooth-scroll foundation everything else (ScrollTrigger scrubs, the
// parallax stack) rides on top of. Lenis eases native scrollY toward its
// target every frame — window scroll events keep firing, so nothing else
// in the app needs to know it's there — and drives ScrollTrigger off the
// same rAF tick so scrubbed animations stay in sync instead of lagging a
// frame behind the smoothed scroll position.
//
// Returns a ref to the live Lenis instance (not just booleans/numbers) so
// other hooks — useSceneTilt reads `.velocity` every tick — can react to
// scroll speed/direction without each one standing up its own scroll
// listener. The ref is null until mount and after unmount/reduced-motion,
// so callers must guard for that.
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
