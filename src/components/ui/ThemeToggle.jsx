'use client';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme } from '@mui/material/styles';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

/** Sun/moon switch between the dark and light themes; the choice is saved and shared with the device preview. */
export default function ThemeToggle({ withLabel = false }) {
  const { mode, systemMode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mode === 'system' ? systemMode : mode) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${next} theme`;
  const icon = mounted && current === 'light' ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />;

  if (withLabel) {
    return (
      <button type="button" onClick={() => setMode(next)} className="inline-flex items-center gap-2 bg-transparent border-0 p-0 text-sm uppercase tracking-[0.2em] text-mute hover:text-bone">
        {icon} {mounted ? `${next} theme` : 'Theme'}
      </button>
    );
  }
  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={() => setMode(next)} sx={{ color: 'text.primary' }}>{icon}</IconButton>
    </Tooltip>
  );
}
