import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/site";
import { SCHUELERINNEN } from "@/lib/data";

export function TestimonialStack() {
  const [top, setTop] = useState(0);
  const [leaving, setLeaving] = useState<null | { dir: 1 | -1 }>(null);
  const [dx, setDx] = useState(0);
  const drag = useRef<{ x: number } | null>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const next = (dir: 1 | -1 = 1) => {
    if (leaving) return;
    if (reduced) { setTop(t => (t + dir + SCHUELERINNEN.length) % SCHUELERINNEN.length); return; }
    setLeaving({ dir });
    setTimeout(() => { setTop(t => (t + dir + SCHUELERINNEN.length) % SCHUELERINNEN.length); setLeaving(null); }, 350);
  };

  const current = SCHUELERINNEN[top]!;

  return (
    <div>
      <div
        className="stack-stage"
        onPointerDown={e => { if (leaving) return; drag.current = { x: e.clientX }; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); }}
        onPointerMove={e => { if (drag.current) setDx(e.clientX - drag.current.x); }}
        onPointerUp={() => { const d = dx; drag.current = null; setDx(0); if (Math.abs(d) > 70) next(d < 0 ? 1 : -1); }}
        onPointerCancel={() => { drag.current = null; setDx(0); }}
      >
        {order.map((src, i) => {
          const peek = PEEK[i - 1];
          const dragging = i === 0 && dx !== 0 && !leaving;
          const style = i === 0
            ? leaving
              ? { transform: `translate(${leaving.dir * -140}%, -10px) rotate(${leaving.dir * -14}deg)`, opacity: 0 }
              : dragging
                ? { transform: `translateX(${dx}px) rotate(${dx / 24}deg)` }
                : undefined
            : { transform: `translate(${peek!.x}px, ${peek!.y}px) rotate(${peek!.r}deg) scale(${peek!.s})` };
          return (
            <div key={src} className={`stack-card${i === 0 ? " stack-card-top" : ""}${dragging ? " stack-card-drag" : ""}`} style={{ ...style, zIndex: i === 0 ? 20 : 10 - i }} aria-hidden={i !== 0}>
              <div className="stack-card-scroll">
                <img src={src} alt={i === 0 ? `Nachricht einer Absolventin (${top + 1} von ${SCHUELERINNEN.length})` : ""} loading={i === 0 ? "eager" : "lazy"} draggable={false} className="w-full select-none rounded-[20px]" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => next(-1)} aria-label="Vorherige Nachricht" className="size-11 rounded-full"><Arrow dir="left" /></Button>
        <span className="text-sm text-muted-foreground" aria-live="polite">{top + 1} / {SCHUELERINNEN.length}</span>
        <Button variant="outline" size="icon" onClick={() => next(1)} aria-label="Nächste Nachricht" className="size-11 rounded-full"><Arrow /></Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Wischen für die nächste Nachricht</p>
    </div>
  );
}
