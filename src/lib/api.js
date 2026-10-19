import {
  localListProducts, localGetProduct, localRelated, localCategories, localCollections, localLookbook, localPriceCart,
} from './catalog.js';
import { localLogin, localMe, localOrders, localSaveOrder, localSignup } from './localAccount.js';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const AUTH_TIMEOUT = 45000;

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}), ...(options.headers || {}) },
    signal: options.signal || AbortSignal.timeout(options.timeout || 4000),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.fromApi = typeof body.message === 'string'; // our API always returns { message }
    throw err;
  }
  return res.json();
}

/** Try the API; if the backend is down, serve the bundled sample data instead. */
async function withFallback(fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    // Genuine API validation / not-found errors propagate; network failures,
    // 5xx and foreign services squatting the port fall back to sample data.
    if (err.fromApi && err.status >= 400 && err.status < 500) throw err;
    return fallback();
  }
}

const qs = (params) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 'all'));
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : '';
};

export const api = {
  listProducts: (params = {}) => withFallback(() => request(`/products${qs(params)}`), () => localListProducts(params)),
  getProduct: (slug) => withFallback(() => request(`/products/${slug}`), () => localGetProduct(slug)).catch((e) => (e.status === 404 ? null : Promise.reject(e))),
  related: (slug) => withFallback(() => request(`/products/${slug}/related`), () => localRelated(slug)),
  categories: (gender) => withFallback(() => request(`/categories${qs({ gender })}`), () => localCategories(gender)),
  collections: () => withFallback(() => request('/categories/collections'), localCollections),
  lookbook: () => withFallback(() => request('/lookbook'), localLookbook),
  priceCart: (items) => withFallback(() => request('/cart', { method: 'POST', body: JSON.stringify({ items }) }), () => localPriceCart(items)),
  /** `user` (optional) is the signed-in account: the order is attached to it and appears in order history. */
  createOrder: (payload, { token, user } = {}) =>
    withFallback(
      () => request('/orders', { method: 'POST', body: JSON.stringify(payload), token }),
      async () => {
        const order = { id: 'VD-' + Math.random().toString(36).slice(2, 8).toUpperCase(), userId: user?.id ?? null, status: 'confirmed', offline: true, createdAt: new Date().toISOString(), ...localPriceCart(payload.items), customer: payload.customer, shippingAddress: payload.shippingAddress, estimatedDelivery: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10) };
        if (user) await localSaveOrder(order);
        return order;
      }
    ),
  // Accounts (backend sessions; browser-only stand-in when the backend is down).
  // Longer timeout so a sleeping free-tier backend can wake instead of silently creating a browser-only account.
  signup: (body) => withFallback(() => request('/auth/signup', { method: 'POST', body: JSON.stringify(body), timeout: AUTH_TIMEOUT }), () => localSignup(body)),
  login: (body) => withFallback(() => request('/auth/login', { method: 'POST', body: JSON.stringify(body), timeout: AUTH_TIMEOUT }), () => localLogin(body)),
  me: (token) => withFallback(() => request('/auth/me', { token }), () => localMe(token)),
  logout: (token) => request('/auth/logout', { method: 'POST', token }).catch(() => {}),
  myOrders: ({ token, user }) => withFallback(() => request('/orders', { token }), () => localOrders(user.id)),
  /** Fire-and-forget ping so a sleeping backend (e.g. Render free tier) starts waking on page load. */
  wake: () => fetch(`${BASE}/health`, { cache: 'no-store' }).catch(() => {}),
  newsletter: (email) => withFallback(() => request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }), () => ({ ok: true, message: 'You are on the list.' })),
};
