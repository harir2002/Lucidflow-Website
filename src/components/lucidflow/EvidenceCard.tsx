type EvidenceCardProps = {
  title?: string;
  signal?: string;
  severity?: string;
  compact?: boolean;
  className?: string;
};

export function EvidenceCard({
  title = "Potential Risk Signal",
  signal = "Pre-selected add-on",
  severity = "High",
  compact = false,
  className = "",
}: EvidenceCardProps) {
  return (
    <article
      className={`border border-white/12 bg-[#101010] shadow-panel ${compact ? "p-3.5" : "p-4 sm:p-5"} ${className}`}
      aria-label={`${title}: ${signal}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-soft-grey">
          {title}
        </p>
        <span className="inline-flex items-center gap-1.5 border border-red-border bg-crimson/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-crimson" aria-hidden />
          {severity}
        </span>
      </div>
      <p className={`font-semibold text-white ${compact ? "mt-2 text-sm" : "mt-3 text-base"}`}>
        {signal}
      </p>
      <dl className={`grid grid-cols-2 gap-x-3 text-[11px] text-muted-grey ${compact ? "mt-3" : "mt-4"}`}>
        <div>
          <dt>Evidence captured</dt>
          <dd className="mt-0.5 text-soft-grey">Screenshot + timestamp</dd>
        </div>
        <div>
          <dt>Action</dt>
          <dd className="mt-0.5 text-soft-grey">Create CAP</dd>
        </div>
      </dl>
    </article>
  );
}
