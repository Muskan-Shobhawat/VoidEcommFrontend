import Hero from '@/components/home/Hero';
import Marquee from '@/components/ui/Marquee';
import FeaturedRail from '@/components/home/FeaturedRail';
import CollectionsSplit from '@/components/home/CollectionsSplit';
import Lookbook from '@/components/home/Lookbook';
import Features from '@/components/home/Features';
import Newsletter from '@/components/home/Newsletter';
import Reveal from '@/components/ui/Reveal';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

const HERO_SLUG = 'orbit-oversized-tee';

export default async function HomePage() {
  const [featured, collections, lookbook, heroProduct] = await Promise.all([
    api.listProducts({ featured: 'true', limit: 8 }),
    api.collections(),
    api.lookbook(),
    api.getProduct(HERO_SLUG),
  ]);

  return (
    <>
      <Hero product={heroProduct} />
      <Marquee items={['Free shipping over $150', 'FW26 drop live', 'Men', 'Women', 'Real-time 3D', 'Limited editions', 'Ships worldwide']} />
      <FeaturedRail products={featured.data} />
      <CollectionsSplit collections={collections} />
      <Features />
      <Lookbook tiles={lookbook} />
      <section className="wrap pb-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl glass p-8 md:p-14 grain">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/30 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-lilac/30 blur-3xl" />
            <div className="relative max-w-xl"><Newsletter /></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
