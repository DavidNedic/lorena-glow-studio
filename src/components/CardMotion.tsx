import { useEffect, useRef } from "react";

type Variant = "behandlung" | "academy";
const LOOP = 6;
const ease = (x: number) => x * x * (3 - 2 * x);
const clamp = (x: number) => Math.max(0, Math.min(1, x));

type P = { x: number; y: number; r: number; s: number; ph: number };
function makeParticles(n: number): P[] {
 let seed = n * 7919;
 const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
 return Array.from({ length: n }, () => ({ x: rnd(), y: rnd(), r: 0.6 + rnd() * 1.6, s: 1 + Math.floor(rnd() * 2), ph: rnd() * Math.PI * 2 }));
}

function background(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, a: string, b: string, hiAlpha: number) {
 const g = ctx.createLinearGradient(0, 0, w, h);
 g.addColorStop(0, a); g.addColorStop(1, b);
 ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
 const k = (t / LOOP) * Math.PI * 2;
 for (let i = 0; i < 3; i++) {
  const cx = w * (0.5 + 0.35 * Math.sin(k + i * 2.1));
  const cy = h * (0.5 + 0.3 * Math.cos(k + i * 1.7));
  const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.45);
  rg.addColorStop(0, `rgba(255,252,247,${hiAlpha})`); rg.addColorStop(1, "rgba(255,252,247,0)");
  ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
 }
}

function particles(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, ps: P[], dpr: number) {
 const f = t / LOOP;
 for (const p of ps) {
  const y = ((p.y - f * p.s) % 1 + 1) % 1;
  const a = 0.35 + 0.35 * Math.sin(f * Math.PI * 2 * 2 + p.ph);
  const edge = Math.min(1, y * 6, (1 - y) * 6);
  ctx.fillStyle = `rgba(216,178,106,${a * edge})`;
  ctx.beginPath(); ctx.arc(p.x * w, y * h, p.r * dpr, 0, Math.PI * 2); ctx.fill();
 }
}

function drawDrop(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dpr: number) {
 const cx = w / 2, cy = h * 0.58;
 if (t < 1.3) {
  const y = -h * 0.1 + (cy - -h * 0.1) * (t / 1.3) ** 2;
  const rx = h * 0.04, ry = h * 0.055;
  const g = ctx.createRadialGradient(cx - rx * 0.3, y - ry * 0.3, 0, cx, y, ry);
  g.addColorStop(0, "#E2B3A3"); g.addColorStop(1, "#C98B78");
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.ellipse(cx - rx * 0.35, y - ry * 0.4, rx * 0.22, ry * 0.16, -0.5, 0, Math.PI * 2); ctx.fill();
  return;
 }
 const age = t - 1.3;
 const fade = 1 - ease(clamp((t - 4.6) / 1.2));
 const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.25);
 sg.addColorStop(0, `rgba(201,139,120,${0.28 * fade * Math.exp(-age * 0.5)})`); sg.addColorStop(1, "rgba(201,139,120,0)");
 ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
 for (let i = 0; i < 5; i++) {
  const ra = age - i * 0.35; if (ra <= 0) continue;
  const r = ra * w * 0.12;
  const a = Math.exp(-ra * 0.7) * fade;
  ctx.lineWidth = 2 * dpr;
  ctx.strokeStyle = `rgba(201,139,120,${0.5 * a})`;
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.32, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1 * dpr;
  ctx.strokeStyle = `rgba(255,255,255,${0.8 * a})`;
  ctx.beginPath(); ctx.ellipse(cx, cy - 2 * dpr, r, r * 0.32, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
 }
}

function drawBird(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, bird: HTMLCanvasElement | null) {
 if (!bird) return;
 const a = ease(clamp(t / 1.4)) * (1 - ease(clamp((t - 5.2) / 0.8)));
 if (a <= 0) return;
 const bh = h * 0.55, bw = bh * (bird.width / bird.height);
 const x = (w - bw) / 2, y = (h - bh) / 2;
 const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, bh * 0.75);
 glow.addColorStop(0, `rgba(255,225,170,${0.45 * a})`); glow.addColorStop(1, "rgba(255,225,170,0)");
 ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
 // sweep position over bird
 const sp = (t / LOOP) * 1.6 - 0.3;
 const off = document.createElement("canvas"); off.width = Math.ceil(bw); off.height = Math.ceil(bh);
 const o = off.getContext("2d")!;
 const g = o.createLinearGradient(0, 0, bw, bh);
 g.addColorStop(0, "#9C7434"); g.addColorStop(0.55, "#D8B26A"); g.addColorStop(1, "#FFF1C9");
 o.fillStyle = g; o.fillRect(0, 0, bw, bh);
 const s = o.createLinearGradient(0, 0, bw, bh);
 const c = clamp(sp);
 s.addColorStop(clamp(c - 0.08), "rgba(255,255,255,0)"); s.addColorStop(c, "rgba(255,255,255,0.75)"); s.addColorStop(clamp(c + 0.08), "rgba(255,255,255,0)");
 o.fillStyle = s; o.fillRect(0, 0, bw, bh);
 o.globalCompositeOperation = "destination-in"; o.drawImage(bird, 0, 0, bw, bh);
 ctx.globalAlpha = a;
 ctx.shadowColor = "rgba(90,60,30,0.35)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
 ctx.drawImage(off, x, y);
 ctx.shadowColor = "transparent"; ctx.globalAlpha = 1;
}

export function CardMotion({ variant, hostRef }: { variant: Variant; hostRef?: React.RefObject<HTMLElement | null> }) {
 const ref = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  const cv = ref.current; if (!cv) return;
  const ctx = cv.getContext("2d"); if (!ctx) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ps = makeParticles(variant === "behandlung" ? 36 : 56);
  let bird: HTMLCanvasElement | null = null;
  let dpr = 1;
  const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); const r = cv.getBoundingClientRect(); cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr); };
  resize();
  const draw = (t: number) => {
   const w = cv.width, h = cv.height;
   if (variant === "behandlung") { background(ctx, w, h, t, "#FBF5F0", "#EBD6CB", 0.35); drawDrop(ctx, w, h, t, dpr); }
   else { background(ctx, w, h, t, "#D9BDB2", "#B98A7D", 0.22); drawBird(ctx, w, h, t, bird); }
   particles(ctx, w, h, t, ps, dpr);
  };
  const still = variant === "behandlung" ? 2.6 : 3;
  if (variant === "academy") {
   const img = new Image(); img.src = "/images/kolibri-maske.png";
   img.onload = () => { const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext("2d")!.drawImage(img, 0, 0); bird = c; if (reduced || !running) draw(reduced ? still : time); };
  }
  let time = 0, last = 0, raf = 0, running = false, speed = 1;
  const loop = (now: number) => { const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; time = (time + dt * speed) % LOOP; draw(time); raf = requestAnimationFrame(loop); };
  const start = () => { if (running || reduced) return; running = true; last = 0; raf = requestAnimationFrame(loop); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  draw(reduced ? still : 0);
  const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), { threshold: 0.1 });
  io.observe(cv);
  const host = hostRef?.current;
  const fast = () => { speed = 1.3; }, slow = () => { speed = 1; };
  host?.addEventListener("mouseenter", fast); host?.addEventListener("mouseleave", slow);
  const onResize = () => { resize(); if (!running) draw(reduced ? still : time); };
  addEventListener("resize", onResize);
  return () => { stop(); io.disconnect(); removeEventListener("resize", onResize); host?.removeEventListener("mouseenter", fast); host?.removeEventListener("mouseleave", slow); };
 }, [variant, hostRef]);
 return <canvas ref={ref} aria-hidden="true" className="choice-image size-full object-cover" />;
}
