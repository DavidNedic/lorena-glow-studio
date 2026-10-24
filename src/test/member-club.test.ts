import { describe, expect, it } from "vitest";
import { makeVoucherCode, newsletterCsv, normalizeEmail, signupSchema, SIGNUPS_PER_IP_PER_HOUR, VOUCHER_PERCENT, type AdminRow } from "@/lib/member-club";
import { sitemapPaths } from "@/routes/sitemap[.]xml";

describe("Member Club rules", () => {
  it("new voucher codes have six characters without 0/O/1/I", () => {
    for (let i = 0; i < 300; i++) {
      const code = makeVoucherCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    }
  });
  it("voucher is 10 %", () => expect(VOUCHER_PERCENT).toBe(10));
  it("max 5 signups per IP per hour", () => expect(SIGNUPS_PER_IP_PER_HOUR).toBe(5));
  it("emails compare case-insensitively", () => expect(normalizeEmail(" Anna@Example.DE ")).toBe("anna@example.de"));
  it("newsletter checkbox is required", () => {
    expect(signupSchema.safeParse({ vorname: "Anna", email: "a@b.de", newsletter: false }).success).toBe(false);
    expect(signupSchema.safeParse({ vorname: "Anna", email: "a@b.de", newsletter: true }).success).toBe(true);
  });
  it("CSV exports only confirmed, not unsubscribed", () => {
    const base = { member_id: "x", created_at: "2026-01-01", code: null, redeemed_at: null, redeemed_note: null };
    const rows: AdminRow[] = [{ ...base, vorname: "A", email: "a@x.de", status: "bestätigt" }, { ...base, vorname: "B", email: "b@x.de", status: "offen" }, { ...base, vorname: "C", email: "c@x.de", status: "abgemeldet" }];
    const csv = newsletterCsv(rows);
    expect(csv).toContain("a@x.de"); expect(csv).not.toContain("b@x.de"); expect(csv).not.toContain("c@x.de");
  });
  it("admin is not in the sitemap", () => expect(sitemapPaths()).not.toContain("/admin"));
});
