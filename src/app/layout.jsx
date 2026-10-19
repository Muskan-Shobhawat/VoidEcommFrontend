import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Syne, Space_Grotesk } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ThemeRegistry from '@/components/providers/ThemeRegistry';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';
import AppShell from '@/components/device/AppShell';

const display = Syne({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--font-display' });
const body = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });

export const metadata = {
  title: 'VOID. — Clothing for the next dimension',
  description: 'Demo e-commerce experience: men’s & women’s apparel with interactive 3D product views.',
};

export const viewport = { themeColor: '#0a0a0c', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="font-body">
        <InitColorSchemeScript attribute={THEME_ATTRIBUTE} modeStorageKey={THEME_STORAGE_KEY} defaultMode="dark" />
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
