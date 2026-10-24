import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
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
  <div className="treatment-shop-grid">{visible.map(t => <article key={t.slug} id={`t-${t.slug}`} className={`shop-treatment${hit === t.slug ? "shop-treatment-hit" : ""}`}>
   <Button variant="ghost" className="shop-image-button" onClick={() => setSelected(t)} aria-label={`${t.name} ansehen`}><img src={t.image} alt={`Einblick bei The Golden Cosmetics: ${t.name}`} loading="lazy" className="shop-treatment-image"/><span className="shop-image-label">{analysis ? "Individuell abgestimmt" : "Online buchbar"}</span></Button>
   <div className="shop-treatment-info"><p className="text-xs text-muted-foreground">{t.duration}</p><h4>{t.name}</h4>{t.price && !analysis && <p className="shop-price">{t.price}</p>}
    {analysis ? <Button variant="outline" className="shop-cta" onClick={() => setSelected(t)}>Ansehen <ArrowUpRight aria-hidden="true"/></Button> : <Button asChild className="btn btn-primary shop-cta"><a href={t.bookingUrl} target="_blank" rel="noreferrer" aria-label={`${t.name} buchen`}>Buchen <ArrowUpRight aria-hidden="true"/></a></Button>}
   </div>
  </article>)}</div>
  {treatments.length > 6 && <Button variant="outline" className="btn btn-ghost mt-6" onClick={() => setExpanded(!showAll)}>{showAll ? "Weniger anzeigen" : "Alle Behandlungen ansehen"}</Button>}
  <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="shop-dialog">{selected && <><DialogHeader><DialogTitle>{selected.name}</DialogTitle><DialogDescription>{selected.duration}{selected.price && !analysis ? ` · ${selected.price}` : ""}</DialogDescription></DialogHeader><p className="text-sm text-muted-foreground">{selected.sentence}</p>{analysis && <p className="text-sm text-muted-foreground">Ob diese Behandlung zu dir passt, entscheiden wir gemeinsam bei deiner Hautanalyse.</p>}<Button asChild className="btn btn-primary"><a href={analysis ? first?.bookingUrl : selected.bookingUrl} target="_blank" rel="noreferrer">{analysis ? "Hautanalyse buchen" : "Jetzt buchen"}<ArrowUpRight aria-hidden="true"/></a></Button></>}</DialogContent></Dialog>
 </>;
}