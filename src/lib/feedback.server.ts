// Server-only: verschickt fällige Feedback-Mails 48 h nach Gutschein-Einlösung.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { FEEDBACK_DELAY_HOURS, FEEDBACK_MAX_AGE_DAYS, isFeedbackDue } from "@/lib/member-club";

const ORIGIN = "https://thegoldencosmetics.com";

export async function sendDueFeedbackMails(now = new Date()) {
  const latest = new Date(now.getTime() - FEEDBACK_DELAY_HOURS * 3600_000).toISOString();
  const earliest = new Date(now.getTime() - FEEDBACK_MAX_AGE_DAYS * 86400_000).toISOString();
  const { data, error } = await supabaseAdmin.from("vouchers")
    .select("id, redeemed_at, feedback_token, members!inner(vorname, email, newsletter_confirmed_at, unsubscribed_at)")
    .is("feedback_sent_at", null).not("redeemed_at", "is", null)
    .lte("redeemed_at", latest).gte("redeemed_at", earliest).limit(50);
  if (error) throw error;
  let sent = 0;
  for (const v of data ?? []) {
    const m: any = Array.isArray(v.members) ? v.members[0] : v.members;
    if (!v.redeemed_at || !isFeedbackDue(v.redeemed_at, now)) continue;
    if (!m?.newsletter_confirmed_at || m.unsubscribed_at) {
      await supabaseAdmin.from("vouchers").update({ feedback_sent_at: now.toISOString() }).eq("id", v.id);
      continue;
    }
    try {
      await sendTemplateEmail("member-feedback", m.email, {
        templateData: { origin: ORIGIN, vorname: m.vorname, feedbackUrl: `${ORIGIN}/member-club/feedback?token=${v.feedback_token}` },
        idempotencyKey: `member-feedback-${v.id}`,
      });
      await supabaseAdmin.from("vouchers").update({ feedback_sent_at: now.toISOString() }).eq("id", v.id);
      sent++;
    } catch (e) { console.error("feedback mail failed", v.id, e); }
  }
  return sent;
}
