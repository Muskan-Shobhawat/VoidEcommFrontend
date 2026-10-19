'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ProductImage from './ProductImage';
import { SceneLoader } from '@/components/three/HeroCanvas';
import { STAGE_BACKDROP } from '@/lib/stage';

const ModelViewer = dynamic(() => import('@/components/three/ModelViewer'), { ssr: false, loading: () => <SceneLoader /> });

/**
 * Products with a `model` show the live GLB viewer as their only view.
 * Everything else gets a photo gallery with a 3D tilt + cursor-led zoom and a thumbnail strip.
 */
export default function ProductGallery({ images, name, palette, badges, model, tint }) {
  if (model) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink">
        <div className="absolute inset-0" style={{ background: STAGE_BACKDROP }} />
        <ModelViewer src={model.src} tint={model.tint ? tint : undefined} palette={palette} />
        <div className="absolute left-4 top-4 flex gap-2">{badges}</div>
        <p className={`absolute bottom-4 left-1/2 -translate-x-1/2 m-0 text-[10px] uppercase tracking-[0.3em] whitespace-nowrap pointer-events-none text-night/70`}>Drag to rotate<span className="hidden sm:inline"> · Scroll or pinch to zoom</span></p>
        {!model.tint && model.colorway && (
          <span className="absolute left-4 bottom-4 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-bone/80 pointer-events-none hidden sm:inline">Shown in {model.colorway}</span>
        )}
        <a href={model.credit.url} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-4 rounded-full glass px-3 py-1 text-[10px] text-bone/70 hover:text-bone">
          Model by {model.credit.author} · {model.credit.license}
        </a>
      </div>
    );
  }
  return <PhotoGallery images={images} name={name} palette={palette} badges={badges} />;
}

function PhotoGallery({ images, name, palette, badges }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 120, damping: 20 });
  const ox = useTransform(mx, (v) => v * 100);
  const oy = useTransform(my, (v) => v * 100);
  const origin = useMotionTemplate`${ox}% ${oy}%`;
  const zoomScale = useSpring(1, { stiffness: 120, damping: 20 });
  zoomScale.set(zoom ? 1.35 : 1);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { mx.set(0.5); my.set(0.5); setZoom(false); };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      <div className="flex md:flex-col gap-3 md:w-20 shrink-0 overflow-x-auto no-scrollbar">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative h-20 w-16 md:h-24 md:w-20 shrink-0 overflow-hidden rounded-xl border transition-all ${i === active ? 'border-signal' : 'border-bone/10 opacity-60 hover:opacity-100'}`}
          >
            <ProductImage src={src} alt="" sizes="80px" />
          </button>
        ))}
      </div>

      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setZoom(true)}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        className="relative flex-1 aspect-[4/5] overflow-hidden rounded-3xl bg-ink"
      >
        <div className="absolute inset-0 -z-0" style={{ background: `radial-gradient(circle at 30% 20%, ${palette[1]}55, transparent 55%)` }} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={images[active]}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <motion.div className="absolute inset-0" style={{ transformOrigin: origin, scale: zoomScale }}>
              <ProductImage src={images[active]} alt={name} sizes="(max-width: 992px) 100vw, 55vw" priority />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute left-4 top-4 flex gap-2">{badges}</div>
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 m-0 text-[10px] uppercase tracking-[0.3em] text-bone/70 whitespace-nowrap hidden md:block">Hover to zoom</p>
      </motion.div>
    </div>
  );
}
