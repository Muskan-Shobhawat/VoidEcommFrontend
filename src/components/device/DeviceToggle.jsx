'use client';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import TabletMacRoundedIcon from '@mui/icons-material/TabletMacRounded';
import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded';
import { DEVICES, useDevice } from '@/store/device';

const ICONS = { mobile: SmartphoneRoundedIcon, tablet: TabletMacRoundedIcon, desktop: DesktopWindowsRoundedIcon };

export default function DeviceToggle({ floating = false }) {
  const { device, setDevice } = useDevice();

  const group = (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={device}
      onChange={(_, v) => v && setDevice(v)}
      sx={{
        '& .MuiToggleButton-root': { border: 0, borderRadius: 999, px: 1.4, color: 'text.secondary', gap: 0.75, textTransform: 'none', fontSize: 12 },
        '& .Mui-selected': { color: 'var(--void) !important', bgcolor: 'var(--bone) !important' },
      }}
    >
      {Object.entries(DEVICES).map(([key, d]) => {
        const Icon = ICONS[key];
        return (
          <ToggleButton key={key} value={key} aria-label={d.label}>
            <Tooltip title={d.hint} placement="top">
              <span className="inline-flex items-center gap-1.5">
                <Icon sx={{ fontSize: 16 }} />
                <span className="hidden sm:inline">{d.label}</span>
              </span>
            </Tooltip>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );

  if (!floating) return group;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] glass rounded-full p-1 pl-3 flex items-center gap-2 shadow-2xl">
      <span className="text-[10px] uppercase tracking-[0.2em] text-mute hidden md:inline">Preview</span>
      {group}
    </div>
  );
}
