export const money = (n, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

export const cx = (...a) => a.filter(Boolean).join(' ');
