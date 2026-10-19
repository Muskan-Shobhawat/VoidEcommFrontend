import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';
import products from '@/lib/data/products';

// One credit per model; several products can share the same GLB.
const MODEL_CREDITS = Object.values(
  products.reduce((acc, p) => {
    const c = p.model.credit;
    acc[c.url] ??= { ...c, category: p.category };
    return acc;
  }, {}),
);

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t hairline">
      <div className="wrap py-14 md:py-20">
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-5">
            <p className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-none">VOID<span className="text-signal">.</span></p>
            <p className="mt-4 max-w-sm text-mute">Clothing for the next dimension. A demo storefront built with Next.js, MUI, Tailwind, Bootstrap and three.js.</p>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <p className="text-xs uppercase tracking-[0.25em] text-mute mb-4">Shop</p>
            <ul className="list-unstyled flex flex-col gap-2.5 m-0 text-sm">
              <li><Link href="/shop?gender=men" className="hover:text-signal">Men</Link></li>
              <li><Link href="/shop?gender=women" className="hover:text-signal">Women</Link></li>
              <li><Link href="/shop?isNew=true" className="hover:text-signal">New In</Link></li>
              <li><Link href="/shop?tag=limited" className="hover:text-signal">Limited</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <p className="text-xs uppercase tracking-[0.25em] text-mute mb-4">Company</p>
            <ul className="list-unstyled flex flex-col gap-2.5 m-0 text-sm">
              <li><span className="text-mute">About</span></li>
              <li><span className="text-mute">Sustainability</span></li>
              <li><span className="text-mute">Stores</span></li>
              <li><span className="text-mute">Careers</span></li>
            </ul>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <Newsletter compact />
          </div>
        </div>
        <div className="mt-14 border-t hairline pt-6 text-xs text-mute">
          <p className="mb-2 uppercase tracking-[0.25em]">3D model credits</p>
          <ul className="list-unstyled m-0 flex flex-wrap gap-x-6 gap-y-1">
            {MODEL_CREDITS.map((c) => (
              <li key={c.url}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-bone">“{c.title}” by {c.author}</a> · {c.license} · used for all {c.category}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-6 text-xs text-mute">
          <span>© {new Date().getFullYear()} VOID. Demo only — no real orders are processed.</span>
          <span>Made with Next.js · MUI · Tailwind · Bootstrap · three.js</span>
        </div>
      </div>
    </footer>
  );
}
