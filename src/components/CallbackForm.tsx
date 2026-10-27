import { useState } from "react";
import { Button } from "./ui/button";
import { notifyAcademyRequest } from "@/lib/member.functions";
const field = "w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring";
export function CallbackForm({ course, compact = false }: { course?: string; compact?: boolean }) {
 const [interest,setInterest]=useState("Weiß noch nicht"), [slot,setSlot]=useState("Vormittags"), [state,setState]=useState<"idle"|"busy"|"ok"|"fail">("idle");
 return <form className="mx-auto w-full max-w-[520px] space-y-4 text-center" onSubmit={async e=>{ e.preventDefault();const f=e.currentTarget;const d=new FormData(f);setState("busy");
  try { const r=await notifyAcademyRequest({data:{vorname:String(d.get("vorname")??""),nachname:String(d.get("nachname")??""),telefon:String(d.get("telefon")??""),email:String(d.get("email")??""),wuensche:String(d.get("wuensche")??""),zeitfenster:slot,interesse:course||interest}}); setState(r.ok?"ok":"fail"); if(r.ok) f.reset(); } catch { setState("fail"); } }}>
  <div className="grid gap-4 sm:grid-cols-2">
   <label className="block text-left"><span className="mb-2 block text-sm">Vorname</span><input required name="vorname" autoComplete="given-name" maxLength={80} className={field} /></label>
   <label className="block text-left"><span className="mb-2 block text-sm">Nachname</span><input required name="nachname" autoComplete="family-name" maxLength={80} className={field} /></label>
  </div>
  <label className="block text-left"><span className="mb-2 block text-sm">Handynummer</span><input required type="tel" name="telefon" autoComplete="tel" pattern={String.raw`[\+0-9\(\) \/\-]{6,30}`} className={field} /></label>
  <label className="block text-left"><span className="mb-2 block text-sm">E-Mail</span><input required type="email" name="email" autoComplete="email" maxLength={200} className={field} /></label>
  <fieldset><legend className="mb-3 w-full text-left text-sm">Wann darf ich dich anrufen?</legend><div className="flex flex-wrap gap-2">{["Vormittags","Nachmittags"].map(c=><Button key={c} type="button" variant="ghost" className="chip" data-active={slot===c} aria-pressed={slot===c} onClick={()=>setSlot(c)}>{c}</Button>)}</div></fieldset>
  <label className="block text-left"><span className="mb-2 block text-sm">Deine Wünsche (optional)</span><textarea name="wuensche" rows={3} maxLength={1000} className={`${field} !rounded-3xl resize-y`} /></label>
  {!compact&&<fieldset><legend className="mb-3 w-full text-sm">Interesse</legend><div className="flex flex-wrap justify-center gap-2">{["Fachliche Masterclass","Business & Mentoring","Weiß noch nicht"].map(c=><Button key={c} type="button" variant="ghost" className="chip whitespace-normal" data-active={interest===c} aria-pressed={interest===c} onClick={()=>setInterest(c)}>{c}</Button>)}</div></fieldset>}
  <Button type="submit" disabled={state==="busy"} className="btn btn-primary w-full">{state==="busy"?"Einen Moment …":"Jetzt Teilnahme sichern"}</Button>
  {state==="ok"&&<p role="status" className="text-sm">Danke! Deine Anfrage ist bei Lorena angekommen. Du bekommst gleich eine Bestätigung per E-Mail.</p>}
  {state==="fail"&&<p role="alert" className="text-sm">Das hat leider nicht geklappt. Bitte versuch es später erneut oder schreib Lorena per WhatsApp.</p>}
 </form>;
}
