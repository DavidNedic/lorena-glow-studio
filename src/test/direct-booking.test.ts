import { describe, expect, it } from "vitest";
import { CONTACT, DIRECT_BOOKING_PRICE_CAP, TREATMENTS, isDirectBookingEligible, type Treatment } from "@/lib/data";

const sample: Treatment = { slug: "sample", name: "Sample", group: "direct", duration: "60 Min.", sentence: "", image: "", bookingUrl: CONTACT.beautinda, beautindaPrice: 99 };

describe("Direktbuchungen unter 150 Euro auf Beautinda", () => {
  it("schließt 150 Euro und höhere Preise aus", () => {
    expect(DIRECT_BOOKING_PRICE_CAP).toBe(150);
    expect(isDirectBookingEligible(sample)).toBe(true);
    expect(isDirectBookingEligible({ ...sample, beautindaPrice: 150 })).toBe(false);
    expect(isDirectBookingEligible({ ...sample, beautindaPrice: 180 })).toBe(false);
  });
  it("schließt nicht belegte und offene Ab-Preise aus", () => {
    const { beautindaPrice, ...unpriced } = sample;
    expect(beautindaPrice).toBe(99);
    expect(isDirectBookingEligible({ ...unpriced, price: "ab 65 €" })).toBe(false);
    expect(isDirectBookingEligible({ ...sample, bookingUrl: "https://example.com" })).toBe(false);
    expect(isDirectBookingEligible({ ...sample, beautindaPrice: NaN })).toBe(false);
  });
  it("bietet nur die sieben bestätigten Festpreis-Angebote an", () => {
    expect(TREATMENTS.filter(isDirectBookingEligible).map(t => [t.slug, t.beautindaPrice])).toEqual([
      ["lash", 79], ["brow", 69], ["brow-color", 20], ["brow-shape", 15], ["natural", 99], ["wispy", 120], ["volumen", 149],
    ]);
  });
});