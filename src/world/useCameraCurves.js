import { useMemo } from 'react';
import * as THREE from 'three';
import { CHAPTERS } from './chapters.js';

export function useCameraCurves(mobile) {
  return useMemo(() => {
    const posPts = CHAPTERS.map((c) => {
      const cam = mobile ? c.camera.mobile : c.camera;
      return new THREE.Vector3(cam.p[0], cam.p[1], cam.p[2]);
    });
    const tgtPts = CHAPTERS.map((c) => {
      const cam = mobile ? c.camera.mobile : c.camera;
      return new THREE.Vector3(cam.t[0], cam.t[1], cam.t[2]);
    });
    return {
      pos: new THREE.CatmullRomCurve3(posPts, false, 'centripetal', 0.5),
      tgt: new THREE.CatmullRomCurve3(tgtPts, false, 'centripetal', 0.5)
    };
  }, [mobile]);
}

export function useMobileBreakpoint() {
  const get = () => (typeof window !== 'undefined' ? window.innerWidth < 760 : false);
  return get;
}
