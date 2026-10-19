import Link from 'next/link';
import Button from '@mui/material/Button';

export default function NotFound() {
  return (
    <div className="wrap min-h-[80vh] flex flex-col items-center justify-center text-center pt-24">
      <p className="text-xs uppercase tracking-[0.3em] text-signal">404</p>
      <h1 className="font-display font-extrabold text-6xl md:text-8xl tracking-tight mt-3">Lost in the void<span className="text-signal">.</span></h1>
      <p className="text-mute mt-4">This page doesn&apos;t exist in our dimension.</p>
      <Button component={Link} href="/" variant="contained" sx={{ mt: 4 }}>Back home</Button>
    </div>
  );
}
