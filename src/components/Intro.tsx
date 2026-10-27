import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
const birdMark = "/images/kolibri-gold.webp";
type Phase = "pending" | "intro" | "fly" | "done";
const ease = (x: number) => x * x * (3 - 2 * x);
export function IntroGate({ children }: { children: ReactNode }) {
 const [phase, setPhase] = useState<Phase>("pending");
 const pageRef = useRef<HTMLDivElement>(null), birdRef = useRef<HTMLDivElement>(null);
 const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(() => {
  if (sessionStorage.getItem("tg-intro") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("done"); return; }
  let cancelled = false;
  const image = new Image();
  image.src = birdMark;
  const ready = async () => {
   try { await image.decode(); } catch { /* Continue with the loaded image if decoding is unavailable. */ }
   if (cancelled) return;
   sessionStorage.setItem("tg-intro", "1");
   setPhase("intro");
   timers.current.push(setTimeout(() => setPhase("fly"), 3500));
  };
  void ready();
  return () => { cancelled = true; timers.current.forEach(clearTimeout); };
 }, []);
 useEffect(() => { if (phase !== "fly") return; const el = pageRef.current, bird = birdRef.current; if (!el || !bird) return; const start = performance.now(), endSize = Math.max(innerWidth,innerHeight)*12; let raf = 0; const step = () => { const p = Math.min((performance.now()-start)/1500,1), e = ease(p), size = 168*Math.pow(endSize/168,e); el.style.maskSize = `${size}px`; el.style.webkitMaskSize = `${size}px`; bird.style.opacity = String(1-Math.min(e*1.6,1)); if (p < 1) raf = requestAnimationFrame(step); else setPhase("done"); }; raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf); }, [phase]);
 const masked = phase !== "done";
 return <>{masked && <div className="intro-backdrop intro-screen fixed inset-0 z-50" aria-hidden={phase === "fly"}>
   <p className="absolute inset-x-5 top-10 text-center text-lg font-semibold md:text-2xl">The Golden Cosmetics & Academy</p>
   {phase !== "pending" && phase !== "fly" && <div className="flex h-full items-center justify-center"><div className="relative"><div className="relative size-[260px]"><div className="intro-bird absolute inset-[46px]"><img src={birdMark} alt="" loading="eager" decoding="sync" className="size-full object-contain" /></div></div><div className="absolute left-1/2 top-full mt-8 w-max max-w-[90vw] -translate-x-1/2 text-center"><p className="intro-title text-5xl font-semibold">Hallo!</p><p className="intro-subtitle mt-2 text-muted-foreground">Willkommen bei The Golden Cosmetics</p></div></div></div>}
   <Button variant="link" onClick={() => { timers.current.forEach(clearTimeout); setPhase("done"); }} className="absolute bottom-8 right-8 z-[60] text-muted-foreground">Überspringen</Button>
 </div>}<div ref={pageRef} className={masked ? "intro-screen pointer-events-none fixed inset-0 z-[55] overflow-hidden" : ""} style={masked ? { maskImage: `url(${birdMark})`, WebkitMaskImage: `url(${birdMark})`, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center", maskSize: phase === "fly" ? "168px" : "0px", WebkitMaskSize: phase === "fly" ? "168px" : "0px" } : undefined}>{children}{masked && <div ref={birdRef} className="intro-silhouette pointer-events-none fixed inset-0 z-[70]" />}</div></>;
}
