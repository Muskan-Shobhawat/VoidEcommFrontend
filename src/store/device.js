'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEVICES = {
  mobile: { label: 'Mobile', width: 390, height: 844, hint: 'iPhone 14 · 390×844' },
  tablet: { label: 'Tablet', width: 820, height: 1180, hint: 'iPad Air · 820×1180' },
  desktop: { label: 'Desktop', width: null, height: null, hint: 'Full viewport' },
};

export const useDevice = create(
  persist((set) => ({ device: 'desktop', setDevice: (device) => set({ device }) }), { name: 'void-device' })
);
