'use client';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ProductImage from '@/components/product/ProductImage';
import { useCart, lineKey } from '@/store/cart';
import { money } from '@/lib/format';

export default function CartLine({ line, compact = false }) {
  const { setQty, remove } = useCart();
  const key = lineKey(line);
  return (
    <div className="flex gap-4">
      <Link href={`/product/${line.slug}`} className={`relative shrink-0 overflow-hidden rounded-xl bg-ink ${compact ? 'w-20 h-24' : 'w-24 h-28 md:w-28 md:h-32'}`}>
        <ProductImage src={line.image} alt={line.name} sizes="120px" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link href={`/product/${line.slug}`} className="font-display font-bold leading-tight hover:text-signal truncate">{line.name}</Link>
          <span className="font-semibold shrink-0">{money(line.price * line.quantity)}</span>
        </div>
        <p className="text-xs text-mute mt-1 m-0">{line.color} · Size {line.size}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="inline-flex items-center rounded-full border hairline">
            <IconButton size="small" onClick={() => setQty(key, line.quantity - 1)} disabled={line.quantity <= 1} aria-label="Decrease"><RemoveRoundedIcon fontSize="small" /></IconButton>
            <span className="w-6 text-center text-sm">{line.quantity}</span>
            <IconButton size="small" onClick={() => setQty(key, line.quantity + 1)} disabled={line.quantity >= 10} aria-label="Increase"><AddRoundedIcon fontSize="small" /></IconButton>
          </div>
          <IconButton size="small" onClick={() => remove(key)} aria-label="Remove" sx={{ color: 'text.secondary' }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
        </div>
      </div>
    </div>
  );
}
