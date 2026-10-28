import { describe, expect, it } from "vitest";
import { CONTACT } from "@/lib/data";
import { MAP_EMBED_URL, MAP_QUERY, MAP_ROUTE_URL } from "@/components/LocationMap";

// Die Karte muss auf der bestätigten Studio-Adresse aufbauen: Einbettung,
// Routenplaner und Anzeige dürfen nie auseinanderlaufen.
describe("Standort-Karte", () => {
  it("baut Karte und Route auf der bestätigten Adresse auf", () => {
    const address = `${CONTACT.street}, ${CONTACT.city}`;
    expect(MAP_QUERY).toBe("Austraße 26, 74336 Brackenheim");
    expect(MAP_EMBED_URL).toContain("output=embed");
    expect(MAP_EMBED_URL).toContain(encodeURIComponent(address));
    expect(MAP_ROUTE_URL).toContain(`destination=${encodeURIComponent(address)}`);
  });
});
