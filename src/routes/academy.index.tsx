import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AccordionItem, Footer, FloatingNav, Hand, Label, MobileBar, Section, SimpleAccordion, Slider } from "@/components/site";
import { CONTACT, MASTERCLASSES } from "@/lib/data";
import { recommend, type Answers } from "@/lib/check";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Kosmetik Masterclasses mit Zertifikat · The Golden Academy" },
      { name: "description", content: "Masterclasses mit Zertifikat und Mentoring für Kosmetikerinnen, persönlich begleitet von Lorena Kovacevic in Brackenheim." },
      { property: "og:title", content: "The Golden Academy · Masterclasses für Kosmetikerinnen" },
      { property: "og:description", content: "You were made for more. Masterclasses mit Zertifikat und Mentoring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Academy,
});

const CALL = { label: "Rückruf anfordern", href: "#rueckruf" };

function Academy() {
  const [tab, setTab] = useState<"fachlich" | "business">("fachlich");
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="theme-dark min-h-screen bg-background text-foreground">
      <FloatingNav back="/" links={[{ label: "Masterclasses", href: "#masterclasses" }, { label: "Karriere-Check", href: "#check" }, { label: "Absolventinnen", href: "#absolventinnen" }]} cta={CALL} />

      <Section className="grid items-center gap-10 pt-10 md:grid-cols-2 md:pt-16">
        <div className="order-2 md:order-1">
          <h1 className="text-5xl md:text-7xl">You were made for more.</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Dein Können. Deine Expertise. Deine Zukunft. Masterclasses mit Zertifikat und Mentoring, persönlich begleitet von Lorena. Ich bilde dich nicht nur aus, ich begleite dich auf deinem weiteren Weg.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#check" className="btn btn-primary">Welche Masterclass passt zu mir?</a>
            <a href="#rueckruf" className="btn btn-ghost">Kostenlos beraten lassen</a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <img src="/images/absolventinnen-1.jpg" alt="Lorena mit Absolventinnen der Academy" className="aspect-[4/3] w-full rounded-[24px] object-cover md:aspect-[4/5]" />
          <Hand className="mt-4 text-gold">Ich zeig dir, wie es geht.</Hand>
        </div>
      </Section>

      <Section id="paket">
        <div className="rounded-[28px] bg-surface p-6 md:p-12">
          <Label>Skin Expert Masterclass</Label>
          <h2 className="max-w-3xl text-3xl md:text-5xl">Drei Schulungen. Drei Behandlungskonzepte. Fünf Zertifikate. Dein nächster Schritt zur Skin Expertin.</h2>
          <div className="mt-10 grid grid-cols-2 items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1.2fr]">
            {["Aquafacial", "Microneedling", "Glass Skin"].map((n, i) => (
              <div key={n} className="contents">
                <div className="rounded-[20px] bg-surface-2 p-5 font-semibold">{n}</div>
                <span className="hidden text-center text-2xl text-muted-foreground md:block">{i < 2 ? "+" : "="}</span>
              </div>
            ))}
            <div className="col-span-2 rounded-[20px] bg-gold p-5 font-semibold text-primary-foreground md:col-span-1">5 Zertifikate</div>
          </div>
          <a href="#rueckruf" className="btn btn-primary mt-10">Paket anfragen</a>
        </div>
      </Section>

      <Section id="masterclasses">
        <h2 className="text-4xl md:text-5xl">Alle Masterclasses</h2>
        <div className="mt-8 inline-flex gap-1 rounded-full bg-surface p-1">
          <button data-active={tab === "fachlich"} onClick={() => setTab("fachlich")} className="chip border-0">Fachlich</button>
          <button data-active={tab === "business"} onClick={() => setTab("business")} className="chip border-0">Business & Wachstum</button>
        </div>
        <div className="card mt-6 overflow-hidden">
          {MASTERCLASSES.filter((m) => m.group === tab).map((m) => (
            <AccordionItem key={m.slug} open={open === m.slug} onToggle={() => setOpen(open === m.slug ? null : m.slug)}
              head={
                <div className="flex items-baseline justify-between gap-4">
                  <div><p className="text-xl font-semibold tracking-[-0.03em]">{m.name}</p><p className="text-sm text-muted-foreground">{m.format}</p></div>
                  <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">Preis im Gespräch</span>
                </div>
              }>
              <p className="text-lg font-semibold">{m.lead}</p>
              <p className="mt-2 text-muted-foreground">{m.text}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">{m.tags.map((g) => <span key={g} className="rounded-full bg-surface-2 px-3 py-1">{g}</span>)}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href="#rueckruf" className="btn btn-primary">Platz anfragen</a>
                <Link to="/academy/$slug" params={{ slug: m.slug }} className="btn btn-ghost">Alle Details</Link>
              </div>
            </AccordionItem>
          ))}
        </div>
      </Section>

      <Section id="absolventinnen">
        <Label>Deine Entwicklung endet nicht mit dem Zertifikat.</Label>
        <h2 className="mb-8 text-4xl md:text-5xl">Meine Absolventinnen</h2>
        <Slider images={[1, 2, 3, 4].map((i) => `/images/absolventinnen-${i}.jpg`)} alt={(i) => `Absolventin ${i + 1} mit Zertifikat`} />
      </Section>

      <Section id="check"><Check /></Section>

      <Section className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <h2 className="text-4xl">Gut zu wissen</h2>
        <SimpleAccordion items={[
          { q: "Was kostet eine Masterclass?", a: "Das besprechen wir persönlich am Telefon. So kann ich dir genau das anbieten, was zu dir passt." },
          { q: "Kann ich auch online lernen?", a: "Einige Masterclasses gibt es online. Alles Weitere nach Absprache." },
          { q: "Kann ich in Raten zahlen?", a: "Ja, Ratenzahlung ist mit Klarna möglich, vorbehaltlich Genehmigung." },
          { q: "Brauche ich Vorkenntnisse?", a: "Das hängt von der Masterclass ab. Im Gespräch finden wir deinen passenden Einstieg." },
          { q: "Was passiert nach der Schulung?", a: "Ich bleibe deine Ansprechpartnerin, auch wenn du dein Zertifikat schon in der Hand hast." },
        ]} />
      </Section>

      <Section id="rueckruf" className="grid gap-10 md:grid-cols-2">
        <div>
          <Hand className="text-4xl text-gold">Wie lange willst du noch zuschauen?</Hand>
          <p className="mt-4 text-muted-foreground">Lass mir deine Nummer da. Ich rufe dich an und wir finden gemeinsam deinen nächsten Schritt.</p>
          <p className="mt-6 text-2xl font-semibold">{CONTACT.phone}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-gold">WhatsApp schreiben</a>
            <a href={CONTACT.calendly} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-gold">Termin über Calendly</a>
          </div>
        </div>
        <CallbackForm />
      </Section>

      <Footer headline="Lass uns über deine Karriere sprechen." cta={CALL} />
      <MobileBar {...CALL} />
    </div>
  );
}

function CallbackForm() {
  const [sent, setSent] = useState(false);
  const [interest, setInterest] = useState("Weiß noch nicht");
  if (sent) return <div className="card grid place-items-center p-10 text-center"><div><p className="text-2xl font-semibold">Danke!</p><p className="mt-2 text-muted-foreground">Ich melde mich so schnell wie möglich bei dir.</p></div></div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card space-y-4 p-6 md:p-8">
      <Field label="Vorname" name="vorname" />
      <Field label="Handynummer" name="telefon" type="tel" />
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Interesse</p>
        <div className="flex flex-wrap gap-2">
          {["Skin Expert Paket", "Einzelne Masterclass", "Business & Mentoring", "Weiß noch nicht"].map((c) => (
            <button type="button" key={c} data-active={interest === c} onClick={() => setInterest(c)} className="chip">{c}</button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary w-full">Rückruf anfordern</button>
      <p className="text-xs text-muted-foreground">Deine Daten nutze ich nur für den Rückruf. Mehr in der <a href="/rechtliches#datenschutz" className="underline">Datenschutzerklärung</a>.</p>
    </form>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted-foreground">{label}</span>
      <input required name={name} type={type} className="w-full rounded-full border bg-surface-2 px-5 py-3 outline-none focus:border-gold" />
    </label>
  );
}

const QUESTIONS = [
  { key: "stand", q: "Wo stehst du gerade?", opts: [["neu", "Ich bin neu in der Branche"], ["kosmetikerin", "Ich bin Kosmetikerin"], ["studio", "Ich habe ein eigenes Studio"]] },
  { key: "goal", q: "Was ist dein Ziel?", opts: [["treatments", "Neue Treatments anbieten"], ["wissen", "Mehr Fachwissen"], ["umsatz", "Mehr Kundinnen und Umsatz"], ["ausbilden", "Selbst ausbilden"]] },
  { key: "form", q: "Wie lernst du am liebsten?", opts: [["vorort", "Vor Ort"], ["online", "Online"], ["egal", "Egal"]] },
  { key: "start", q: "Wann möchtest du starten?", opts: [["sofort", "Sofort"], ["bald", "In 1 bis 3 Monaten"], ["info", "Ich informiere mich erst"]] },
] as const;

function Check() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const done = step >= QUESTIONS.length;
  const slug = done ? recommend(ans as unknown as Answers) : "";
  const course = slug === "skin-expert" ? "Skin Expert Masterclass" : MASTERCLASSES.find((m) => m.slug === slug)?.name;

  return (
    <div className="rounded-[28px] bg-surface p-6 md:p-12">
      <Label>Karriere-Check</Label>
      <div className="mb-8 h-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-gold transition-all duration-500" style={{ width: `${(Math.min(step, 4) / 4) * 100}%` }} />
      </div>
      {!done ? (
        <div>
          <h2 className="text-3xl md:text-4xl">{QUESTIONS[step].q}</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {QUESTIONS[step].opts.map(([v, l]) => (
              <button key={v} onClick={() => { setAns({ ...ans, [QUESTIONS[step].key]: v }); setStep(step + 1); }}
                className="rounded-[20px] border bg-surface-2 p-5 text-left text-lg font-medium transition hover:border-gold">{l}</button>
            ))}
          </div>
          {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-6 text-sm text-muted-foreground hover:text-foreground">← Zurück</button>}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[20px] bg-surface-2 p-6">
            <p className="text-sm text-muted-foreground">Mein Vorschlag für dich:</p>
            <h3 className="mt-2 text-3xl text-gold">{course}</h3>
            {slug !== "skin-expert"
              ? <Link to="/academy/$slug" params={{ slug }} className="mt-4 inline-block text-sm underline underline-offset-4">Alle Details</Link>
              : <a href="#paket" className="mt-4 inline-block text-sm underline underline-offset-4">Zum Paket</a>}
            <button onClick={() => { setStep(0); setAns({}); setSent(false); }} className="mt-4 block text-sm text-muted-foreground">Nochmal starten</button>
          </div>
          {sent ? (
            <div className="grid place-items-center rounded-[20px] border p-6 text-center"><div><p className="text-2xl font-semibold">Danke!</p><p className="mt-2 text-muted-foreground">Ich rufe dich zurück.</p></div></div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <Field label="Vorname" name="vorname" />
              <Field label="Handynummer" name="telefon" type="tel" />
              <button className="btn btn-primary w-full">Kostenlosen Rückruf sichern</button>
              <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="block text-center text-sm underline underline-offset-4">Lieber per WhatsApp schreiben</a>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
