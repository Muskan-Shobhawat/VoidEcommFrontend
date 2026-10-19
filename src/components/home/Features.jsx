import Reveal from '@/components/ui/Reveal';

const ITEMS = [
  { n: '01', t: 'Immersive 3D lookbook', d: 'Browse the drop in a living 3D space — floating photography, depth and light that react to your cursor.' },
  { n: '02', t: 'Light-reactive finishes', d: 'Iridescent shells, holographic weaves and liquid satins that change with your angle.' },
  { n: '03', t: 'Responsible build', d: 'Recycled fills, organic cotton and Portuguese manufacturing across the core range.' },
  { n: '04', t: 'Fit, resolved', d: 'Oversized, cropped and tailored blocks tuned over three seasons of fit sessions.' },
];

export default function Features() {
  return (
    <section className="border-y hairline bg-ink/40">
      <div className="wrap py-16 md:py-24">
        <div className="row g-4 g-lg-5">
          {ITEMS.map((it, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={it.n}>
              <Reveal delay={i * 0.08}>
                <p className="font-display text-signal text-sm">{it.n}</p>
                <h3 className="font-display font-bold text-2xl mt-2 tracking-tight">{it.t}</h3>
                <p className="text-mute mt-2 text-sm leading-relaxed">{it.d}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
