'use client';
import { useEffect, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ScreenRotationRoundedIcon from '@mui/icons-material/ScreenRotationRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { DEVICES, useDevice } from '@/store/device';
import DeviceToggle from './DeviceToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DeviceStage() {
  const device = useDevice((s) => s.device);
  const [src, setSrc] = useState('/');
  const [landscape, setLandscape] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [viewport, setViewport] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    setSrc(window.location.pathname + window.location.search);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const spec = DEVICES[device];
  const w = landscape ? spec.height : spec.width;
  const h = landscape ? spec.width : spec.height;
  const scale = useMemo(() => Math.min(1, (viewport.h - 150) / h, (viewport.w - 48) / w), [viewport, w, h]);

  return (
    <div className="device-stage">
      <div className="w-full flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="font-display font-extrabold tracking-tight text-lg">VOID.</span>
          <span className="text-xs text-mute hidden sm:inline">Responsive preview · {spec.hint}</span>
        </div>
        <div className="flex items-center gap-2 glass rounded-full p-1 pl-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-mute hidden md:inline">Preview</span>
          <DeviceToggle />
          <Tooltip title="Rotate">
            <IconButton size="small" onClick={() => setLandscape((v) => !v)}><ScreenRotationRoundedIcon fontSize="small" /></IconButton>
          </Tooltip>
          <ThemeToggle />
          <Tooltip title="Reload frame">
            <IconButton size="small" onClick={() => setNonce((n) => n + 1)}><RefreshRoundedIcon fontSize="small" /></IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 w-full flex items-start justify-center overflow-hidden pb-6">
        <div style={{ width: w * scale, height: h * scale }} className="relative">
          <div
            className={`device-bezel ${device}`}
            style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            {device === 'mobile' && !landscape && <div className="device-notch" />}
            <iframe key={`${device}-${nonce}`} src={src} title={`${spec.label} preview`} />
          </div>
        </div>
      </div>
    </div>
  );
}
