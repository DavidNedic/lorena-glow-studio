import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CONTACT } from "@/lib/data";
import { Button } from "@/components/ui/button";
import birdMark from "@/assets/kolibri-mark.png";

export function Logo({ text = true, white = false }: { text?: boolean; white?: boolean }) {
  return <span className="flex items-center justify-center gap-2"><img src={birdMark} alt="The Golden Cosmetics Logo, ein Kolibri" className={`size-9 shrink-0 object-contain ${white ? "brand-bird-white" : "brand-bird-black"}`} />{text && <span className="nav-brand text-left text-sm font-semibold leading-tight">The Golden Cosmetics<br /> & Academy</span>}</span>;
}
export function Arrow({ dir = "right" }: { dir?: "right" | "left" }) { return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{dir === "right" ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}</svg>; }
export function InstagramLogo() {
  const id = useId();
  return <svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id={id} cx="30%" cy="105%" r="130%"><stop offset="0%" stopColor="var(--insta-yellow)" /><stop offset="30%" stopColor="var(--insta-orange)" /><stop offset="60%" stopColor="var(--insta-pink)" /><stop offset="100%" stopColor="var(--insta-purple)" /></radialGradient></defs><rect width="24" height="24" rx="6" fill={`url(#${id})`} /><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="var(--logo-light)" strokeWidth="1.7" /><circle cx="12" cy="12" r="3.4" fill="none" stroke="var(--logo-light)" strokeWidth="1.7" /><circle cx="16.6" cy="7.5" r="1" fill="var(--logo-light)" /></svg>;
}
export function InstagramLink({ results = false }: { results?: boolean }) { return <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium underline underline-offset-4"><InstagramLogo />{results ? "Mehr Ergebnisse auf Instagram" : "Mehr auf Instagram"}</a>; }
export function ActionLink({ href, children, secondary = false, lipstick = false, external = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; lipstick?: boolean; external?: boolean; className?: string }) {
  return <Button asChild variant="ghost" className={`${lipstick ? "btn-lipstick" : `btn ${secondary ? "btn-ghost" : "btn-primary"}`} ${className}`}><a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a></Button>;
}
type NavProps = { back: string; links: { label: string; href: string }[]; cta: { label: string; href: string; external?: boolean } };
export function FloatingNav({ back, links, cta }: NavProps) {
  const [menu, setMenu] = useState(false);
  return <div className="sticky top-[14px] z-40 flex justify-center px-3 pt-3"><nav className="relative flex max-w-full items-center gap-2 rounded-full bg-nav p-1.5 shadow-warm md:gap-5">
    <Button asChild variant="ghost" size="icon" className="size-10 shrink-0 rounded-full bg-surface-2"><a href={back} aria-label="Zurück"><Arrow dir="left" /></a></Button>
    <Link to="/" className="hidden md:block"><Logo /></Link><Link to="/" className="md:hidden"><Logo text={false} /></Link>
    <div className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">{links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}</div>
    <Button variant="ghost" size="icon" aria-label="Navigation öffnen" aria-expanded={menu} onClick={() => setMenu(!menu)} className="rounded-full md:hidden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 8h14M5 16h14" /></svg></Button>
    <ActionLink href={cta.href} external={cta.external ?? false} lipstick>{cta.label}</ActionLink>
    {menu && <div className="absolute inset-x-0 top-[calc(100%+10px)] flex flex-col gap-4 rounded-2xl border bg-nav p-5 text-center md:hidden">{links.map(l => <a key={l.href} href={l.href} onClick={() => setMenu(false)}>{l.label}</a>)}</div>}
  </nav></div>;
}
export function Footer({ headline, cta }: { headline: string; cta: { label: string; href: string; external?: boolean } }) {
  return <footer className="site-footer text-center"><div className="mx-auto max-w-6xl px-5 pb-10 pt-20">
    <div className="flex flex-col items-center gap-7 border-b pb-14"><h2 className="max-w-3xl text-4xl md:text-5xl">{headline}</h2><ActionLink href={cta.href} external={cta.external ?? false} className="footer-cta">{cta.label}</ActionLink></div>
    <div className="mt-12 flex flex-col items-start gap-3 text-left"><Logo text={false} white /><p className="whitespace-nowrap text-sm font-semibold sm:text-base">{CONTACT.name}</p><p>by {CONTACT.owner}, Fachkosmetikerin in Brackenheim</p></div>
    <div className="mx-auto grid max-w-4xl gap-8 py-10 text-left text-sm md:grid-cols-3">
      <div><p className="mb-2 font-semibold">Standort</p><p className="text-muted-foreground">{CONTACT.street}<br />{CONTACT.city}</p></div>
      <div><p className="mb-2 font-semibold">Öffnungszeiten</p><p className="text-muted-foreground">{CONTACT.hours}</p></div>
      <div className="space-y-2"><p className="font-semibold">Kontakt</p><a href={CONTACT.tel} className="block text-muted-foreground">{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`} className="block text-muted-foreground">{CONTACT.email}</a><a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="block text-muted-foreground">@thegoldencosmetics</a></div>
    </div><div className="flex flex-wrap justify-start gap-5 border-t pt-6 text-left text-xs text-muted-foreground"><span>© 2026 The Golden Cosmetics</span><Link to="/rechtliches" hash="impressum">Impressum</Link><Link to="/rechtliches" hash="datenschutz">Datenschutz</Link><Link to="/rechtliches" hash="agb">AGB</Link><Link to="/rechtliches" hash="widerruf">Widerruf</Link><Link to="/member-club">Member Club</Link><Link to="/admin" className="opacity-60 hover:opacity-100">Admin</Link><a href={CONTACT.websiteCreator.url} target="_blank" rel="noreferrer">Website von {CONTACT.websiteCreator.name}</a></div>
  </div></footer>;
}
export function AccordionItem({ open, onToggle, head, children, id }: { open: boolean; onToggle: () => void; head: ReactNode; children: ReactNode; id?: string }) {
 const panelId = useId();
 return <div id={id} className="scroll-mt-28 border-b last:border-b-0"><Button variant="ghost" onClick={onToggle} aria-expanded={open} aria-controls={panelId} className="h-auto w-full justify-start gap-3 whitespace-normal rounded-none px-5 py-5 text-left md:px-7"><span className="min-w-0 flex-1">{head}</span><span className={`grid size-8 shrink-0 place-items-center rounded-full border transition-transform ${open ? "rotate-45 text-primary" : ""}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></span></Button><div id={panelId} hidden={!open} className="px-5 pb-6 text-left md:px-7">{children}</div></div>;
}
export function SimpleAccordion({ items }: { items: { q: string; a: ReactNode }[] }) { const [open, setOpen] = useState<number | null>(0); return <div className="accordion-list card overflow-hidden">{items.map((it, i) => <AccordionItem key={it.q} open={open === i} onToggle={() => setOpen(open === i ? null : i)} head={<span className="font-semibold">{it.q}</span>}><div className="text-muted-foreground">{it.a}</div></AccordionItem>)}</div>; }
export function Slider({ images, alt }: { images: string[]; alt: (i: number) => string }) {
 const ref = useRef<HTMLDivElement>(null);
 const go = (d: number) => { const el = ref.current; if (el) el.scrollBy({ left: d * el.clientWidth * .5, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
 return <div><div ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5">{images.map((src, i) => <img key={src+i} src={src} alt={alt(i)} loading="lazy" className="aspect-[4/5] w-[72%] shrink-0 snap-start last:snap-end rounded-3xl object-cover sm:w-[42%] lg:w-[30%]" />)}</div><div className="mt-6 hidden justify-center gap-3 md:flex"><Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Vorheriges Bild" className="size-11 rounded-full"><Arrow dir="left" /></Button><Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Nächstes Bild" className="size-11 rounded-full"><Arrow /></Button></div></div>;
}
export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) { return <section id={id} className={`site-section ${className}`}>{children}</section>; }
export function Label({ children }: { children: ReactNode }) { return <p className="mb-3 text-sm font-medium text-muted-foreground">{children}</p>; }
export function useScrollToHash() { useEffect(() => { const hash = window.location.hash.slice(1); if (hash) document.getElementById(decodeURIComponent(hash))?.scrollIntoView(); }, []); }
