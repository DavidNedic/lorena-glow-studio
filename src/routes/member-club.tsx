import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Footer, FloatingNav, Label, Section } from "@/components/site";
import { Button } from "@/components/ui/button";
import { MemberCard } from "@/components/MemberCard";
import { CONTACT } from "@/lib/data";
import { breadcrumbs, OG, seoHead } from "@/lib/seo";
import { listOffers, redeemInvite, revealOfferCode } from "@/lib/member.functions";

export const Route = createFileRoute("/member-club")({
  head: () => seoHead({ path: "/member-club", title: "The Golden Member Club · Exklusive Vorteile", description: "Der Member Club von The Golden Cosmetics in Brackenheim: exklusive Rabatte und Codes für Kundinnen. Beitreten mit persönlichem Einladungscode nach deiner Behandlung.", image: OG.behandlungen, noindex: true, jsonLd: [breadcrumbs([["Start", "/"], ["Member Club", "/member-club"]])] }),
  component: MemberClub,
});

const LS_KEY = "tgc-member";
type Saved = { code: string; name: string };

function JoinPanel({ onJoined }: { onJoined: (m: Saved) => void }) {
  const redeem = useServerFn(redeemInvite);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setError(""); setStep(2);
  };
  const submitJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await redeem({ data: { code, vorname, email, newsletter } });
      if (!res.ok) { setError("Dieser Code ist ungültig oder wurde schon verwendet."); setStep(1); return; }
      const saved = { code: res.memberCode, name: vorname.trim() };
      localStorage.setItem(LS_KEY, JSON.stringify(saved));
      onJoined(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beitritt fehlgeschlagen");
    } finally { setBusy(false); }
  };

  return (
    <div className="card w-full p-7 text-left">
      <div className="mb-6 flex gap-2" aria-label={`Schritt ${step} von 3`}>{[1, 2, 3].map(i => <span key={i} className={`h-1 flex-1 rounded-full ${step >= i ? "bg-primary" : "bg-surface-2"}`} />)}</div>
      {step === 1 && <form onSubmit={submitCode} className="space-y-4">
        <h2 className="text-2xl">Dein Einladungscode</h2>
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="z. B. XKCD42AB" maxLength={20} autoComplete="off" className="w-full rounded-full border bg-surface px-5 py-3 uppercase tracking-[0.2em] outline-none focus:ring-1 focus:ring-ring" aria-label="Einladungscode" />
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="btn btn-primary w-full">Weiter →</Button>
      </form>}
      {step === 2 && <form onSubmit={submitJoin} className="space-y-4">
        <h2 className="text-2xl">Fast geschafft</h2>
        <label className="block"><span className="mb-2 block text-sm">Vorname</span><input required value={vorname} onChange={e => setVorname(e.target.value)} maxLength={80} autoComplete="given-name" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
        <label className="block"><span className="mb-2 block text-sm">E-Mail</span><input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
        <label className="flex items-start gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="mt-1" />Ich möchte exklusive Member-Angebote per E-Mail bekommen. Abmelden geht jederzeit mit einem Klick.</label>
        <p className="text-xs text-muted-foreground">Mit dem Beitritt akzeptierst du unsere <Link to="/rechtliches" hash="agb" className="underline">AGB</Link> und die <Link to="/rechtliches" hash="datenschutz" className="underline">Datenschutzerklärung</Link>.</p>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={busy} className="btn btn-primary w-full">{busy ? "Einen Moment …" : "Mitglied werden"}</Button>
      </form>}
    </div>
  );
}

function Offers({ member }: { member: Saved | null }) {
  const fetchOffers = useServerFn(listOffers);
  const reveal = useServerFn(revealOfferCode);
  const [offers, setOffers] = useState<{ id: string; title: string; condition: string; valid_until: string | null }[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  useEffect(() => { fetchOffers().then(setOffers).catch(() => {}); }, [fetchOffers]);
  if (!offers.length) return null;
  const show = async (id: string) => {
    if (!member) return;
    const res = await reveal({ data: { memberCode: member.code, offerId: id } });
    if (res.code) setCodes(c => ({ ...c, [id]: res.code! }));
  };
  return (
    <Section id="vorteile"><h2 className="text-4xl md:text-5xl">Deine Vorteile diesen Monat</h2>
      <div className="mx-auto mt-8 max-w-2xl divide-y text-left">
        {offers.map(o => <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div><p className="font-semibold">{o.title}</p><p className="mt-1 text-sm text-muted-foreground">{o.condition}{o.valid_until ? ` · Gültig bis ${new Date(o.valid_until).toLocaleDateString("de-DE")}` : ""}</p></div>
          {codes[o.id] ? <span className="chip" data-active="true">{codes[o.id]}</span> : member ? <Button variant="ghost" className="chip" onClick={() => show(o.id)}>Code anzeigen</Button> : <span className="text-sm text-muted-foreground">Nur für Members</span>}
        </div>)}
      </div>
    </Section>
  );
}

function MemberClub() {
  const [member, setMember] = useState<Saved | null>(null);
  useEffect(() => { try { const raw = localStorage.getItem(LS_KEY); if (raw) setMember(JSON.parse(raw)); } catch { /* ignore */ } }, []);
  return <div className="bg-background">
    <FloatingNav back="/" links={[{ label: "Behandlungen", href: "/behandlungen" }, { label: "Academy", href: "/academy" }]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section className="site-hero"><div className="mx-auto grid max-w-5xl items-center gap-10 text-left md:grid-cols-2">
      <div>
        <Label>Nur für meine Kundinnen</Label>
        <h1 className="text-4xl md:text-5xl">The Golden Member Club</h1>
        <p className="mt-5 text-muted-foreground">Du warst schon bei mir? Dann hast du einen Einladungscode bekommen. Damit trittst du bei und sicherst dir exklusive Rabatte und Codes für deinen nächsten Besuch.</p>
        <p className="mt-4 text-sm text-muted-foreground">Kein Code? Den gibt es nach deiner Behandlung im Studio.</p>
      </div>
      {member ? (
        <div className="text-center">
          <h2 className="mb-5 text-2xl">Willkommen, {member.name}</h2>
          <MemberCard code={member.code} name={member.name} className="mx-auto w-full" />
          <p className="mt-5 text-xs text-muted-foreground"><span className="underline">Code per E-Mail erneut anfordern</span> (bald verfügbar)</p>
        </div>
      ) : <JoinPanel onJoined={setMember} />}
    </div></Section>
    <Section><div className="mx-auto grid max-w-4xl gap-6 text-left md:grid-cols-3">
      {[["01", "Exklusive Rabatte", "Member-Preise auf ausgewählte Treatments, nur für Clubmitglieder."], ["02", "Codes für vor Ort", "Kleine Extras im Studio, einfach Code zeigen und einlösen."], ["03", "Zuerst informiert", "Neue Treatments und freie Last-Minute-Termine bekommst du vor allen anderen."]].map(([n, t, d]) => <div key={n} className="border-t pt-4"><p className="text-sm text-muted-foreground">{n}</p><p className="mt-2 font-semibold">{t}</p><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>)}
    </div></Section>
    <Offers member={member} />
    <Section><p className="text-xs text-muted-foreground">Du möchtest deine Mitgliedschaft beenden? Schreib uns kurz an <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p></Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}
