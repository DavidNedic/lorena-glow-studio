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

  const current = SCHUELERINNEN[top];
  if (!current) return null;

  return (
    <div>
      <div className="stack-carousel">
      <Button variant="outline" size="icon" onClick={() => next(-1)} aria-label="Vorherige Nachricht" className="size-11 rounded-full"><Arrow dir="left" /></Button>
      <div className="stack-viewport">
      <div
        className="stack-stage"
        onPointerDown={e => { if (leaving) return; drag.current = { x: e.clientX }; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); }}
        onPointerMove={e => { if (drag.current) setDx(e.clientX - drag.current.x); }}
        onPointerUp={() => { const d = dx; drag.current = null; setDx(0); if (Math.abs(d) > 70) next(d < 0 ? 1 : -1); }}
        onPointerCancel={() => { drag.current = null; setDx(0); }}
      >
        <div
          key={current}
          className={`stack-card stack-card-top${dx !== 0 && !leaving ? " stack-card-drag" : ""}`}
          style={
            leaving
              ? { transform: `translate(${leaving.dir * -140}%, -10px) rotate(${leaving.dir * -14}deg)`, opacity: 0 }
              : dx !== 0
                ? { transform: `translateX(${dx}px) rotate(${dx / 24}deg)` }
                : undefined
          }
        >
          <div className="stack-card-scroll">
            <img src={current} alt={`Nachricht einer Absolventin (${top + 1} von ${SCHUELERINNEN.length})`} loading="eager" draggable={false} className="select-none" />
          </div>
        </div>
      </div>
      </div>
      <Button variant="outline" size="icon" onClick={() => next(1)} aria-label="Nächste Nachricht" className="size-11 rounded-full"><Arrow /></Button>
      </div>
      <div className="mt-6 flex items-center justify-center">
        <span className="text-sm text-muted-foreground" aria-live="polite">{top + 1} / {SCHUELERINNEN.length}</span>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Wischen für die nächste Nachricht</p>
    </div>
  );
}
