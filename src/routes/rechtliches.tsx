import { createFileRoute } from "@tanstack/react-router";
import { Footer, FloatingNav, Section } from "@/components/site";
import { CONTACT } from "@/lib/data";
import { OG, breadcrumbs, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/rechtliches")({
  head: () => seoHead({ path: "/rechtliches", title: "Impressum & Datenschutz · The Golden Cosmetics", description: "Impressum und Datenschutzerklärung von The Golden Cosmetics & Academy, Kosmetikstudio von Lorena Kovacevic in Brackenheim bei Heilbronn.", image: OG.behandlungen, jsonLd: [breadcrumbs([["Start", "/"], ["Impressum & Datenschutz", "/rechtliches"]])] }),
  component: Legal,
});

function Legal() {
  return (
    <div className="bg-background">
      <FloatingNav back="/" links={[{ label: "Impressum", href: "#impressum" }, { label: "Datenschutz", href: "#datenschutz" }]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
      <Section id="impressum" className="max-w-3xl">
        <h1 className="text-5xl">Impressum</h1>
         <p className="mt-6 text-muted-foreground">{CONTACT.name}<br />{CONTACT.owner}<br />Rechtsform: {CONTACT.legalForm}<br />{CONTACT.street}<br />{CONTACT.city}<br />Telefon: {CONTACT.phone}<br />E-Mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
         <p className="mt-4 text-muted-foreground">USt-IdNr. gemäß § 27a UStG: {CONTACT.vatId}<br />Berufsbezeichnung: {CONTACT.profession}</p>
         <h2 className="mt-8 text-2xl">Verbraucherstreitbeilegung</h2>
         <p className="mt-4 text-muted-foreground">{CONTACT.disputeResolution}</p>
      </Section>
      <Section id="datenschutz" className="max-w-3xl">
        <h2 className="text-4xl">Datenschutz</h2>
        <p className="mt-6 text-muted-foreground">[DATENSCHUTZERKLÄRUNG]</p>
      </Section>
       <Section id="agb" className="max-w-3xl">
         <h2 className="text-4xl">AGB</h2>
         <p className="mt-6 text-muted-foreground">Die Allgemeinen Geschäftsbedingungen werden hier ergänzt.</p>
       </Section>
      <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    </div>
  );
}
