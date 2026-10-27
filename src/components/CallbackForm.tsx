import { useState } from "react";
import { Button } from "./ui/button";
import { whatsappUrl } from "@/lib/data";
import { notifyAcademyRequest } from "@/lib/member.functions";
export function CallbackForm({ course, compact = false }: { course?: string; compact?: boolean }) {
 const [interest,setInterest]=useState("Weiß noch nicht"), [prepared,setPrepared]=useState(false), [href,setHref]=useState("");
 return <form className="mx-auto w-full max-w-[520px] space-y-4 text-center" onSubmit={e=>{ e.preventDefault();const data=new FormData(e.currentTarget);const url=whatsappUrl(`Hi Lorena, ich möchte ein Kennenlerngespräch anfragen. Mein Vorname: ${data.get("vorname")}. Meine Handynummer: ${data.get("telefon")}. Interesse: ${course || interest}.`);setHref(url);setPrepared(true);window.open(url,"_blank","noopener,noreferrer");notifyAcademyRequest({data:{vorname:String(data.get("vorname")??""),telefon:String(data.get("telefon")??""),interesse:course||interest}}).catch(()=>{}); }}>
 <label className="block text-left"><span className="mb-2 block text-sm">Vorname</span><input required name="vorname" autoComplete="given-name" maxLength={80} className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
 <label className="block text-left"><span className="mb-2 block text-sm">Handynummer</span><input required type="tel" name="telefon" autoComplete="tel" pattern="[+0-9() /-]{6,30}" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
 {!compact&&<fieldset><legend className="mb-3 w-full text-sm">Interesse</legend><div className="flex flex-wrap justify-center gap-2">{["Fachliche Masterclass","Business & Mentoring","Weiß noch nicht"].map(c=><Button key={c} type="button" variant="ghost" className="chip whitespace-normal" data-active={interest===c} aria-pressed={interest===c} onClick={()=>setInterest(c)}>{c}</Button>)}</div></fieldset>}
 <Button type="submit" className="btn btn-primary w-full">Jetzt Teilnahme sichern</Button><p className="text-xs text-muted-foreground">Deine Anfrage geht an Lorena per E-Mail und öffnet WhatsApp. Bitte sende die vorbereitete Nachricht dort ab.</p>
 {prepared&&<p role="status" className="text-sm">Deine Nachricht ist vorbereitet. <a href={href} target="_blank" rel="noreferrer" className="underline">In WhatsApp öffnen und senden</a></p>}
 </form>;
}
