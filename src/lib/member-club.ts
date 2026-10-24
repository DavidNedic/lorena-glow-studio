// Shared, browser-safe Member Club helpers (voucher format, signup validation, email HTML).
import { z } from "zod";
import { CONTACT } from "@/lib/data";

export const VOUCHER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
export const VOUCHER_PERCENT = 10;
export const SIGNUPS_PER_IP_PER_HOUR = 5;

export function makeVoucherCode(rand: (n: number) => Uint8Array = n => crypto.getRandomValues(new Uint8Array(n))) {
  return "GOLDEN-" + Array.from(rand(4)).map(b => VOUCHER_ALPHABET[b % VOUCHER_ALPHABET.length]).join("");
}
export const normalizeEmail = (e: string) => e.trim().toLowerCase();
export const normalizeCode = (c: string) => c.trim().toUpperCase().replace(/\s+/g, "");

export const signupSchema = z.object({
  vorname: z.string().trim().min(1, "Bitte gib deinen Vornamen an.").max(80),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail an.").max(255),
  newsletter: z.literal(true, { errorMap: () => ({ message: "Bitte bestätige die Newsletter-Anmeldung." }) }),
  website: z.string().max(200).optional(), // honeypot
});

export const NEWSLETTER_CONSENT = "Ja, ich möchte den Newsletter von The Golden Cosmetics erhalten. Als Dankeschön bekomme ich einmalig 10 % Rabatt auf eine Behandlung im Studio. Abmeldung jederzeit möglich.";

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function layout(origin: string, unsubscribeUrl: string, inner: string) {
  return `<!doctype html><html lang="de"><body style="margin:0;background:#f5efe8;font-family:Helvetica,Arial,sans-serif;color:#2b211c">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe8;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fbf7f2;border-radius:24px;padding:36px 28px;text-align:center">
<tr><td><img src="${origin}/images/logo.png" alt="The Golden Cosmetics" width="64" style="display:block;margin:0 auto 20px;filter:brightness(0)"></td></tr>
<tr><td>${inner}</td></tr></table>
<p style="font-size:11px;line-height:1.6;color:#8c7d72;margin:20px 0 0">The Golden Cosmetics &amp; Academy · Lorena Kovacevic · Austraße 26, 74336 Brackenheim<br>
<a href="${origin}/rechtliches#impressum" style="color:#8c7d72">Impressum</a> · <a href="${unsubscribeUrl}" style="color:#8c7d72">Newsletter abmelden</a></p>
</td></tr></table></body></html>`;
}
const btn = (href: string, label: string) => `<a href="${href}" style="display:inline-block;background:#8f5b55;color:#fbf7f2;text-decoration:none;border-radius:999px;padding:14px 28px;font-size:15px;margin-top:8px">${label}</a>`;

export function confirmEmail(o: { origin: string; vorname: string; confirmUrl: string; unsubscribeUrl: string }) {
  return {
    subject: "Bitte bestätige deine Anmeldung",
    html: layout(o.origin, o.unsubscribeUrl, `<h1 style="font-size:24px;font-weight:600;margin:0 0 14px">Hallo ${esc(o.vorname)},</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 22px">schön, dass du dabei sein möchtest. Bitte bestätige kurz deine Anmeldung zum Newsletter. Danach schicke ich dir deinen 10&nbsp;%-Gutschein.</p>
${btn(o.confirmUrl, "Anmeldung bestätigen")}
<p style="font-size:12px;color:#8c7d72;margin:22px 0 0">Du hast dich nicht angemeldet? Dann ignoriere diese E-Mail einfach.</p>`),
  };
}

export function voucherEmail(o: { origin: string; vorname: string; code: string; unsubscribeUrl: string }) {
  return {
    subject: "Dein 10 % Gutschein von The Golden Cosmetics",
    html: layout(o.origin, o.unsubscribeUrl, `<h1 style="font-size:24px;font-weight:600;margin:0 0 14px">Danke, ${esc(o.vorname)}!</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px">Schön, dass du jetzt dabei bist. Als kleines Dankeschön bekommst du einmalig 10&nbsp;% auf eine Behandlung bei mir im Studio.</p>
<div style="border:1px dashed #b98a6e;border-radius:18px;padding:20px;margin:0 0 20px;background:#fff">
<p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8c7d72;margin:0 0 8px">Dein Gutscheincode</p>
<p style="font-size:30px;font-weight:700;letter-spacing:.14em;margin:0;font-family:Menlo,Consolas,monospace">${esc(o.code)}</p></div>
<p style="font-size:13px;line-height:1.6;color:#6b5d54;margin:0 0 22px">Einmalig vor Ort im Studio einlösbar, Austraße 26, Brackenheim. Einfach den Code bei der Behandlung zeigen. Nicht mit anderen Aktionen kombinierbar, keine Barauszahlung.</p>
${btn(CONTACT.beautinda, "Termin buchen")}
<p style="font-size:14px;margin:24px 0 0">Ich freu mich auf dich,<br>Lorena</p>`),
  };
}

export type AdminRow = { member_id: string; vorname: string; email: string; created_at: string; status: "bestätigt" | "offen" | "abgemeldet"; code: string | null; redeemed_at: string | null; redeemed_note: string | null };

export function newsletterCsv(rows: AdminRow[]) {
  const q = (c: string) => `"${c.replaceAll('"', '""')}"`;
  const list = rows.filter(r => r.status === "bestätigt");
  return [["Vorname", "E-Mail", "Angemeldet am"], ...list.map(r => [r.vorname, r.email, new Date(r.created_at).toLocaleDateString("de-DE")])].map(r => r.map(q).join(";")).join("\n");
}
