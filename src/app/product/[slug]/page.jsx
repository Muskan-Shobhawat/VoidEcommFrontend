import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';
import ProductCard from '@/components/product/ProductCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const product = await api.getProduct(params.slug);
  return { title: product ? `${product.name} — VOID.` : 'Not found — VOID.' };
}

export default async function ProductPage({ params }) {
  const product = await api.getProduct(params.slug);
  if (!product) notFound();
  const related = await api.related(params.slug);

  return (
    <>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="wrap py-16 md:py-24">
          <SectionTitle eyebrow="Complete the look" title="You may also like" />
          <div className="row g-4 g-md-5">
            {related.map((p) => (
              <div className="col-6 col-md-3" key={p.id}><ProductCard product={p} /></div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
