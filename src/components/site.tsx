import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CONTACT } from "@/lib/data";

export function Logo({ text = true }: { text?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <img src="/images/logo.png" alt="The Golden Cosmetics Logo, ein Kolibri" className="size-8" />
      {text && <span className="font-semibold tracking-[-0.03em]">The Golden</span>}
    </span>
  );
}

export function Arrow({ dir = "right" }: { dir?: "right" | "left" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      {dir === "right" ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
    </svg>
  );
}

type NavProps = {
  back: string;
  links: { label: string; href: string }[];
  cta: { label: string; href: string; external?: boolean };
};

export function FloatingNav({ back, links, cta }: NavProps) {
  return (
    <div className="sticky top-[14px] z-40 flex justify-center px-3">
      <nav className="flex items-center gap-2 rounded-full bg-nav p-1.5 pl-1.5 shadow-warm md:gap-5">
        <a href={back} aria-label="Zurück" className="grid size-10 place-items-center rounded-full bg-surface-2 transition hover:text-gold">
          <Arrow dir="left" />
        </a>
        <Link to="/" className="pr-1">
          <span className="md:hidden"><Logo text={false} /></span>
          <span className="hidden md:inline"><Logo /></span>
        </Link>
        <div className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-foreground">{l.label}</a>
          ))}
        </div>
        <a href={cta.href} {...(cta.external ? { target: "_blank", rel: "noreferrer" } : {})} className="btn-lipstick ml-1">
          {cta.label}
        </a>
      </nav>
    </div>
  );
}

export function Footer({ headline, cta }: { headline: string; cta: { label: string; href: string; external?: boolean } }) {
  return (
    <footer className="theme-dark bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-20 md:pb-10">
        <div className="flex flex-col items-start justify-between gap-6 border-b pb-14 md:flex-row md:items-end">
          <h2 className="max-w-xl text-4xl md:text-6xl">{headline}</h2>
          <a href={cta.href} {...(cta.external ? { target: "_blank", rel: "noreferrer" } : {})} className="btn btn-primary">{cta.label}</a>
        </div>
        <div className="grid gap-10 py-12 text-sm md:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-muted-foreground">Kosmetikstudio und Academy von Lorena Kovacevic in Brackenheim.</p>
          </div>
          <div><p className="mb-2 font-semibold">Studio</p><p className="text-muted-foreground">{CONTACT.street}<br />{CONTACT.city}</p></div>
          <div><p className="mb-2 font-semibold">Öffnungszeiten</p><p className="text-muted-foreground">{CONTACT.hours}</p></div>
          <div className="space-y-1 text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Kontakt</p>
            <p>{CONTACT.phone}</p><p>{CONTACT.email}</p>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="block hover:text-gold">@thegoldencosmetics</a>
            <a href={CONTACT.instagramAcademy} target="_blank" rel="noreferrer" className="block hover:text-gold">@academy_thegoldencosmetics</a>
          </div>
        </div>
        <div className="flex gap-6 border-t pt-6 text-xs text-muted-foreground">
          <span>© 2026 The Golden Cosmetics</span>
          <a href="/rechtliches#impressum" className="hover:text-foreground">Impressum</a>
          <a href="/rechtliches#datenschutz" className="hover:text-foreground">Datenschutz</a>
        </div>
      </div>
    </footer>
  );
}

export function MobileBar({ label, href, external }: { label: string; href: string; external?: boolean }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full bg-nav p-1.5 shadow-warm md:hidden">
      <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="btn btn-primary flex-1 py-3">{label}</a>
      <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost py-3">WhatsApp</a>
    </div>
  );
}

export function Hand({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`hand text-3xl text-gold-text ${className}`}>{children}</p>;
}

export function AccordionItem({ open, onToggle, head, children, id }: {
  open: boolean; onToggle: () => void; head: ReactNode; children: ReactNode; id?: string;
}) {
  return (
    <div id={id} className="border-b last:border-b-0 scroll-mt-28">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-7">
        <div className="flex-1">{head}</div>
        <span className={`grid size-9 shrink-0 place-items-center rounded-full border transition-transform duration-300 ${open ? "rotate-45 border-gold text-gold" : ""}`}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden"><div className="px-5 pb-6 md:px-7">{children}</div></div>
      </div>
    </div>
  );
}

export function SimpleAccordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="card overflow-hidden">
      {items.map((it, i) => (
        <AccordionItem key={it.q} open={open === i} onToggle={() => setOpen(open === i ? null : i)}
          head={<span className="font-semibold tracking-[-0.02em]">{it.q}</span>}>
          <div className="text-muted-foreground">{it.a}</div>
        </AccordionItem>
      ))}
    </div>
  );
}

export function Slider({ images, alt }: { images: string[]; alt: (i: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.5, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5">
        {images.map((src, i) => (
          <img key={src + i} src={src} alt={alt(i)} loading="lazy"
            className="aspect-[4/5] w-[78%] shrink-0 snap-start rounded-[24px] object-cover sm:w-[42%] lg:w-[30%]" />
        ))}
      </div>
      <div className="mt-6 hidden justify-end gap-2 md:flex">
        <button onClick={() => go(-1)} aria-label="Zurück" className="grid size-11 place-items-center rounded-full border hover:border-gold"><Arrow dir="left" /></button>
        <button onClick={() => go(1)} aria-label="Weiter" className="grid size-11 place-items-center rounded-full border hover:border-gold"><Arrow /></button>
      </div>
    </div>
  );
}

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24 ${className}`}>{children}</section>;
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-medium text-gold-text">{children}</p>;
}

export function useScrollToHash() {
  useEffect(() => {
    if (window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView();
  }, []);
}
