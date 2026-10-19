'use client';
import { useEffect, useRef } from 'react';

/** Soft radial glow that trails the pointer (desktop only). */
export default function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 h-[500px] w-[500px] rounded-full opacity-40 hidden md:block"
      style={{ background: 'radial-gradient(circle, rgba(255,90,31,0.22) 0%, rgba(201,182,255,0.10) 35%, transparent 70%)', filter: 'blur(10px)' }}
    />
  );
}
