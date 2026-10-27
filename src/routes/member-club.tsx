import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Footer, FloatingNav, Label, Section } from "@/components/site";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/data";
import { breadcrumbs, OG, seoHead } from "@/lib/seo";
import { signupMember } from "@/lib/member.functions";
import { NEWSLETTER_CONSENT } from "@/lib/member-club";

export const Route = createFileRoute("/member-club")({
  head: () => seoHead({ path: "/member-club", title: "The Golden Member Club · 10 % Willkommensgutschein", description: "Melde dich zum Newsletter von The Golden Cosmetics in Brackenheim an und erhalte einmalig 10 % Rabatt auf eine Behandlung im Studio.", image: OG.behandlungen, noindex: true, jsonLd: [breadcrumbs([["Start", "/"], ["Member Club", "/member-club"]])] }),
  component: MemberClub,
});

function JoinPanel() {
  const signup = useServerFn(signupMember);
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | "sent" | "confirm" | "exists">(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletter) { setError("Bitte bestätige die Newsletter-Anmeldung."); return; }
    setBusy(true); setError("");
    try {
      const res = await signup({ data: { vorname, nachname, email, newsletter: true, website } });
      setDone(res.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen");
    } finally { setBusy(false); }
  };

  if (done) return (
    <div className="card w-full p-7 text-left" role="status">
      <h2 className="text-2xl">{done === "exists" ? "Du bist schon dabei" : "Fast geschafft"}</h2>
      <p className="mt-3 text-muted-foreground">{done === "exists"
        ? "Diese E-Mail-Adresse ist bereits gespeichert. Eine weitere Anmeldung und ein weiterer Gutschein sind nicht möglich. Schau in deinem Postfach auch im Spam-Ordner nach deinem Gutschein. Falls keine Mail angekommen ist, schreib mir bitte an info@thegoldencosmetics.com."
        : "Ich habe dir eine E-Mail geschickt. Klick dort auf „Anmeldung bestätigen“, dann bekommst du direkt deinen persönlichen 10 %-Gutschein. Schau auch im Spam-Ordner nach."}</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="card w-full space-y-4 p-7 text-left">
      <h2 className="text-2xl">10 % für dich</h2>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm">Vorname</span><input required value={vorname} onChange={e => setVorname(e.target.value)} maxLength={80} autoComplete="given-name" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label><label className="block"><span className="mb-2 block text-sm">Nachname</span><input required value={nachname} onChange={e => setNachname(e.target.value)} maxLength={80} autoComplete="family-name" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label></div>
      <label className="block"><span className="mb-2 block text-sm">E-Mail</span><input required type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={255} autoComplete="email" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
      <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
      <label className="flex items-start gap-3 text-sm text-muted-foreground"><input type="checkbox" required checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="mt-1" />{NEWSLETTER_CONSENT}</label>
      <p className="text-xs text-muted-foreground"><Link to="/rechtliches" hash="datenschutz" className="underline">Datenschutzerklärung</Link></p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy || !newsletter} className="btn btn-primary w-full">{busy ? "Einen Moment …" : "Gutschein sichern"}</Button>
    </form>
  );
}

function MemberClub() {
  return <div className="bg-background">
    <FloatingNav back="/" links={[{ label: "Behandlungen", href: "/behandlungen" }, { label: "Academy", href: "/academy" }]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section className="site-hero"><div className="mx-auto grid max-w-5xl items-center gap-10 text-left md:grid-cols-2">
      <div>
        <Label>Newsletter & Willkommensgutschein</Label>
        <h1 className="text-4xl md:text-5xl">The Golden Member Club</h1>
        <p className="mt-5 text-muted-foreground">Als Mitglied des Golden Member Clubs erhältst du exklusive Einblicke in neue Treatments, profitierst von besonderen Preisvorteilen und genießt als Willkommensgeschenk 10 % auf deine erste Behandlung im Studio.</p>
      </div>
      <JoinPanel />
    </div></Section>
    <Section><div className="mx-auto grid max-w-4xl gap-6 text-left md:grid-cols-3">
      {[["01", "Anmelden", "Vor- und Nachname und E-Mail eintragen, Haken setzen."], ["02", "Bestätigen und Code erhalten", "Bestätige deine Anmeldung per E-Mail, dann kommt dein Gutscheincode in dein Postfach."], ["03", "Gutschein zeigen", "Deinen Code bei der nächsten Behandlung im Studio zeigen."]].map(([n, t, d]) => <div key={n} className="border-t pt-4"><p className="text-sm text-muted-foreground">{n}</p><p className="mt-2 font-semibold">{t}</p><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>)}
    </div></Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}
