import { describe, expect, it } from "vitest";
import { LEGAL_TERMS } from "@/lib/data";

describe("Bestätigte Geschäftsbedingungen", () => {
  it("akzeptiert die bestätigten Studio-Zahlungsarten", () => {
    expect(LEGAL_TERMS.paymentMethods).toEqual(["Barzahlung", "EC-/Debitkarte", "Kreditkarte"]);
  });
  it("berechnet 50 Prozent bei später Absage", () => {
    expect(LEGAL_TERMS.cancellationFeePercent).toBe(50);
  });
  it("erlaubt kostenlose Behandlungsabsage bis 24 Stunden vorher", () => {
    expect(LEGAL_TERMS.treatmentCancellationHours).toBe(24);
  });
  it("erlaubt kostenlose Kursabsage bis 14 Tage vorher", () => {
    expect(LEGAL_TERMS.courseCancellationDays).toBe(14);
  });
  it("wendet die bestätigte Verspätungsregel ab 15 Minuten an", () => {
    expect(LEGAL_TERMS.lateArrivalMinutes).toBe(15);
  });
  it("lässt gekaufte Gutscheine drei Jahre ab Jahresende gelten", () => {
    expect(LEGAL_TERMS.voucherValidityYears).toBe(3);
  });
});