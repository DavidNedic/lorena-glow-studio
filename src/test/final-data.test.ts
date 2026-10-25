import { expect, it } from "vitest";
import { ABSOLVENTINNEN, BEFORE_AFTER, CONTACT, LEGACY_TREATMENT_SLUGS, MASTERCLASSES, PROBLEMS, SCHUELERINNEN, TREATMENTS, ZOOM_AREAS } from "@/lib/data";
import { answerChat, refreshHistory, trimHistory, type ChatMessage } from "@/lib/chat";
it("alle Buchungen gehen zum konkreten Beautinda-Salon",()=>{expect(CONTACT.beautinda).toBe("https://beautinda.de/salon/xUqq2vyQw724bbTtNRDh");for(const t of TREATMENTS)expect(t.bookingUrl).toBe(CONTACT.beautinda);});
it("Telefon und Öffnungszeiten entsprechen den Vorgaben",()=>{expect(CONTACT.tel).toBe("tel:+491629709213");expect(CONTACT.hours).toBe("Mo bis Sa, 9 bis 20 Uhr");});
it("bestätigter E-Mail-Kontakt",()=>expect(CONTACT.email).toBe("info@thegoldencosmetics.com"));
it("Rechtsform ist Einzelunternehmen",()=>expect(CONTACT.legalForm).toBe("Einzelunternehmen"));
it("Umsatzsteuer-ID entspricht der Inhaberin",()=>expect(CONTACT.vatId).toBe("DE319849001"));
it("Berufsbezeichnung ist Fachkosmetikerin",()=>expect(CONTACT.profession).toBe("Fachkosmetikerin"));
it("keine Teilnahme an Verbraucherschlichtung",()=>expect(CONTACT.disputeResolution).toBe("Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."));
it("alle Instagram-Links nutzen denselben Account",()=>expect(CONTACT.instagramAcademy).toBe("https://www.instagram.com/thegoldencosmetics"));
it("Behandlungen: 1 First-Time, 11 direkt buchbar, 14 nach Hautanalyse",()=>{
  expect(TREATMENTS.filter(t=>t.group==="first").map(t=>t.slug)).toEqual(["first"]);
  expect(TREATMENTS.filter(t=>t.group==="direct").map(t=>t.slug)).toEqual(["klassische-ausreinigung","dermaplaning","glow-peel","refresh-peel","pure-peel","lash","brow","brow-color","brow-shape","natural","refill"]);
  expect(TREATMENTS.filter(t=>t.group==="analysis")).toHaveLength(14);
  expect(TREATMENTS.find(t=>t.slug==="first")?.duration).toBe("120 Min.");
});
it("Preise nur bei direkt buchbaren Behandlungen, aus Beautinda",()=>{for(const t of TREATMENTS){expect(t).not.toHaveProperty("oldPrice");expect(t).not.toHaveProperty("from");expect(t).not.toHaveProperty("priceNote");if(t.group!=="direct")expect(t).not.toHaveProperty("price");}expect(Object.fromEntries(TREATMENTS.filter(t=>t.price).map(t=>[t.slug,t.price]))).toEqual({lash:"79 €",brow:"69 €","brow-color":"20 €","brow-shape":"15 €",natural:"99 €",refill:"ab 65 €"});});
it("Hotspots verweisen auf die gewünschten Behandlungen",()=>expect(ZOOM_AREAS.map(a=>[a.id,TREATMENTS.find(t=>t.slug===a.slug)?.name])).toEqual([["stirn","Microneedling x Salmon DNA"],["augen","Korean Lashlifting inkl. Färben"],["nase","Aquafacial Ausreinigung"],["wangen","Microneedling"],["kinn","BioRePeel"],["augenbrauen","Browlifting inkl. Färben + Formen"],["pickel","Anti-Akne Face Reset"],["glow","First Time: Hautanalyse + erste Behandlung"],["unsicher","First Time: Hautanalyse + erste Behandlung"]]));
it("neue Foto-Hotspots liegen auf Braue und linker Wange ohne Video",()=>expect(ZOOM_AREAS.filter(a=>a.id==="augenbrauen"||a.id==="pickel").map(a=>[a.id,a.x,a.y,a.video])).toEqual([["augenbrauen",61,33,false],["pickel",30,56,false]]));
it("BioRePeel steht in der Hautanalyse-Gruppe ohne Preis",()=>expect(TREATMENTS.find(t=>t.slug==="biorepeel")).toMatchObject({group:"analysis",duration:"Dauer nach Absprache",sentence:"Peeling bei Akne und unreiner Haut."}));
it("alle Probleme führen zur Hautanalyse",()=>{expect(PROBLEMS).toHaveLength(5);for(const p of PROBLEMS)expect(p.slug).toBe("first");});
it("alte Aliase leiten auf die neuen Behandlungen um",()=>{expect(LEGACY_TREATMENT_SLUGS).toEqual({"lash-brow":"lash",ausreinigung:"klassische-ausreinigung",rein:"klassische-ausreinigung",aqua:"aquafacial-ausreinigung",micro:"microneedling","micro-salmon":"microneedling-salmon-dna",glass:"glass-skin","anti-akne":"anti-akne-face-reset"});});
it("frühere Slugs wie micro-cica oder glow-peel sind wieder echte Angebote",()=>{for(const slug of ["micro-cica","glass-skin","aha-egf","aqua-micro","dermaplaning","microdermabrasion","akne-body","carboxy","glow-peel","refresh-peel","pure-peel"])expect(TREATMENTS.some(t=>t.slug===slug)).toBe(true);});
it("Academy-Masterclasses sind vor Ort und online möglich, Hautkunde bleibt PDF",()=>{expect(MASTERCLASSES).toHaveLength(11);expect(MASTERCLASSES.filter(m=>m.group==="fachlich")).toHaveLength(8);for(const m of MASTERCLASSES.filter(m=>m.slug!=="hautkunde")) { expect(m.format).toContain("Vor Ort");expect(m.format).toContain("Online"); } expect(MASTERCLASSES.find(m=>m.slug==="hautkunde")?.format).toBe("Digitales Produkt · PDF");});
it("Absolventinnen mit Studio-Logo kommen zuerst",()=>expect(ABSOLVENTINNEN.slice(0,6)).toEqual(["/img/absolventin-01.jpg","/img/absolventin-05.jpg","/img/absolventin-08.jpg","/img/absolventin-10.jpg","/img/absolventin-12.jpg","/img/absolventin-13.jpg"]));
it("11 Schülerinnen-Screenshots in Reihenfolge",()=>{expect(SCHUELERINNEN).toHaveLength(11);expect(SCHUELERINNEN[0]).toBe("/img/schuelerinnen/schuelerin-01.png");expect(SCHUELERINNEN[10]).toBe("/img/schuelerinnen/schuelerin-11.png");});
it("Vorher/Nachher enthält nur die beiden neuen Vergleiche ohne Teint",()=>{expect(BEFORE_AFTER.map(b=>b.id)).toEqual(["poren","stirn"]);for(const b of BEFORE_AFTER){expect(b.before).toMatch(/vorher/);expect(b.after).toMatch(/nachher/);}});
it("Chat speichert höchstens 80 neueste Nachrichten",()=>{const messages:ChatMessage[]=Array.from({length:90},(_,i)=>({role:"user",text:String(i)}));const kept=trimHistory(messages);expect(kept).toHaveLength(80);expect(kept[0]?.text).toBe("10");expect(kept[79]?.text).toBe("89");});
it("Chat nennt keine Behandlungspreise und verweist Preisfragen auf Beautinda",()=>{for(const q of ["Welche Behandlung passt zu mir?","First Time Preis","Was kostet eine Behandlung?","lash Preis",...TREATMENTS.map(t=>t.name),"Dauer","Männer"]){expect(answerChat(q).text).not.toMatch(/€|\b\d+\s*Euro/i);}expect(answerChat("First Time Preis").href).toBe(CONTACT.beautinda);});
it("Chat empfiehlt passende Behandlungen aus dem Katalog",()=>{expect(answerChat("Microneedling").href).toBe("/behandlungen#t-microneedling");expect(answerChat("Aquafacial").href).toBe("/behandlungen/first");expect(answerChat("Akne").href).toBe("/behandlungen/first");expect(answerChat("Wimpern").href).toBe("/behandlungen/lash");expect(answerChat("Brauen").href).toBe("/behandlungen#t-brow");});
it("gespeicherte automatische Antworten erhalten keine alten Preise oder Links",()=>{const messages:ChatMessage[]=[{role:"user",text:"Microneedling"},{role:"bot",text:"Microneedling: 120 €",href:"/behandlungen/micro"}];expect(refreshHistory(messages)[1]?.href).toBe("/behandlungen#t-microneedling");expect(refreshHistory(messages)[1]?.text).not.toContain("120 €");expect(refreshHistory(messages)[0]).toEqual(messages[0]);});
it("Chat bietet für unbekannte Fragen persönlichen Kontakt",()=>expect(answerChat("xyz").href).toContain("https://wa.me/491629709213"));

import { readFileSync as rfMB } from "node:fs";
test("mobile bottom bar is removed everywhere", () => {
  for (const f of ["src/components/site.tsx","src/routes/behandlungen.index.tsx","src/routes/behandlungen.$slug.tsx","src/routes/academy.index.tsx","src/routes/academy.$slug.tsx"]) expect(rfMB(f,"utf8")).not.toContain("MobileBar");
});
it("Academy-WhatsApp fragt nach einer Masterclass, Behandlungstext bleibt unverändert", () => {
  expect(CONTACT.whatsappAcademy).toBe("https://wa.me/491629709213?text=" + encodeURIComponent("Hi Lorena, ich habe eine Frage zu einer Masterclass."));
  expect(CONTACT.whatsapp).toBe("https://wa.me/491629709213?text=" + encodeURIComponent("Hi Lorena, ich habe eine Frage zu einer Behandlung."));
});
test("nur Academy-Seiten nutzen den Masterclass-WhatsApp-Text", () => {
  for (const f of ["src/routes/academy.index.tsx", "src/routes/academy.$slug.tsx"]) {
    const s = rfMB(f, "utf8");
    expect(s).toContain("CONTACT.whatsappAcademy");
    expect(s).not.toMatch(/CONTACT\.whatsapp\b/);
  }
  expect(rfMB("src/routes/behandlungen.index.tsx", "utf8")).toContain("CONTACT.whatsapp");
});
test("Rechtstexte haben alle vier Anker", () => {
  const legal = rfMB("src/routes/rechtliches.tsx","utf8");
  for (const id of ['id="impressum"','id="agb"','id="widerruf"','id="datenschutz"']) expect(legal).toContain(id);
});
