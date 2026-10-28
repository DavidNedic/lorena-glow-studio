import { describe, expect, it } from "vitest";
import { FEEDBACK_DELAY_HOURS, isFeedbackDue } from "@/lib/member-club";

const now = new Date("2026-10-28T12:00:00Z");
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000);

describe("Feedback-Mail nach Gutschein-Einlösung", () => {
  it("wartet 48 Stunden", () => expect(FEEDBACK_DELAY_HOURS).toBe(48));
  it("ist nach 47 Stunden noch nicht fällig", () => expect(isFeedbackDue(hoursAgo(47), now)).toBe(false));
  it("ist nach 48 Stunden fällig", () => expect(isFeedbackDue(hoursAgo(48), now)).toBe(true));
  it("schickt keine Mail für alte Einlösungen nach 14 Tagen", () => expect(isFeedbackDue(hoursAgo(15 * 24), now)).toBe(false));
});
