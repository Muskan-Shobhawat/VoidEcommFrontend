/**
 * Browser-only stand-in for the auth + order-history API, used when the backend is unreachable
 * so the demo keeps working. Data lives in this browser's localStorage only.
 */
import { localPriceCart } from './catalog.js';

const KEY = 'void-local-accounts';
const TOKEN_PREFIX = 'local.';
export const DEMO_ACCOUNT = { name: 'Demo Shopper', email: 'demo@void.shop', password: 'void1234' };

const apiError = (status, message) => Object.assign(new Error(message), { status, fromApi: true });
const genId = () => 'VD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const publicUser = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt });

async function hash(password) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`void:${password}`));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function pastOrder(userId, daysAgo, status, items) {
  const createdAt = new Date(Date.now() - daysAgo * 864e5);
  return {
    id: genId(), userId, status, createdAt: createdAt.toISOString(), offline: true,
    customer: { name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email },
    ...localPriceCart(items),
    estimatedDelivery: new Date(createdAt.getTime() + 5 * 864e5).toISOString().slice(0, 10),
  };
}

async function load() {
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch { db = null; }
  if (db?.users) return db;
  // First use: seed the same demo account the backend ships with.
  const id = 'local-demo';
  db = {
    users: { [DEMO_ACCOUNT.email]: { id, name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email, createdAt: new Date().toISOString(), hash: await hash(DEMO_ACCOUNT.password) } },
    orders: [
      pastOrder(id, 24, 'delivered', [{ productId: 'p-002', quantity: 1, size: 'L' }, { productId: 'p-001', quantity: 2, size: 'M', color: 'Void Black' }]),
      pastOrder(id, 3, 'shipped', [{ productId: 'p-007', quantity: 1, size: 'M' }]),
    ],
  };
  save(db);
  return db;
}
function save(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* storage full or blocked: demo only */ }
}
const userIdFrom = (token) => (token?.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null);

export async function localSignup({ name, email, password }) {
  const db = await load();
  const key = String(email || '').trim().toLowerCase();
  if (!String(name || '').trim()) throw apiError(400, 'Name is required');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(key)) throw apiError(400, 'Valid email required');
  if (String(password || '').length < 6) throw apiError(400, 'Password must be at least 6 characters');
  if (db.users[key]) throw apiError(409, 'An account with this email already exists');
  const user = { id: crypto.randomUUID(), name: name.trim(), email: key, createdAt: new Date().toISOString(), hash: await hash(password) };
  db.users[key] = user;
  save(db);
  return { token: TOKEN_PREFIX + user.id, user: publicUser(user), offline: true };
}

export async function localLogin({ email, password }) {
  const db = await load();
  const user = db.users[String(email || '').trim().toLowerCase()];
  if (!user || user.hash !== (await hash(String(password || '')))) throw apiError(401, 'Incorrect email or password');
  return { token: TOKEN_PREFIX + user.id, user: publicUser(user), offline: true };
}

export async function localMe(token) {
  // A backend session can't be checked while the backend is down: report "unknown", don't sign out.
  if (!userIdFrom(token)) return { user: null };
  const db = await load();
  const user = Object.values(db.users).find((u) => u.id === userIdFrom(token));
  if (!user) throw apiError(401, 'Please sign in');
  return { user: publicUser(user) };
}

export async function localOrders(userId) {
  const db = await load();
  return db.orders.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function localSaveOrder(order) {
  const db = await load();
  db.orders.push(order);
  save(db);
}
