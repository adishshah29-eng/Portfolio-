import { useEffect, useRef, useState } from 'react';
import { measureAnchors, exactProgressFromScroll } from '../lib/scrollProgress.js';

export function useScrollAnchors(sectionRefs, chapterIds) {
  const anchorsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const widthAtMeasureRef = useRef(window.innerWidth);

  useEffect(() => {
    function measure() {
      const els = sectionRefs.map((r) => r.current).filter(Boolean);
      if (els.length === sectionRefs.length) {
        anchorsRef.current = measureAnchors(els);
      }
    }

    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const exact = exactProgressFromScroll(anchorsRef.current, scrollY);
      const idx = Math.max(0, Math.min(chapterIds.length - 1, Math.round(exact)));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    }

    function onResize() {
      const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      const widthChanged = window.innerWidth !== widthAtMeasureRef.current;
      if (coarse && !widthChanged) return;
      widthAtMeasureRef.current = window.innerWidth;
      measure();
      onScroll();
    }

    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
      measure();
      onScroll();
    });
    window.addEventListener('load', () => {
      measure();
      onScroll();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { anchorsRef, activeIndex };
}
