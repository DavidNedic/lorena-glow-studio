import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// Publishable client for public, narrowly-scoped reads/calls (anon role).
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, storage: undefined, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
}

export const redeemInvite = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string; vorname: string; email: string; newsletter: boolean }) => {
    if (!data.code || data.code.length > 20) throw new Error("Ungültiger Code");
    if (!data.vorname?.trim() || data.vorname.length > 80) throw new Error("Vorname fehlt");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || "")) throw new Error("E-Mail ungültig");
    return data;
  })
  .handler(async ({ data }) => {
    const { data: code, error } = await publicClient().rpc("redeem_invite", { _code: data.code, _vorname: data.vorname, _email: data.email, _newsletter: data.newsletter });
    if (error) throw new Error("Beitritt fehlgeschlagen");
    if (!code) return { ok: false as const };
    return { ok: true as const, memberCode: code };
  });

export const listOffers = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("member_offers_public").select("id, title, condition, valid_until");
  return data ?? [];
});

export const revealOfferCode = createServerFn({ method: "POST" })
  .inputValidator((data: { memberCode: string; offerId: string }) => data)
  .handler(async ({ data }) => {
    const { data: code } = await publicClient().rpc("reveal_offer_code", { _member_code: data.memberCode, _offer_id: data.offerId });
    return { code: code ?? null };
  });

export const unsubscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const { data: ok } = await publicClient().rpc("unsubscribe_newsletter", { _token: data.token });
    return { ok: !!ok };
  });

// ---- Admin (Lorena) ----
async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!isAdmin) throw new Error("Forbidden");
}

export const adminListMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data } = await context.supabase.from("members").select("id, vorname, email, member_code, newsletter, unsubscribed_at, created_at").order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminListInvites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data } = await context.supabase.from("invite_codes").select("id, code, active, used_at, created_at").order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminCreateInvites = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { count: number }) => ({ count: Math.min(Math.max(Math.floor(data.count) || 1, 1), 50) }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const rows = Array.from({ length: data.count }, () => ({ code: Array.from(crypto.getRandomValues(new Uint8Array(6))).map(b => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("") }));
    const { data: created, error } = await context.supabase.from("invite_codes").insert(rows).select("code");
    if (error) throw new Error("Codes konnten nicht erstellt werden");
    return created ?? [];
  });

export const adminListOffers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data } = await context.supabase.from("member_offers").select("*").order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminSaveOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id?: string; title: string; condition: string; code: string; valid_until: string | null; active: boolean }) => {
    if (!data.title?.trim() || !data.code?.trim()) throw new Error("Titel und Code sind Pflicht");
    return data;
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const row = { title: data.title.trim(), condition: data.condition.trim(), code: data.code.trim(), valid_until: data.valid_until || null, active: data.active };
    const { error } = data.id
      ? await context.supabase.from("member_offers").update(row).eq("id", data.id)
      : await context.supabase.from("member_offers").insert(row);
    if (error) throw new Error("Vorteil konnte nicht gespeichert werden");
    return { ok: true };
  });
