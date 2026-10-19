'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const lineKey = (l) => `${l.productId}__${l.size}__${l.color}`;

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (product, { size, color, quantity = 1 }) => {
        const line = { productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], size, color: color?.name, colorHex: color?.hex, quantity };
        const key = lineKey(line);
        set((s) => {
          const existing = s.items.find((i) => lineKey(i) === key);
          const items = existing
            ? s.items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.min(10, i.quantity + quantity) } : i))
            : [...s.items, line];
          return { items, isOpen: true };
        });
      },
      setQty: (key, quantity) =>
        set((s) => ({ items: s.items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => lineKey(i) !== key) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),
    }),
    { name: 'void-cart', partialize: (s) => ({ items: s.items }) }
  )
);

export { lineKey };

// Keep cart in sync between the device-preview iframe and the parent window.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'void-cart') useCart.persist.rehydrate();
  });
}
