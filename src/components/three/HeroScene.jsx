'use client';
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows, MeshDistortMaterial, Torus, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import Lights from './Lights';
import { Garment } from './ModelViewer';

/* Pointer parallax for the whole scene; scales down on narrow viewports. */
function Rig({ children }) {
  const ref = useRef();
  const { viewport } = useThree();
  const scale = Math.min(1, Math.max(0.5, viewport.width / 10.5));
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, -state.pointer.y * 0.18, 3, dt);
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, state.pointer.x * 0.35, 3, dt);
  });
  return <group ref={ref} scale={scale}>{children}</group>;
}

function Orbits() {
  const a = useRef(), b = useRef();
  useFrame((_, dt) => {
    if (a.current) { a.current.rotation.z += dt * 0.22; a.current.rotation.x += dt * 0.04; }
    if (b.current) { b.current.rotation.z -= dt * 0.16; b.current.rotation.y += dt * 0.07; }
  });
  return (
    <>
      <Torus ref={a} args={[3.4, 0.016, 12, 240]} rotation={[1.2, 0.3, 0]}>
        <meshStandardMaterial color="#f2efe9" emissive="#ff5a1f" emissiveIntensity={0.6} roughness={0.2} metalness={0.9} />
      </Torus>
      <Torus ref={b} args={[4.1, 0.011, 12, 240]} rotation={[0.6, -0.8, 0]}>
        <meshStandardMaterial color="#c9b6ff" emissive="#c9b6ff" emissiveIntensity={0.5} roughness={0.2} metalness={0.9} />
      </Torus>
    </>
  );
}

function Blob({ position, color, speed = 2, scale = 0.4 }) {
  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial color={color} distort={0.45} speed={2.2} roughness={0.15} metalness={0.3} clearcoat={1} />
      </mesh>
    </Float>
  );
}

/* The hero garment: a live GLB on a slow turntable; hover lifts it, click opens the product. */
function HeroGarment({ product, onSelect }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.35;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, hovered ? 1.3 : 1.18, 6, dt));
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group
        ref={ref}
        scale={1.18}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); onSelect?.(product); }}
      >
        <Garment src={product.model.src} tint={product.model.tint ? product.colors[0].hex : undefined} shadow={false} />
      </group>
    </Float>
  );
}

export default function HeroScene({ product, onSelect }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <Lights />
        <Rig>
          {product?.model && <HeroGarment product={product} onSelect={onSelect} />}
          <Orbits />
          <Blob position={[-3.9, 2.2, -1.5]} color="#ff5a1f" />
          <Blob position={[4, -2.2, -2]} color="#c9b6ff" speed={1.5} scale={0.55} />
          <Blob position={[0.6, 3, -3]} color="#9fe8ff" speed={2.5} scale={0.28} />
          <Sparkles count={70} scale={[13, 8, 6]} size={2.2} speed={0.4} opacity={0.5} color="#c9b6ff" />
        </Rig>
        <ContactShadows position={[0, -3, 0]} opacity={0.45} scale={16} blur={2.8} far={4} color="#000" />
        <AdaptiveDpr pixelated />
      </Suspense>
    </Canvas>
  );
}
