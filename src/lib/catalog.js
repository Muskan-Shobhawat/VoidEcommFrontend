/**
 * Local mirror of the backend catalogue logic.
 * Used as a fallback when the API is unreachable so the demo always renders.
 */
import products from './data/products.js';
import categories, { collections } from './data/categories.js';

const SORTS = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || b.reviews - a.reviews,
  newest: (a, b) => Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export function localListProducts(params = {}) {
  const { gender, category, search, sort = 'featured', minPrice, maxPrice, featured, isNew, tag, page = 1, limit = 24 } = params;
  let items = [...products];
  if (gender && gender !== 'all') items = items.filter((p) => p.gender === gender);
  if (category && category !== 'all') {
    const cats = String(category).split(',');
    items = items.filter((p) => cats.includes(p.category));
  }
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.includes(q));
  }
  if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));
  if (featured === 'true' || featured === true) items = items.filter((p) => p.featured);
  if (isNew === 'true' || isNew === true) items = items.filter((p) => p.isNew);
  if (tag) items = items.filter((p) => p.tags.includes(tag));
  items.sort(SORTS[sort] || SORTS.featured);
  const total = items.length;
  const perPage = Number(limit);
  const start = (Number(page) - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, page: Number(page), limit: perPage, pages: Math.ceil(total / perPage) } };
}

export const localGetProduct = (slug) => products.find((p) => p.slug === slug || p.id === slug) || null;

export function localRelated(slug) {
  const product = localGetProduct(slug);
  if (!product) return [];
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1))
    .slice(0, 4);
}

export const localCategories = (gender) =>
  categories
    .filter((c) => !gender || gender === 'all' || c.genders.includes(gender))
    .map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug && (!gender || gender === 'all' || p.gender === gender)).length }));

export const localCollections = () =>
  collections.map((c) => ({ ...c, count: products.filter((p) => p.gender === c.slug).length, featured: products.filter((p) => p.gender === c.slug && p.featured).slice(0, 3) }));

export const localLookbook = () => [
  { id: 'lb-1', title: 'ZERO GRAVITY', subtitle: 'FW26 Outerwear', palette: ['#0b0b0f', '#6f7cff'], link: '/shop?category=jackets', images: ['/products/monolith-leather-jacket-3d.jpg', '/products/axis-moto-jacket-3d.jpg', '/products/rider-leather-jacket-3d.jpg'] },
  { id: 'lb-2', title: 'REFRACTION', subtitle: 'Women SS26', palette: ['#1b1030', '#9fe8ff'], link: '/shop?gender=women', images: ['/products/lilac-flare-dress-3d.jpg', '/products/aurora-slip-dress-3d.jpg', '/products/emerald-tea-dress-3d.jpg'] },
  { id: 'lb-3', title: 'HEAVYWEIGHT', subtitle: 'Core Basics', palette: ['#1b1b24', '#ff5a1f'], link: '/shop?category=tees', images: ['/products/eclipse-heavy-tee-3d.jpg', '/products/orbit-oversized-tee-3d.jpg', '/products/signal-boxy-tee-3d.jpg'] },
];

export function localPriceCart(items = []) {
  const lines = items
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      const qty = Math.max(1, Math.min(10, Number(line.quantity) || 1));
      const color = product.colors.find((c) => c.name === line.color) || product.colors[0];
      return { productId: product.id, slug: product.slug, name: product.name, image: product.images[0], palette: product.palette, price: product.price, quantity: qty, size: line.size || product.sizes[0], color: color.name, colorHex: color.hex, lineTotal: +(product.price * qty).toFixed(2) };
    })
    .filter(Boolean);
  const subtotal = +lines.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
  const shipping = subtotal === 0 || subtotal >= 2999 ? 0 : 149;
  const tax = Math.round(subtotal * 0.12);
  return { lines, summary: { subtotal, shipping, tax, total: +(subtotal + shipping + tax).toFixed(2), currency: 'INR', freeShippingThreshold: 2999, itemCount: lines.reduce((s, l) => s + l.quantity, 0) } };
}
