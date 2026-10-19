import { Suspense } from 'react';
import ShopClient from '@/components/shop/ShopClient';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Shop — VOID.' };

export default async function ShopPage({ searchParams }) {
  const params = {
    gender: searchParams.gender || 'all',
    category: searchParams.category || 'all',
    sort: searchParams.sort || 'featured',
    search: searchParams.search || '',
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    isNew: searchParams.isNew,
    tag: searchParams.tag,
    limit: 48,
  };
  const [result, categories] = await Promise.all([api.listProducts(params), api.categories(params.gender)]);

  return (
    <Suspense>
      <ShopClient products={result.data} total={result.meta.total} categories={categories} params={params} />
    </Suspense>
  );
}
