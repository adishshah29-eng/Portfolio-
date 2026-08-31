import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { ACCENTS } from './textures.js';

function seededCards(count, rMin, rMax, zBias, seedOffset) {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const w = 1.0 + Math.random() * 1.6;
    const h = 1.4 + Math.random() * 5.5;
    const d = 0.12;
    const ang = Math.random() * Math.PI * 2;
    const rad = rMin + Math.random() * (rMax - rMin);
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad * 0.6 - zBias;
    const y = h / 2;
    const ry = Math.random() * 0.5 - 0.25;
    const accent = ACCENTS[(i + seedOffset) % ACCENTS.length];
    const lines = 1 + Math.floor(Math.random() * 3);
    cards.push({ w, h, d, x, y, z, ry, accent, lines, key: `${seedOffset}-${i}` });
  }
  return cards;
}

function Card({ w, h, d, x, y, z, ry, accent, lines }) {
  const headerH = Math.min(0.22, h * 0.14);
  return (
    <group position={[x, y, z]} rotation={[0, ry, 0]}>
      <RoundedBox args={[w, h, d]} radius={Math.min(w, h, d) * 0.18} smoothness={3} castShadow={false}>
        <meshStandardMaterial color="#151b21" roughness={0.55} metalness={0.28} envMapIntensity={0.2} />
      </RoundedBox>
      {/* header bar, like a browser/app chrome strip */}
      <mesh position={[0, h / 2 - headerH / 2, d / 2 + 0.005]}>
        <planeGeometry args={[w * 0.92, headerH]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>
      {/* content lines */}
      {Array.from({ length: lines }).map((_, li) => (
        <mesh key={li} position={[-w * 0.02, h / 2 - headerH - 0.22 - li * 0.34, d / 2 + 0.005]}>
          <planeGeometry args={[w * (0.5 + Math.random() * 0.3), 0.045]} />
          <meshBasicMaterial color={accent} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export function FloatingCards() {
  const cards = useMemo(
    () => [
      ...seededCards(20, 6, 20, 4, 0),
      ...seededCards(18, 14, 34, -18, 20),
      ...seededCards(14, 10, 30, -34, 40)
    ],
    []
  );
  return (
    <group>
      {cards.map((c) => (
        <Card key={c.key} {...c} />
      ))}
    </group>
  );
}

function seededChips(count, rMin, rMax, zBias) {
  const chips = [];
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = rMin + Math.random() * (rMax - rMin);
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad * 0.6 - zBias;
    const accent = ACCENTS[i % ACCENTS.length];
    chips.push({ x, z, accent, key: i });
  }
  return chips;
}

function Chip({ x, z, accent }) {
  return (
    <group position={[x, 0.14, z]}>
      <RoundedBox args={[0.6, 0.22, 0.22]} radius={0.11} smoothness={3}>
        <meshStandardMaterial color="#151b21" roughness={0.5} metalness={0.3} envMapIntensity={0.2} />
      </RoundedBox>
      <mesh position={[0.16, 0, 0.11]}>
        <circleGeometry args={[0.055, 20]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

export function ButtonChips() {
  const chips = useMemo(() => seededChips(24, 4, 30, -6), []);
  return (
    <group>
      {chips.map((c) => (
        <Chip key={c.key} {...c} />
      ))}
    </group>
  );
}
