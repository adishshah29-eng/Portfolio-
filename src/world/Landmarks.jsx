import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { makeGlowTexture, ACCENTS } from './textures.js';

// A giant stylized pointer-cursor silhouette — the Boot chapter's hero
// landmark, standing in for Kage's vermilion moon-lit torii.
export function CursorLandmark() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, -0.92);
    shape.lineTo(0.22, -0.7);
    shape.lineTo(0.36, -0.98);
    shape.lineTo(0.5, -0.92);
    shape.lineTo(0.36, -0.64);
    shape.lineTo(0.66, -0.64);
    shape.lineTo(0, 0);
    const extrude = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
    extrude.center();
    return extrude;
  }, []);

  const glowTex = useMemo(() => makeGlowTexture(), []);

  return (
    <group position={[6.5, 4.6, -6]} rotation={[0, -0.5, 0.18]} scale={2.6}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#dfe7e0" roughness={0.32} metalness={0.15} envMapIntensity={0.4} emissive="#e0231c" emissiveIntensity={0.12} />
      </mesh>
      <sprite scale={[6, 6, 1]} position={[0, 0, -0.3]}>
        <spriteMaterial map={glowTex} color="#e0231c" transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

const MODULE_POSITIONS = [
  [-6, 2.4, -34],
  [-1.5, 3.4, -37],
  [3, 2.2, -35],
  [6.5, 3.8, -39]
];

function WindowPanel({ position, accent, index }) {
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const ringRef = useRef();
  const w = 2.1;
  const h = 1.5;
  const d = 0.1;
  const headerH = 0.26;

  useFrame((state) => {
    if (ringRef.current) ringRef.current.rotation.z = state.clock.elapsedTime * 0.15 + index;
  });

  return (
    <group position={position}>
      <sprite scale={[4.2, 4.2, 1]} position={[0, 0, -0.2]}>
        <spriteMaterial map={glowTex} color={accent} transparent opacity={0.32} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.35, 0.015, 8, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.55} />
      </mesh>
      <RoundedBox args={[w, h, d]} radius={0.06} smoothness={3}>
        <meshPhysicalMaterial
          color="#0c0f13" roughness={0.22} metalness={0.35}
          clearcoat={0.6} clearcoatRoughness={0.2} envMapIntensity={0.6}
        />
      </RoundedBox>
      <mesh position={[0, h / 2 - headerH / 2, d / 2 + 0.005]}>
        <planeGeometry args={[w * 0.96, headerH]} />
        <meshBasicMaterial color="#0a0d11" />
      </mesh>
      {[0, 1, 2].map((dotI) => (
        <mesh key={dotI} position={[-w / 2 + 0.18 + dotI * 0.15, h / 2 - headerH / 2, d / 2 + 0.01]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color={dotI === 0 ? '#e0231c' : dotI === 1 ? '#c9a24a' : '#ff5a3c'} />
        </mesh>
      ))}
      {[0, 1].map((lineI) => (
        <mesh key={lineI} position={[-w * 0.05, h / 2 - headerH - 0.26 - lineI * 0.28, d / 2 + 0.005]}>
          <planeGeometry args={[w * (0.55 - lineI * 0.15), 0.05]} />
          <meshBasicMaterial color={accent} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function WindowPanels() {
  return (
    <group>
      {MODULE_POSITIONS.map((p, i) => (
        <WindowPanel key={i} position={p} accent={ACCENTS[i % ACCENTS.length]} index={i} />
      ))}
    </group>
  );
}
