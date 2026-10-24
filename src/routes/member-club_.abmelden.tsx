import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Footer, FloatingNav, Section } from "@/components/site";
import { CONTACT } from "@/lib/data";
import { breadcrumbs, OG, seoHead } from "@/lib/seo";
import { unsubscribeNewsletter } from "@/lib/member.functions";

export const Route = createFileRoute("/member-club_/abmelden")({
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s["token"] === "string" ? s["token"] : "" }),
  head: () => seoHead({ path: "/member-club/abmelden", title: "Newsletter abmelden · The Golden Cosmetics", description: "Abmeldung vom Member-Club-Newsletter von The Golden Cosmetics.", image: OG.behandlungen, noindex: true, jsonLd: [breadcrumbs([["Start", "/"], ["Member Club", "/member-club"]])] }),
  component: Unsubscribe,
});

function Unsubscribe() {
  const { token } = Route.useSearch();
  const unsubscribe = useServerFn(unsubscribeNewsletter);
  const [state, setState] = useState<"busy" | "ok" | "fail">("busy");
  useEffect(() => {
    if (!token) { setState("fail"); return; }
    unsubscribe({ data: { token } }).then(r => setState(r.ok ? "ok" : "fail")).catch(() => setState("fail"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return <div>
    <FloatingNav back="/member-club" links={[]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section className="max-w-xl">
      <h1 className="text-4xl">Newsletter abmelden</h1>
      {state === "busy" && <p className="mt-6 text-muted-foreground">Einen Moment …</p>}
      {state === "ok" && <p className="mt-6 text-muted-foreground">Du bist abgemeldet. Du bekommst keine Member-Angebote mehr per E-Mail.</p>}
      {state === "fail" && <p className="mt-6 text-muted-foreground">Dieser Abmelde-Link ist ungültig oder wurde schon verwendet. Schreib uns an <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>}
      <Link to="/member-club" className="mt-6 inline-block text-sm underline underline-offset-4">Zum Member Club</Link>
    </Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}
