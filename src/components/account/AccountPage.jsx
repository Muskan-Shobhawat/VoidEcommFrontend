'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { api } from '@/lib/api';
import { money } from '@/lib/format';
import { useAuth } from '@/store/auth';
import ProductImage from '@/components/product/ProductImage';
import OrderTracking from './OrderTracking';

const STATUS_STYLE = {
  confirmed: 'bg-lilac text-night',
  shipped: 'bg-ice text-night',
  delivered: 'bg-acid text-night',
  cancelled: 'bg-bone/10 text-mute',
};
const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function AccountPage() {
  const router = useRouter();
  const { token, user, clear } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const signingOut = useRef(false); // sign-out goes home, not to the login redirect below

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;
    if (!user) { if (!signingOut.current) router.replace('/login?next=/account'); return; }
    let live = true;
    api.myOrders({ token, user })
      .then((list) => live && setOrders(list))
      .catch((err) => {
        if (!live) return;
        if (err.status === 401) { clear(); return; } // session expired (e.g. demo server restarted)
        setError(err.message); setOrders([]);
      });
    return () => { live = false; };
  }, [hydrated, user, token, router, clear]);

  const signOut = () => { signingOut.current = true; api.logout(token); clear(); router.push('/'); };

  if (!hydrated || !user) return <div className="wrap pt-28 md:pt-36 pb-10 min-h-[60vh]" />;

  const spent = (orders || []).reduce((s, o) => s + o.summary.total, 0);

  return (
    <div className="wrap pt-28 md:pt-36 pb-10">
      <p className="text-xs uppercase tracking-[0.3em] text-signal mb-3">Account</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-none m-0">Hi, {user.name.split(' ')[0]}<span className="text-signal">.</span></h1>
        <Button variant="outlined" onClick={signOut} sx={{ borderColor: 'rgb(var(--bone-rgb) / 0.25)', color: 'text.primary' }}>Sign out</Button>
      </div>

      <div className="row g-4 g-lg-5 mt-6">
        <div className="col-12 col-lg-4">
          <div className="glass rounded-3xl p-6 md:p-8 lg:sticky lg:top-28">
            <p className="font-display font-bold text-xl">Profile</p>
            <dl className="m-0 mt-4 flex flex-col gap-3 text-sm">
              <div><dt className="text-[10px] uppercase tracking-[0.25em] text-mute">Name</dt><dd className="m-0 mt-1">{user.name}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-[0.25em] text-mute">Email</dt><dd className="m-0 mt-1 break-all">{user.email}</dd></div>
              {user.createdAt && <div><dt className="text-[10px] uppercase tracking-[0.25em] text-mute">Member since</dt><dd className="m-0 mt-1">{fmtDate(user.createdAt)}</dd></div>}
            </dl>
            <div className="mt-6 flex flex-col gap-3">
              {[['Orders', orders ? orders.length : '—'], ['Spent', orders ? money(spent) : '—']].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3 rounded-2xl border hairline px-4 py-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-mute">{label}</span>
                  <span className="font-display font-extrabold text-xl">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <p className="font-display font-bold text-xl mb-4">Order history</p>
          {error && <p className="text-signal text-sm">{error}</p>}
          {!orders ? (
            <div className="flex flex-col gap-3">{[0, 1].map((i) => <Skeleton key={i} variant="rounded" height={88} sx={{ borderRadius: 4 }} />)}</div>
          ) : orders.length === 0 ? (
            <div className="glass rounded-3xl p-8 text-center">
              <p className="font-display font-bold text-2xl m-0">No orders yet.</p>
              <p className="text-mute mt-2">Orders you place while signed in show up here.</p>
              <Button component={Link} href="/shop" variant="contained" sx={{ mt: 2 }}>Start shopping</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o, i) => (
                <Accordion key={o.id} defaultExpanded={i === 0} disableGutters elevation={0} className="glass !rounded-3xl overflow-hidden" sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2.5, md: 3.5 }, py: 1 }}>
                    <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 pr-3">
                      <div className="flex -space-x-3">
                        {o.lines.slice(0, 3).map((l) => (
                          <div key={`${l.productId}${l.size}${l.color}`} className="relative h-12 w-10 overflow-hidden rounded-lg border-2 border-void bg-ink"><ProductImage src={l.image} alt="" sizes="40px" /></div>
                        ))}
                      </div>
                      <div className="min-w-0">
                        <p className="m-0 font-display font-bold">{o.id}</p>
                        <p className="m-0 text-xs text-mute">{fmtDate(o.createdAt)} · {o.summary.itemCount} item{o.summary.itemCount === 1 ? '' : 's'}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${STATUS_STYLE[o.status] || STATUS_STYLE.confirmed}`}>{o.status}</span>
                      <span className="ml-auto font-semibold">{money(o.summary.total)}</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: { xs: 2.5, md: 3.5 }, pb: 3 }}>
                    <OrderTracking order={o} />
                    <div className="flex flex-col gap-3 border-t hairline pt-4">
                      {o.lines.map((l) => (
                        <Link key={`${l.productId}${l.size}${l.color}`} href={`/product/${l.slug}`} className="flex items-center gap-3 hover:text-signal">
                          <div className="relative h-14 w-12 overflow-hidden rounded-lg bg-ink shrink-0"><ProductImage src={l.image} alt={l.name} sizes="60px" /></div>
                          <div className="flex-1 min-w-0 text-sm"><p className="m-0 font-semibold truncate">{l.name}</p><p className="m-0 text-mute text-xs">{l.color} · {l.size} · ×{l.quantity}</p></div>
                          <span className="text-sm">{money(l.lineTotal)}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                      <div className="text-mute">
                        {o.shippingAddress?.line1 && <p className="m-0">Ship to {[o.shippingAddress.line1, o.shippingAddress.city, o.shippingAddress.country].filter(Boolean).join(', ')}</p>}
                        <p className="m-0">{o.status === 'delivered' ? 'Delivered' : 'Estimated delivery'} {fmtDate(o.estimatedDelivery)}</p>
                      </div>
                      <table className="table table-borderless mb-0 text-sm">
                        <tbody>
                          <tr><td className="text-mute p-0">Subtotal</td><td className="text-end p-0">{money(o.summary.subtotal)}</td></tr>
                          <tr><td className="text-mute p-0">Shipping</td><td className="text-end p-0">{o.summary.shipping === 0 ? 'Free' : money(o.summary.shipping)}</td></tr>
                          <tr><td className="text-mute p-0">Tax</td><td className="text-end p-0">{money(o.summary.tax)}</td></tr>
                          <tr><td className="p-0 pt-1 font-semibold">Total</td><td className="text-end p-0 pt-1 font-semibold">{money(o.summary.total)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
