'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { HeroScene } from '@/components/three/HeroCanvas';

export default function Hero({ product }) {
  const router = useRouter();

  return (
    <section className="relative min-h-[100svh] overflow-hidden grain">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(900px 500px at 70% 30%, rgba(201,182,255,0.18), transparent 60%), radial-gradient(700px 500px at 20% 80%, rgba(255,90,31,0.16), transparent 60%)' }} />
      <div className="absolute inset-0 -z-10 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgb(var(--bone-rgb) / .6) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--bone-rgb) / .6) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />

      {/* 3D lookbook: top band on phones/tablets, right two-thirds on desktop */}
      <div className="absolute inset-x-0 top-0 h-[62svh] lg:inset-0 lg:left-[30%] lg:h-auto">
        <HeroScene product={product} onSelect={(p) => router.push(`/product/${p.slug}`)} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void lg:hidden" />
      </div>

      <div className="wrap relative flex min-h-[100svh] flex-col justify-end pb-28 pt-[48svh] lg:justify-center lg:pb-24 lg:pt-32 pointer-events-none">
        <div className="pointer-events-auto lg:max-w-[46%]">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs uppercase tracking-[0.35em] text-signal mb-5">
            FW26 · Collection 01
          </motion.p>
          <h1 className="font-display font-extrabold leading-[0.88] tracking-tight text-[15vw] sm:text-[12vw] lg:text-[8.5vw]">
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="block">WEAR</motion.span>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="block text-outline">THE</motion.span>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="block">VOID<span className="text-signal">.</span></motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 max-w-md text-mute md:text-lg">
            Technical fabrics, sculptural silhouettes and finishes that shift with light. Browse the drop in a living 3D lookbook.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-8 flex flex-wrap gap-3">
            <Button component={Link} href="/shop?gender=men" variant="contained" size="large" endIcon={<ArrowOutwardRoundedIcon />}>Shop Men</Button>
            <Button component={Link} href="/shop?gender=women" variant="outlined" size="large" sx={{ borderColor: 'rgb(var(--bone-rgb) / 0.25)', color: 'text.primary' }}>Shop Women</Button>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 text-[10px] uppercase tracking-[0.3em] text-mute">
            Move your cursor · Tap the tee to open it
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-mute">
        <span>Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-bone to-transparent animate-pulseGlow" />
      </div>
    </section>
  );
}
