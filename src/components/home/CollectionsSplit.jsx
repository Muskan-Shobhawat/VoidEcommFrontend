import Link from 'next/link';
import ProductImage from '@/components/product/ProductImage';
import Reveal from '@/components/ui/Reveal';

/* Featured stills fanned across the bottom of the panel: centre in front, sides tilted behind; hover lifts them. */
const FAN = [
  'left-[4%] -rotate-[9deg] group-hover:-translate-y-4 group-hover:-rotate-[13deg]',
  'left-1/2 -translate-x-1/2 z-10 group-hover:-translate-y-6',
  'right-[4%] rotate-[9deg] group-hover:-translate-y-4 group-hover:rotate-[13deg]',
];

export default function CollectionsSplit({ collections }) {
  return (
    <section className="wrap py-10 md:py-16">
      <div className="row g-4">
        {collections.map((c, i) => (
          <div className="col-12 col-md-6" key={c.slug}>
            <Reveal delay={i * 0.1}>
              {/* flat studio panel: theme surface, faint grid, outlined initial; the collection accent only marks details */}
              <Link
                href={`/shop?gender=${c.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border hairline bg-ink text-bone min-h-[560px] lg:min-h-[620px] transition-colors duration-500"
                style={{ containerType: 'inline-size', '--accent': c.palette[1] }}
              >
                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{ backgroundImage: 'linear-gradient(rgb(var(--bone-rgb)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--bone-rgb)) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-[4%] -top-[6%] font-display font-extrabold leading-none text-transparent select-none text-[min(70cqw,30rem)] transition-transform duration-700 group-hover:-translate-x-3"
                  style={{ WebkitTextStroke: '1.5px rgb(var(--bone-rgb) / 0.12)' }}
                >
                  {c.name[0]}
                </span>
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.15] transition-transform duration-700 group-hover:scale-x-100" style={{ background: 'var(--accent)' }} />
                <div className="relative p-8 md:p-10">
                  <p className="m-0 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
                    <span className="h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
                    {c.count} pieces
                  </p>
                  <h3 className="font-display font-extrabold text-[min(12.5cqw,6rem)] tracking-tight leading-none mt-2 mb-0">{c.name}</h3>
                  <p className="mt-3 mb-0 text-lg text-mute max-w-xs">{c.tagline}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em]">Explore <span className="transition-transform group-hover:translate-x-2" style={{ color: 'var(--accent)' }}>→</span></span>
                </div>
                <div className="relative mt-auto h-[clamp(240px,62cqw,340px)]">
                  {c.featured.slice(0, 3).map((p, j) => (
                    <div
                      key={p.id}
                      className={`absolute bottom-[-8%] w-[40%] max-w-[230px] aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl transition-transform duration-700 ${FAN[j]}`}
                    >
                      <ProductImage src={p.images[0]} alt={p.name} sizes="(max-width: 768px) 40vw, 230px" />
                    </div>
                  ))}
                </div>
              </Link>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
