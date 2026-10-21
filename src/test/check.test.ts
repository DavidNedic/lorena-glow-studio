import { describe, expect, it } from "vitest";
import { recommend } from "@/lib/check";

describe("Karriere-Check", () => {
  it("ausbilden → Trainer Mentoring", () =>
    expect(recommend({ stand: "studio", goal: "ausbilden", form: "online" })).toBe("trainer-mentoring"));
  it("Umsatz mit Studio → Business Growth", () =>
    expect(recommend({ stand: "studio", goal: "umsatz", form: "egal" })).toBe("business-growth-mentoring"));
  it("Umsatz ohne Studio → Social Media", () =>
    expect(recommend({ stand: "kosmetikerin", goal: "umsatz", form: "egal" })).toBe("social-media"));
  it("neu + online → Hautkunde", () =>
    expect(recommend({ stand: "neu", goal: "treatments", form: "online" })).toBe("hautkunde"));
  it("Fachwissen vor Ort → Skin Expert", () =>
    expect(recommend({ stand: "kosmetikerin", goal: "wissen", form: "vorort" })).toBe("skin-expert"));
  it("online → Zahnbleaching", () =>
    expect(recommend({ stand: "kosmetikerin", goal: "treatments", form: "online" })).toBe("zahnbleaching"));
  it("Studio → Lash & Browlifting", () =>
    expect(recommend({ stand: "studio", goal: "treatments", form: "vorort" })).toBe("lash-browlifting"));
  it("sonst Skin Expert", () =>
    expect(recommend({ stand: "kosmetikerin", goal: "treatments", form: "egal" })).toBe("skin-expert"));
});
