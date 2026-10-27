import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Das Handynummer-Muster im Anfrageformular muss auch unter dem modernen
// "v"-Flag gültig sein (aktuelle Browser), sonst lässt sich das Formular
// nicht abschicken.
const source = readFileSync(join(__dirname, "../components/CallbackForm.tsx"), "utf8");
const pattern = source.match(/pattern=\{String\.raw`([^`]+)`\}/)?.[1] ?? "";

describe("CallbackForm Handynummer-Muster", () => {
  it("nutzt ein unter dem v-Flag gültiges Muster", () => {
    expect(pattern).not.toBe("");
    expect(() => new RegExp(pattern, "v")).not.toThrow();
  });

  it("akzeptiert eine übliche Handynummer und lehnt Text ab", () => {
    const re = new RegExp(pattern, "v");
    expect(re.test("0170 1234567")).toBe(true);
    expect(re.test("+49 170 1234567")).toBe(true);
    expect(re.test("not-a-phone")).toBe(false);
  });
});
