import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Footer, FloatingNav, Section } from "@/components/site";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT } from "@/lib/data";
import { breadcrumbs, OG, seoHead } from "@/lib/seo";
import { adminCreateInvites, adminListInvites, adminListMembers, adminListOffers, adminSaveOffer } from "@/lib/member.functions";

export const Route = createFileRoute("/member-club/admin")({
  head: () => seoHead({ path: "/member-club/admin", title: "Member Club Verwaltung · The Golden Cosmetics", description: "Interner Bereich zur Verwaltung des Member Clubs von The Golden Cosmetics.", image: OG.behandlungen, noindex: true, jsonLd: [breadcrumbs([["Start", "/"], ["Member Club", "/member-club"]])] }),
  component: Admin,
});

type Member = { id: string; vorname: string; email: string; member_code: string; newsletter: boolean; unsubscribed_at: string | null; created_at: string };
type Invite = { id: string; code: string; active: boolean; used_at: string | null; created_at: string };
type Offer = { id: string; title: string; condition: string; code: string; valid_until: string | null; active: boolean };

function Admin() {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const listMembers = useServerFn(adminListMembers);
  const listInvites = useServerFn(adminListInvites);
  const listOffersFn = useServerFn(adminListOffers);
  const createInvites = useServerFn(adminCreateInvites);
  const saveOffer = useServerFn(adminSaveOffer);

  const load = async () => {
    try {
      const [m, i, o] = await Promise.all([listMembers(), listInvites(), listOffersFn()]);
      setMembers(m as Member[]); setInvites(i as Invite[]); setOffers(o as Offer[]); setIsAdmin(true);
    } catch { setIsAdmin(false); }
  };
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) load().finally(() => setReady(true)); else setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange(event => { if (event === "SIGNED_IN") load(); if (event === "SIGNED_OUT") setIsAdmin(false); });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError("Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort."); return; }
    await load();
  };

  if (!ready) return <div className="bg-background"><Section><p className="text-muted-foreground">Laden …</p></Section></div>;

  if (!isAdmin) return <div className="bg-background">
    <FloatingNav back="/member-club" links={[]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section className="max-w-md"><h1 className="text-4xl">Member Club Verwaltung</h1>
      <form onSubmit={login} className="mt-8 space-y-4 text-left">
        <label className="block"><span className="mb-2 block text-sm">E-Mail</span><input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
        <label className="block"><span className="mb-2 block text-sm">Passwort</span><input required type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="btn btn-primary w-full">Anmelden</Button>
      </form>
    </Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;

  const makeCodes = async (count: number) => {
    const created = await createInvites({ data: { count } });
    setNewCodes(created.map(c => c.code));
    setInvites(await listInvites() as Invite[]);
  };
  const csv = () => {
    const rows = [["Vorname", "E-Mail", "Member-Code", "Newsletter", "Beigetreten"], ...members.map(m => [m.vorname, m.email, m.member_code, m.newsletter && !m.unsubscribed_at ? "ja" : "nein", new Date(m.created_at).toLocaleDateString("de-DE")])];
    const blob = new Blob([rows.map(r => r.map(c => `"${String(c).replaceAll('"', '""')}"`).join(";")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "member-club.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  return <div className="bg-background">
    <FloatingNav back="/member-club" links={[{ label: "Codes", href: "#codes" }, { label: "Mitglieder", href: "#mitglieder" }, { label: "Vorteile", href: "#vorteile" }]} cta={{ label: "Abmelden", href: "#abmelden" }} />
    <Section className="max-w-4xl"><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-4xl">Member Club Verwaltung</h1><Button variant="ghost" className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>Abmelden</Button></div></Section>

    <Section id="codes" className="max-w-4xl"><h2 className="text-3xl">Einladungscodes</h2>
      <div className="mt-5 flex flex-wrap justify-center gap-3"><Button className="btn btn-primary" onClick={() => makeCodes(1)}>1 Code erstellen</Button><Button variant="ghost" className="btn btn-ghost" onClick={() => makeCodes(20)}>20 Codes erstellen</Button></div>
      {newCodes.length > 0 && <div className="card mx-auto mt-6 max-w-xl p-6 text-left"><p className="mb-3 font-semibold">Neue Codes (zum Ausdrucken):</p><p className="whitespace-pre-line font-mono text-sm tracking-widest">{newCodes.join("\n")}</p></div>}
      <div className="mx-auto mt-6 max-w-xl divide-y text-left text-sm">{invites.map(i => <div key={i.id} className="flex items-center justify-between gap-3 py-2.5"><span className="font-mono tracking-widest">{i.code}</span><span className="text-muted-foreground">{i.used_at ? "Verwendet" : i.active ? "Frei" : "Inaktiv"}</span></div>)}</div>
    </Section>

    <Section id="mitglieder" className="max-w-4xl"><div className="flex flex-wrap items-center justify-center gap-4"><h2 className="text-3xl">Mitglieder</h2><Button variant="ghost" className="btn btn-ghost" onClick={csv}>CSV exportieren</Button></div>
      <div className="mx-auto mt-6 max-w-2xl divide-y text-left text-sm">{members.map(m => <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span><span className="block font-semibold">{m.vorname}</span><span className="text-muted-foreground">{m.email}</span></span><span className="font-mono text-xs">{m.member_code}</span><span className="text-muted-foreground">{m.newsletter && !m.unsubscribed_at ? "Newsletter" : "Kein Newsletter"} · {new Date(m.created_at).toLocaleDateString("de-DE")}</span></div>)}</div>
      {!members.length && <p className="mt-6 text-muted-foreground">Noch keine Mitglieder.</p>}
    </Section>

    <Section id="vorteile" className="max-w-4xl"><h2 className="text-3xl">Vorteile</h2>
      <form className="card mx-auto mt-6 max-w-xl space-y-3 p-6 text-left" onSubmit={async e => {
        e.preventDefault(); const d = new FormData(e.currentTarget);
        await saveOffer({ data: { title: String(d.get("title") || ""), condition: String(d.get("condition") || ""), code: String(d.get("code") || ""), valid_until: String(d.get("valid_until") || "") || null, active: true } });
        (e.target as HTMLFormElement).reset(); setOffers(await listOffersFn() as Offer[]);
      }}>
        <p className="font-semibold">Neuer Vorteil</p>
        <input required name="title" placeholder="Titel, z. B. 10 % auf Lashlifting" maxLength={120} className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" />
        <input name="condition" placeholder="Bedingung, z. B. nur dienstags" maxLength={200} className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" />
        <input required name="code" placeholder="Code, z. B. GOLD10" maxLength={40} className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" />
        <label className="block text-sm text-muted-foreground">Gültig bis <input type="date" name="valid_until" className="ml-2 rounded-full border bg-surface px-4 py-2" /></label>
        <Button type="submit" className="btn btn-primary w-full">Vorteil speichern</Button>
      </form>
      <div className="mx-auto mt-6 max-w-xl divide-y text-left text-sm">{offers.map(o => <div key={o.id} className="flex items-center justify-between gap-3 py-3"><span><span className="block font-semibold">{o.title}</span><span className="text-muted-foreground">{o.code}{o.valid_until ? ` · bis ${new Date(o.valid_until).toLocaleDateString("de-DE")}` : ""}</span></span><Button variant="ghost" className="chip" data-active={o.active} onClick={async () => { await saveOffer({ data: { id: o.id, title: o.title, condition: o.condition, code: o.code, valid_until: o.valid_until, active: !o.active } }); setOffers(await listOffersFn() as Offer[]); }}>{o.active ? "Aktiv" : "Inaktiv"}</Button></div>)}</div>
    </Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}
