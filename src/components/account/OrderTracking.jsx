import { cx } from '@/lib/format';

const DAY = 864e5;
const fmt = (d) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

/**
 * Demo tracking timeline derived from the order's status and dates
 * (the in-memory backend only stores confirmed / shipped / delivered).
 */
function trackingSteps(order) {
  const placed = new Date(order.createdAt);
  const eta = new Date(`${order.estimatedDelivery}T12:00:00`);
  const steps = [
    { label: 'Ordered', date: placed },
    { label: 'Packed', date: new Date(placed.getTime() + DAY) },
    { label: 'Shipped', date: new Date(placed.getTime() + 2 * DAY) },
    { label: 'Out for delivery', date: eta },
    { label: 'Delivered', date: eta },
  ];
  // Index of the step the parcel is at now.
  let current = { confirmed: 0, shipped: 2, delivered: 4 }[order.status] ?? 0;
  if (order.status === 'confirmed' && Date.now() > steps[1].date.getTime()) current = 1;
  if (order.status === 'shipped' && new Date().toDateString() === eta.toDateString()) current = 3;
  return { steps, current };
}

const headline = (order, steps, current) =>
  current === 4 ? `Delivered ${fmt(steps[4].date)}` : current === 3 ? 'Out for delivery today' : `Arriving ${fmt(steps[4].date)}`;

export default function OrderTracking({ order }) {
  if (order.status === 'cancelled') return null;
  const { steps, current } = trackingSteps(order);
  const trackingNo = current >= 2 ? `VX${order.id.replace(/\W/g, '').slice(-6)}${order.createdAt.slice(8, 10)}` : null;

  // Explicit [1.25rem] spacing: Bootstrap's !important pb-5 / mb-5 would otherwise win over Tailwind's.
  return (
    <div className="border-t hairline pt-4 pb-[1.25rem]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-[1.25rem]">
        <p className="m-0 font-display font-bold">{headline(order, steps, current)}</p>
        <p className="m-0 text-xs text-mute">{trackingNo ? <>Void Express · <span className="text-bone">{trackingNo}</span></> : 'Tracking number once shipped'}</p>
      </div>
      <ol className="list-unstyled m-0 p-0 flex flex-col md:flex-row" aria-label="Delivery progress">
        {steps.map((s, i) => {
          const done = i <= current;
          return (
            <li key={s.label} className="relative flex md:flex-1 md:flex-col md:items-center md:text-center gap-3 md:gap-2 pb-[1.25rem] last:pb-0 md:pb-0" aria-current={i === current ? 'step' : undefined}>
              {/* connector to the next step: vertical on phones, horizontal from md up */}
              {i < steps.length - 1 && (
                <span className={cx('absolute left-[7px] top-4 bottom-0 w-0.5 md:left-1/2 md:top-[7px] md:bottom-auto md:h-0.5 md:w-full', i < current ? 'bg-signal' : 'bg-bone/15')} aria-hidden />
              )}
              <span
                className={cx(
                  'relative z-10 mt-0.5 md:mt-0 h-4 w-4 shrink-0 rounded-full border-2 border-solid',
                  done ? 'border-signal bg-signal' : 'border-bone/25 bg-void',
                  i === current && 'ring-4 ring-signal/25'
                )}
                aria-hidden
              />
              <div>
                <p className={cx('m-0 text-sm font-semibold', !done && 'text-mute')}>{s.label}</p>
                <p className="m-0 text-xs text-mute">{done ? fmt(s.date) : i === steps.length - 1 ? `Expected ${fmt(s.date)}` : 'Pending'}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
