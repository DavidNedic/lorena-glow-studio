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
