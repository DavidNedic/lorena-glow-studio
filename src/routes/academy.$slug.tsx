import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Footer, FloatingNav, MobileBar, Section, SimpleAccordion } from "@/components/site";
import { CONTACT, MASTERCLASSES } from "@/lib/data";

export const Route = createFileRoute("/academy/$slug")({
  loader: ({ params }) => {
    const m = MASTERCLASSES.find((x) => x.slug === params.slug);
    if (!m) throw notFound();
    return m;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} Masterclass · The Golden Academy` },
      { name: "description", content: `${loaderData.lead} ${loaderData.name} bei Lorena Kovacevic, Brackenheim.` },
      { property: "og:title", content: `${loaderData.name} · The Golden Academy` },
      { property: "og:description", content: loaderData.lead },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ] : [{ title: "Masterclass nicht gefunden" }, { name: "robots", content: "noindex" }],
  }),
  component: Detail,
});

const CALL = { label: "Rückruf anfordern", href: "/academy#rueckruf" };

function Detail() {
  const m = Route.useLoaderData();
  return (
    <div className="theme-dark min-h-screen bg-background text-foreground">
      <FloatingNav back="/academy" links={[{ label: "Details", href: "#details" }, { label: "Masterclasses", href: "/academy#masterclasses" }]} cta={CALL} />
      <div className="no-scrollbar mx-auto mt-8 flex max-w-6xl gap-2 overflow-x-auto px-5">
        {MASTERCLASSES.map((x) => <Link key={x.slug} to="/academy/$slug" params={{ slug: x.slug }} data-active={x.slug === m.slug} className="chip">{x.name}</Link>)}
      </div>
      <Section className="grid items-center gap-10 pt-10 md:grid-cols-2">
        <div>
          <Link to="/academy" className="text-sm text-muted-foreground hover:text-foreground">← Alle Masterclasses</Link>
          <h1 className="mt-4 text-5xl md:text-6xl">{m.name}</h1>
          <p className="mt-5 text-xl">{m.lead}</p>
          <p className="mt-4 text-sm text-muted-foreground">{m.format} · Preis im persönlichen Gespräch · Ratenzahlung mit Klarna</p>
          {m.inPackage && <a href="/academy#paket" className="mt-4 inline-block rounded-full border border-gold px-4 py-1.5 text-sm text-gold">Auch im Skin Expert Paket</a>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/academy#rueckruf" className="btn btn-primary">Platz anfragen</a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost">Per WhatsApp fragen</a>
          </div>
        </div>
        <img src={m.image} alt={`Masterclass ${m.name}`} className="aspect-[4/5] w-full rounded-[24px] object-cover" />
      </Section>
      <Section id="details" className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <h2 className="text-4xl">Alles, was du wissen musst</h2>
        <SimpleAccordion items={[
          { q: "Das lernst du", a: m.text },
          { q: "Für wen?", a: m.group === "business" ? "Für Kosmetikerinnen, die ihr Business auf das nächste Level bringen wollen." : "Für Kosmetikerinnen und Quereinsteigerinnen, die sicher und fundiert arbeiten wollen." },
          { q: "Rahmen", a: `${m.format}. Termine und Ablauf besprechen wir persönlich.` },
          { q: "Preis und Bezahlung", a: "Den Preis besprechen wir im persönlichen Gespräch. Ratenzahlung mit Klarna ist möglich, vorbehaltlich Genehmigung." },
        ]} />
      </Section>
      <Footer headline="Lass uns über deine Karriere sprechen." cta={CALL} />
      <MobileBar {...CALL} />
    </div>
  );
}
