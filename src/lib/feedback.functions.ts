import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { feedbackSchema, type FeedbackRow } from "@/lib/member-club";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getFeedbackInvite = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => {
    if (typeof d?.token !== "string" || !/^[a-f0-9]{48}$/.test(d.token)) throw new Error("Ungültiger Link");
    return d;
  })
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: v } = await db.from("vouchers").select("id, redeemed_at, members!inner(vorname)").eq("feedback_token", data.token).maybeSingle();
    if (!v?.redeemed_at) return { state: "invalid" as const };
    const { data: f } = await db.from("member_feedback").select("id").eq("voucher_id", v.id).maybeSingle();
    const m: any = Array.isArray(v.members) ? v.members[0] : v.members;
    return { state: f ? "done" as const : "open" as const, vorname: m?.vorname ?? "" };
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = feedbackSchema.safeParse(d);
    if (!r.success) throw new Error(r.error.issues[0]?.message ?? "Ungültige Eingabe");
    return r.data;
  })
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: v } = await db.from("vouchers").select("id, member_id, code, redeemed_at, redeemed_note, members!inner(vorname, nachname, email)").eq("feedback_token", data.token).maybeSingle();
    if (!v?.redeemed_at) return { ok: false as const, reason: "Dieser Feedback-Link ist ungültig." };
    const { error } = await db.from("member_feedback").insert({ voucher_id: v.id, member_id: v.member_id, sterne: data.sterne, text: data.text, veroeffentlichen: data.veroeffentlichen });
    if (error?.code === "23505") return { ok: false as const, reason: "Du hast bereits Feedback gegeben – danke dir!" };
    if (error) throw new Error("Dein Feedback konnte nicht gespeichert werden. Bitte versuch es erneut.");
    const m: any = Array.isArray(v.members) ? v.members[0] : v.members;
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("owner-notification", "thegoldencosmetics@web.de", {
        templateData: { origin: "https://thegoldencosmetics.com", art: "Neues Kundinnen-Feedback", felder: [
          { label: "Name", wert: `${m?.vorname ?? ""} ${m?.nachname ?? ""}`.trim() },
          { label: "E-Mail", wert: m?.email ?? "" },
          { label: "Bewertung", wert: `${"★".repeat(data.sterne)}${"☆".repeat(5 - data.sterne)} (${data.sterne}/5)` },
          { label: "Behandlung", wert: v.redeemed_note ?? "" },
          { label: "Feedback", wert: data.text },
          { label: "Veröffentlichung erlaubt", wert: data.veroeffentlichen ? "Ja" : "Nein" }] },
        idempotencyKey: `owner-feedback-${v.id}`,
      });
    } catch { /* owner notice must not block feedback */ }
    return { ok: true as const };
  });

export const adminListFeedback = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase.from("member_feedback").select("id, sterne, text, veroeffentlichen, created_at, members(vorname, nachname, email), vouchers(redeemed_note)").order("created_at", { ascending: false });
    if (error) throw new Error("Feedback konnte nicht geladen werden.");
    return (data ?? []).map((f: any): FeedbackRow => ({ id: f.id, sterne: f.sterne, text: f.text, veroeffentlichen: f.veroeffentlichen, created_at: f.created_at, vorname: f.members?.vorname ?? "", nachname: f.members?.nachname ?? "", email: f.members?.email ?? "", behandlung: f.vouchers?.redeemed_note ?? null }));
  });
