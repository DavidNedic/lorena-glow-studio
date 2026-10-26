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

// Behandlung: goldene Linien-Zeichnung eines Gesichts im Profil (zeichnet sich selbst, dann Glanz).
type Seg = ["M", number, number] | ["C", number, number, number, number, number, number];
const FACE: Seg[] = [["M",0.36,0.11],["C",0.47,0.085,0.575,0.15,0.59,0.27],["C",0.595,0.31,0.582,0.34,0.585,0.365],["C",0.595,0.405,0.632,0.45,0.66,0.495],["C",0.672,0.515,0.655,0.535,0.622,0.538],["C",0.614,0.552,0.634,0.566,0.63,0.585],["C",0.626,0.598,0.606,0.6,0.602,0.606],["C",0.625,0.616,0.624,0.645,0.6,0.658],["C",0.585,0.668,0.582,0.684,0.596,0.705],["C",0.61,0.73,0.59,0.765,0.54,0.775],["C",0.5,0.783,0.485,0.81,0.49,0.85],["C",0.494,0.88,0.505,0.905,0.52,0.94]];
const HAIR: Seg[] = [["M",0.36,0.11],["C",0.25,0.13,0.19,0.23,0.205,0.35],["C",0.215,0.43,0.26,0.47,0.27,0.54],["C",0.285,0.63,0.25,0.7,0.3,0.78],["C",0.33,0.83,0.37,0.86,0.36,0.94]];
const WAVE: Seg[] = [["M",0.33,0.18],["C",0.27,0.26,0.3,0.36,0.34,0.42],["C",0.38,0.48,0.35,0.56,0.32,0.62]];
const LIP: Seg[] = [["M",0.603,0.606],["C",0.596,0.608,0.588,0.607,0.582,0.604]];
const LASH: Seg[] = [["M",0.508,0.392],["C",0.524,0.414,0.553,0.416,0.57,0.398]];
const LASH_TIPS: [number, number][] = [[0.515,0.403],[0.527,0.409],[0.54,0.411],[0.553,0.41],[0.564,0.405]];
function segLength(segs: Seg[]) {
 let len = 0, px = 0, py = 0;
 for (const g of segs) {
  if (g[0] === "M") { px = g[1]; py = g[2]; continue; }
  const [, x1, y1, x2, y2, x3, y3] = g; let lx = px, ly = py;
  for (let i = 1; i <= 24; i++) { const u = i / 24, v = 1 - u; const x = v*v*v*px + 3*v*v*u*x1 + 3*v*u*u*x2 + u*u*u*x3, y = v*v*v*py + 3*v*v*u*y1 + 3*v*u*u*y2 + u*u*u*y3; len += Math.hypot(x - lx, y - ly); lx = x; ly = y; }
  px = x3; py = y3;
 }
 return len;
}
const LENS = { face: segLength(FACE), hair: segLength(HAIR), wave: segLength(WAVE) };
function trace(ctx: CanvasRenderingContext2D, segs: Seg[], ox: number, oy: number, s: number) {
 ctx.beginPath();
 for (const g of segs) { if (g[0] === "M") ctx.moveTo(ox + g[1] * s, oy + g[2] * s); else ctx.bezierCurveTo(ox + g[1] * s, oy + g[2] * s, ox + g[3] * s, oy + g[4] * s, ox + g[5] * s, oy + g[6] * s); }
}
function drawFace(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dpr: number) {
 const s = h * 0.9, ox = w / 2 - s * 0.43, oy = h / 2 - s * 0.525;
 const fade = 1 - ease(clamp((t - 5.2) / 0.8));
 if (fade <= 0) return;
 const draw = ease(clamp(t / 2.4));
 const sweep = clamp((t - 2.4) / 2.2) * 1.6 - 0.3;
 const gold = ctx.createLinearGradient(ox + s * 0.2, oy + s * 0.1, ox + s * 0.7, oy + s * 0.95);
 gold.addColorStop(0, "#9C7434"); gold.addColorStop(0.5, "#C9A24B"); gold.addColorStop(1, "#A97E3A");
 const shine = ctx.createLinearGradient(ox + s * 0.2, oy + s * 0.1, ox + s * 0.7, oy + s * 0.95);
 const c = clamp(sweep);
 shine.addColorStop(clamp(c - 0.12), "rgba(255,244,214,0)"); shine.addColorStop(c, "rgba(255,244,214,0.95)"); shine.addColorStop(clamp(c + 0.12), "rgba(255,244,214,0)");
 ctx.save();
 ctx.globalAlpha = fade; ctx.lineCap = "round"; ctx.lineJoin = "round";
 ctx.shadowColor = "rgba(150,105,50,0.25)"; ctx.shadowBlur = 4 * dpr;
 const line = (segs: Seg[], len: number, width: number, alpha = 1) => {
  ctx.globalAlpha = fade * alpha; ctx.lineWidth = width * dpr;
  ctx.setLineDash([len * s * draw, len * s]); trace(ctx, segs, ox, oy, s);
  ctx.strokeStyle = gold; ctx.stroke();
  if (sweep > -0.2 && sweep < 1.2) { ctx.strokeStyle = shine; ctx.stroke(); }
 };
 line(FACE, LENS.face, 2.2); line(HAIR, LENS.hair, 2.2); line(WAVE, LENS.wave, 1.6, 0.55);
 ctx.setLineDash([]);
 const detail = ease(clamp((t - 1.9) / 0.6));
 if (detail > 0) {
  ctx.globalAlpha = fade * detail; ctx.strokeStyle = gold;
  ctx.lineWidth = 2 * dpr; trace(ctx, LASH, ox, oy, s); ctx.stroke(); trace(ctx, LIP, ox, oy, s); ctx.stroke();
  ctx.lineWidth = 1.3 * dpr; ctx.beginPath();
  for (const [x, y] of LASH_TIPS) { ctx.moveTo(ox + x * s, oy + y * s); ctx.lineTo(ox + (x - 0.005) * s, oy + (y + 0.017) * s); }
  ctx.stroke();
 }
 ctx.restore();
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
   if (variant === "behandlung") { background(ctx, w, h, t, "#FBF5F0", "#EBD6CB", 0.35); drawFace(ctx, w, h, t, dpr); }
   else { background(ctx, w, h, t, "#D9BDB2", "#B98A7D", 0.22); drawBird(ctx, w, h, t, bird); }
   particles(ctx, w, h, t, ps, dpr);
  };
  const still = variant === "behandlung" ? 3.4 : 3;
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
