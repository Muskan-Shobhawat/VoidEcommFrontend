'use client';
import { useEffect, useState } from 'react';
import { useDevice } from '@/store/device';
import DeviceStage from './DeviceStage';
import DeviceToggle from './DeviceToggle';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CursorGlow from '@/components/ui/CursorGlow';
import AuthSync from '@/components/account/AuthSync';

/**
 * Decides between rendering the site directly (desktop / inside the preview iframe)
 * or rendering a device "stage" that loads the site in a phone/tablet-sized iframe.
 */
export default function AppShell({ children }) {
  const device = useDevice((s) => s.device);
  const [mounted, setMounted] = useState(false);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(window.self !== window.top);
    setMounted(true);
  }, []);

  const showStage = mounted && !embedded && device !== 'desktop';

  if (showStage) return <DeviceStage />;

  return (
    <>
      {!embedded && <CursorGlow />}
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <AuthSync />
      {mounted && !embedded && <DeviceToggle floating />}
    </>
  );
}
