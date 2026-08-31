import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHAPTERS } from './chapters.js';
import { useCameraCurves } from './useCameraCurves.js';
import { exactProgressFromScroll, dampTo } from '../lib/scrollProgress.js';

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function CameraRig({ anchorsRef, reducedMotion, worldState }) {
  const [mobile, setMobile] = useState(() => window.innerWidth < 760);
  const curves = useCameraCurves(mobile);
  const smoothRef = useRef(0);
  const tmpA = useRef(new THREE.Color());
  const tmpB = useRef(new THREE.Color());

  useEffect(() => {
    function onResize() {
      const next = window.innerWidth < 760;
      setMobile((prev) => (prev === next ? prev : next));
    }
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useFrame((state, dt) => {
    const scrollY = window.scrollY || window.pageYOffset;
    const exact = exactProgressFromScroll(anchorsRef.current, scrollY);
    const last = CHAPTERS.length - 1;

    if (reducedMotion) {
      smoothRef.current = Math.round(Math.max(0, Math.min(last, exact)));
    } else {
      smoothRef.current = dampTo(smoothRef.current, exact, 5.2, Math.min(dt, 1 / 30));
    }
    const smooth = smoothRef.current;

    const u = clamp01(smooth / last);
    const idxF = u * last;
    const i0 = Math.max(0, Math.min(last - 1, Math.floor(idxF)));
    const i1 = Math.min(last, i0 + 1);
    const t = idxF - i0;

    const pos = curves.pos.getPoint(u);
    const tgt = curves.tgt.getPoint(u);
    const camA = mobile ? CHAPTERS[i0].camera.mobile : CHAPTERS[i0].camera;
    const camB = mobile ? CHAPTERS[i1].camera.mobile : CHAPTERS[i1].camera;

    state.camera.position.copy(pos);
    state.camera.fov = lerp(camA.fov, camB.fov, t);
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(tgt.x, tgt.y, tgt.z);

    const a = CHAPTERS[i0].world;
    const b = CHAPTERS[i1].world;
    tmpA.current.set(a.grade);
    tmpB.current.set(b.grade);
    const ws = worldState.current;
    ws.fog = lerp(a.fog, b.fog, t);
    ws.key = lerp(a.key, b.key, t);
    ws.signal = lerp(a.signal, b.signal, t);
    ws.grade.copy(tmpA.current).lerp(tmpB.current, t);
    ws.time = state.clock.elapsedTime;

    if (state.scene.fog) state.scene.fog.density = ws.fog;
  });

  return null;
}
