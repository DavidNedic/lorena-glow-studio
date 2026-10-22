import { CONTACT, MASTERCLASSES, TREATMENTS, priceLabel } from "./data";
export type ChatMessage = { role: "bot" | "user"; text: string; href?: string; label?: string };
export const CHAT_LIMIT = 80;
export const GREETING: ChatMessage = { role: "bot", text: "Hallo! Ich beantworte dir Fragen zu Behandlungen, Preisen, Terminen und der Academy. Dein Verlauf bleibt auf diesem Gerät gespeichert." };
export function trimHistory(messages: ChatMessage[]) { return messages.slice(-CHAT_LIMIT); }
export function answerChat(input: string, academy = false): ChatMessage {
 const q = input.toLowerCase();
 const reply = (text: string, href = CONTACT.beautinda, label = "Termin buchen"): ChatMessage => ({ role: "bot", text, href, label });
 if (/öffnungs|oeffnungs|geöffnet|uhr|zeiten/.test(q)) return reply(`${CONTACT.hours}. Du findest mich in der ${CONTACT.street}, ${CONTACT.city}.`);
 if (/adresse|standort|wo seid|wo bist|brackenheim/.test(q)) return reply(`${CONTACT.name}: ${CONTACT.street}, ${CONTACT.city}.`, CONTACT.whatsapp,"Per WhatsApp fragen");
 if (/klarna|raten|bezahl/.test(q)) return reply("Für die Academy ist Ratenzahlung über Klarna möglich, vorbehaltlich Genehmigung. Den Preis besprechen wir im Kennenlerngespräch.","/academy#rueckruf","Kennenlerngespräch anfragen");
 if (/online|vor ort/.test(q)) return reply("Ja, alle Masterclasses sind online. Du lernst in deinem Tempo. Zahnbleaching enthält einen Live-Call, Train the Trainer und Social Media finden online live statt. Ich bleibe deine Ansprechpartnerin.","/academy#masterclasses","Alle Masterclasses");
 if (/gutschein/.test(q)) return reply("Ja, es gibt Gutscheine. Schreib mir per WhatsApp, dann besprechen wir deinen Wunsch.",CONTACT.whatsapp,"Gutschein anfragen");
 if (/männer|maenner|mann/.test(q)) return reply("Ja, ich behandle auch Männer, zum Beispiel mit der Klassischen Ausreinigung: 1 Std. · 99 €.","/behandlungen/rein","Klassische Ausreinigung ansehen");
 if (/kennenlern|rückruf|rueckruf/.test(q)) return reply("Im Kennenlerngespräch finden wir die Masterclass, die zu deinem Stand und deinen Zielen passt. 30 Minuten, persönlich mit Lorena.","/academy#rueckruf","Kennenlerngespräch anfragen");
 if (/masterclass|academy|schulung|ausbild/.test(q) || (academy && /preis|kost/.test(q))) return reply(`Meine Angebote: ${MASTERCLASSES.map(m=>m.name).join(", ")}. Alle sind online. Preise klären wir im Kennenlerngespräch.`,"/academy#masterclasses","Alle Masterclasses");
 if (/erst|hautanalys|welche behandlung|passt zu|weiß nicht/.test(q)) return reply("Dein Einstieg: First Time, Hautanalyse + erste Behandlung. 2 Std. · 99 € statt 120 €. Welche Behandlung endgültig passt, klären wir bei deiner Hautanalyse.","/behandlungen/first","First Time ansehen");
 const specific = TREATMENTS.find(t => q.includes(t.name.toLowerCase()) || q.includes(t.slug));
 if (specific) return reply(`${specific.name}: ${specific.duration ? specific.duration+" · " : ""}${priceLabel(specific)}${specific.oldPrice ? ` statt ${specific.oldPrice} €` : ""}. ${specific.sentence}`);
 const recommendations: [RegExp,string][] = [[/akne|unrein/,"anti-akne"],[/poren|fahl/,"aqua"],[/narben|struktur|needling/,"micro"],[/glow|glass/,"glass"],[/peel|chemical/,"glow-peel"],[/wimper|lash/,"lash"],[/brauen|brow/,"brow"]];
 for (const [pattern,slug] of recommendations) if (pattern.test(q)) { const t=TREATMENTS.find(x=>x.slug===slug); if(t) return reply(`${t.name}: ${t.duration ? t.duration+" · " : ""}${priceLabel(t)}. Was zu deiner Haut passt, klären wir persönlich.`,t.detail ? `/behandlungen/${t.slug}` : `/behandlungen#t-${t.slug}`,t.detail ? "Ablauf ansehen" : "Behandlung ansehen"); }
 if (/preis|kost|dauer/.test(q)) return reply(TREATMENTS.map(t=>`${t.name}: ${priceLabel(t)}${t.duration ? ` · ${t.duration}` : ""}`).join("\n"),"/behandlungen#behandlungen","Alle Behandlungen und Preise");
 if (/buch|termin|beautinda/.test(q)) return reply("Deinen Termin buchst du direkt über Beautinda. Für deinen ersten Besuch empfehle ich First Time: Hautanalyse + erste Behandlung.");
 if (/kontakt|telefon|whatsapp|lorena/.test(q)) return reply(`Du erreichst mich unter ${CONTACT.phone} oder per WhatsApp.`,CONTACT.whatsapp,"Lorena schreiben");
 return reply("Das beantwortet dir Lorena am besten persönlich.",CONTACT.whatsapp,"Per WhatsApp fragen");
}
