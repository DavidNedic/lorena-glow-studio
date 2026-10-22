import { CONTACT, MASTERCLASSES, TREATMENTS } from "./data";
export type ChatMessage = { role: "bot" | "user"; text: string; href?: string; label?: string };
export const CHAT_LIMIT = 80;
export const GREETING: ChatMessage = { role: "bot", text: "Hallo! Ich beantworte dir Fragen zu Behandlungen, Terminen und der Academy. Dein Verlauf bleibt auf diesem Gerät gespeichert." };
export function trimHistory(messages: ChatMessage[]) { return messages.slice(-CHAT_LIMIT); }
// Refresh saved automatic answers against today's catalogue, without sending device data anywhere.
export function refreshHistory(messages: ChatMessage[], academy = false): ChatMessage[] {
 return trimHistory(messages.map((message, index) => {
  if (message.role === "user") return message;
  const previous = messages[index - 1];
  return previous?.role === "user" ? answerChat(previous.text, message.href?.startsWith("/academy") || academy) : GREETING;
 }));
}
export function answerChat(input: string, academy = false): ChatMessage {
 const q = input.toLowerCase();
 const reply = (text: string, href = CONTACT.beautinda, label = "Termin buchen"): ChatMessage => ({ role: "bot", text, href, label });
 if (/öffnungs|oeffnungs|geöffnet|uhr|zeiten/.test(q)) return reply(`${CONTACT.hours}. Du findest mich in der ${CONTACT.street}, ${CONTACT.city}.`);
 if (/adresse|standort|wo seid|wo bist|brackenheim/.test(q)) return reply(`${CONTACT.name}: ${CONTACT.street}, ${CONTACT.city}.`, CONTACT.whatsapp,"Per WhatsApp fragen");
 if (/klarna|raten|bezahl/.test(q)) return reply("Für die Academy ist Ratenzahlung über Klarna möglich, vorbehaltlich Genehmigung. Den Preis besprechen wir im Kennenlerngespräch.","/academy#rueckruf","Kennenlerngespräch anfragen");
 if (/online|vor ort/.test(q)) return reply("Ja, alle Masterclasses sind online. Du lernst in deinem Tempo. Zahnbleaching enthält einen Live-Call, Train the Trainer und Social Media finden online live statt. Ich bleibe deine Ansprechpartnerin.","/academy#masterclasses","Alle Masterclasses");
 if (/gutschein/.test(q)) return reply("Ja, es gibt Gutscheine. Schreib mir per WhatsApp, dann besprechen wir deinen Wunsch.",CONTACT.whatsapp,"Gutschein anfragen");
 if (/männer|maenner|mann/.test(q)) return reply("Ja, auch für Männer starten wir mit First Time: Hautanalyse + erste Behandlung. 2 Std.","/behandlungen/first","First Time ansehen");
 if (/kennenlern|rückruf|rueckruf/.test(q)) return reply("Im Kennenlerngespräch finden wir die Masterclass, die zu deinem Stand und deinen Zielen passt. 30 Minuten, persönlich mit Lorena.","/academy#rueckruf","Kennenlerngespräch anfragen");
 if (/masterclass|academy|schulung|ausbild/.test(q) || (academy && /preis|kost/.test(q))) return reply(`Meine Angebote: ${MASTERCLASSES.map(m=>m.name).join(", ")}. Alle sind online. Preise klären wir im Kennenlerngespräch.`,"/academy#masterclasses","Alle Masterclasses");
 if (/preis|kost|€|euro/.test(q)) return reply("Informationen zu den Konditionen erhältst du direkt über Beautinda. Bei Fragen kannst du Lorena auch per WhatsApp schreiben.");
 if (/erst|hautanalys|welche behandlung|passt zu|weiß nicht/.test(q)) return reply("Dein Einstieg: First Time, Hautanalyse + erste Behandlung. 2 Std. Welche erste Behandlung zu deiner Haut passt, klären wir bei deiner Hautanalyse.","/behandlungen/first","First Time ansehen");
 const specific = [...TREATMENTS].sort((a,b)=>b.slug.length-a.slug.length).find(t => q.includes(t.name.toLowerCase()) || new RegExp(`(?:^|\\s)${t.slug}(?:$|\\s|[?!.,])`).test(q));
 const describe = (t: typeof TREATMENTS[number]) => reply(`${t.name}${t.duration ? ` · ${t.duration}` : ""}.${t.sentence ? ` ${t.sentence}` : ""}`, t.detail ? `/behandlungen/${t.slug}` : `/behandlungen#t-${t.slug}`, t.detail ? "Ablauf ansehen" : "Behandlung ansehen");
 if (specific) return describe(specific);
 const recommendations: [RegExp,string][] = [[/akne|unrein|poren|fahl|narben|struktur|needling|micro|aqua|ausreinig|rein|glow|glass|peel|chemical|dermaplan|dermabrasion|carboxy|cica|salmon|aha-egf/,"first"],[/wimper|lash/,"lash"],[/brauen|brow/,"brow"]];
 for (const [pattern,slug] of recommendations) if (pattern.test(q)) { const t=TREATMENTS.find(x=>x.slug===slug); if(t) return describe(t); }
 if (/behandlungen|dauer/.test(q)) return reply(TREATMENTS.map(t=>`${t.name}${t.duration ? ` · ${t.duration}` : ""}`).join("\n"),"/behandlungen#behandlungen","Alle Behandlungen");
 if (/buch|termin|beautinda/.test(q)) return reply("Deinen Termin buchst du direkt über Beautinda. Für deinen ersten Besuch empfehle ich First Time: Hautanalyse + erste Behandlung.");
 if (/kontakt|telefon|whatsapp|lorena/.test(q)) return reply(`Du erreichst mich unter ${CONTACT.phone} oder per WhatsApp.`,CONTACT.whatsapp,"Lorena schreiben");
 return reply("Das beantwortet dir Lorena am besten persönlich.",CONTACT.whatsapp,"Per WhatsApp fragen");
}
