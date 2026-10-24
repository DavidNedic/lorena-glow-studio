import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { makeVoucherCode, normalizeCode, normalizeEmail, SIGNUPS_PER_IP_PER_HOUR, signupSchema, VOUCHER_PERCENT, type AdminRow } from "@/lib/member-club";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
function origin() {
  try { return new URL(getRequest().url).origin; } catch { return "https://thegoldencosmetics.com"; }
}
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
    const { data: existing } = await db.from("members").select("id, vorname, confirm_token, newsletter_token, newsletter_confirmed_at, unsubscribed_at").ilike("email", email).maybeSingle();
    let member = existing;
    if (existing) return { status: "exists" as const };
    if (!member) {
      const { data: created, error } = await db.from("members").insert({ vorname: data.vorname.trim(), email, newsletter: true }).select("id, vorname, confirm_token, newsletter_token, newsletter_confirmed_at, unsubscribed_at").single();
      if (error?.code === '23505') return { status: 'exists' as const };
      if (error || !created) throw new Error("Anmeldung fehlgeschlagen. Bitte versuch es noch einmal.");
      member = created;
    }
    const o = origin();
    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email');
    const delivery = await sendTemplateEmail('member-confirmation', email, {
      templateData: { origin: o, vorname: member.vorname, confirmUrl: `${o}/member-club/bestaetigen?token=${member.confirm_token}` },
      idempotencyKey: `member-confirmation-${member.id}-${member.confirm_token}`,
    });
    if (!delivery.sent) throw new Error('An diese Adresse können derzeit keine Member-Club-Mails gesendet werden.');
    return { status: "sent" as const };
  });

export const confirmMember = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => {
    if (typeof d?.token !== "string" || !/^[a-f0-9]{48}$/.test(d.token)) throw new Error("Ungültiger Link");
    return d;
  })
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: m } = await db.from("members").select("id, vorname, email, newsletter_token, newsletter_confirmed_at, unsubscribed_at").eq("confirm_token", data.token).maybeSingle();
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
    const o = origin();
    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email');
    const delivery = await sendTemplateEmail('member-voucher', m.email, {
      templateData: { origin: o, vorname: m.vorname, code },
      idempotencyKey: `member-voucher-${m.id}-${code}`,
    });
    if (!delivery.sent) return { ok: false as const };
    return { ok: true as const };
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
    const { data: members, error: memberError } = await context.supabase.from("members").select("id, vorname, email, created_at, newsletter_confirmed_at, unsubscribed_at").order("created_at", { ascending: false });
    const { data: vouchers, error: voucherError } = await context.supabase.from("vouchers").select("member_id, code, redeemed_at, redeemed_note");
    if (memberError || voucherError) throw new Error('Die Mitglieder konnten nicht geladen werden. Bitte versuch es erneut.');
    const byMember = new Map((vouchers ?? []).map((v: any) => [v.member_id, v]));
    return (members ?? []).map((m: any): AdminRow => {
      const v: any = byMember.get(m.id);
      return { member_id: m.id, vorname: m.vorname, email: m.email, created_at: m.created_at, status: m.unsubscribed_at ? "abgemeldet" : m.newsletter_confirmed_at ? "bestätigt" : "offen", code: v?.code ?? null, redeemed_at: v?.redeemed_at ?? null, redeemed_note: v?.redeemed_note ?? null };
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
