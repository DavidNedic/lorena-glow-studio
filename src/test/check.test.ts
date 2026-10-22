import { describe, expect, it } from "vitest";
import { recommend, type Stand, type Goal } from "@/lib/check";
describe("Karriere-Check",()=>{
 const cases:[Stand,Goal,string][]=[["studio","ausbilden","train-the-trainer"],["studio","umsatz","business-growth-mentoring"],["kosmetikerin","umsatz","social-media"],["neu","wissen","hautkunde"],["neu","treatments","aquafacial"],["studio","treatments","glass-skin"],["kosmetikerin","treatments","kombi"]];
 for(const [stand,goal,result] of cases)it(`${stand}, ${goal} → ${result}`,()=>expect(recommend({stand,goal,start:"sofort"})).toBe(result));
 it("Startzeit verändert die Empfehlung nicht",()=>{for(const start of ["sofort","bald","info"] as const)expect(recommend({stand:"neu",goal:"treatments",start})).toBe("aquafacial");});
});
