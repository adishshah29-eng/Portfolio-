import { useEffect, useRef } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = ['255,167,102', '255,120,84', '255,209,140'];
const MAX_DPR = 2;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

// A restrained ember/spark atmosphere scoped to one chapter (Deploy) - a
// genuine extra depth layer between the far/mid/near background drift and
// the portal plate itself, rather than another flat parallax tier. Sparks
// rise slowly with a gentle sway, recycling from the bottom once they
// drift past the top, so the motion reads as continuous embers escaping
// the portal rather than a one-shot burst.
//
// Canvas rather than DOM/SVG nodes - this is 30+ small identical shapes
// updating every frame, exactly the case the canvas-vs-DOM tradeoff favors
// canvas for. Sticky-positioned and sized to the viewport (not the whole,
// much taller, scroll-runway section) since that's the only slice ever
// visible at once, and z-index:-1 keeps it behind the pinned text without
// needing any change to the text's own stacking.
export default function EmberParticles({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const COUNT = reduced ? 12 : 32;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let raf = null;
    let visible = true;
    let lastT = performance.now();

    function spawn(initial) {
      return {
        x: rand(0, width),
        y: initial ? rand(0, height) : height + rand(0, 40),
        r: rand(1, 3),
        speed: rand(12, 30),
        sway: rand(6, 20),
        swaySpeed: rand(0.35, 1),
        phase: rand(0, Math.PI * 2),
        opacity: rand(0.22, 0.7),
        color: COLORS[(Math.random() * COLORS.length) | 0]
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawStatic() {
      resize();
      particles = Array.from({ length: COUNT }, () => spawn(true));
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function step(t) {
      raf = requestAnimationFrame(step);
      if (!visible || document.hidden) {
        lastT = t;
        return;
      }
      let dt = (t - lastT) / 1000;
      lastT = t;
      if (dt > 0.1) dt = 0.1;

      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speed * dt;
        p.phase += p.swaySpeed * dt;
        if (p.y < -10) {
          Object.assign(p, spawn(false));
        }
        const x = p.x + Math.sin(p.phase) * p.sway;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (reduced) {
      drawStatic();
      const ro = new ResizeObserver(drawStatic);
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    resize();
    particles = Array.from({ length: COUNT }, () => spawn(true));
    raf = requestAnimationFrame(step);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
