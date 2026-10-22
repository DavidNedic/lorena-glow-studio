import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONTACT, TREATMENTS, ZOOM_AREAS, type ZoomArea } from "@/lib/data";

export function FaceZoom({ onShow }: { onShow: (slug: string) => void }) {
  const [sel, setSel] = useState<ZoomArea | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [done, setDone] = useState(false);
  const vids = useRef<Record<string, HTMLVideoElement | null>>({});

  const stopAll = () => Object.values(vids.current).forEach(v => { if (v) { v.pause(); v.currentTime = 0; } });
  const reset = () => { stopAll(); setSel(null); setZoomed(false); setDone(false); };
  const pick = (a: ZoomArea) => {
    stopAll(); setDone(false); setSel(a);
    if (!a.video) { setZoomed(false); return; }
    setZoomed(true);
    const v = vids.current[a.id];
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDone(true); return; }
    v.playbackRate = 3; v.play().catch(() => setDone(true));
  };
  const t = sel ? TREATMENTS.find(x => x.slug === sel.slug) : undefined;
  const active = zoomed && sel;

  return <div className="zoom-grid">
    <div className="zoom-stage" data-zoomed={zoomed}>
      <img src="/zoom/face.jpg" alt="Gesicht eines Models im Fotostudio" className="zoom-media zoom-base" />
      {ZOOM_AREAS.filter(a => a.video).map(a => <video key={a.id} ref={el => { vids.current[a.id] = el; }} src={`/zoom/${a.id}.mp4`} poster="/zoom/face.jpg" muted playsInline preload="metadata" className="zoom-media zoom-video" data-show={active && sel.id === a.id && !done} onEnded={() => setDone(true)} />)}
      {active && <img key={sel.id} src={`/zoom/${sel.id}-4k.jpg`} alt={`Nahaufnahme ${sel.area}`} className="zoom-media zoom-4k" data-show={done} />}
      {!zoomed && ZOOM_AREAS.filter(a => a.x !== undefined).map(a => <button key={a.id} type="button" className="zoom-dot" style={{ left: `${a.x}%`, top: `${a.y}%` }} onClick={() => pick(a)} aria-label={`${a.area} ansehen`}><span className="zoom-ring" /><span className="zoom-label">{a.area}</span></button>)}
      {zoomed && <button type="button" className="zoom-back" onClick={reset}>← Gesicht</button>}
      {active && done && sel.explain && <div className="zoom-card"><p className="font-bold">{sel.problem}</p><p className="mt-1 text-sm text-muted-foreground">{sel.explain}</p></div>}
    </div>
    <div>
      <div className="flex flex-wrap gap-2 max-[819px]:justify-center">
        {ZOOM_AREAS.filter(a => a.x === undefined).map(a => <Button key={a.id} variant="ghost" className="chip zoom-chip" data-active={sel?.id === a.id} aria-pressed={sel?.id === a.id} onClick={() => sel?.id === a.id ? reset() : pick(a)}>{a.id === "glow" ? "Ganzes Gesicht: kein Glow" : "Ich bin unsicher"}</Button>)}
      </div>
      <div className="card mt-5 p-6 text-left">
        {sel && t ? <>
          <p className="text-sm text-muted-foreground">{sel.area} · {sel.problem}</p>
          <h3 className="mt-2 text-2xl">{t.name}</h3>
          <p className="mt-3 text-muted-foreground">{sel.help}</p>
          <p className="mt-4 text-sm"><strong>{t.name}</strong>{t.duration && ` · ${t.duration}`}</p>
          <div className="mt-5 flex flex-wrap gap-3"><a href={CONTACT.beautinda} target="_blank" rel="noreferrer" className="btn btn-primary">Termin buchen</a><Button variant="ghost" className="btn btn-ghost" onClick={() => onShow(t.slug)}>Ansehen</Button></div>
        </> : <>
          <p className="text-sm text-muted-foreground">So geht es</p>
          <h3 className="mt-2 text-2xl">Tipp auf eine Stelle im Gesicht</h3>
          <p className="mt-3 text-muted-foreground">Wir zoomen ganz nah heran, zeigen dir das Problem und welche Behandlung dafür passt.</p>
        </>}
      </div>
    </div>
  </div>;
}
