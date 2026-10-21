import { useEffect, useRef, useState, type ReactNode } from "react";

type Phase = "pending" | "intro" | "swing" | "fly" | "done";
const easeInOutQuart = (x: number) => (x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2);

export function IntroGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("pending");
  const pageRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("tg-intro") || reduced) { setPhase("done"); return; }
    sessionStorage.setItem("tg-intro", "1");
    setPhase("intro");
    timers.current.push(setTimeout(() => setPhase("swing"), 3500));
    timers.current.push(setTimeout(() => setPhase("fly"), 4100));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "fly") return;
    const el = pageRef.current!, gold = goldRef.current!;
    const startS = 168, endS = Math.max(innerWidth, innerHeight) * 60;
    const t0 = performance.now(); let raf = 0;
    const step = () => {
      const p = Math.min((performance.now() - t0) / 1500, 1);
      const e = easeInOutQuart(p);
      const s = startS * Math.pow(endS / startS, e);
      el.style.setProperty("mask-size", `${s}px`); el.style.setProperty("-webkit-mask-size", `${s}px`);
      gold.style.opacity = String(1 - Math.min(e * 1.6, 1));
      if (p < 1) raf = requestAnimationFrame(step); else setPhase("done");
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const skip = () => { timers.current.forEach(clearTimeout); setPhase("done"); };
  const masked = phase !== "done";
  const maskStyle = masked ? {
    maskImage: "url(/images/kolibri-maske.png)", WebkitMaskImage: "url(/images/kolibri-maske.png)",
    maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
    maskPosition: "center", WebkitMaskPosition: "center",
    maskSize: phase === "fly" ? undefined : "0px", WebkitMaskSize: phase === "fly" ? undefined : "0px",
  } : {};

  return (
    <>
      {masked && (
        <div className="fixed inset-0 z-50 bg-ink" aria-hidden={phase === "fly"}>
          {phase !== "pending" && phase !== "fly" && (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="relative size-[260px]">
                <svg viewBox="0 0 260 260" className={`absolute inset-0 transition-opacity duration-500 ${phase === "swing" ? "opacity-0" : ""}`}>
                  <circle cx="130" cy="130" r="122" fill="none" stroke="#C9A055" strokeWidth="1" className="intro-ring" />
                </svg>
                <div className="absolute inset-[46px] overflow-hidden">
                  <img src="/images/logo.png" alt="" className="intro-bird size-full transition-transform duration-500"
                    style={phase === "swing" ? { transform: "scale(.88) rotate(-4deg)" } : undefined} />
                  <span className="intro-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-paper/40 blur-md" />
                </div>
              </div>
              <div className={`mt-8 text-center transition-opacity duration-500 ${phase === "swing" ? "opacity-0" : ""}`}>
                <p className="intro-text hand text-5xl text-gold">Hallo!</p>
                <p className="intro-text2 mt-2 text-paper/80">Willkommen bei The Golden Cosmetics</p>
              </div>
            </div>
          )}
          <button onClick={skip} className="btn absolute bottom-8 right-8 z-[60] border border-paper/20 px-4 py-2 text-sm text-paper/80">Überspringen</button>
        </div>
      )}
      <div ref={pageRef} className={masked ? "relative z-[55]" : ""} style={maskStyle}>
        {children}
        {masked && <div ref={goldRef} className="pointer-events-none fixed inset-0 z-[70] bg-gold" />}
      </div>
    </>
  );
}
