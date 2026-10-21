export type Stand = "neu" | "kosmetikerin" | "studio";
export type Goal = "treatments" | "wissen" | "umsatz" | "ausbilden";
export type Form = "vorort" | "online" | "egal";
export type Answers = { stand: Stand; goal: Goal; form: Form };

/** Returns a masterclass slug, or "skin-expert" for the package. */
export function recommend({ stand, goal, form }: Answers): string {
  if (goal === "ausbilden") return "trainer-mentoring";
  if (goal === "umsatz") return stand === "studio" ? "business-growth-mentoring" : "social-media";
  if (stand === "neu" || goal === "wissen") return form === "online" ? "hautkunde" : "skin-expert";
  if (form === "online") return "zahnbleaching";
  if (stand === "studio") return "lash-browlifting";
  return "skin-expert";
}
