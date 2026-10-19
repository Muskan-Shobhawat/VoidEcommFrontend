'use client';
import { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF, AdaptiveDpr, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import Lights from './Lights';

const FIT = 3; // largest dimension of every model after normalising, in scene units

/**
 * Loads a GLB garment, centres it, scales it to a common size and optionally
 * tints its fabric towards the selected swatch colour.
 */
export function Garment({ src, tint, shadow = true }) {
  // (path, useDraco=false, useMeshopt=true): our models are meshopt-compressed, no Draco CDN needed
  const { scene } = useGLTF(src, false, true);

  const { object, scale, offset, materials, floor } = useMemo(() => {
    const object = scene.clone(true);
    const materials = [];
    object.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      const list = Array.isArray(o.material) ? o.material : [o.material];
      const cloned = list.map((m) => {
        const c = m.clone();
        c.side = THREE.DoubleSide; // single-layer cloth panels must render from both sides
        // FBX->glTF conversions often leave the glTF default (metalness 1, roughness 1) on plain
        // fabric panels, which renders near-black. Treat those as non-metallic cloth.
        if (!c.metalnessMap && c.metalness >= 0.99 && c.roughness >= 0.99) c.metalness = 0;
        c.userData.baseColor = c.color ? c.color.clone() : null;
        materials.push(c);
        return c;
      });
      o.material = Array.isArray(o.material) ? cloned : cloned[0];
    });
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = FIT / Math.max(size.x, size.y, size.z);
    return { object, scale, offset: center.multiplyScalar(-1), materials, floor: -(size.y * scale) / 2 - 0.02 };
  }, [scene]);

  const target = useMemo(() => (tint ? new THREE.Color(tint) : null), [tint]);

  useFrame((_, dt) => {
    for (const m of materials) {
      if (!m.color || !m.userData.baseColor) continue;
      const goal = target || m.userData.baseColor;
      m.color.lerp(goal, Math.min(1, dt * 6));
    }
  });

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  return (
    <>
      <group scale={scale}>
        <primitive object={object} position={offset} />
      </group>
      {shadow && <ContactShadows position={[0, floor, 0]} opacity={0.5} scale={8} blur={2.6} far={3} />}
    </>
  );
}

/* Let vertical swipes scroll the page on touch devices; horizontal drags still rotate. */
function TouchScrollFix() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const id = setTimeout(() => { gl.domElement.style.touchAction = 'pan-y'; }, 0);
    return () => clearTimeout(id);
  }, [gl]);
  return null;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-night/70 whitespace-nowrap">
        <div className="h-14 w-14 rounded-full border border-night/10 border-t-signal animate-spinSlow" style={{ animationDuration: '1.2s' }} />
        Loading 3D · {Math.round(progress)}%
      </div>
    </Html>
  );
}

export default function ModelViewer({ src, tint, palette = ['#1b1b24', '#ff5a1f'] }) {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 0.2, 7.4], fov: 35 }} gl={{ antialias: true, alpha: true }} style={{ position: 'absolute', inset: 0 }}>
      <Lights accent={palette[1]} cool={palette[0]} />
      <Suspense fallback={<Loader />}>
        <Garment src={src} tint={tint} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={4.2}
        maxDistance={9}
        autoRotate
        autoRotateSpeed={1.1}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
      />
      <TouchScrollFix />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

export const preloadModel = (src) => useGLTF.preload(src, false, true);
