import { useState } from "react";
import { BEFORE_AFTER } from "@/lib/data";

function Compare({ item }: { item: (typeof BEFORE_AFTER)[number] }) {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const panel = (label: string) => (
    <div className="grid h-full w-full place-items-center bg-surface-2">
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
  return (
    <figure className="text-left">
      <div className="ba-frame" style={{ aspectRatio: item.ratio }}>
        <div className="absolute inset-0">
          {item.after ? <img src={item.after} alt={`${item.name} nachher`} loading="lazy" className="h-full w-full object-cover" /> : panel("Nachher-Bild")}
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {item.before ? <img src={item.before} alt={`${item.name} vorher`} loading="lazy" className="h-full w-full object-cover" /> : panel("Vorher-Bild")}
        </div>
        <span className="ba-tag left-3 top-3">Vorher</span>
        <span className="ba-tag right-3 top-3">Nachher</span>
        <div className={`ba-line${touched ? "" : " ba-line-hint"}`} style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="ba-knob">↔</span>
        </div>
        {!touched && <span className="ba-swipe" aria-hidden="true"><span>←</span>Wischen zum Vergleichen<span>→</span></span>}
        <input
          type="range" min={0} max={100} value={pos} onChange={e => { setPos(Number(e.target.value)); setTouched(true); }} onPointerDown={() => setTouched(true)}
          aria-label={`Vorher-Nachher-Regler für ${item.name}`} className="ba-range"
        />
      </div>
      <figcaption className="mt-4"><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-muted-foreground">{item.note}</p></figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <div className="mx-auto mt-10 grid max-w-5xl items-start gap-8 md:grid-cols-2">
      {BEFORE_AFTER.map(item => <Compare key={item.id} item={item} />)}
    </div>
  );
}
