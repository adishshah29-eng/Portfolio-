import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeGridTexture, makeRoughnessTexture, makeGlowTexture } from './textures.js';

export function SceneLighting({ worldState }) {
  const hemiRef = useRef();
  const keyRef = useRef();

  useFrame(() => {
    const ws = worldState.current;
    if (keyRef.current) {
      keyRef.current.intensity = ws.key;
      keyRef.current.color.copy(ws.grade);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemiRef} args={['#252d35', '#05070a', 0.28]} />
      <directionalLight ref={keyRef} position={[-14, 22, 10]} intensity={0.3} color="#9fb3c8" />
    </>
  );
}

export function GridGround() {
  const gridTex = useMemo(() => makeGridTexture(), []);
  const roughTex = useMemo(() => makeRoughnessTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[160, 160, 1, 1]} />
      <meshStandardMaterial
        color="#090b0f"
        roughness={0.88}
        roughnessMap={roughTex}
        metalness={0.06}
        emissive="#ffffff"
        emissiveMap={gridTex}
        emissiveIntensity={0.5}
        envMapIntensity={0.1}
      />
    </mesh>
  );
}

// The "signal" — a large soft focus ring standing in for Kage's moon,
// reinterpreted as a UI selection/focus indicator.
export function SignalRing({ worldState }) {
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const haloRef = useRef();
  const coreRef = useRef();
  const ringRef = useRef();
  const lightRef = useRef();
  const position = [2, 22, -70];

  useFrame(() => {
    const ws = worldState.current;
    if (haloRef.current) haloRef.current.material.opacity = ws.signal * 0.5;
    if (coreRef.current) coreRef.current.material.opacity = ws.signal * 0.55;
    if (ringRef.current) {
      ringRef.current.material.opacity = ws.signal * 0.85;
      ringRef.current.rotation.z = ws.time * 0.03;
    }
    if (lightRef.current) lightRef.current.intensity = ws.signal * 0.6;
  });

  return (
    <group position={position}>
      <sprite ref={haloRef} scale={[42, 42, 1]}>
        <spriteMaterial map={glowTex} color="#e0231c" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={coreRef} scale={[9, 9, 1]}>
        <spriteMaterial map={glowTex} color="#ffe3c9" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh ref={ringRef}>
        <torusGeometry args={[6, 0.06, 12, 64]} />
        <meshBasicMaterial color="#dfe7e0" transparent opacity={0.6} />
      </mesh>
      <pointLight ref={lightRef} color="#e0231c" intensity={0.6} distance={90} decay={2} />
    </group>
  );
}
