import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ActionLink, Footer, FloatingNav, InstagramLink, Label, Section, SimpleAccordion, Slider, useScrollToHash } from "@/components/site";
import { Button } from "@/components/ui/button";
import { ChatAssistant } from "@/components/ChatAssistant";
import { FaceZoom } from "@/components/FaceZoom";
import { BeforeAfter } from "@/components/BeforeAfter";
import { MemberPopup } from "@/components/MemberPopup";
import { CONTACT, RESULT_PHOTOS, TREATMENTS, type Treatment } from "@/lib/data";
import { BEAUTY_SALON, OG, breadcrumbs, seoHead } from "@/lib/seo";
export const FAQ=[{q:"Wie läuft mein erster Termin ab?",a:"Wir starten mit einer Hautanalyse und wählen die passende erste Behandlung. Am einfachsten buchst du First Time: Hautanalyse + erste Behandlung."},{q:"Welche Behandlung passt zu mir?",a:"Tipp oben im Gesicht an, wo du etwas verändern möchtest, oder frag den Assistenten unten rechts. Final entscheiden wir gemeinsam bei deiner Hautanalyse."},{q:"Wie bereite ich mich vor?",a:"Komm am besten ungeschminkt. So kann ich deine Haut direkt beurteilen."},{q:"Kann ich meinen Termin verschieben oder absagen?",a:<>Ja, bis 24 Stunden vor deinem Termin kostenlos. Bei einer späteren Absage oder wenn du nicht erscheinst, werden 50 % des Behandlungspreises fällig, diese sind nicht erstattbar. Alles Weitere steht in den <Link to="/rechtliches" hash="agb" className="underline">AGB</Link>.</>},{q:"Gibt es Gutscheine?",a:"Ja, schreib mir per WhatsApp, dann besprechen wir deinen Gutschein."},{q:"Behandelst du auch Männer?",a:"Ja, auch für Männer starten wir mit First Time: Hautanalyse + erste Behandlung."}];
export const Route=createFileRoute("/behandlungen/")({head:()=>seoHead({path:"/behandlungen",title:"Kosmetik & Wimpern in Brackenheim · The Golden Cosmetics",description:"Hautanalyse, Lashlifting, Browlifting und Wimpernverlängerung bei Fachkosmetikerin Lorena Kovacevic in Brackenheim bei Heilbronn. Jetzt Termin buchen.",image:OG.behandlungen,jsonLd:[BEAUTY_SALON,{"@context":"https://schema.org","@type":"FAQPage",mainEntity:FAQ.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:typeof f.a==="string"?f.a:"Ja, bis 24 Stunden vor deinem Termin kostenlos. Bei einer späteren Absage oder wenn du nicht erscheinst, werden 50 % des Behandlungspreises fällig, diese sind nicht erstattbar. Alles Weitere steht in den AGB."}}))},breadcrumbs([["Start","/"],["Behandlungen","/behandlungen"]])]}),component:Behandlungen});
const BOOK={label:"Termin buchen",href:CONTACT.beautinda,external:true};
function Row({t,hit,bookable}:{t:Treatment;hit:boolean;bookable:boolean}){
 return <div id={`t-${t.slug}`} className={`treat-row${hit?" treat-row-hit":""}`}>
  <span className="min-w-0"><span className="block font-semibold">{t.name}</span><span className="mt-0.5 block text-sm text-muted-foreground">{t.duration}{t.price?` · ${t.price}`:""}</span></span>
  <span className="flex shrink-0 items-center gap-3">
   {t.detail&&<Link to="/behandlungen/$slug" params={{slug:t.slug}} className="text-sm underline underline-offset-4">Ablauf</Link>}
   {bookable&&<a href={CONTACT.beautinda} target="_blank" rel="noreferrer" className="treat-book">Buchen</a>}
  </span>
 </div>;
}
function Behandlungen(){
 const [hit,setHit]=useState<string|null>(null);const [sel,setSel]=useState<string|null>(null);useScrollToHash();
 const first=TREATMENTS.find(t=>t.group==="first")!;
 const pick=(slug:string)=>{setHit(slug);setTimeout(()=>document.getElementById(`t-${slug}`)?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}),50);setTimeout(()=>setHit(null),2600);};
 return <div className="min-h-screen bg-background text-foreground"><FloatingNav back="/" links={[{label:"Behandlungen",href:"#behandlungen"},{label:"Über Lorena",href:"#lorena"},{label:"Kontakt",href:"#kontakt"}]} cta={BOOK}/>
 <Section className="site-hero"><h1>Schöne Haut beginnt damit, sie zu verstehen.</h1><p className="section-copy mt-6 text-lg text-muted-foreground">Hautästhetik mit Anspruch. Individuelle Behandlungen, moderne Skin-Konzepte und fundiertes Fachwissen, abgestimmt auf die Bedürfnisse deiner Haut.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><ActionLink href={CONTACT.beautinda} external>Termin buchen</ActionLink><ActionLink href="#behandlungen" secondary>Behandlungen ansehen</ActionLink></div><a href={CONTACT.beautinda} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm text-muted-foreground">5,0 von 5 · Bewertungen auf Beautinda</a><img src="/img/einblick-5.jpg" alt="Behandlungsraum von The Golden Cosmetics in Brackenheim mit beleuchtetem Logo" className="hero-picture" style={{objectPosition:"50% 12%"}}/></Section>
 <Section id="zoom"><h2 className="section-copy text-3xl md:text-5xl">Wo möchtest du etwas verändern?</h2><p className="section-copy mt-4 text-muted-foreground">Tipp auf eine Stelle. Wir zoomen ganz nah heran und zeigen dir, was dahintersteckt.</p><FaceZoom onShow={pick}/></Section>
 <Section id="behandlungen"><h2 className="text-4xl md:text-5xl">Behandlungen</h2>
  <div className="first-box mx-auto mt-6 max-w-4xl">
   <p className="text-sm text-muted-foreground">Neu bei mir? Hier startest du.</p>
   <h3 className="mt-2 text-2xl md:text-3xl">{first.name}</h3>
   <p className="mt-3 text-muted-foreground">{first.duration}. Lorena schaut sich deine Haut genau an und behandelt direkt passend.</p>
   <div className="mt-6 flex flex-wrap gap-3"><ActionLink href={CONTACT.beautinda} external>Direkt buchen</ActionLink><Button asChild variant="ghost" className="btn btn-ghost"><Link to="/behandlungen/$slug" params={{slug:first.slug}}>Ablauf ansehen</Link></Button></div>
  </div>
  <div className="treat-cards mx-auto max-w-5xl">
   <div className="treat-card"><h3 className="text-xl">Direkt online buchen</h3><p className="mt-1 text-sm text-muted-foreground">Ohne Vorgespräch, wähl einfach deinen Termin.</p><div className="mt-4">{TREATMENTS.filter(t=>t.group==="direct").map(t=><Row key={t.slug} t={t} hit={hit===t.slug} bookable/>)}</div></div>
   <div className="treat-card"><h3 className="text-xl">Dein Weg zu deiner Haut</h3><p className="mt-1 text-sm text-muted-foreground">Kein Muss, kein Paket. Nur das, was deine Haut wirklich braucht.</p>
    <ol className="story">
     <li><span className="story-dot">1</span><span><span className="block text-sm font-semibold">Du kommst zu First Time</span><span className="block text-xs text-muted-foreground">Ich lerne deine Haut kennen und du gehst schon mit dem ersten Glow nach Hause.</span></span></li>
     <li><span className="story-dot">2</span><span><span className="block text-sm font-semibold">Wir sprechen über deine Wünsche</span><span className="block text-xs text-muted-foreground">Ehrlich und ohne Verkaufsdruck. Vielleicht reicht schon gute Pflege zu Hause.</span></span></li>
     <li><span className="story-dot">3</span><span><span className="block text-sm font-semibold">Wenn du magst, gehen wir weiter</span><span className="block text-xs text-muted-foreground">Tipp an, was dich interessiert. Das sind Möglichkeiten, keine Pflicht.</span></span></li>
    </ol>
    <div className="story-chips">{TREATMENTS.filter(t=>t.group==="analysis").map(t=><button type="button" key={t.slug} id={`t-${t.slug}`} aria-pressed={sel===t.slug} onClick={()=>setSel(sel===t.slug?null:t.slug)} className={`story-chip${hit===t.slug||sel===t.slug?" treat-row-hit":""}`}>{t.name}</button>)}</div>
    {sel&&(()=>{const t=TREATMENTS.find(x=>x.slug===sel)!;return <div className="story-pick"><p className="text-sm font-semibold">{t.name}</p><p className="mt-1 text-sm text-muted-foreground">{t.sentence||"Wir schauen bei deinem First-Time-Termin, ob das zu deiner Haut passt."}</p>{t.detail&&<Link to="/behandlungen/$slug" params={{slug:t.slug}} className="mt-2 inline-block text-sm underline underline-offset-4">Mehr erfahren</Link>}</div>;})()}
   </div>
  </div>
  <div className="cal-bar mx-auto max-w-5xl"><span><span className="block font-semibold">Freie Termine und aktuelle Preise</span><span className="block text-sm text-muted-foreground">Immer tagesaktuell in meinem Buchungskalender.</span></span><ActionLink href={CONTACT.beautinda} external secondary>Kalender öffnen</ActionLink></div>
 </Section>
 <Section id="vorher-nachher"><Label>Vorher und nachher</Label><h2 className="text-4xl md:text-5xl">Zieh den Regler und sieh selbst</h2><BeforeAfter/></Section>
 <Section id="ergebnisse"><h2 className="text-4xl md:text-5xl">Echte Haut. Echter Glow.</h2><p className="mb-5 mt-3 text-muted-foreground">Direkt nach der Behandlung</p><Slider images={RESULT_PHOTOS} alt={()=>"Ergebnis direkt nach der Behandlung bei The Golden Cosmetics"}/><InstagramLink results/></Section>
 <Section id="lorena"><div className="mx-auto max-w-[620px] text-left"><img src="/images/lorena-portrait-1.jpg" alt="Lorena Kovacevic, anerkannte Fachkosmetikerin" loading="lazy" className="mx-auto aspect-[4/5] w-full max-w-[420px] rounded-3xl object-cover max-[699px]:w-[78%]"/><p className="mt-5 text-center text-xl font-bold">Lorena Kovacevic</p><p className="text-center text-sm text-muted-foreground">Fachkosmetikerin</p><h2 className="quote-heading mt-6 text-3xl md:text-5xl">Skin is my expertise. Your next level is my mission.</h2><p className="mt-5 text-muted-foreground">Als anerkannte Fachkosmetikerin schaue ich mir deine Haut genau an und sage dir ehrlich, was sie braucht. So gibst du kein Geld mehr für Produkte und Behandlungen aus, die nicht zu dir passen.</p><p className="mt-4 text-sm text-muted-foreground">Dein Einstieg: Hautanalyse und erste Behandlung in einem Termin.</p><div className="mt-5 flex justify-center"><ActionLink href={CONTACT.whatsapp} external>Jetzt beraten lassen</ActionLink></div></div></Section>
 <Section id="kontakt"><h2 className="mb-6 text-4xl">Gut zu wissen</h2><SimpleAccordion items={FAQ}/><p className="mt-5 text-muted-foreground">Deine Frage ist nicht dabei? Schreib mir einfach, ich antworte persönlich.</p><ActionLink href={CONTACT.whatsapp} external secondary className="mt-4">Per WhatsApp fragen</ActionLink></Section>
 <Section id="member"><div className="club mx-auto max-w-4xl">
  <div className="club-ticket"><span className="club-ticket-label">Golden Ticket</span><span className="club-ticket-value">10 %</span><span className="club-ticket-sub">auf deine nächste Behandlung</span><span className="club-ticket-code">GOLDEN-••••</span></div>
  <div className="text-left"><Label>Nur für meine Kundinnen</Label><h2 className="mt-3 text-3xl md:text-4xl">The Golden Member Club</h2><p className="mt-3 text-muted-foreground">Dein Ticket in meinen inneren Kreis. Einmal eintragen und bestätigen, dann kommt dein persönlicher Code per Mail.</p>
   <ul className="club-perks"><li><b>Dein Willkommenscode</b><span>10 % einmalig im Studio</span></li><li><b>Zuerst Bescheid wissen</b><span>Neue Treatments und freie Termine</span></li><li><b>Hauttipps von mir</b><span>Kurz, ehrlich, ohne Spam</span></li></ul>
   <Button asChild variant="ghost" className="btn btn-primary mt-6"><Link to="/member-club">Ticket sichern →</Link></Button></div>
 </div></Section><Footer headline="Bereit für deinen Glow?" cta={BOOK}/><ChatAssistant/><MemberPopup/></div>;
}
