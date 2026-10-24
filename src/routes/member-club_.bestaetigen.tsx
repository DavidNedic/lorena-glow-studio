import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Footer, FloatingNav, Label, Logo, Section } from "@/components/site";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/data";
import { OG, seoHead } from "@/lib/seo";
import { confirmMember } from "@/lib/member.functions";

export const Route = createFileRoute("/member-club_/bestaetigen")({
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s["token"] === "string" ? s["token"] : "" }),
  head: () => seoHead({ path: "/member-club/bestaetigen", title: "Anmeldung bestätigen · The Golden Cosmetics", description: "Bestätigung der Newsletter-Anmeldung bei The Golden Cosmetics in Brackenheim.", image: OG.behandlungen, noindex: true }),
  component: Confirm,
});

function Confirm() {
  const { token } = Route.useSearch();
  const confirm = useServerFn(confirmMember);
  const [state, setState] = useState<"busy" | "ok" | "delivery-fail" | "fail">("busy");
  const [msg, setMsg] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!token) { setState("fail"); return; }
    let active = true;
    setState("busy");
    setMsg("");
    confirm({ data: { token } }).then(r => {
      if (active) setState(r.ok ? "ok" : "confirmed" in r && r.confirmed ? "delivery-fail" : "fail");
    }).catch(e => { if (active) { setMsg(e instanceof Error ? e.message : ""); setState("fail"); } });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, attempt]);
  return <div>
    <FloatingNav back="/" links={[]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section className="site-hero">
      <div className="mx-auto max-w-xl text-center" aria-live="polite" aria-busy={state === "busy"}>
        <div className="mb-8"><Logo text={false} /></div>
        <Label>The Golden Member Club</Label>
        <h1 className="text-3xl md:text-4xl">{state === "ok" || state === "delivery-fail" ? "Anmeldung wurde bestätigt" : state === "fail" ? "Bestätigung nicht möglich" : "Deine Anmeldung wird bestätigt"}</h1>
        {state === "busy" && <p className="mt-6 text-muted-foreground">Einen Moment, ich bereite deinen Gutschein vor.</p>}
        {state === "ok" && <><p className="mt-6 text-muted-foreground">Schön, dass du dabei bist! Deinen persönlichen Gutscheincode habe ich dir per E-Mail geschickt.</p><p className="mt-3 text-sm text-muted-foreground">Schau auch in deinem Spam-Ordner nach. Eine erneute Anmeldung ist nicht nötig.</p></>}
        {state === "delivery-fail" && <><p className="mt-6 text-muted-foreground">Du bist dabei, aber deine Gutscheinmail konnte noch nicht verschickt werden. Bitte versuch den Versand erneut.</p><Button className="btn btn-primary mt-6" onClick={() => setAttempt(n => n + 1)}>Gutscheinmail erneut senden</Button></>}
        {state === "fail" && <p className="mt-6 text-muted-foreground">{msg || "Dieser Bestätigungslink ist ungültig oder nicht mehr verfügbar."} Schreib mir gern an <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild className="btn btn-primary"><Link to="/behandlungen">Zu den Behandlungen</Link></Button><Button asChild variant="ghost" className="btn btn-ghost"><Link to="/">Zur Startseite</Link></Button></div>
      </div>
    </Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}
