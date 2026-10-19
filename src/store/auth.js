'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Signed-in session: the API token and public profile. */
export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, user }) => set({ token, user }),
      clear: () => set({ token: null, user: null }),
    }),
    { name: 'void-auth' }
  )
);

// Keep the session in sync between the device-preview iframe and the parent window.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'void-auth') useAuth.persist.rehydrate();
  });
}
