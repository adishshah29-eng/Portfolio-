import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import CameraRig from './CameraRig.jsx';
import { SceneLighting, GridGround, SignalRing } from './Atmosphere.jsx';
import { FloatingCards, ButtonChips } from './Props.jsx';
import { CursorLandmark, WindowPanels } from './Landmarks.jsx';
import { EmberParticles } from './Particles.jsx';

export default function InterfaceWorld({ anchorsRef, reducedMotion, onContextLost }) {
  const worldState = useRef({ fog: 0.026, key: 0.3, signal: 0.5, grade: new THREE.Color('#8fa4c9'), time: 0 });

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 36, near: 0.1, far: 220, position: [0, 5.2, 16] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.92;
        if ('outputColorSpace' in gl) gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.fog = new THREE.FogExp2('#05070a', 0.026);
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          if (onContextLost) onContextLost();
        });
      }}
    >
      <CameraRig anchorsRef={anchorsRef} reducedMotion={reducedMotion} worldState={worldState} />
      <SceneLighting worldState={worldState} />
      <SignalRing worldState={worldState} />
      <GridGround />
      <FloatingCards />
      <ButtonChips />
      <CursorLandmark />
      <WindowPanels />
      <EmberParticles reducedMotion={reducedMotion} />

      {/* Procedural, offline-safe environment for real reflections — dim,
          accent-tinted panels instead of a bright neutral studio. */}
      <Environment resolution={256} frames={1} environmentIntensity={0.35}>
        <Lightformer form="rect" color="#e0231c" intensity={1.4} scale={[10, 4, 1]} position={[-8, 6, -6]} target={[0, 2, 0]} />
        <Lightformer form="rect" color="#c9a24a" intensity={1.0} scale={[8, 3, 1]} position={[10, 4, -12]} target={[0, 2, 0]} />
        <Lightformer form="circle" color="#dfe7e0" intensity={0.5} scale={6} position={[0, 12, 4]} target={[0, 0, 0]} />
      </Environment>

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.7} luminanceThreshold={0.32} luminanceSmoothing={0.35} mipmapBlur radius={0.42} />
      </EffectComposer>
    </Canvas>
  );
}
