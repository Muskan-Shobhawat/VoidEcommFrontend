'use client';
import { Environment, Lightformer } from '@react-three/drei';

/** Studio lighting built from light-formers (no external HDR download needed). */
export default function Lights({ accent = '#ff5a1f', cool = '#c9b6ff' }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, -2, -4]} intensity={6} color={accent} />
      <pointLight position={[5, 3, -6]} intensity={5} color={cool} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[10, 4, 1]} />
        <Lightformer form="ring" intensity={2} color={accent} position={[-6, 2, 2]} scale={[4, 4, 1]} />
        <Lightformer form="ring" intensity={2} color={cool} position={[6, -1, 2]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, -4, 4]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
      </Environment>
    </>
  );
}
