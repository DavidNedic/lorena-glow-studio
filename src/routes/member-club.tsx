import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav, Footer, Section } from "@/components/site";
import { CONTACT } from "@/lib/data";
import { breadcrumbs, OG, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/member-club")({
  head: () => seoHead({ path: "/member-club", title: "Member Club · The Golden Cosmetics Brackenheim", description: "Der Member Club von The Golden Cosmetics & Academy in Brackenheim bei Heilbronn. Weitere Informationen folgen.", image: OG.behandlungen, noindex: true, jsonLd: [breadcrumbs([["Start", "/"], ["Member Club", "/member-club"]])] }),
  component: MemberClub,
});

function MemberClub() {
  return <div className="bg-background">
    <FloatingNav back="/" links={[{ label: "Behandlungen", href: "/behandlungen" }, { label: "Academy", href: "/academy" }]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section><h1 className="text-5xl">Member Club</h1><p className="mt-6 text-muted-foreground">Hier findest du bald mehr zum Member Club.</p></Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}