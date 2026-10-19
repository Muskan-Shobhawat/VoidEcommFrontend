'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';
import { money } from '@/lib/format';
import ProductImage from '@/components/product/ProductImage';

const EMPTY = { name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'United States' };

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { token, user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [summary, setSummary] = useState(null);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  // Signed in: start with the account's name and email.
  useEffect(() => {
    if (hydrated && user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [hydrated, user]);
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    api.priceCart(items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color }))).then((r) => setSummary(r.summary)).catch(() => {});
  }, [items, hydrated]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading'); setError('');
    try {
      const o = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country },
      }, { token, user });
      setOrder(o);
      clear();
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message); setStatus('idle');
    }
  };

  if (order) {
    return (
      <div className="wrap pt-28 md:pt-36 pb-10">
        <div className="mx-auto max-w-2xl text-center glass rounded-3xl p-8 md:p-14 grain relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-acid/20 blur-3xl" />
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: '#c6ff3d' }} />
          <p className="text-xs uppercase tracking-[0.3em] text-mute mt-4">Order confirmed</p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight mt-2">{order.id}</h1>
          <p className="text-mute mt-4">Thanks{order.customer?.name ? `, ${order.customer.name.split(' ')[0]}` : ''}. A confirmation was “sent” to {order.customer?.email}. Estimated delivery {order.estimatedDelivery}.</p>
          {order.offline && <p className="text-xs text-signal mt-2">Backend offline: this order was priced locally{user ? ' and saved in this browser' : ' and not stored'}.</p>}
          <div className="mt-8 flex flex-col gap-3 text-left">
            {order.lines.map((l) => (
              <div key={`${l.productId}${l.size}${l.color}`} className="flex items-center gap-3">
                <div className="relative h-14 w-12 overflow-hidden rounded-lg bg-ink"><ProductImage src={l.image} alt={l.name} sizes="60px" /></div>
                <div className="flex-1 text-sm"><p className="m-0 font-semibold">{l.name}</p><p className="m-0 text-mute text-xs">{l.color} · {l.size} · ×{l.quantity}</p></div>
                <span className="text-sm">{money(l.lineTotal)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t hairline pt-3 font-semibold"><span>Total</span><span>{money(order.summary.total)}</span></div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button component={Link} href="/shop" variant="contained">Keep exploring</Button>
            {user ? (
              <Button component={Link} href="/account" variant="outlined" sx={{ borderColor: 'rgb(var(--bone-rgb) / 0.25)', color: 'text.primary' }}>View order history</Button>
            ) : (
              <Button component={Link} href="/signup" variant="outlined" sx={{ borderColor: 'rgb(var(--bone-rgb) / 0.25)', color: 'text.primary' }}>Create an account</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap pt-28 md:pt-36 pb-10">
      <p className="text-xs uppercase tracking-[0.3em] text-signal mb-3">Checkout</p>
      <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-none">Almost there<span className="text-signal">.</span></h1>
      <p className="text-mute mt-3">
        Demo checkout — no payment is collected.{' '}
        {hydrated && (user
          ? <>Signed in as <span className="text-bone">{user.email}</span>; this order will appear in your <Link href="/account" className="underline underline-offset-4 text-bone">order history</Link>.</>
          : <><Link href="/login?next=/checkout" className="underline underline-offset-4 text-bone">Sign in</Link> to save it to your order history.</>)}
      </p>

      {hydrated && items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display font-bold text-2xl">Your bag is empty.</p>
          <Button component={Link} href="/shop" variant="contained" sx={{ mt: 2 }}>Go shopping</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="row g-4 g-lg-5 mt-6">
          <div className="col-12 col-lg-7">
            <div className="glass rounded-3xl p-6 md:p-8">
              <p className="font-display font-bold text-xl mb-4">Contact</p>
              <div className="row g-3">
                <div className="col-12 col-md-6"><label className="form-label">Full name</label><input required className="form-control" value={form.name} onChange={set('name')} placeholder="Ada Lovelace" /></div>
                <div className="col-12 col-md-6"><label className="form-label">Email</label><input required type="email" className="form-control" value={form.email} onChange={set('email')} placeholder="ada@orbit.io" /></div>
                <div className="col-12 col-md-6"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={set('phone')} placeholder="+1 555 0100" /></div>
              </div>
              <p className="font-display font-bold text-xl mt-8 mb-4">Shipping address</p>
              <div className="row g-3">
                <div className="col-12"><label className="form-label">Address</label><input required className="form-control" value={form.line1} onChange={set('line1')} placeholder="1 Infinite Loop" /></div>
                <div className="col-12"><label className="form-label">Apartment, suite (optional)</label><input className="form-control" value={form.line2} onChange={set('line2')} /></div>
                <div className="col-12 col-md-5"><label className="form-label">City</label><input required className="form-control" value={form.city} onChange={set('city')} /></div>
                <div className="col-6 col-md-3"><label className="form-label">State</label><input className="form-control" value={form.state} onChange={set('state')} /></div>
                <div className="col-6 col-md-4"><label className="form-label">Postal code</label><input required className="form-control" value={form.postalCode} onChange={set('postalCode')} /></div>
                <div className="col-12"><label className="form-label">Country</label>
                  <select className="form-select" value={form.country} onChange={set('country')}>
                    {['United States', 'United Kingdom', 'India', 'Japan', 'Germany', 'Australia', 'Canada'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <p className="font-display font-bold text-xl mt-8 mb-4">Payment</p>
              <div className="rounded-2xl border hairline p-4 text-sm text-mute">Demo mode: payment is simulated. Click “Place order” to generate a confirmation.</div>
              {error && <p className="text-signal text-sm mt-4 m-0">{error}</p>}
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="glass rounded-3xl p-6 lg:sticky lg:top-28">
              <p className="font-display font-bold text-xl">Order summary</p>
              <div className="mt-4 flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                {items.map((l) => (
                  <div key={`${l.productId}${l.size}${l.color}`} className="flex items-center gap-3">
                    <div className="relative h-14 w-12 overflow-hidden rounded-lg shrink-0 bg-ink"><ProductImage src={l.image} alt={l.name} sizes="60px" /></div>
                    <div className="flex-1 text-sm min-w-0"><p className="m-0 font-semibold truncate">{l.name}</p><p className="m-0 text-mute text-xs">{l.color} · {l.size} · ×{l.quantity}</p></div>
                    <span className="text-sm">{money(l.price * l.quantity)}</span>
                  </div>
                ))}
              </div>
              <table className="table table-borderless mb-0 mt-4 text-sm">
                <tbody>
                  <tr><td className="text-mute ps-0">Subtotal</td><td className="text-end pe-0">{summary ? money(summary.subtotal) : '—'}</td></tr>
                  <tr><td className="text-mute ps-0">Shipping</td><td className="text-end pe-0">{summary ? (summary.shipping === 0 ? <span className="text-acid">Free</span> : money(summary.shipping)) : '—'}</td></tr>
                  <tr><td className="text-mute ps-0">Tax</td><td className="text-end pe-0">{summary ? money(summary.tax) : '—'}</td></tr>
                  <tr className="border-top"><td className="ps-0 pt-3 font-semibold">Total</td><td className="text-end pe-0 pt-3 font-display font-extrabold text-xl">{summary ? money(summary.total) : '—'}</td></tr>
                </tbody>
              </table>
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3 }} disabled={status === 'loading' || !items.length}>
                {status === 'loading' ? 'Placing order…' : 'Place order'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
