import Link from 'next/link';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import ProductImage from '@/components/product/ProductImage';
import { STAGE_BACKDROP } from '@/lib/stage';

/* Three stills fanned on a light stage: centre card in front, side cards tilted behind; hover spreads them. */
const FAN = [
  'left-[6%] -rotate-[8deg] group-hover:-translate-x-3 group-hover:-rotate-[12deg]',
  'left-1/2 -translate-x-1/2 z-10 group-hover:-translate-y-2',
  'right-[6%] rotate-[8deg] group-hover:translate-x-3 group-hover:rotate-[12deg]',
];

export default function Lookbook({ tiles }) {
  return (
    <section className="wrap py-20 md:py-28">
      <SectionTitle eyebrow="Lookbook" title="Stories in motion." />
      <div className="row g-4">
        {tiles.map((t, i) => (
          <div className="col-12 col-md-4" key={t.id}>
            <Reveal delay={i * 0.08}>
              <Link href={t.link} className="group block overflow-hidden rounded-3xl bg-ink text-snow">
                <div className="relative aspect-[4/3] overflow-hidden" style={{ background: STAGE_BACKDROP }}>
                  {(t.images || []).slice(0, 3).map((src, j) => (
                    <div
                      key={src}
                      className={`absolute top-[12%] w-[40%] aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl transition-transform duration-700 ${FAN[j]}`}
                    >
                      <ProductImage src={src} alt="" sizes="(max-width: 768px) 40vw, 14vw" />
                    </div>
                  ))}
                </div>
                <div className="relative p-6 md:p-7" style={{ background: `linear-gradient(140deg, ${t.palette[0]}, ${t.palette[1]}40)`, containerType: 'inline-size' }}>
                  <p className="m-0 text-xs uppercase tracking-[0.3em] text-snow/70">{t.subtitle}</p>
                  {/* sized to the tile width so long titles stay on one line */}
                  <h3 className="font-display font-extrabold text-[min(7cqw,2.25rem)] whitespace-nowrap tracking-tight leading-none mt-2 mb-0">{t.title}</h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-snow/80">
                    Explore <span className="transition-transform group-hover:translate-x-2">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
