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

// Behandlung: goldene Lotusblüte öffnet sich, dann Schein, Glanz und Funkeln.
function goldGrad(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
 const g = ctx.createLinearGradient(x0, y0, x1, y1);
 g.addColorStop(0, "#9C7434"); g.addColorStop(0.5, "#C9A24B"); g.addColorStop(1, "#A97E3A");
 return g;
}
function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number, a: number, dpr: number) {
 ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#FFF4D6"; ctx.shadowColor = "rgba(255,230,170,0.95)"; ctx.shadowBlur = 10 * dpr;
 ctx.beginPath();
 for (let j = 0; j < 8; j++) { const rr = j % 2 ? r * 0.2 : r; const an = j * Math.PI / 4 + rot; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
 ctx.closePath(); ctx.fill(); ctx.restore();
}
const PETALS: [number, number, number][] = [[0, 1, 0.95], [-0.42, 0.9, 0.85], [0.42, 0.9, 0.85], [-0.85, 0.75, 0.7], [0.85, 0.75, 0.7], [-1.25, 0.55, 0.55], [1.25, 0.55, 0.55]];
function drawLotus(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dpr: number) {
 const cx = w / 2, cy = h * 0.66, s = h * 0.5;
 const fade = 1 - ease(clamp((t - 5.2) / 0.8));
 if (fade <= 0) return;
 const halo = ease(clamp((t - 2.2) / 1.5)) * fade;
 const hg = ctx.createRadialGradient(cx, cy - s * 0.35, 0, cx, cy - s * 0.35, s * 0.9);
 hg.addColorStop(0, `rgba(255,236,190,${0.55 * halo})`); hg.addColorStop(1, "rgba(255,236,190,0)");
 ctx.fillStyle = hg; ctx.fillRect(0, 0, w, h);
 const open = ease(clamp((t - 1.2) / 2));
 const gold = goldGrad(ctx, cx - s, cy - s, cx + s, cy);
 const sw = clamp((t - 3.2) / 1.6) * 1.6 - 0.3;
 ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowColor = "rgba(150,105,50,0.25)"; ctx.shadowBlur = 4 * dpr;
 PETALS.forEach(([ang0, len, wid], i) => {
  const d = ease(clamp((t - i * 0.12) / 1.2));
  if (d <= 0) return;
  const ang = ang0 * (0.35 + 0.65 * open), L = len * s * (0.75 + 0.25 * open), W = wid * s * 0.32;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-W, -L * 0.35, -W * 0.55, -L * 0.85, 0, -L); ctx.bezierCurveTo(W * 0.55, -L * 0.85, W, -L * 0.35, 0, 0);
  ctx.globalAlpha = fade * 0.12 * open; ctx.fillStyle = "#E8C88A"; ctx.fill();
  ctx.globalAlpha = fade; ctx.lineWidth = 2.1 * dpr; ctx.setLineDash([L * 2.6 * d, L * 3]); ctx.strokeStyle = gold; ctx.stroke();
  if (sw > -0.2 && sw < 1.2) {
   const sh = ctx.createLinearGradient(-W, -L, W, 0); const c = clamp(sw);
   sh.addColorStop(clamp(c - 0.12), "rgba(255,246,222,0)"); sh.addColorStop(c, "rgba(255,248,228,0.95)"); sh.addColorStop(clamp(c + 0.12), "rgba(255,246,222,0)");
   ctx.strokeStyle = sh; ctx.stroke();
  }
  ctx.setLineDash([]); ctx.restore();
 });
 const wl = ease(clamp((t - 0.4) / 1.2));
 ctx.globalAlpha = fade * 0.7; ctx.strokeStyle = gold; ctx.lineWidth = 1.6 * dpr;
 ctx.beginPath(); ctx.moveTo(cx - s * wl * 0.9, cy + 8 * dpr); ctx.bezierCurveTo(cx - s * 0.3 * wl, cy + 2 * dpr, cx + s * 0.3 * wl, cy + 14 * dpr, cx + s * wl * 0.9, cy + 8 * dpr); ctx.stroke();
 ctx.restore();
 for (const [x, y, st] of [[cx - s * 0.55, cy - s * 0.75, 3.3], [cx + s * 0.6, cy - s * 0.55, 3.8], [cx + s * 0.05, cy - s * 1.08, 4.2]] as [number, number, number][]) {
  const k = clamp((t - st) / 0.9);
  if (k <= 0 || k >= 1) continue;
  star(ctx, x, y, (7 + 11 * Math.sin(Math.PI * k)) * dpr, k * 0.8, Math.sin(Math.PI * k) * fade, dpr);
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
   if (variant === "behandlung") { background(ctx, w, h, t, "#FBF5F0", "#EBD6CB", 0.35); drawLotus(ctx, w, h, t, dpr); }
   else { background(ctx, w, h, t, "#D9BDB2", "#B98A7D", 0.22); drawBird(ctx, w, h, t, bird); }
   particles(ctx, w, h, t, ps, dpr);
  };
  const still = variant === "behandlung" ? 4.0 : 3;
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
