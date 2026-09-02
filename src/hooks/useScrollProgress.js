import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A thin bar under the nav that fills across the whole 5-chapter scroll -
// scrubbed 1:1 against document height, not an independent animation, so it
// isn't gated behind prefers-reduced-motion (same reasoning as a native
// scrollbar thumb: it's a live readout of where you are, not motion for its
// own sake). Returns a ref to attach to the bar element.
export function useScrollProgress() {
  const barRef = useRef(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
      });
    });

    return () => ctx.revert();
  }, []);

  return barRef;
}
