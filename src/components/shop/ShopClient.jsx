'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ProductCard from '@/components/product/ProductCard';
import { money } from '@/lib/format';

const GENDERS = [
  { v: 'all', l: 'All' },
  { v: 'men', l: 'Men' },
  { v: 'women', l: 'Women' },
];
const SORTS = [
  { v: 'featured', l: 'Featured' },
  { v: 'newest', l: 'Newest' },
  { v: 'price-asc', l: 'Price: low → high' },
  { v: 'price-desc', l: 'Price: high → low' },
  { v: 'rating', l: 'Top rated' },
];

export default function ShopClient({ products, total, categories, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState([Number(params.minPrice) || 0, Number(params.maxPrice) || 400]);
  const [search, setSearch] = useState(params.search || '');

  useEffect(() => setSearch(params.search || ''), [params.search]);

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '' || v === 'all' || v === false) next.delete(k);
        else next.set(k, String(v));
      });
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [sp, pathname, router]
  );

  const activeCats = params.category === 'all' ? [] : params.category.split(',');
  const toggleCat = (slug) => {
    const set = new Set(activeCats);
    set.has(slug) ? set.delete(slug) : set.add(slug);
    update({ category: [...set].join(',') || 'all' });
  };

  const clearAll = () => router.push(pathname, { scroll: false });
  const title = params.gender === 'all' ? 'All pieces' : params.gender === 'men' ? 'Men' : 'Women';

  const Filters = (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-mute mb-3">Search</p>
        <form onSubmit={(e) => { e.preventDefault(); update({ search }); }}>
          <input className="form-control" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-mute mb-3">Collection</p>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Chip key={g.v} label={g.l} clickable onClick={() => update({ gender: g.v, category: 'all' })} variant={params.gender === g.v ? 'filled' : 'outlined'} color={params.gender === g.v ? 'primary' : 'default'} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-mute mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip key={c.slug} label={`${c.name} · ${c.count}`} clickable onClick={() => toggleCat(c.slug)} variant={activeCats.includes(c.slug) ? 'filled' : 'outlined'} color={activeCats.includes(c.slug) ? 'secondary' : 'default'} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-mute mb-3">Price · {money(price[0])} – {money(price[1])}</p>
        <div className="px-2">
          <Slider value={price} min={0} max={400} step={10} onChange={(_, v) => setPrice(v)} onChangeCommitted={(_, v) => update({ minPrice: v[0] || '', maxPrice: v[1] >= 400 ? '' : v[1] })} valueLabelDisplay="auto" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip label="New in" clickable onClick={() => update({ isNew: params.isNew === 'true' ? '' : 'true' })} variant={params.isNew === 'true' ? 'filled' : 'outlined'} color={params.isNew === 'true' ? 'primary' : 'default'} />
        <Chip label="Limited" clickable onClick={() => update({ tag: params.tag === 'limited' ? '' : 'limited' })} variant={params.tag === 'limited' ? 'filled' : 'outlined'} color={params.tag === 'limited' ? 'primary' : 'default'} />
      </div>
      <Button variant="text" onClick={clearAll} sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}>Clear all</Button>
    </div>
  );

  return (
    <div className="wrap pt-28 md:pt-36 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-signal mb-3">Shop</p>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-none">{title}<span className="text-signal">.</span></h1>
          <p className="text-mute mt-3">{total} {total === 1 ? 'piece' : 'pieces'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="lg:!hidden" variant="outlined" startIcon={<TuneRoundedIcon />} onClick={() => setOpen(true)} sx={{ borderColor: 'rgb(var(--bone-rgb) / 0.2)', color: 'text.primary' }}>Filters</Button>
          <Select size="small" value={params.sort} onChange={(e) => update({ sort: e.target.value })} sx={{ borderRadius: 999, minWidth: 180, '& fieldset': { borderColor: 'rgb(var(--bone-rgb) / 0.2)' } }}>
            {SORTS.map((s) => <MenuItem key={s.v} value={s.v}>{s.l}</MenuItem>)}
          </Select>
        </div>
      </div>

      <div className="row g-4 g-lg-5">
        <aside className="col-lg-3 d-none d-lg-block">
          <div className="sticky top-28">{Filters}</div>
        </aside>
        <div className="col-12 col-lg-9">
          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display font-bold text-3xl">Nothing matched.</p>
              <p className="text-mute">Try widening your filters.</p>
              <Button variant="outlined" onClick={clearAll} sx={{ mt: 2 }}>Reset filters</Button>
            </div>
          ) : (
            <div className="row g-4 g-md-5">
              {products.map((p, i) => (
                <div className="col-6 col-md-4" key={p.id}>
                  <ProductCard product={p} index={i} priority={i < 3} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: '24px 24px 0 0', maxHeight: '88vh', p: 3 } }}>
        <div className="flex items-center justify-between mb-6">
          <p className="font-display font-bold text-xl m-0">Filters</p>
          <IconButton onClick={() => setOpen(false)}><CloseRoundedIcon /></IconButton>
        </div>
        {Filters}
        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => setOpen(false)}>Show {total} results</Button>
      </Drawer>
    </div>
  );
}
