import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeGlowTexture } from './textures.js';

export function EmberParticles({ reducedMotion }) {
  const count = reducedMotion ? 0 : 220;
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const pointsRef = useRef();

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90 - 20;
      speeds[i] = 0.15 + Math.random() * 0.35;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, dt) => {
    if (!pointsRef.current || count === 0) return;
    const attr = pointsRef.current.geometry.getAttribute('position');
    for (let i = 0; i < count; i++) {
      let y = attr.array[i * 3 + 1] + speeds[i] * dt;
      if (y > 14) y = 0;
      attr.array[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={glowTex} color="#ff9a5a" size={0.22} transparent opacity={0.55}
        depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation
      />
    </points>
  );
}
