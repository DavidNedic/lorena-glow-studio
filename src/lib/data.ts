import noseBefore from "@/assets/vergleich-1-vorher.jpg.asset.json";
import noseAfter from "@/assets/vergleich-1-nachher.jpg.asset.json";
import glowBefore from "@/assets/vergleich-2-vorher.jpg.asset.json";
import glowAfter from "@/assets/vergleich-2-nachher.jpg.asset.json";

export const CONTACT = {
  name: "The Golden Cosmetics & Academy", owner: "Lorena Kovacevic",
  legalForm: "Einzelunternehmen", vatId: "DE319849001", profession: "Fachkosmetikerin",
  disputeResolution: "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
  street: "Austraße 26", city: "74336 Brackenheim", phone: "0162 9709213", tel: "tel:+491629709213",
  email: "info@thegoldencosmetics.com", hours: "Mo bis Sa, 9 bis 20 Uhr",
  beautinda: "https://beautinda.de/salon/xUqq2vyQw724bbTtNRDh",
  whatsapp: "https://wa.me/491629709213?text=" + encodeURIComponent("Hi Lorena, ich habe eine Frage zu einer Behandlung."),
  calendly: "https://calendly.com/thegoldencosmetics",
  instagram: "https://www.instagram.com/thegoldencosmetics", instagramAcademy: "https://www.instagram.com/thegoldencosmetics",
};
export function whatsappUrl(text: string) { return `https://wa.me/491629709213?text=${encodeURIComponent(text)}`; }

// Prices come from the Beautinda catalogue and are shown only for directly bookable treatments; free slots live in Beautinda.
export type TreatmentGroup = "first" | "direct" | "analysis";
export type Treatment = { slug: string; name: string; group: TreatmentGroup; duration: string; sentence: string; image: string; detail?: boolean; price?: string; bookingUrl: string };
const treatment = (slug: string, name: string, group: TreatmentGroup, duration = "", extra: Partial<Treatment> = {}): Treatment => ({ slug, name, group, duration: duration || "Dauer nach Absprache", sentence: "", image: "/images/kachel-behandlung.jpg", bookingUrl: CONTACT.beautinda, ...extra });
export const TREATMENTS: Treatment[] = [
  treatment("first", "First Time: Hautanalyse + erste Behandlung", "first", "120 Min.", { detail: true, sentence: "Wir schauen uns deine Haut genau an und verbinden deine Hautanalyse mit der ersten passenden Behandlung." }),
  // Direkt online buchen
  treatment("klassische-ausreinigung", "Klassische Ausreinigung", "direct", "60 Min.", { sentence: "Die gründliche Ausreinigung für ein reines, frisches Hautbild." }),
  treatment("dermaplaning", "Dermaplaning", "direct", "60 Min.", { sentence: "Sanftes Abtragen abgestorbener Hautschüppchen und feiner Härchen für sofort glatte Haut." }),
  treatment("glow-peel", "Glow-Peel", "direct", "60 Min.", { sentence: "Fruchtiges Peeling für frischen Glow und einen ebenmäßigen Teint." }),
  treatment("refresh-peel", "Refresh-Peel", "direct", "", { sentence: "Die schnelle Auffrischung für zwischendurch." }),
  treatment("pure-peel", "Pure-Peel", "direct", "", { sentence: "Klares Peeling für reine, verfeinerte Haut." }),
  treatment("lash", "Korean Lashlifting inkl. Färben", "direct", "90 Min.", { detail: true, price: "79 €", sentence: "Geschwungene Wimpern mit koreanischer Lifting-Technik, ganz ohne Extensions.", image: "/images/lorena-portrait-1.jpg" }),
  treatment("brow", "Browlifting inkl. Färben + Formen", "direct", "80 Min.", { price: "69 €", sentence: "Konstant schöne Augenbrauen, jeden Tag, ganz ohne Nachzeichnen." }),
  treatment("brow-color", "Augenbrauen färben", "direct", "30 Min.", { price: "20 €", sentence: "Mehr Dichte und Ausdruck für deine Brauen." }),
  treatment("brow-shape", "Augenbrauen formen", "direct", "30 Min.", { price: "15 €", sentence: "Die passende Form für dein Gesicht, sauber gezupft und korrigiert." }),
  treatment("natural", "Wimpernverlängerung Natural 1:1 Neu-Set", "direct", "120 Min.", { price: "99 €", sentence: "Dezente Verlängerung, eine Extension pro Naturwimper." }),
  treatment("refill", "Wimpern auffüllen", "direct", "80 Min.", { price: "ab 65 €", sentence: "Dein Set bleibt voll und gepflegt." }),
  // Nach deiner Hautanalyse
  treatment("aquafacial-ausreinigung", "Aquafacial Ausreinigung", "analysis", "70 Min.", { sentence: "Tiefenausreinigung der Poren mit viel Feuchtigkeit." }),
  treatment("microneedling", "Microneedling", "analysis", "60 Min.", { sentence: "Microneedling bei Aknenarben. Kann die Erneuerung der Haut anregen und das Hautbild glätten." }),
  treatment("micro-cica", "Microneedling x Cica-Exosome", "analysis", "60 Min.", { sentence: "Microneedling kombiniert mit beruhigenden Cica-Exosomen." }),
  treatment("microneedling-salmon-dna", "Microneedling x Salmon DNA", "analysis", "60 Min.", { sentence: "Microneedling mit Salmon DNA. Anti-Aging-Effekt, wirkt gegen feine Linien und Falten." }),
  treatment("glass-skin", "Signature Glasskin Treatment", "analysis", "80 Min.", { sentence: "Mein Signature-Treatment für den Glass-Skin-Glow." }),
  treatment("aha-egf", "AHA-EGF Skinbooster Facial", "analysis", "60 Min.", { sentence: "Fruchtsäure trifft Wachstumsfaktoren für sichtbar erneuerte Haut." }),
  treatment("aqua-micro", "Aquafacial x Microneedling Kombi", "analysis", "120 Min.", { sentence: "Ausreinigung und Needling in einer ausgiebigen Behandlung." }),
  treatment("microdermabrasion", "Microdermabrasion", "analysis", "70 Min.", { sentence: "Apparatives Abtragen der obersten Hautschicht für ein feineres Hautbild." }),
  treatment("anti-akne-face-reset", "Anti-Akne Face Reset", "analysis", "60 Min.", { sentence: "Gezielt gegen Pickel: Wir gehen an die Ursache, statt nur abzudecken." }),
  treatment("biorepeel", "BioRePeel", "analysis", "", { sentence: "Peeling bei Akne und unreiner Haut." }),
  treatment("akne-body", "Akne Body Behandlung", "analysis", "", { sentence: "Die Anti-Akne-Behandlung für Rücken und Dekolleté." }),
  treatment("carboxy", "Carboxy-Therapie", "analysis", "60 Min.", { sentence: "CO2-Therapie, die die Durchblutung der Haut anregen kann." }),
  treatment("wispy", "Wimpernverlängerung Wispy Neu-Set", "analysis", "120 Min.", { sentence: "Der federleichte Wispy-Look mit gestuften Längen." }),
  treatment("volumen", "Wimpernverlängerung Volumen Neu-Set", "analysis", "120 Min.", { sentence: "Mehr Dichte mit feinen Volumenfächern." }),
];
// Aliases resolve to a current offer; everything else is a real slug now.
// Shop imagery shows studio impressions, not a claimed result of each treatment.
const SHOP_IMPRESSIONS = ["/img/einblick-1.jpg", "/img/einblick-3.jpg", "/img/einblick-2.jpg"];
export function treatmentShopImage(slug: string) { const index = Math.max(0, TREATMENTS.findIndex(t => t.slug === slug)); return SHOP_IMPRESSIONS[index % SHOP_IMPRESSIONS.length] ?? "/img/einblick-1.jpg"; }
export const LEGACY_TREATMENT_SLUGS: Record<string, string> = {
  "lash-brow": "lash", ausreinigung: "klassische-ausreinigung", rein: "klassische-ausreinigung",
  aqua: "aquafacial-ausreinigung", micro: "microneedling", "micro-salmon": "microneedling-salmon-dna",
  glass: "glass-skin", "anti-akne": "anti-akne-face-reset",
};
export type ZoomArea = { id: string; area: string; problem: string; explain?: string; slug: string; help: string; x?: number; y?: number; video: boolean };
export const ZOOM_AREAS: ZoomArea[] = [
  { id: "stirn", area: "Stirn", problem: "Feine Linien und Falten", explain: "Mit der Zeit verliert die Haut an Spannkraft, feine Linien graben sich ein.", slug: "microneedling-salmon-dna", help: "Microneedling mit Salmon DNA. Anti-Aging-Effekt, wirkt gegen feine Linien und Falten.", x: 50, y: 21.3, video: false },
  { id: "augen", area: "Augen", problem: "Kurze, gerade Wimpern", explain: "Ohne Schwung wirken sie kürzer, als sie eigentlich sind.", slug: "lash", help: "Korean Lashlifting inkl. Färben oder eine Wimpernverlängerung. Wacher Blick, ganz ohne Mascara.", x: 40, y: 40.3, video: false },
  { id: "nase", area: "Nase", problem: "Mitesser und große Poren", explain: "Talg und Schmutz setzen sich in den Poren fest und werden dunkel.", slug: "aquafacial-ausreinigung", help: "Aquafacial: Tiefenausreinigung der Poren mit viel Feuchtigkeit. Die Poren sind danach frei.", x: 50, y: 46.9, video: false },
  { id: "wangen", area: "Wangen", problem: "Aknenarben", explain: "Nach Pickeln bleiben oft kleine Vertiefungen in der Haut zurück.", slug: "microneedling", help: "Microneedling bei Aknenarben. Kann die Erneuerung der Haut anregen und das Hautbild glätten.", x: 62, y: 56, video: false },
  { id: "kinn", area: "Kinn", problem: "Akne am Kinn", explain: "Kommt oft immer wieder an derselben Stelle.", slug: "biorepeel", help: "BioRePeel bei Akne am Kinn: ein Peeling, das gezielt an den unreinen Stellen ansetzt.", x: 50, y: 67.5, video: false },
  { id: "augenbrauen", area: "Augenbrauen", problem: "Ungleichmäßige Brauen", explain: "Die Härchen wachsen in verschiedene Richtungen, die Form geht verloren.", slug: "brow", help: "Brow Lifting inkl. Färben und Formen. Für konstant schöne Augenbrauen, jeden Tag.", x: 61, y: 33, video: false },
  { id: "pickel", area: "Pickel", problem: "Einzelne Pickel", explain: "Entstehen, wenn Poren durch zu viel Talg verstopfen und sich entzünden.", slug: "anti-akne-face-reset", help: "Gezielt gegen Pickel: Wir gehen an die Ursache, statt nur abzudecken.", x: 30, y: 56, video: false },
  { id: "glow", area: "Ganzes Gesicht", problem: "Fahle, trockene Haut", explain: "Abgestorbene Hautschüppchen schlucken das Licht, die Haut wirkt müde.", slug: "first", help: "Wir klären bei deiner Hautanalyse, was deiner Haut fehlt, und starten mit der passenden ersten Behandlung.", video: true },
  { id: "unsicher", area: "Unsicher?", problem: "Du weißt nicht, was du brauchst", slug: "first", help: "Total normal. Wir starten mit einer Hautanalyse und machen direkt deine erste Behandlung.", video: false },
];
export const PROBLEMS = [
  { label: "Unreinheiten, die immer wiederkommen", text: "Du reinigst, pflegst, probierst neue Produkte. Und trotzdem sind sie nach ein paar Tagen wieder da.", slug: "first" },
  { label: "Verstopfte Poren und ein fahler Teint", text: "Make-up sitzt nicht mehr richtig, die Haut wirkt müde, egal wie viel du schläfst.", slug: "first" },
  { label: "Narben, große Poren, unebene Struktur", text: "Du siehst es jeden Morgen im Spiegel und versuchst, es mit Foundation zu verstecken.", slug: "first" },
  { label: "Dir fehlt der Glow", text: "Du investierst viel in deine Haut, aber sie strahlt einfach nicht so, wie du es dir wünschst.", slug: "first" },
  { label: "Du weißt nicht, was deine Haut wirklich braucht", text: "Zu viele Produkte, zu viele Meinungen. Du willst endlich wissen, was bei dir funktioniert.", slug: "first" },
];
// Original collages split and geometrically aligned without retouching skin.
export const BEFORE_AFTER = [
  { id: "poren", name: "Nase & Poren", note: "Vor und nach der Behandlung", before: noseBefore.url, after: noseAfter.url, ratio: "1000/510" },
  { id: "stirn", name: "Haut & Glow", note: "Vor und nach der Behandlung", before: glowBefore.url, after: glowAfter.url, ratio: "1000/510" },
  { id: "teint", name: "Ebenmäßiger Teint", note: "Ruhigeres Hautbild", before: "/img/vn-06-vorher.jpg", after: "/img/vn-06-nachher.jpg", ratio: "1000/510" },
];
/** Ergebnis-Fotos ohne Vorher-Nachher-Collagen (die laufen im Regler). */
export const RESULT_PHOTOS = ["01", "03", "05", "07", "08", "09", "10", "12"].map(n => `/img/ergebnis-${n}.jpg`);
export const ABSOLVENTINNEN = ["01", "05", "08", "10", "12", "13", "02", "03", "04", "06", "07", "09", "11"].map(n => `/img/absolventin-${n}.jpg`);
export const SCHUELERINNEN = Array.from({ length: 11 }, (_, i) => `/img/schuelerinnen/schuelerin-${String(i + 1).padStart(2, "0")}.png`);
export type Masterclass = { slug: string; name: string; format: string; group: "fachlich" | "business"; lead: string; text: string; tags: string[]; image: string };
const course = (slug: string, name: string, lead: string, text: string, format = "Online", group: "fachlich" | "business" = "fachlich"): Masterclass => ({ slug, name, lead, text, format, group, tags: [format, "Persönlich begleitet", "Nachbetreuung"], image: "/images/lorena-portrait-2.jpg" });
export const MASTERCLASSES: Masterclass[] = [
  course("aquafacial", "Aquafacial Masterclass", "Lerne nicht einfach eine Behandlung. Lerne, was dahintersteckt.", "Dein Einstieg in die apparative Kosmetik. Ich vermittle dir die Grundlagen der Haut, die Vorbereitung und die professionelle Umsetzung Schritt für Schritt."),
  course("microneedling", "Microneedling Masterclass", "Lerne, Hautbilder gezielt zu behandeln.", "Grundlagen, Hautbeurteilung, Technik und sichere Durchführung. Du lernst, wie Microneedling die Regeneration der Haut anregen kann."),
  course("kombi", "Aquafacial & Microneedling Kombi-Masterclass", "Zwei gefragte Behandlungskonzepte in einer Masterclass.", "Ich verbinde die Grundlagen und Abläufe von Aquafacial und Microneedling. Du lernst, Hautbilder zu beurteilen und beide Konzepte gezielt einzusetzen."),
  course("glass-skin", "Glass Skin Masterclass", "Mach den Glass-Skin-Glow zu deinem gefragtesten Signature-Treatment.", "12 aufeinander abgestimmte Schritte. Ich zeige dir, wie sie zusammenwirken und wie du sie an die Bedürfnisse der Haut anpasst."),
  course("korean-lash-lifting", "Korean Lash Lifting Masterclass", "Perfekt geliftete Wimpern ohne täglichen Stylingaufwand.", "Du lernst die koreanische Lifting-Technik, die Vorbereitung und den professionellen Ablauf für geschwungene Wimpern."),
  course("browlifting", "Browlifting Masterclass", "Ausdrucksvolle Augenbrauen, gezielt in Form gebracht.", "Ich begleite dich durch Vorbereitung, Lifting und Styling für gepflegte, in Form gebrachte Brauen."),
  course("zahnbleaching", "Zahnbleaching Masterclass", "Erweitere dein Beauty-Angebot um kosmetische Zahnaufhellung.", "Online-Unterlagen und ein persönlicher Live-Call. Ich erkläre dir den Ablauf der kosmetischen Zahnaufhellung und beantworte deine Fragen.", "Online · Live-Call"),
  course("hautkunde", "Hautkunde", "Verstehe die Haut und erkenne ihre Bedürfnisse.", "Dein digitales Fundament: Aufbau der Haut, Hauttypen und Hautzustände, verständlich aufbereitet als PDF.", "Digitales Produkt · PDF"),
  course("train-the-trainer", "Train the Trainer Masterclass", "Von der Beauty-Expertin zur Trainerin.", "Ich begleite dich zu deinen eigenen Schulungen: Unterlagen, Verträge, Zahlungsarten und eine saubere Preiskalkulation.", "Online · Live", "business"),
  course("social-media", "Social Media Masterclass", "Neue Kundinnen finden kaum den Weg zu dir?", "Ich zeige dir, wie du dein Können auf Instagram sichtbar machst, passende Inhalte entwickelst und daraus Termine machst.", "Online · Live", "business"),
  course("business-growth-mentoring", "Business Growth Mentoring", "Du hast bewiesen, dass du es kannst. Jetzt geht es darum, wie viel mehr möglich ist.", "Wir schauen gemeinsam auf dein Studio, deine Preise und deine Abläufe und planen deinen nächsten Schritt.", "1:1 · Premium", "business"),
];
export const LEGACY_COURSE_SLUGS: Record<string, string> = { "trainer-mentoring": "train-the-trainer", "lash-browlifting": "korean-lash-lifting" };
