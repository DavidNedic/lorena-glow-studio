import { useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TREATMENTS, type Treatment } from "@/lib/data";

export function TreatmentShop({ treatments, analysis = false, hit }: { treatments: Treatment[]; analysis?: boolean; hit: string | null }) {
 const [selected, setSelected] = useState<Treatment | null>(null);
 const [expanded, setExpanded] = useState(false);
 const first = TREATMENTS.find(t => t.group === "first");
 const showAll = expanded || treatments.some(t => t.slug === hit);
 const visible = showAll ? treatments : treatments.slice(0, 6);
 return <>
  <div className={`treatment-menu${analysis ? " treatment-menu-analysis" : ""}`}>{visible.map(t => <article key={t.slug} id={`t-${t.slug}`} className={`treatment-menu-item${hit === t.slug ? " shop-treatment-hit" : ""}`}>
   {analysis ? <>
    <Button variant="ghost" className="treatment-option" aria-label={`${t.name} ansehen`} aria-expanded={selected?.slug === t.slug} aria-controls={`option-${t.slug}`} onClick={() => setSelected(selected?.slug === t.slug ? null : t)}><span>{t.name}</span>{selected?.slug === t.slug ? <Minus aria-hidden="true"/> : <Plus aria-hidden="true"/>}</Button>
    {selected?.slug === t.slug && <div id={`option-${t.slug}`} className="treatment-option-detail"><p className="mt-2 text-xs">{t.duration}</p>{first && <Button asChild variant="link" className="mt-2 h-auto px-0 text-sm"><a href={first.bookingUrl} target="_blank" rel="noreferrer">Hautanalyse buchen <ArrowUpRight aria-hidden="true"/></a></Button>}</div>}
   </> : <div className="treatment-booking-row"><div className="min-w-0"><h4>{t.name}</h4><p className="mt-1 text-sm text-muted-foreground">{t.duration}{t.price ? ` · ${t.price}` : ""}</p></div><Button asChild className="btn btn-primary treatment-booking-button"><a href={t.bookingUrl} target="_blank" rel="noreferrer" aria-label={`${t.name} buchen`}>Buchen <ArrowUpRight aria-hidden="true"/></a></Button></div>}
  </article>)}</div>
  {treatments.length > 6 && <Button variant="outline" className="btn btn-ghost mt-6" onClick={() => setExpanded(!showAll)}>{showAll ? "Weniger anzeigen" : "Alle Behandlungen ansehen"}</Button>}
 </>;
}