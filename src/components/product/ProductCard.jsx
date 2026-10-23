'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ProductImage from './ProductImage';
import { money } from '@/lib/format';

export default function ProductCard({ product, priority = false }) {
  const ref = useRef(null);
  const [colorIdx, setColorIdx] = useState(0);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });

  // Tilt follows a mouse only; on touch it would fight the swipe/scroll gesture.
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };
  const color = product.colors[colorIdx];
  const off = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const [img1, img2] = product.images;

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink shine">
          <ProductImage src={img1} alt={product.name} priority={priority} className="transition-transform duration-700 group-hover:scale-[1.06]" />
          {img2 && (
            <ProductImage src={img2} alt="" className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            {product.isNew && <span className="rounded-full bg-bone px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-void">New</span>}
            {off > 0 && <span className="rounded-full bg-signal px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-night">-{off}%</span>}
            {product.tags.includes('limited') && <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">Limited</span>}
            {product.model && <span className="rounded-full bg-lilac px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-night">3D</span>}
          </div>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block w-full rounded-full bg-black/60 py-2.5 text-white text-center text-xs font-semibold uppercase tracking-widest">{product.model ? 'View in 3D ↗' : 'Quick view ↗'}</span>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-mute">{product.gender} · {product.category}</p>
          <Link href={`/product/${product.slug}`} className="mt-1 block font-display font-bold text-base md:text-lg leading-tight hover:text-signal transition-colors">{product.name}</Link>
        </div>
        <div className="text-right shrink-0">
          <p className="font-semibold">{money(product.price)}</p>
          {product.compareAtPrice && <p className="text-xs text-mute line-through">{money(product.compareAtPrice)}</p>}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {product.colors.map((c, i) => (
          <button
            key={c.name}
            type="button"
            aria-label={c.name}
            title={c.name}
            onMouseEnter={() => setColorIdx(i)}
            onClick={() => setColorIdx(i)}
            className={`h-4 w-4 rounded-full border transition-transform ${i === colorIdx ? 'scale-125 border-bone' : 'border-bone/20 hover:scale-110'}`}
            style={{ background: c.hex }}
          />
        ))}
        <span className="ml-2 text-[11px] text-mute">{color.name}</span>
        <span className="ml-auto text-xs text-mute">★ {product.rating}</span>
      </div>
    </motion.article>
  );
}
