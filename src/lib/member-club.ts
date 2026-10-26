// Shared, browser-safe Member Club helpers (voucher format and signup validation).
import { z } from "zod";

export const VOUCHER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
export const VOUCHER_PERCENT = 10;
export const SIGNUPS_PER_IP_PER_HOUR = 5;

export function makeVoucherCode(rand: (n: number) => Uint8Array = n => crypto.getRandomValues(new Uint8Array(n))) {
  return Array.from(rand(6)).map(b => VOUCHER_ALPHABET[b % VOUCHER_ALPHABET.length]).join("");
}
export const normalizeEmail = (e: string) => e.trim().toLowerCase();
export const normalizeCode = (c: string) => c.trim().toUpperCase().replace(/\s+/g, "");

export const signupSchema = z.object({
  vorname: z.string().trim().min(1, "Bitte gib deinen Vornamen an.").max(80),
  nachname: z.string().trim().min(1, "Bitte gib deinen Nachnamen an.").max(80),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail an.").max(255),
  newsletter: z.literal(true, { errorMap: () => ({ message: "Bitte bestätige die Newsletter-Anmeldung." }) }),
  website: z.string().max(200).optional(), // honeypot
});

export const NEWSLETTER_CONSENT = "Ja, ich möchte den Newsletter von The Golden Cosmetics erhalten. Als Dankeschön bekomme ich einmalig 10 % Rabatt auf eine Behandlung im Studio. Abmeldung jederzeit möglich.";

export type AdminRow = { member_id: string; vorname: string; nachname: string; email: string; created_at: string; status: "bestätigt" | "offen" | "abgemeldet"; code: string | null; redeemed_at: string | null; redeemed_note: string | null };

export function newsletterCsv(rows: AdminRow[]) {
  const q = (c: string) => `"${c.replaceAll('"', '""')}"`;
  const list = rows.filter(r => r.status === "bestätigt");
  return [["Vorname", "Nachname", "E-Mail", "Angemeldet am"], ...list.map(r => [r.vorname, r.nachname, r.email, new Date(r.created_at).toLocaleDateString("de-DE")])].map(r => r.map(q).join(";")).join("\n");
}

// ---- Rechnungen ----
export const BUSINESS = { name: "The Golden Cosmetics & Academy", owner: "Lorena Kovacevic", street: "Austraße 26", city: "74336 Brackenheim", vatId: "DE319849001", email: "info@thegoldencosmetics.com", phone: "0162 9709213" };
export type InvoiceItem = { text: string; menge: number; einzelpreis: number }; // Einzelpreis brutto in Euro
export type Invoice = { id: string; nummer: string; datum: string; leistungsdatum: string; kunde_name: string; kunde_adresse: string; kunde_email: string; positionen: InvoiceItem[]; ust_satz: number; netto: number; ust: number; brutto: number; zahlungsart: string; bezahlt: boolean; notiz: string; storniert_at: string | null; created_at: string };
const r2 = (n: number) => Math.round(n * 100) / 100;
/** Preise im Studio sind Endpreise (brutto). Die Umsatzsteuer wird herausgerechnet. */
export function invoiceTotals(items: InvoiceItem[], ustSatz = 19) {
  const brutto = r2(items.reduce((s, i) => s + (Number(i.menge) || 0) * (Number(i.einzelpreis) || 0), 0));
  const netto = r2(brutto / (1 + ustSatz / 100));
  return { brutto, netto, ust: r2(brutto - netto) };
}
export const euro = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
export const invoiceSchema = z.object({
  datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  leistungsdatum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  kunde_name: z.string().trim().min(1, "Bitte Name der Kundin angeben.").max(120),
  kunde_adresse: z.string().trim().max(300).default(""),
  kunde_email: z.string().trim().max(255).default(""),
  positionen: z.array(z.object({ text: z.string().trim().min(1, "Bitte jede Position beschreiben.").max(200), menge: z.number().positive().max(999), einzelpreis: z.number().min(0).max(100000) })).min(1, "Mindestens eine Position.").max(30),
  ust_satz: z.number().min(0).max(19).default(19),
  zahlungsart: z.string().trim().max(60).default(""),
  bezahlt: z.boolean().default(false),
  notiz: z.string().trim().max(500).default(""),
});

// ---- Newsletter ----
export type Newsletter = { id: string; betreff: string; vorschau: string; ueberschrift: string; text: string; button_text: string; button_url: string; status: "entwurf" | "gesendet"; empfaenger: number; gesendet_at: string | null; created_at: string };
export const newsletterSchema = z.object({
  id: z.string().uuid().optional(),
  betreff: z.string().trim().min(1, "Bitte einen Betreff eingeben.").max(150),
  vorschau: z.string().trim().max(150).default(""),
  ueberschrift: z.string().trim().min(1, "Bitte eine Überschrift eingeben.").max(150),
  text: z.string().trim().min(1, "Bitte einen Text eingeben.").max(5000),
  button_text: z.string().trim().max(60).default(""),
  button_url: z.string().trim().max(500).refine(u => !u || /^https:\/\//.test(u), "Der Button-Link muss mit https:// beginnen.").default(""),
});
