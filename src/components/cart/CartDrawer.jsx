'use client';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useCart } from '@/store/cart';
import CartLine from './CartLine';
import { money } from '@/lib/format';

export default function CartDrawer() {
  const { items, isOpen, close } = useCart();
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const remaining = Math.max(0, 150 - subtotal);

  return (
    <Drawer anchor="right" open={isOpen} onClose={close} PaperProps={{ sx: { width: '100vw', maxWidth: 440, display: 'flex', flexDirection: 'column' } }}>
      <div className="flex items-center justify-between px-5 py-4 border-b hairline">
        <p className="font-display font-extrabold text-xl m-0">Your bag <span className="text-mute text-sm font-body font-normal">({items.length})</span></p>
        <IconButton onClick={close} aria-label="Close cart"><CloseRoundedIcon /></IconButton>
      </div>

      <div className="px-5 py-3 text-xs">
        {remaining > 0 ? (
          <p className="m-0 text-mute">Add <span className="text-bone">{money(remaining)}</span> more for free shipping.</p>
        ) : (
          <p className="m-0 text-acid">You unlocked free shipping ✦</p>
        )}
        <div className="mt-2 h-1 rounded-full bg-bone/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-signal to-lilac transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-4 py-2">
        {items.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-display font-bold text-2xl">Nothing here yet.</p>
            <p className="text-mute text-sm">Your bag is empty — it&apos;s a void, literally.</p>
            <Button component={Link} href="/shop" variant="outlined" onClick={close} sx={{ mt: 2 }}>Start shopping</Button>
          </div>
        )}
        {items.map((line) => <CartLine key={`${line.productId}${line.size}${line.color}`} line={line} compact />)}
      </div>

      {items.length > 0 && (
        <div className="border-t hairline p-5 flex flex-col gap-3">
          <div className="flex justify-between text-sm"><span className="text-mute">Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
          <p className="text-xs text-mute m-0">Shipping & taxes calculated at checkout.</p>
          <Button component={Link} href="/checkout" onClick={close} variant="contained" size="large" fullWidth>Checkout</Button>
          <Button component={Link} href="/cart" onClick={close} variant="text" fullWidth sx={{ color: 'text.secondary' }}>View bag</Button>
        </div>
      )}
    </Drawer>
  );
}
