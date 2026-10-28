import { useState } from "react";
import { ActionLink, Label } from "@/components/site";
import { CONTACT } from "@/lib/data";

export const MAP_QUERY = `${CONTACT.street}, ${CONTACT.city}`;
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&hl=de&output=embed`;
export const MAP_ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;

// Standort-Sektion am Ende der Behandlungsseite: dunkler Block im Footer-Ton,
// warm getönte Karte, die erst nach einem Klick interaktiv wird, damit das
// Scrollen auf dem Handy nicht hängen bleibt. Die Karte läuft bewusst über die
// volle Seitenbreite, damit sie links und rechts bündig mit dem Rand endet.
export function LocationMap() {
  const [active, setActive] = useState(false);
  return (
    <section id="anfahrt" className="map-section">
      <div className="site-section map-copy">
        <Label>Anfahrt</Label>
        <h2 className="text-4xl md:text-5xl">Mitten in Brackenheim.</h2>
        <p className="mt-4 text-muted-foreground">
          {CONTACT.street} · {CONTACT.city}
          <br />
          {CONTACT.hours}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionLink href={MAP_ROUTE_URL} external className="footer-cta">Route planen</ActionLink>
          <ActionLink href={CONTACT.whatsapp} external secondary>Per WhatsApp fragen</ActionLink>
        </div>
      </div>
      <div className={`map-frame${active ? " map-active" : ""}`}>
        <iframe
          src={MAP_EMBED_URL}
          title={`Karte: ${CONTACT.name}, ${MAP_QUERY}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        {!active && (
          <button type="button" className="map-activate" onClick={() => setActive(true)}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
            Karte entdecken
          </button>
        )}
      </div>
    </section>
  );
}
