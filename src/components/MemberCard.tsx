export function MemberCard({ code = "TG · 4821 · 07", name, className = "" }: { code?: string; name?: string; className?: string }) {
  return (
    <div className={`member-card ${className}`} aria-label="The Golden Member Club Karte">
      <div className="member-card-inner">
        <div className="flex items-start justify-between">
          <img src="/images/logo.png" alt="" className="brand-bird-white size-9 object-contain" />
          <span className="member-card-tag">Member</span>
        </div>
        <p className="member-card-code">{code}</p>
        <div className="flex items-end justify-between gap-3">
          <span className="member-card-name">{name || "The Golden Member Club"}</span>
          <span className="member-card-city">Brackenheim</span>
        </div>
      </div>
    </div>
  );
}
