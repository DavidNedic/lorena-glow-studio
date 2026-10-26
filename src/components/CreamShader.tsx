import { useEffect, useRef } from "react";

const FRAG = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec3 drops[8];
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;
 vec2 asp=vec2(r.x/r.y,1.);
 vec2 p=uv*asp*1.35;
 float off=0.;
 for(int i=0;i<8;i++){vec3 d=drops[i]; float age=t-d.z; if(age>0.&&age<4.){
   vec2 dp=(uv-d.xy)*asp; float dist=length(dp);
   off+=sin(dist*34.-age*5.)*exp(-dist*5.)*exp(-age*1.2)*.03;}}
 float tt=t*.025;
 vec2 q=vec2(fbm(p+tt),fbm(p+vec2(5.2,1.3)-tt));
 float f=fbm(p+1.5*q+off*4.);
 vec3 cream=vec3(.984,.962,.942), blush=vec3(.972,.902,.868), petal=vec3(.958,.874,.852);
 vec3 c=mix(cream,blush,smoothstep(.2,.85,f));
 c=mix(c,petal,smoothstep(.6,1.,f)*.4);
 for(int i=0;i<3;i++){
  float fi=float(i);
  vec2 cp=vec2(.5+.36*sin(tt*2.2+fi*2.1),.5+.32*cos(tt*1.8+fi*1.7))*asp;
  float dgl=1.-smoothstep(0.,.8,length(uv-cp)/length(asp));
  vec3 tint=fi<1.?vec3(1.,.945,.9):fi<2.?vec3(1.,.965,.94):vec3(.99,.955,.925);
  c=mix(c,tint,dgl*.32);
 }
 float sheen=smoothstep(.55,.95,fbm(p*.85+q*2.+off*6.));
 c=mix(c,vec3(1.,.996,.988),sheen*.22+off*1.6);
 gl_FragColor=vec4(c,.76);
}`;

export function CreamShader() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = cv.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type); if (!s) return null; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    if (!pr) return;
    const vertex = sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}");
    const fragment = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vertex || !fragment) return;
    gl.attachShader(pr, vertex); gl.attachShader(pr, fragment);
    gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uD = gl.getUniformLocation(pr, "drops");
    const drops = new Float32Array(24).fill(-99); let di = 0;
    const start = performance.now(); const now = () => (performance.now() - start) / 1000;
    const drop = (x: number, y: number) => { drops.set([x, y, now()], di * 3); di = (di + 1) % 8; };
    let lastMove = 0;
    const onMove = (e: PointerEvent) => { if (now() - lastMove > 0.35) { lastMove = now(); drop(e.clientX / innerWidth, 1 - e.clientY / innerHeight); } };
    const onClick = (e: PointerEvent) => drop(e.clientX / innerWidth, 1 - e.clientY / innerHeight);
    addEventListener("pointermove", onMove); addEventListener("pointerdown", onClick);
    let auto: ReturnType<typeof setTimeout>;
    const autoDrop = () => { drop(Math.random(), Math.random()); auto = setTimeout(autoDrop, 3000 + Math.random() * 2000); };
    auto = setTimeout(autoDrop, 1500);
    let lw = 0;
    const resize = () => { if (innerWidth === lw && cv.width > 0) return; lw = innerWidth; const d = Math.min(devicePixelRatio, 1.5) * 0.6; cv.width = innerWidth * d; cv.height = Math.max(innerHeight, screen.height) * d; gl.viewport(0, 0, cv.width, cv.height); };
    resize(); addEventListener("resize", resize);
    let raf = 0;
    const loop = () => { gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, now()); gl.uniform3fv(uD, drops); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); raf = requestAnimationFrame(loop); };
    loop();
    return () => { cancelAnimationFrame(raf); clearTimeout(auto); removeEventListener("pointermove", onMove); removeEventListener("pointerdown", onClick); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 h-lvh w-full" />;
}
