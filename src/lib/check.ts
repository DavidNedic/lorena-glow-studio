export type Stand = "neu" | "kosmetikerin" | "studio";
export type Goal = "treatments" | "wissen" | "umsatz" | "ausbilden";
export type Start = "sofort" | "bald" | "info";
export type Answers = { stand: Stand; goal: Goal; start: Start };
export function recommend({ stand, goal }: Answers): string {
  if (goal === "ausbilden") return "train-the-trainer";
  if (goal === "umsatz") return stand === "studio" ? "business-growth-mentoring" : "social-media";
  if (goal === "wissen") return "hautkunde";
  if (stand === "neu") return "aquafacial";
  if (stand === "studio") return "glass-skin";
  return "kombi";
}
