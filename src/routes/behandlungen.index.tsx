import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AccordionItem, Footer, FloatingNav, Hand, Label, MobileBar, Section, SimpleAccordion, Slider } from "@/components/site";
import { CONTACT, PROBLEMS, TREATMENTS, type Category } from "@/lib/data";

export const Route = createFileRoute("/behandlungen/")({
  head: () => ({
    meta: [
      { title: "Kosmetik & Treatments in Brackenheim · The Golden Cosmetics" },
      { name: "description", content: "Glass Skin, Aquafacial, Microneedling und mehr bei Fachkosmetikerin Lorena Kovacevic in Brackenheim. Jetzt Termin buchen." },
      { property: "og:title", content: "Behandlungen · The Golden Cosmetics" },
      { property: "og:description", content: "Hautästhetik mit Anspruch in Brackenheim." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Behandlungen,
});

const FILTERS: ("Alle" | Category)[] = ["Alle", "Reine Haut", "Glow", "Struktur", "Augen"];
const BOOK = { label: "Termin buchen", href: CONTACT.beautinda, external: true };

function Behandlungen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Alle");
  const [open, setOpen] = useState<string | null>(null);
  const list = TREATMENTS.filter((t) => filter === "Alle" || t.categories.includes(filter));

  const pick = (slug: string) => {
    setFilter("Alle"); setOpen(slug);
    setTimeout(() => document.getElementById(`t-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  return (
    <div className="bg-background">
      <FloatingNav back="/" links={[{ label: "Behandlungen", href: "#behandlungen" }, { label: "Ergebnisse", href: "#ergebnisse" }, { label: "Über mich", href: "#lorena" }]} cta={BOOK} />

      <Section className="grid items-center gap-10 pt-10 md:grid-cols-2 md:pt-16">
        <div className="order-2 md:order-1">
          <h1 className="text-5xl md:text-7xl">Deine Haut verdient eine Lösung.</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Hautästhetik mit Anspruch. Individuelle Behandlungen, moderne Skin-Konzepte und fundiertes Fachwissen, abgestimmt auf die Bedürfnisse deiner Haut.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={CONTACT.beautinda} target="_blank" rel="noreferrer" className="btn btn-primary">Termin buchen</a>
            <a href="#behandlungen" className="btn btn-ghost">Behandlungen entdecken</a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <img src="/images/studio.jpg" alt="Das Kosmetikstudio The Golden Cosmetics in Brackenheim" className="aspect-[4/3] w-full rounded-[24px] object-cover shadow-warm md:aspect-[4/5]" />
          <div className="mt-5 flex items-center gap-4">
            <img src="/images/lorena-portrait-2.jpg" alt="Lorena Kovacevic" className="size-14 rounded-full object-cover" />
            <div><Hand className="leading-none">Ich freu mich auf dich!</Hand><p className="text-sm text-muted-foreground">Lorena, Inhaberin</p></div>
          </div>
        </div>
      </Section>

      <Section className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl md:text-5xl">Du probierst Produkt um Produkt und bist morgens trotzdem unzufrieden mit dem, was du im Spiegel siehst?</h2>
          <p className="mt-6 text-muted-foreground">Vielleicht hast du schon vieles versucht, ohne wirklich zu verstehen, was deine Haut braucht. Es ist Zeit, deine Haut nicht länger nur zu kaschieren, sondern sie gezielt zu verstehen und professionell zu behandeln.</p>
        </div>
        <div>
          <p className="mb-4 font-semibold">Was davon kennst du? <span className="font-normal text-muted-foreground">Tipp an, was dich stört.</span></p>
          <div className="border-t">
            {PROBLEMS.map((p) => {
              const t = TREATMENTS.find((x) => x.slug === p.slug)!;
              return (
                <button key={p.slug} onClick={() => pick(p.slug)} className="group flex w-full items-center justify-between border-b py-5 text-left">
                  <span className="text-xl font-medium tracking-[-0.02em]">{p.label}</span>
                  <span className="text-sm text-muted-foreground transition group-hover:text-gold-text">{t.name} →</span>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section id="behandlungen">
        <h2 className="text-4xl md:text-5xl">Meine Behandlungen</h2>
        <div className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5">
          {FILTERS.map((f) => <button key={f} data-active={filter === f} onClick={() => setFilter(f)} className="chip">{f}</button>)}
        </div>
        <div className="card mt-6 overflow-hidden">
          {list.map((t) => (
            <AccordionItem key={t.slug} id={`t-${t.slug}`} open={open === t.slug} onToggle={() => setOpen(open === t.slug ? null : t.slug)}
              head={
                <div className="flex items-baseline justify-between gap-4">
                  <div><p className="text-xl font-semibold tracking-[-0.03em]">{t.name}</p><p className="text-sm text-muted-foreground">{t.sub}</p></div>
                  <span className="shrink-0 text-sm text-muted-foreground">ab {t.price} €</span>
                </div>
              }>
              <div className="flex flex-col gap-5 sm:flex-row">
                <img src={t.image} alt={`Hautbild nach ${t.name}`} className="aspect-[4/5] w-28 rounded-[16px] object-cover" />
                <div className="flex-1">
                  <p className="text-lg">{t.sentence}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="text-muted-foreground">Ideal bei</span>{t.tags.map((g) => <span key={g} className="rounded-full bg-surface-2 px-3 py-1">{g}</span>)}</div>
                  <p className="mt-3 text-sm text-muted-foreground">Dauer: {t.duration} Min. · Jede Behandlung startet mit einer Hautanalyse.</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={t.bookingUrl} target="_blank" rel="noreferrer" className="btn btn-primary">{t.name} buchen</a>
                    <Link to="/behandlungen/$slug" params={{ slug: t.slug }} className="btn btn-ghost">Ablauf ansehen</Link>
                  </div>
                </div>
              </div>
            </AccordionItem>
          ))}
        </div>
      </Section>

      <Section id="ergebnisse">
        <Label>Echte Haut. Echter Glow.</Label>
        <h2 className="mb-8 text-4xl md:text-5xl">Direkt nach der Behandlung</h2>
        <Slider images={[1, 2, 3, 4, 5].map((i) => `/images/ergebnis-${i}.jpg`)} alt={(i) => `Hautergebnis ${i + 1} direkt nach der Behandlung`} />
        <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm font-medium underline underline-offset-4 hover:text-gold-text">Mehr Ergebnisse auf Instagram @thegoldencosmetics</a>
      </Section>

      <Section id="lorena" className="grid items-center gap-10 md:grid-cols-2">
        <img src="/images/lorena-portrait-1.jpg" alt="Lorena Kovacevic, Fachkosmetikerin in Brackenheim" className="aspect-[4/5] w-full rounded-[24px] object-cover shadow-warm" />
        <div>
          <Hand>Hi, ich bin Lorena.</Hand>
          <h2 className="mt-3 text-4xl md:text-5xl">Skin is my expertise. Your next level is my mission.</h2>
          <p className="mt-6 text-muted-foreground">Als anerkannte Fachkosmetikerin schaue ich mir deine Haut genau an und sage dir ehrlich, was sie braucht. In meinem Studio in Brackenheim nehme ich mir Zeit für dich.</p>
          <a href={CONTACT.beautinda} target="_blank" rel="noreferrer" className="btn btn-primary mt-8">Termin bei Lorena buchen</a>
        </div>
      </Section>

      <Section id="kontakt" className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-4xl">Gut zu wissen</h2>
          <p className="mt-4 text-muted-foreground">Deine Frage ist nicht dabei? Schreib mir einfach.</p>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost mt-6">Per WhatsApp fragen</a>
        </div>
        <SimpleAccordion items={[
          { q: "Wie läuft mein erster Termin ab?", a: "Wir starten immer mit einer Hautanalyse. Danach weiß ich, was deine Haut braucht, und wir legen gemeinsam los." },
          { q: "Welches Treatment passt zu mir?", a: "Das klären wir in der Hautanalyse. Du musst dich vorher nicht festlegen." },
          { q: "Wie bereite ich mich vor?", a: "Komm am besten ungeschminkt. So kann ich deine Haut direkt beurteilen." },
          { q: "Gibt es Gutscheine?", a: "Ja. Schreib mir per WhatsApp, dann stelle ich dir deinen Gutschein aus." },
          { q: "Behandelst du auch Männer?", a: "Ja, die Ausreinigung gibt es auch als Men Edition." },
          { q: "Kann ich meinen Termin verschieben?", a: "[STORNOBEDINGUNGEN]" },
        ]} />
      </Section>

      <Footer headline="Bereit für deinen Glow?" cta={BOOK} />
      <MobileBar {...BOOK} />
    </div>
  );
}
