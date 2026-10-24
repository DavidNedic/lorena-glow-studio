import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Footer, FloatingNav, Section } from "@/components/site";
import { CONTACT } from "@/lib/data";
import { OG, seoHead } from "@/lib/seo";
import { confirmMember } from "@/lib/member.functions";

export const Route = createFileRoute("/member-club/bestaetigen")({
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s["token"] === "string" ? s["token"] : "" }),
  head: () => seoHead({ path: "/member-club/bestaetigen", title: "Anmeldung bestätigen · The Golden Cosmetics", description: "Bestätigung der Newsletter-Anmeldung bei The Golden Cosmetics in Brackenheim.", image: OG.behandlungen, noindex: true }),
  component: Confirm,
});

function Confirm() {
  const { token } = Route.useSearch();
  const confirm = useServerFn(confirmMember);
  const [state, setState] = useState<"busy" | "ok" | "fail">("busy");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!token) { setState("fail"); return; }
    confirm({ data: { token } }).then(r => setState(r.ok ? "ok" : "fail")).catch(e => { setMsg(e instanceof Error ? e.message : ""); setState("fail"); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return <div className="bg-background">
    <FloatingNav back="/member-club" links={[]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section className="max-w-xl">
      <h1 className="text-4xl">{state === "ok" ? "Danke!" : "Anmeldung bestätigen"}</h1>
      {state === "busy" && <p className="mt-6 text-muted-foreground">Einen Moment …</p>}
      {state === "ok" && <p className="mt-6 text-muted-foreground">Dein Gutscheincode ist unterwegs in dein Postfach.</p>}
      {state === "fail" && <p className="mt-6 text-muted-foreground">{msg || "Dieser Bestätigungslink ist ungültig."} Schreib uns gern an <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>}
      <Link to="/behandlungen" className="mt-6 inline-block text-sm underline underline-offset-4">Zu den Behandlungen</Link>
    </Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}
