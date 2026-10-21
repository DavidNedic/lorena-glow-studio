import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { IntroGate } from "@/components/Intro";
import { CreamShader } from "@/components/CreamShader";
import { Arrow, Logo } from "@/components/site";
import { CONTACT } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Golden Cosmetics & Academy · Kosmetik in Brackenheim" },
      { name: "description", content: "Kosmetikstudio und Academy von Lorena Kovacevic in Brackenheim. Treatments für deine Haut und Masterclasses für Kosmetikerinnen." },
      { property: "og:title", content: "The Golden Cosmetics & Academy" },
      { property: "og:description", content: "Kosmetikstudio und Academy von Lorena Kovacevic in Brackenheim." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "BeautySalon", name: CONTACT.name,
        founder: CONTACT.owner, telephone: CONTACT.phone,
        address: { "@type": "PostalAddress", streetAddress: CONTACT.street, postalCode: "74336", addressLocality: "Brackenheim", addressCountry: "DE" },
        sameAs: [CONTACT.instagram, CONTACT.instagramAcademy],
      }),
    }],
  }),
  component: Index,
});

function ChoiceCard({ to, dark, img, kicker, title, text }: { to: "/behandlungen" | "/academy"; dark?: boolean; img: string; kicker: string; title: string; text: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => { localStorage.setItem("tg-choice", to); navigate({ to }); }}
      className={`group flex flex-col rounded-[28px] p-3 text-left shadow-warm transition-transform duration-500 hover:-translate-y-1.5 ${dark ? "theme-dark bg-ink text-foreground" : "bg-paper"}`}
    >
      <div className="aspect-[16/10] overflow-hidden rounded-[18px]">
        <img src={img} alt={`${title}: ${text}`} className="size-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
      </div>
      <div className="flex items-end gap-4 p-4 pt-6">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{kicker}</p>
          <h2 className="mt-1 text-3xl md:text-4xl">{title}</h2>
          <p className="mt-2 text-muted-foreground">{text}</p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-full border transition-all duration-500 group-hover:-rotate-45 group-hover:border-gold group-hover:text-gold">
          <Arrow />
        </span>
      </div>
    </button>
  );
}

function Index() {
  return (
    <IntroGate>
      <div className="relative min-h-screen overflow-hidden" style={{ backgroundImage: "url(/images/creme-hintergrund.jpg)", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
        <CreamShader />
        <div className="relative flex min-h-screen flex-col">
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
            <Link to="/"><Logo /></Link>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/behandlungen" className="hidden text-muted-foreground hover:text-foreground md:inline">Behandlungen</Link>
              <Link to="/academy" className="hidden text-muted-foreground hover:text-foreground md:inline">Academy</Link>
              <a href="/behandlungen#kontakt" className="hidden text-muted-foreground hover:text-foreground md:inline">Kontakt</a>
              <a href={CONTACT.beautinda} target="_blank" rel="noreferrer" className="btn-lipstick">Termin buchen</a>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl">Wofür bist du hier?</h1>
              <p className="mt-4 text-muted-foreground">Wähle einfach aus. Du kannst jederzeit wechseln.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <ChoiceCard to="/behandlungen" img="/images/kachel-behandlung.jpg" kicker="Für dich und deine Haut" title="Behandlung" text="Treatments für sichtbar schöne Haut im Studio in Brackenheim." />
              <ChoiceCard to="/academy" dark img="/images/kachel-academy.jpg" kicker="Für Kosmetikerinnen" title="Academy" text="Masterclasses mit Zertifikat und Mentoring für Kosmetikerinnen." />
            </div>
          </main>
          <footer className="flex flex-wrap justify-center gap-x-3 gap-y-1 px-5 pb-6 text-xs text-muted-foreground">
            <span>{CONTACT.street}, {CONTACT.city}</span><span>·</span>
            <a href={CONTACT.beautinda} target="_blank" rel="noreferrer" className="hover:text-foreground">Termin direkt buchen</a><span>·</span>
            <span>{CONTACT.phone}</span>
          </footer>
        </div>
      </div>
    </IntroGate>
  );
}
