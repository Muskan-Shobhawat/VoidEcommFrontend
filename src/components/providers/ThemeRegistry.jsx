'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';

const brand = {
  primary: { main: '#ff5a1f', contrastText: '#0a0a0c' },
  secondary: { main: '#c9b6ff' },
};

// MUI writes data-theme="dark" | "light" on <html>; globals.css keys the Tailwind/Bootstrap palette off the same attribute.
const theme = createTheme({
  cssVariables: { colorSchemeSelector: THEME_ATTRIBUTE },
  defaultColorScheme: 'dark',
  colorSchemes: {
    dark: {
      palette: {
        ...brand,
        background: { default: '#0a0a0c', paper: '#121218' },
        text: { primary: '#f2efe9', secondary: '#9a9aa6' },
        divider: 'rgba(255,255,255,0.1)',
      },
    },
    light: {
      palette: {
        ...brand,
        background: { default: '#f4f1ea', paper: '#ebe7de' },
        text: { primary: '#121218', secondary: '#63636f' },
        divider: 'rgba(0,0,0,0.1)',
      },
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'var(--font-body), system-ui, sans-serif',
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 22, paddingBlock: 10 },
        containedPrimary: { boxShadow: '0 10px 30px -10px rgba(255,90,31,0.7)' },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 500 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: theme.vars.palette.background.default, backgroundImage: 'none' }) } },
    MuiTooltip: { styleOverrides: { tooltip: { background: '#1c1c24', color: '#f2efe9', fontSize: 12 } } },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false }}>
      <ThemeProvider theme={theme} defaultMode="dark" modeStorageKey={THEME_STORAGE_KEY} disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
