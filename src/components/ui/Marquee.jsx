export default function Marquee({ items, className = '' }) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden border-y hairline py-3 md:py-4 ${className}`}>
      <div className="flex w-max animate-marquee gap-10 pr-10 whitespace-nowrap font-display text-sm md:text-base uppercase tracking-[0.25em]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className={i % 2 ? 'text-mute' : 'text-bone'}>{t}</span>
            <span className="text-signal">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
