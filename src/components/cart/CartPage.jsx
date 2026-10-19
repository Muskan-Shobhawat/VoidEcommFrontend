'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useCart } from '@/store/cart';
import { api } from '@/lib/api';
import { money } from '@/lib/format';
import CartLine from './CartLine';

export default function CartPage() {
  const { items, clear } = useCart();
  const [summary, setSummary] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) { setSummary(null); return; }
    let live = true;
    api.priceCart(items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })))
      .then((r) => live && setSummary(r.summary))
      .catch(() => live && setSummary(null));
    return () => { live = false; };
  }, [items, hydrated]);

  return (
    <div className="wrap pt-28 md:pt-36 pb-10">
      <p className="text-xs uppercase tracking-[0.3em] text-signal mb-3">Bag</p>
      <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-none">Your bag<span className="text-signal">.</span></h1>

      {hydrated && items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display font-bold text-3xl">It&apos;s a void in here.</p>
          <p className="text-mute">Add something with mass.</p>
          <Button component={Link} href="/shop" variant="contained" sx={{ mt: 2 }}>Shop the collection</Button>
        </div>
      ) : (
        <div className="row g-4 g-lg-5 mt-6">
          <div className="col-12 col-lg-8">
            <div className="flex flex-col divide-y divide-white/10">
              {items.map((l) => <div key={`${l.productId}${l.size}${l.color}`} className="py-5"><CartLine line={l} /></div>)}
            </div>
            {items.length > 0 && <Button variant="text" onClick={clear} sx={{ mt: 2, color: 'text.secondary' }}>Clear bag</Button>}
          </div>
          <div className="col-12 col-lg-4">
            <div className="glass rounded-3xl p-6 lg:sticky lg:top-28">
              <p className="font-display font-bold text-xl">Summary</p>
              <table className="table table-borderless mb-0 mt-3 text-sm">
                <tbody>
                  <tr><td className="text-mute ps-0">Subtotal</td><td className="text-end pe-0">{summary ? money(summary.subtotal) : <Skeleton width={60} sx={{ ml: 'auto' }} />}</td></tr>
                  <tr><td className="text-mute ps-0">Shipping</td><td className="text-end pe-0">{summary ? (summary.shipping === 0 ? <span className="text-acid">Free</span> : money(summary.shipping)) : <Skeleton width={60} sx={{ ml: 'auto' }} />}</td></tr>
                  <tr><td className="text-mute ps-0">Tax (est.)</td><td className="text-end pe-0">{summary ? money(summary.tax) : <Skeleton width={60} sx={{ ml: 'auto' }} />}</td></tr>
                  <tr className="border-top"><td className="ps-0 pt-3 font-semibold">Total</td><td className="text-end pe-0 pt-3 font-display font-extrabold text-xl">{summary ? money(summary.total) : <Skeleton width={80} sx={{ ml: 'auto' }} />}</td></tr>
                </tbody>
              </table>
              <Button component={Link} href="/checkout" variant="contained" size="large" fullWidth sx={{ mt: 3 }} disabled={!items.length}>Proceed to checkout</Button>
              <Button component={Link} href="/shop" variant="text" fullWidth sx={{ mt: 1, color: 'text.secondary' }}>Continue shopping</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
