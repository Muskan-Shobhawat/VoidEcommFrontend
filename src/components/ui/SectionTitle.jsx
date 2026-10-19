export default function SectionTitle({ eyebrow, title, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-12 ${className}`}>
      <div>
        {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-signal mb-3">{eyebrow}</p>}
        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[0.95]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
