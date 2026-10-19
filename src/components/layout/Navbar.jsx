'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { cx } from '@/lib/format';
import ThemeToggle from '@/components/ui/ThemeToggle';

const LINKS = [
  { href: '/shop?gender=men', label: 'Men' },
  { href: '/shop?gender=women', label: 'Women' },
  { href: '/shop?isNew=true', label: 'New In' },
  { href: '/shop', label: 'Shop All' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCart((s) => s.open);
  const user = useAuth((s) => s.user);
  const signedIn = hydrated && !!user;

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={cx('fixed inset-x-0 top-0 z-40 transition-all duration-500', scrolled ? 'py-2' : 'py-4')}>
      <div className="wrap">
        <nav className={cx('flex items-center justify-between rounded-full px-3 md:px-5 py-2 transition-all duration-500', scrolled ? 'glass' : '')}>
          <div className="flex items-center gap-2">
            <IconButton className="md:!hidden" onClick={() => setOpen(true)} aria-label="Open menu" sx={{ color: 'text.primary' }}>
              <MenuRoundedIcon />
            </IconButton>
            <Link href="/" className="font-display font-extrabold text-xl md:text-2xl tracking-tight flex items-center gap-1">
              VOID<span className="text-signal">.</span>
            </Link>
          </div>

          <ul className="hidden md:flex items-center gap-8 list-unstyled m-0">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm uppercase tracking-[0.18em] text-mute hover:text-bone transition-colors relative group">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href="/shop" aria-label="Search">
              <IconButton sx={{ color: 'text.primary' }}><SearchRoundedIcon /></IconButton>
            </Link>
            <Link href={signedIn ? '/account' : '/login'} aria-label={signedIn ? 'Your account' : 'Sign in'}>
              <IconButton sx={{ color: 'text.primary' }}><PersonOutlineRoundedIcon /></IconButton>
            </Link>
            <IconButton onClick={openCart} aria-label="Open cart" sx={{ color: 'text.primary' }}>
              <Badge badgeContent={hydrated ? count : 0} color="primary" overlap="circular" sx={{ '& .MuiBadge-badge': { fontWeight: 700 } }}>
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>
          </div>
        </nav>
      </div>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: '86vw', maxWidth: 380, p: 3 } }}>
        <div className="flex items-center justify-between mb-10">
          <span className="font-display font-extrabold text-2xl">VOID<span className="text-signal">.</span></span>
          <IconButton onClick={() => setOpen(false)} aria-label="Close menu"><CloseRoundedIcon /></IconButton>
        </div>
        <ul className="list-unstyled flex flex-col gap-6 m-0">
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="font-display font-extrabold text-4xl tracking-tight hover:text-signal transition-colors">
                <span className="text-xs text-mute mr-3 align-middle">0{i + 1}</span>{l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-start gap-4">
          <Link href={signedIn ? '/account' : '/login'} onClick={() => setOpen(false)} className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-mute hover:text-bone">
            <PersonOutlineRoundedIcon fontSize="small" /> {signedIn ? 'Account & orders' : 'Sign in'}
          </Link>
          <ThemeToggle withLabel />
        </div>
        <p className="mt-auto text-xs text-mute">Demo build · sample data · 3D powered by three.js</p>
      </Drawer>
    </header>
  );
}
