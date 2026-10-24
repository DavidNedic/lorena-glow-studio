import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONTACT, TREATMENTS, ZOOM_AREAS, type ZoomArea } from "@/lib/data";

export function FaceZoom({ onShow }: { onShow: (slug: string) => void }) {
  const [sel, setSel] = useState<ZoomArea | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [done, setDone] = useState(false);
  const [fb, setFb] = useState<null | { reduced: boolean }>(null);
  const [returning, setReturning] = useState(false);
  const base = useRef<HTMLImageElement>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { token.current++; if (timer.current) clearTimeout(timer.current); if (returnTimer.current) clearTimeout(returnTimer.current); }, []);
  const vids = useRef<Record<string, HTMLVideoElement | null>>({});
  const token = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAll = () => { token.current++; if (timer.current) clearTimeout(timer.current); timer.current = null; setFb(null); Object.values(vids.current).forEach(v => { if (v) { v.pause(); try { v.currentTime = 0; } catch { /* ignore */ } } }); };
  const clear = () => { stopAll(); setReturning(false); setSel(null); setZoomed(false); setDone(false); };
  const reset = () => {
    if (fb && sel && !sel.video && zoomed && !returning) {
      token.current++; if (timer.current) clearTimeout(timer.current);
      const scale = base.current ? getComputedStyle(base.current).scale : "2.6";
      base.current?.style.setProperty("--fb-return-scale", scale === "none" ? "1" : scale);
      setReturning(true); setDone(false);
      returnTimer.current = setTimeout(clear, fb.reduced ? 600 : 1600);
    } else clear();
  };
  const pick = (a: ZoomArea) => {
    if (returnTimer.current) clearTimeout(returnTimer.current); setReturning(false); stopAll(); setDone(false); setSel(a);
    if (!a.video && a.x === undefined) { setZoomed(false); return; }
    setZoomed(true);
    const my = token.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fallback = () => { if (token.current !== my) return; if (timer.current) clearTimeout(timer.current); const v = vids.current[a.id]; v?.pause(); setFb({ reduced }); };
    const v = vids.current[a.id];
    if (!a.video || !v || reduced) { fallback(); return; }
    if (v.readyState === 0) v.load();
    v.playbackRate = 3;
    const p = v.play();
    if (p) p.catch(fallback);
    timer.current = setTimeout(() => { if (v.currentTime === 0) fallback(); }, 600);
  };
  const prep = (el: HTMLVideoElement | null) => { if (!el) return; el.muted = true; el.setAttribute("muted", ""); el.setAttribute("playsinline", ""); el.setAttribute("webkit-playsinline", ""); };
  const t = sel ? TREATMENTS.find(x => x.slug === sel.slug) : undefined;
  const active = zoomed && sel;

  return <div className="zoom-grid">
    <div className="zoom-stage" data-zoomed={zoomed}>
      <img ref={base} src="/zoom/face.jpg" alt="Gesicht eines Models im Fotostudio" className={`zoom-media zoom-base${fb && sel ? " zoom-fallback" : ""}`} data-held={!!fb && done && !returning} data-returning={returning} style={fb && sel ? { ["--fb-x" as string]: `${sel.x ?? 50}%`, ["--fb-y" as string]: `${sel.y ?? 50}%`, ["--fb-scale" as string]: !sel.video ? "2.6" : sel.x === undefined ? "1.25" : "3.5", ["--fb-dur" as string]: fb.reduced ? "0.6s" : "1.6s" } : undefined} onAnimationEnd={e => { if (!returning && fb && e.target === e.currentTarget && e.animationName === "zoom-fb") setDone(true); }} />
      {ZOOM_AREAS.filter(a => a.video).map(a => <video key={a.id} ref={el => { vids.current[a.id] = el; prep(el); }} src={`/zoom/${a.id}.mp4`} poster="/zoom/face.jpg" muted playsInline preload="metadata" className="zoom-media zoom-video" data-show={active && !fb && sel.id === a.id && !done} onEnded={() => setDone(true)} />)}
      {active && sel.video && <img key={sel.id} src={`/zoom/${sel.id}-4k.jpg`} alt={`Nahaufnahme ${sel.area}`} className="zoom-media zoom-4k" data-show={done} />}
      {!zoomed && ZOOM_AREAS.filter(a => a.x !== undefined).map(a => <Button variant="ghost" size="icon" key={a.id} type="button" className="zoom-dot" style={{ left: `${a.x}%`, top: `${a.y}%` }} onClick={() => pick(a)} aria-label={`${a.area} ansehen`}><span className="zoom-ring" /><span className="zoom-label">{a.area}</span></Button>)}
      {zoomed && <Button variant="ghost" type="button" className="zoom-back" onClick={reset} disabled={returning}>← Gesicht</Button>}
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
          <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="ghost" className="btn btn-primary"><a href={CONTACT.beautinda} target="_blank" rel="noreferrer">Termin buchen</a></Button><Button variant="ghost" className="btn btn-ghost" onClick={() => onShow(t.slug)}>Ansehen</Button></div>
        </> : <>
          <p className="text-sm text-muted-foreground">So geht es</p>
          <h3 className="mt-2 text-2xl">Tipp auf eine Stelle im Gesicht</h3>
          <p className="mt-3 text-muted-foreground">Wir zoomen ganz nah heran, zeigen dir das Problem und welche Behandlung dafür passt.</p>
        </>}
      </div>
    </div>
  </div>;
}
