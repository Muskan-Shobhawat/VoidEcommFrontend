'use client';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ProductGallery from './ProductGallery';
import { useCart } from '@/store/cart';
import { money, cx } from '@/lib/format';

export default function ProductDetail({ product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);
  const add = useCart((s) => s.add);

  const off = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const addToBag = () => {
    if (!size) { setToast({ severity: 'warning', msg: 'Pick a size first.' }); return; }
    add(product, { size, color, quantity: qty });
    setToast({ severity: 'success', msg: `${product.name} added to your bag.` });
  };

  return (
    <section className="wrap pt-24 md:pt-32 pb-8">
      <nav className="text-xs uppercase tracking-[0.2em] text-mute mb-6 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-bone">Home</Link><span>/</span>
        <Link href={`/shop?gender=${product.gender}`} className="hover:text-bone">{product.gender}</Link><span>/</span>
        <Link href={`/shop?gender=${product.gender}&category=${product.category}`} className="hover:text-bone">{product.category}</Link><span>/</span>
        <span className="text-bone">{product.name}</span>
      </nav>

      <div className="row g-4 g-lg-6">
        {/* Gallery */}
        <div className="col-12 col-lg-7">
          <div className="lg:sticky lg:top-28">
            <ProductGallery
              images={product.images}
              name={product.name}
              palette={product.palette}
              model={product.model}
              tint={color.hex}
              badges={
                <>
                  {product.isNew && <span className="rounded-full bg-bone px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-void">New</span>}
                  {off > 0 && <span className="rounded-full bg-signal px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-night">-{off}%</span>}
                </>
              }
            />
          </div>
        </div>

        {/* Info */}
        <div className="col-12 col-lg-5">
          <p className="text-xs uppercase tracking-[0.3em] text-signal">{product.gender} · {product.category}</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight leading-[0.95] mt-3">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{money(product.price)}</span>
            {product.compareAtPrice && <span className="text-mute line-through">{money(product.compareAtPrice)}</span>}
            <span className="ml-auto text-sm text-mute">★ {product.rating} · {product.reviews} reviews</span>
          </div>
          <p className="mt-5 text-mute leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <div className="flex justify-between text-xs uppercase tracking-[0.25em] text-mute mb-3"><span>Colour</span><span className="text-bone">{color.name}</span></div>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <Tooltip key={c.name} title={c.name}>
                  <button onClick={() => setColor(c)} aria-label={c.name} className={cx('h-9 w-9 rounded-full border-2 transition-all', color.name === c.name ? 'border-signal scale-110' : 'border-bone/15 hover:border-bone/50')} style={{ background: c.hex }} />
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs uppercase tracking-[0.25em] text-mute mb-3"><span>Size</span><button className="text-bone underline-offset-4 hover:underline bg-transparent border-0 p-0 text-xs uppercase tracking-[0.25em]">Size guide</button></div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={cx('min-w-[52px] rounded-full border px-4 py-2.5 text-sm transition-all', size === s ? 'border-bone bg-bone text-void' : 'border-bone/15 hover:border-bone/50')}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="inline-flex items-center justify-between rounded-full border hairline px-2 h-[52px] sm:w-36">
              <IconButton size="small" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><RemoveRoundedIcon /></IconButton>
              <span className="font-semibold">{qty}</span>
              <IconButton size="small" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase"><AddRoundedIcon /></IconButton>
            </div>
            <Button variant="contained" size="large" fullWidth onClick={addToBag} sx={{ height: 52, fontSize: 15 }}>
              Add to bag — {money(product.price * qty)}
            </Button>
          </div>
          <p className="mt-3 text-xs text-mute">{product.stock <= 20 ? `Only ${product.stock} left · ` : ''}Free shipping over ₹2,999 · 30-day returns</p>

          <div className="mt-8 border-t hairline">
            {[
              { t: 'Details', c: <ul className="m-0 ps-4 text-mute text-sm flex flex-col gap-1">{product.details.map((d) => <li key={d}>{d}</li>)}</ul> },
              { t: 'Shipping & returns', c: <p className="m-0 text-mute text-sm">Ships in 1–2 business days. Free standard shipping on orders over ₹2,999. Returns accepted within 30 days in original condition.</p> },
              { t: 'Care', c: <p className="m-0 text-mute text-sm">Machine wash cold, inside out. Do not tumble dry. Do not iron prints or coated surfaces.</p> },
            ].map((row) => (
              <Accordion key={row.t} disableGutters elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid rgb(var(--bone-rgb) / 0.1)', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: 0 }}><span className="font-semibold">{row.t}</span></AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>{row.c}</AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      <Snackbar open={!!toast} autoHideDuration={2600} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ bottom: { xs: 80, md: 88 } }}>
        {toast ? <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)} sx={{ borderRadius: 999 }}>{toast.msg}</Alert> : null}
      </Snackbar>
    </section>
  );
}
