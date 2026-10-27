import { beforeEach, describe, expect, it } from "vitest";
import { ANALYTICS_MEASUREMENT_ID, analyticsPath, CONSENT_KEY, CONSENT_NOTICE, parseConsent, readConsent, saveConsent, updateAnalytics } from "@/lib/analytics";

describe("voluntary Google Analytics", () => {
  beforeEach(() => {
    localStorage.clear();
    document.getElementById("golden-google-analytics")?.remove();
    delete (window as Window & { gtag?: unknown }).gtag;
  });
  it("uses the dedicated Golden Cosmetics measurement ID after consent", () => {
    expect(ANALYTICS_MEASUREMENT_ID).toBe("G-Z3V1JKN1C1");
    saveConsent(true);
    updateAnalytics(ANALYTICS_MEASUREMENT_ID, "/");
    expect(document.getElementById("golden-google-analytics")?.getAttribute("src")).toBe("https://www.googletagmanager.com/gtag/js?id=G-Z3V1JKN1C1");
  });
  it("does not load tracking before consent", () => {
    updateAnalytics("G-TEST123", "/");
    expect(document.getElementById("golden-google-analytics")).toBeNull();
  });
  it("does not load tracking after rejection", () => {
    saveConsent(false);
    updateAnalytics("G-TEST123", "/academy");
    expect(document.getElementById("golden-google-analytics")).toBeNull();
  });
  it("loads a single script after acceptance", () => {
    saveConsent(true);
    updateAnalytics("G-TEST123", "/academy");
    updateAnalytics("G-TEST123", "/behandlungen");
    expect(document.querySelectorAll("#golden-google-analytics")).toHaveLength(1);
  });
  it("retains acceptance evidence when consent is withdrawn", () => {
    saveConsent(true);
    saveConsent(false);
    expect(readConsent()?.history.map(item => item.accepted)).toEqual([true, false]);
    expect(readConsent()?.history[0]?.notice).toBe(CONSENT_NOTICE);
    updateAnalytics("G-TEST123", "/");
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-TEST123"]).toBe(true);
  });
  it("rejects incomplete consent evidence", () => {
    expect(parseConsent('{"accepted":true,"history":[]}')).toBeNull();
    localStorage.setItem(CONSENT_KEY, "broken");
    expect(readConsent()).toBeNull();
  });
  it("does not measure sensitive pages or confirmation tokens", () => {
    expect(analyticsPath("/admin")).toBeNull();
    expect(analyticsPath("/member-club/bestaetigen")).toBeNull();
    expect(analyticsPath("/behandlungen/anti-akne")).toBeNull();
    expect(analyticsPath("/academy/")).toBe("/academy");
  });
});