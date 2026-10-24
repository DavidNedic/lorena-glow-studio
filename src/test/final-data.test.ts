import { expect, it } from "vitest";
import { CATEGORIES, CONTACT, LEGACY_TREATMENT_SLUGS, MASTERCLASSES, PROBLEMS, TREATMENTS, ZOOM_AREAS } from "@/lib/data";
import { answerChat, refreshHistory, trimHistory, type ChatMessage } from "@/lib/chat";
it("alle Buchungen gehen zum konkreten Beautinda-Salon",()=>{expect(CONTACT.beautinda).toBe("https://beautinda.de/salon/xUqq2vyQw724bbTtNRDh");for(const t of TREATMENTS)expect(t.bookingUrl).toBe(CONTACT.beautinda);});
it("Telefon und Öffnungszeiten entsprechen den Vorgaben",()=>{expect(CONTACT.tel).toBe("tel:+491629709213");expect(CONTACT.hours).toBe("Mo bis Sa, 9 bis 20 Uhr");});
it("bestätigter E-Mail-Kontakt",()=>expect(CONTACT.email).toBe("info@thegoldencosmetics.com"));
it("Rechtsform ist Einzelunternehmen",()=>expect(CONTACT.legalForm).toBe("Einzelunternehmen"));
it("Umsatzsteuer-ID entspricht der Inhaberin",()=>expect(CONTACT.vatId).toBe("DE319849001"));
it("Berufsbezeichnung ist Fachkosmetikerin",()=>expect(CONTACT.profession).toBe("Fachkosmetikerin"));
it("keine Teilnahme an Verbraucherschlichtung",()=>expect(CONTACT.disputeResolution).toBe("Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."));
it("alle Instagram-Links nutzen denselben Account",()=>expect(CONTACT.instagramAcademy).toBe("https://www.instagram.com/thegoldencosmetics"));
it("die bisherigen neun Angebote behalten ihre Dauern",()=>{expect(CATEGORIES).toEqual(["Erstberatung","Liftings","Wimpernbehandlungen","Hautbehandlungen","Akne"]);expect(TREATMENTS.slice(0,9).map(t=>[t.slug,t.category,t.duration])).toEqual([["first","Erstberatung","2 Std."],["lash","Liftings","1 Std. 30 Min."],["brow","Liftings","1 Std. 20 Min."],["brow-color","Liftings","30 Min."],["brow-shape","Liftings","30 Min."],["natural","Wimpernbehandlungen","2 Std."],["wispy","Wimpernbehandlungen","2 Std."],["volumen","Wimpernbehandlungen","2 Std."],["refill","Wimpernbehandlungen","1 Std. 20 Min."]]);});
it("Behandlungsdaten enthalten keine Preise",()=>{for(const t of TREATMENTS){expect(t).not.toHaveProperty("price");expect(t).not.toHaveProperty("oldPrice");expect(t).not.toHaveProperty("from");}});
it("Hotspots verweisen auf die gewünschten Behandlungen",()=>expect(ZOOM_AREAS.map(a=>[a.id,TREATMENTS.find(t=>t.slug===a.slug)?.name])).toEqual([["stirn","Microneedling x Salmon DNA"],["augen","Korean Lashlifting inkl. Färben"],["nase","Aquafacial Ausreinigung"],["wangen","Microneedling"],["kinn","BioRePeel"],["augenbrauen","Browlifting inkl. Färben + Formen"],["pickel","Anti-Akne Face Reset"],["glow","First Time: Hautanalyse + erste Behandlung"],["unsicher","First Time: Hautanalyse + erste Behandlung"]]));
it("neue Foto-Hotspots liegen auf Braue und linker Wange ohne Video",()=>expect(ZOOM_AREAS.filter(a=>a.id==="augenbrauen"||a.id==="pickel").map(a=>[a.id,a.x,a.y,a.video])).toEqual([["augenbrauen",61,33,false],["pickel",30,56,false]]));
it("BioRePeel hat Akne-Kategorie und unbekannte Angaben",()=>expect(TREATMENTS.find(t=>t.slug==="biorepeel")).toMatchObject({category:"Akne",duration:"Dauer auf Anfrage",priceNote:"Preis auf Anfrage",sentence:"Peeling bei Akne und unreiner Haut."}));

it("alle Probleme führen zur Hautanalyse",()=>{expect(PROBLEMS).toHaveLength(5);for(const p of PROBLEMS)expect(p.slug).toBe("first");});
export const RETIRED_SLUGS=["aqua","micro","micro-cica","micro-salmon","glass","aha-egf","rein","aqua-micro","dermaplaning","microdermabrasion","anti-akne","akne-body","carboxy","glow-peel","refresh-peel","pure-peel","glass-skin","aquafacial","microneedling","ausreinigung"];
it("entfernte Angebote führen zur Übersicht, lash-brow bleibt lash",()=>{for(const slug of RETIRED_SLUGS)expect(LEGACY_TREATMENT_SLUGS[slug]).toBe("");expect(LEGACY_TREATMENT_SLUGS["lash-brow"]).toBe("lash");});
it("11 Academy-Angebote, kein Vor-Ort-Angebot",()=>{expect(MASTERCLASSES).toHaveLength(11);expect(MASTERCLASSES.filter(m=>m.group==="fachlich")).toHaveLength(8);expect(MASTERCLASSES.some(m=>/vor ort/i.test(m.format))).toBe(false);});
it("Chat speichert höchstens 80 neueste Nachrichten",()=>{const messages:ChatMessage[]=Array.from({length:90},(_,i)=>({role:"user",text:String(i)}));const kept=trimHistory(messages);expect(kept).toHaveLength(80);expect(kept[0]?.text).toBe("10");expect(kept[79]?.text).toBe("89");});
it("Chat nennt keine Behandlungspreise und verweist Preisfragen auf Beautinda",()=>{for(const q of ["Welche Behandlung passt zu mir?","First Time Preis","Was kostet eine Behandlung?","lash Preis",...TREATMENTS.map(t=>t.name),"Dauer","Männer"]){expect(answerChat(q).text).not.toMatch(/€|\b\d+\s*Euro/i);}expect(answerChat("First Time Preis").href).toBe(CONTACT.beautinda);});
it("Chat empfiehlt für Hautprobleme nur noch first",()=>{for(const q of ["Akne","Poren","Narben","Glow","Microneedling","Aquafacial","Peels","Ausreinigung"])expect(answerChat(q).href).toBe("/behandlungen/first");expect(answerChat("Wimpern").href).toBe("/behandlungen/lash");expect(answerChat("Brauen").href).toBe("/behandlungen#t-brow");});
it("gespeicherte automatische Antworten erhalten keine alten Preise oder Links",()=>{const messages:ChatMessage[]=[{role:"user",text:"Microneedling"},{role:"bot",text:"Microneedling: 120 €",href:"/behandlungen/micro"}];expect(refreshHistory(messages)[1]?.href).toBe("/behandlungen/first");expect(refreshHistory(messages)[1]?.text).not.toContain("120 €");expect(refreshHistory(messages)[0]).toEqual(messages[0]);});
it("Chat bietet für unbekannte Fragen persönlichen Kontakt",()=>expect(answerChat("xyz").href).toContain("https://wa.me/491629709213"));

import { readFileSync as rfMB } from "node:fs";
test("mobile bottom bar is removed everywhere", () => {
  for (const f of ["src/components/site.tsx","src/routes/behandlungen.index.tsx","src/routes/behandlungen.$slug.tsx","src/routes/academy.index.tsx","src/routes/academy.$slug.tsx"]) expect(rfMB(f,"utf8")).not.toContain("MobileBar");
});
