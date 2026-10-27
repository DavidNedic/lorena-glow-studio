import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { makeVoucherCode, normalizeCode, normalizeEmail, SIGNUPS_PER_IP_PER_HOUR, signupSchema, VOUCHER_PERCENT, invoiceSchema, invoiceTotals, newsletterSchema, type AdminRow, type Invoice, type Newsletter } from "@/lib/member-club";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
// Links und Logo in Mails zeigen immer auf die echte Domain – auch bei
// Test-Versänden aus der Vorschau, sonst landen sie auf localhost.
const EMAIL_ORIGIN = "https://thegoldencosmetics.com";
async function sha(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export const signupMember = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = signupSchema.safeParse(d);
    if (!r.success) throw new Error(r.error.issues[0]?.message ?? "Ungültige Eingabe");
    return r.data;
  })
  .handler(async ({ data }) => {
    if (data.website) return { status: "sent" as const }; // honeypot: pretend success
    const db = await admin();
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = await sha("tgc:" + ip);
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await db.from("signup_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((count ?? 0) >= SIGNUPS_PER_IP_PER_HOUR) throw new Error("Zu viele Anmeldungen in kurzer Zeit. Bitte versuch es in einer Stunde noch einmal.");
    await db.from("signup_attempts").insert({ ip_hash: ipHash });

    const email = normalizeEmail(data.email);
    const isTestEmail = email === 'davidnedic@web.de';
    // Double-Opt-in: the voucher is only created and sent after the confirmation link
    // (confirmMember). Signup itself only sends the confirmation email.
    const { data: existing } = await db.from("members").select("id, vorname, confirm_token, newsletter_confirmed_at, unsubscribed_at").ilike("email", email).maybeSingle();
    let member = existing;
    if (existing?.unsubscribed_at) return { status: "exists" as const };
    if (existing?.newsletter_confirmed_at && !isTestEmail) return { status: "exists" as const };
    const resend = !!existing;
    if (!member) {
      const { data: created, error } = await db.from("members").insert({ vorname: data.vorname.trim(), nachname: data.nachname.trim(), email, newsletter: true }).select("id, vorname, confirm_token, newsletter_confirmed_at, unsubscribed_at").single();
      if (error?.code === '23505') return { status: 'exists' as const };
      if (error || !created) throw new Error("Anmeldung fehlgeschlagen. Bitte versuch es noch einmal.");
      member = created;
    }
    const o = EMAIL_ORIGIN;
    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email');
    const delivery = await sendTemplateEmail('member-confirm', email, {
      templateData: { origin: o, vorname: member.vorname, confirmUrl: `${o}/member-club/bestaetigen?token=${member.confirm_token}` },
      idempotencyKey: `member-confirm-${member.id}${resend ? `-resend-${crypto.randomUUID()}` : ''}`,
    });
    if (!delivery.sent) throw new Error('An diese Adresse können derzeit keine Member-Club-Mails gesendet werden.');
    return { status: "confirm" as const };
  });

export const confirmMember = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => {
    if (typeof d?.token !== "string" || !/^[a-f0-9]{48}$/.test(d.token)) throw new Error("Ungültiger Link");
    return d;
  })
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: m } = await db.from("members").select("id, vorname, nachname, email, newsletter_token, newsletter_confirmed_at, unsubscribed_at").eq("confirm_token", data.token).maybeSingle();
    if (!m || m.unsubscribed_at) return { ok: false as const };
    const { data: v } = await db.from("vouchers").select("id, code").eq("member_id", m.id).maybeSingle();
    if (!m.newsletter_confirmed_at) {
      const { error } = await db.from("members").update({ newsletter_confirmed_at: new Date().toISOString() }).eq("id", m.id);
      if (error) throw new Error('Deine Anmeldung konnte nicht bestätigt werden. Bitte öffne den Link erneut.');
    }
    let code = v?.code ?? "";
    for (let i = 0; i < 8 && !code; i++) {
      const c = makeVoucherCode();
      const { error } = await db.from("vouchers").insert({ member_id: m.id, code: c, rabatt_prozent: VOUCHER_PERCENT });
      if (!error) code = c;
      else if (error.code === "23505") {
        const { data: existingVoucher } = await db.from('vouchers').select('code').eq('member_id', m.id).maybeSingle();
        code = existingVoucher?.code ?? '';
      }
    }
    if (!code) throw new Error("Gutschein konnte nicht erstellt werden.");
    const o = EMAIL_ORIGIN;
    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email');
    const delivery = await sendTemplateEmail('member-voucher', m.email, {
      templateData: { origin: o, vorname: m.vorname, code },
      idempotencyKey: `member-voucher-${m.id}-${code}${normalizeEmail(m.email) === 'davidnedic@web.de' ? `-test-${crypto.randomUUID()}` : ''}`,
    }).catch(() => ({ sent: false as const }));
    try { await sendTemplateEmail('owner-notification', 'thegoldencosmetics@web.de', {
      templateData: { origin: o, art: 'Neues Member-Club-Mitglied', felder: [
        { label: 'Name', wert: `${m.vorname} ${m.nachname ?? ''}`.trim() },
        { label: 'E-Mail', wert: m.email }, { label: 'Gutschein-Code', wert: code }] },
      idempotencyKey: `owner-member-${m.id}`,
    }); } catch { /* owner notice must not block confirmation */ }
    if (!delivery.sent) return { ok: false as const, confirmed: true as const };
    return { ok: true as const, confirmed: true as const };
  });

export const notifyAcademyRequest = createServerFn({ method: "POST" })
  .inputValidator((d: Record<string, unknown>) => {
    const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const r = { vorname: s(d?.["vorname"], 80), nachname: s(d?.["nachname"], 80), telefon: s(d?.["telefon"], 30), email: s(d?.["email"], 200), wuensche: s(d?.["wuensche"], 1000), zeitfenster: s(d?.["zeitfenster"], 30), interesse: s(d?.["interesse"], 120) };
    if (!r.vorname || !r.nachname || !/^[+0-9() /-]{6,30}$/.test(r.telefon) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) throw new Error("Ungültige Eingabe");
    return r;
  })
  .handler(async ({ data }) => {
    const db = await admin();
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = await sha("tgc-academy:" + ip);
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await db.from("signup_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((count ?? 0) >= SIGNUPS_PER_IP_PER_HOUR) return { ok: false as const };
    await db.from("signup_attempts").insert({ ip_hash: ipHash });
    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email');
    const id = crypto.randomUUID();
    const r = await sendTemplateEmail('owner-notification', 'thegoldencosmetics@web.de', {
      templateData: { origin: EMAIL_ORIGIN, art: 'Academy – Kennenlerngespräch', felder: [
        { label: 'Name', wert: `${data.vorname} ${data.nachname}` }, { label: 'Handynummer', wert: data.telefon }, { label: 'E-Mail', wert: data.email },
        { label: 'Zeitfenster für Anruf', wert: data.zeitfenster }, { label: 'Interesse', wert: data.interesse }, { label: 'Wünsche', wert: data.wuensche }] },
      idempotencyKey: `owner-academy-${id}`,
    }).catch(() => ({ sent: false }));
    await sendTemplateEmail('academy-confirm', data.email, { templateData: { origin: EMAIL_ORIGIN, vorname: data.vorname, zeitfenster: data.zeitfenster }, idempotencyKey: `academy-confirm-${id}` }).catch(() => null);
    return { ok: r.sent };
  });

export const adminUnsubscribeMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string }) => {
    if (typeof d?.email !== "string" || !d.email.includes("@") || d.email.length > 200) throw new Error("Ungültige E-Mail");
    return { email: normalizeEmail(d.email) };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const db = await admin();
    const { data: rows } = await db.from("members").update({ unsubscribed_at: new Date().toISOString() }).ilike("email", data.email).is("unsubscribed_at", null).select("id");
    return { ok: !!rows?.length };
  });

export const unsubscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => {
    if (typeof data?.token !== "string" || data.token.length > 100) throw new Error("Ungültiger Link");
    return data;
  })
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: ok } = await db.rpc("unsubscribe_newsletter", { _token: data.token });
    return { ok: !!ok };
  });

// ---- Admin (Lorena) ----
async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!isAdmin) throw new Error("Forbidden");
}

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data: members, error: memberError } = await context.supabase.from("members").select("id, vorname, nachname, email, created_at, newsletter_confirmed_at, unsubscribed_at").order("created_at", { ascending: false });
    const { data: vouchers, error: voucherError } = await context.supabase.from("vouchers").select("member_id, code, redeemed_at, redeemed_note");
    if (memberError || voucherError) throw new Error('Die Mitglieder konnten nicht geladen werden. Bitte versuch es erneut.');
    const byMember = new Map((vouchers ?? []).map((v: any) => [v.member_id, v]));
    return (members ?? []).map((m: any): AdminRow => {
      const v: any = byMember.get(m.id);
      return { member_id: m.id, vorname: m.vorname, nachname: m.nachname ?? "", email: m.email, created_at: m.created_at, status: m.unsubscribed_at ? "abgemeldet" : m.newsletter_confirmed_at ? "bestätigt" : "offen", code: v?.code ?? null, redeemed_at: v?.redeemed_at ?? null, redeemed_note: v?.redeemed_note ?? null };
    });
  });

export const adminSetRedeemed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { code: string; redeemed: boolean; note?: string }) => {
    if (typeof d?.code !== "string" || d.code.length > 30) throw new Error("Ungültiger Code");
    return { code: normalizeCode(d.code), redeemed: !!d.redeemed, note: (d.note ?? "").slice(0, 200) };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    let q = context.supabase.from("vouchers").update(data.redeemed ? { redeemed_at: new Date().toISOString(), redeemed_note: data.note || null } : { redeemed_at: null, redeemed_note: null }).eq("code", data.code);
    q = data.redeemed ? q.is("redeemed_at", null) : q.not("redeemed_at", "is", null);
    const { data: rows, error } = await q.select("code");
    if (error) throw new Error("Speichern fehlgeschlagen");
    if (!rows?.length) return { ok: false as const, reason: data.redeemed ? "Dieser Code wurde bereits eingelöst oder existiert nicht." : "Dieser Code ist nicht eingelöst." };
    return { ok: true as const };
  });

// ---- Newsletter-Ersteller ----
export const adminListNewsletters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase.from("newsletters").select("*").order("created_at", { ascending: false });
    if (error) throw new Error("Newsletter konnten nicht geladen werden.");
    const { count } = await context.supabase.from("members").select("id", { count: "exact", head: true }).not("newsletter_confirmed_at", "is", null).is("unsubscribed_at", null);
    return { list: (data ?? []) as Newsletter[], recipients: count ?? 0 };
  });

export const adminSaveNewsletter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => {
    const r = newsletterSchema.safeParse(d);
    if (!r.success) throw new Error(r.error.issues[0]?.message ?? "Ungültige Eingabe");
    return r.data;
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { id, ...fields } = data;
    if (id) {
      const { data: row, error } = await context.supabase.from("newsletters").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id).eq("status", "entwurf").select("id").maybeSingle();
      if (error || !row) throw new Error("Speichern fehlgeschlagen. Bereits gesendete Newsletter können nicht mehr geändert werden.");
      return { id: row.id as string };
    }
    const { data: row, error } = await context.supabase.from("newsletters").insert(fields).select("id").single();
    if (error || !row) throw new Error("Speichern fehlgeschlagen.");
    return { id: row.id as string };
  });

export const adminSendNewsletter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; test: boolean; testEmail?: string }) => {
    if (typeof d?.id !== "string" || !/^[0-9a-f-]{36}$/.test(d.id)) throw new Error("Ungültiger Newsletter");
    const testEmail = (d.testEmail ?? "").trim();
    if (d.test && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(testEmail)) throw new Error("Bitte eine gültige Test-E-Mail eingeben.");
    return { id: d.id, test: !!d.test, testEmail };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { data: nl } = await context.supabase.from("newsletters").select("*").eq("id", data.id).maybeSingle();
    if (!nl) throw new Error("Newsletter nicht gefunden.");
    if (!data.test && nl.status === "gesendet") throw new Error("Dieser Newsletter wurde bereits gesendet.");
    const o = EMAIL_ORIGIN;
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const content = { origin: o, betreff: nl.betreff, vorschau: nl.vorschau, ueberschrift: nl.ueberschrift, text: nl.text, buttonText: nl.button_text, buttonUrl: nl.button_url };
    if (data.test) {
      await sendTemplateEmail("member-newsletter", data.testEmail, { templateData: { ...content, vorname: "Test", unsubscribeUrl: `${o}/member-club/abmelden` }, purpose: "marketing" });
      return { sent: 1, skipped: 0 };
    }
    // Atomar sperren, damit ein Doppelklick nicht zweimal versendet.
    const { data: locked } = await context.supabase.from("newsletters").update({ status: "gesendet", gesendet_at: new Date().toISOString() }).eq("id", nl.id).eq("status", "entwurf").select("id").maybeSingle();
    if (!locked) throw new Error("Dieser Newsletter wird bereits gesendet oder wurde gesendet.");
    const db = await admin();
    const { data: members } = await db.from("members").select("id, vorname, email, newsletter_token").not("newsletter_confirmed_at", "is", null).is("unsubscribed_at", null);
    let sent = 0, skipped = 0;
    for (const m of members ?? []) {
      try {
        const r = await sendTemplateEmail("member-newsletter", m.email, {
          templateData: { ...content, vorname: m.vorname, unsubscribeUrl: `${o}/member-club/abmelden?token=${m.newsletter_token}` },
          idempotencyKey: `newsletter-${nl.id}-${m.id}`,
          purpose: "marketing",
        });
        if (r.sent) sent++; else skipped++;
      } catch { skipped++; }
    }
    await context.supabase.from("newsletters").update({ empfaenger: sent }).eq("id", nl.id);
    return { sent, skipped };
  });

// ---- Rechnungsersteller ----
export const adminListInvoices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await context.supabase.from("rechnungen").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error("Rechnungen konnten nicht geladen werden.");
    return (data ?? []).map((r: any) => ({ ...r, netto: Number(r.netto), ust: Number(r.ust), brutto: Number(r.brutto), ust_satz: Number(r.ust_satz) })) as Invoice[];
  });

export const adminCreateInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => {
    const r = invoiceSchema.safeParse(d);
    if (!r.success) throw new Error(r.error.issues[0]?.message ?? "Ungültige Eingabe");
    return r.data;
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { data: nummer, error: numErr } = await context.supabase.rpc("next_rechnung_nummer");
    if (numErr || !nummer) throw new Error("Rechnungsnummer konnte nicht vergeben werden.");
    const totals = invoiceTotals(data.positionen, data.ust_satz);
    const { data: row, error } = await context.supabase.from("rechnungen").insert({ ...data, nummer, ...totals }).select("*").single();
    if (error || !row) throw new Error("Rechnung konnte nicht gespeichert werden.");
    return { ...row, netto: Number(row.netto), ust: Number(row.ust), brutto: Number(row.brutto), ust_satz: Number(row.ust_satz) } as Invoice;
  });

export const adminUpdateInvoiceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; bezahlt?: boolean; storno?: boolean }) => {
    if (typeof d?.id !== "string" || !/^[0-9a-f-]{36}$/.test(d.id)) throw new Error("Ungültige Rechnung");
    return { id: d.id, bezahlt: d.bezahlt, storno: !!d.storno };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const patch: { bezahlt?: boolean; storniert_at?: string } = {};
    if (typeof data.bezahlt === "boolean") patch.bezahlt = data.bezahlt;
    if (data.storno) patch.storniert_at = new Date().toISOString();
    const { error } = await context.supabase.from("rechnungen").update(patch).eq("id", data.id).is("storniert_at", null);
    if (error) throw new Error("Speichern fehlgeschlagen.");
    return { ok: true as const };
  });
