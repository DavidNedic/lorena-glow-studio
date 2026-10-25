import { describe, expect, it } from "vitest";
import { CONTACT, DIRECT_BOOKING_PRICE_CAP, TREATMENTS, isDirectBookingEligible, type Treatment } from "@/lib/data";

const sample: Treatment = { slug: "sample", name: "Sample", group: "direct", duration: "60 Min.", sentence: "", image: "", bookingUrl: CONTACT.beautinda, beautindaPrice: 99 };

describe("Direktbuchungen unter 100 Euro auf Beautinda", () => {
  it("schließt 100 Euro und höhere Preise aus", () => {
    expect(DIRECT_BOOKING_PRICE_CAP).toBe(100);
    expect(isDirectBookingEligible(sample)).toBe(true);
    expect(isDirectBookingEligible({ ...sample, beautindaPrice: 100 })).toBe(false);
    expect(isDirectBookingEligible({ ...sample, beautindaPrice: 120 })).toBe(false);
  });
  it("schließt nicht belegte und offene Ab-Preise aus", () => {
    expect(isDirectBookingEligible({ ...sample, beautindaPrice: undefined, price: "ab 65 €" })).toBe(false);
    expect(isDirectBookingEligible({ ...sample, bookingUrl: "https://example.com" })).toBe(false);
    expect(isDirectBookingEligible({ ...sample, beautindaPrice: NaN })).toBe(false);
  });
  it("bietet nur die fünf bestätigten Festpreis-Angebote an", () => {
    expect(TREATMENTS.filter(isDirectBookingEligible).map(t => [t.slug, t.beautindaPrice])).toEqual([
      ["lash", 79], ["brow", 69], ["brow-color", 20], ["brow-shape", 15], ["natural", 99],
    ]);
  });
});