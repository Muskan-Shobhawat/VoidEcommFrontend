import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import SectionTitle from '@/components/ui/SectionTitle';

export default function FeaturedRail({ products }) {
  return (
    <section className="wrap py-20 md:py-28">
      <SectionTitle eyebrow="Featured" title={<>Drop 01 <span className="text-mute">/ Essentials</span></>} action={<Link href="/shop" className="text-sm uppercase tracking-[0.2em] text-mute hover:text-signal">All products →</Link>} />
      <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
        {products.map((p, i) => (
          <div key={p.id} className="min-w-[72vw] sm:min-w-[320px] md:min-w-0 snap-start">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
