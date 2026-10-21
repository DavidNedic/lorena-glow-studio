import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Footer, FloatingNav, MobileBar, Section, SimpleAccordion, Slider, Label } from "@/components/site";
import { CONTACT, TREATMENTS } from "@/lib/data";

export const Route = createFileRoute("/behandlungen/$slug")({
  loader: ({ params }) => {
    const t = TREATMENTS.find((x) => x.slug === params.slug);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} in Brackenheim · The Golden Cosmetics` },
      { name: "description", content: `${loaderData.sentence} Bei Fachkosmetikerin Lorena Kovacevic in Brackenheim.` },
      { property: "og:title", content: `${loaderData.name} in Brackenheim` },
      { property: "og:description", content: loaderData.sentence },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ] : [{ title: "Behandlung nicht gefunden" }, { name: "robots", content: "noindex" }],
  }),
  component: Detail,
});

function Detail() {
  const t = Route.useLoaderData();
  const book = { label: `${t.name} buchen`, href: t.bookingUrl, external: true };
  const others = TREATMENTS.filter((x) => x.slug !== t.slug).slice(0, 3);
  return (
    <div className="bg-background">
      <FloatingNav back="/behandlungen" links={[{ label: "Ablauf", href: "#ablauf" }, { label: "Ergebnisse", href: "#ergebnisse" }]} cta={{ label: "Termin buchen", href: t.bookingUrl, external: true }} />
      <div className="no-scrollbar mx-auto mt-8 flex max-w-6xl gap-2 overflow-x-auto px-5">
        {TREATMENTS.map((x) => <Link key={x.slug} to="/behandlungen/$slug" params={{ slug: x.slug }} data-active={x.slug === t.slug} className="chip">{x.name}</Link>)}
      </div>
      <Section className="grid items-center gap-10 pt-10 md:grid-cols-2">
        <div>
          <Link to="/behandlungen" className="text-sm text-muted-foreground hover:text-foreground">← Alle Behandlungen</Link>
          <h1 className="mt-4 text-5xl md:text-7xl">{t.name}</h1>
          <p className="mt-5 text-xl">{t.sentence}</p>
          <p className="mt-4 text-sm text-muted-foreground">Dauer {t.duration} Min. · ab {t.price} € · Mit Hautanalyse</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">{t.tags.map((g) => <span key={g} className="rounded-full bg-surface-2 px-3 py-1">{g}</span>)}</div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={t.bookingUrl} target="_blank" rel="noreferrer" className="btn btn-primary">{t.name} buchen</a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost">Frage stellen</a>
          </div>
        </div>
        <img src={t.image} alt={`${t.name} bei The Golden Cosmetics`} className="aspect-[4/5] w-full rounded-[24px] object-cover shadow-warm" />
      </Section>
      <Section id="ablauf" className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <h2 className="text-4xl">So läuft dein Termin</h2>
        <SimpleAccordion items={[
          { q: "Ankommen und Hautanalyse", a: "Du kommst an, wir sprechen kurz über deine Wünsche und ich schaue mir deine Haut genau an." },
          { q: "Vorbereitung", a: "[TEXT]" },
          { q: "Treatment", a: "[TEXT]" },
          { q: "Pflege für zuhause", a: "Du bekommst von mir klare Empfehlungen, damit dein Ergebnis lange hält." },
        ]} />
      </Section>
      <Section id="ergebnisse">
        <Label>Echte Haut. Echter Glow.</Label>
        <h2 className="mb-8 text-4xl">Direkt nach der Behandlung</h2>
        <Slider images={[1, 2, 3, 4, 5].map((i) => `/images/ergebnis-${i}.jpg`)} alt={(i) => `Ergebnis ${i + 1} nach ${t.name}`} />
      </Section>
      <Section>
        <h2 className="mb-6 text-3xl">Passt auch zu dir</h2>
        <div className="border-t">
          {others.map((o) => (
            <Link key={o.slug} to="/behandlungen/$slug" params={{ slug: o.slug }} className="group flex items-center justify-between border-b py-5">
              <span><span className="text-xl font-semibold tracking-[-0.03em]">{o.name}</span><span className="ml-3 text-sm text-muted-foreground">{o.sub}</span></span>
              <span className="text-sm text-muted-foreground group-hover:text-gold-text">ab {o.price} € →</span>
            </Link>
          ))}
        </div>
      </Section>
      <Footer headline="Bereit für deinen Glow?" cta={book} />
      <MobileBar label="Termin buchen" href={t.bookingUrl} external />
    </div>
  );
}
