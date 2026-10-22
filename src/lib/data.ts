export const CONTACT = {
  name: "The Golden Cosmetics & Academy", owner: "Lorena Kovacevic",
  street: "Austraße 26", city: "74336 Brackenheim", phone: "0162 9709213", tel: "tel:+491629709213",
  email: "info@thegoldencosmetics.de", emailTodo: true, hours: "Mo bis Sa, 9 bis 20 Uhr",
  beautinda: "https://beautinda.de/salon/xUqq2vyQw724bbTtNRDh",
  whatsapp: "https://wa.me/491629709213?text=" + encodeURIComponent("Hi Lorena, ich habe eine Frage zu einer Behandlung."),
  calendly: "https://calendly.com/thegoldencosmetics",
  instagram: "https://www.instagram.com/thegoldencosmetics", instagramAcademy: "https://www.instagram.com/thegoldencosmetics",
};
export function whatsappUrl(text: string) { return `https://wa.me/491629709213?text=${encodeURIComponent(text)}`; }
export const CATEGORIES = ["Erstberatung", "Gesichtsbehandlungen", "Akne", "Anti-Aging", "Liftings", "Wimpernbehandlungen", "Chemical Peel"] as const;
export type Category = typeof CATEGORIES[number];
export type Treatment = { slug: string; name: string; category: Category; price: number; oldPrice?: number; from?: boolean; duration?: string | undefined; sentence: string; image: string; detail?: boolean; bookingUrl: string };
const treatment = (slug: string, name: string, category: Category, price: number, duration?: string, extra: Partial<Treatment> = {}): Treatment => ({ slug, name, category, price, duration, sentence: "", image: "/images/kachel-behandlung.jpg", bookingUrl: CONTACT.beautinda, ...extra });
export const TREATMENTS: Treatment[] = [
  treatment("first", "First Time: Hautanalyse + erste Behandlung", "Erstberatung", 99, "2 Std.", { oldPrice: 120, detail: true, sentence: "Wir schauen uns deine Haut genau an und verbinden deine Hautanalyse mit der ersten passenden Behandlung." }),
  treatment("aqua", "Aquafacial Ausreinigung", "Gesichtsbehandlungen", 120, "1 Std. 10 Min.", { detail: true, sentence: "Reinigung, Feuchtigkeit und frischer Glow in einer Behandlung.", image: "/images/ergebnis-4.jpg" }),
  treatment("micro", "Microneedling", "Gesichtsbehandlungen", 120, "1 Std.", { detail: true, sentence: "Kann die natürliche Regeneration der Haut anregen.", image: "/images/ergebnis-3.jpg" }),
  treatment("micro-cica", "Microneedling x Cica-Exosome", "Gesichtsbehandlungen", 139, "1 Std."),
  treatment("micro-salmon", "Microneedling x Salmon DNA", "Gesichtsbehandlungen", 139, "1 Std."),
  treatment("glass", "Signature Glasskin Treatment", "Gesichtsbehandlungen", 129, "1 Std. 20 Min.", { detail: true, sentence: "12 abgestimmte Schritte für strahlende, ebenmäßige Haut.", image: "/images/ergebnis-1.jpg" }),
  treatment("aha-egf", "AHA-EGF Skinbooster Facial", "Gesichtsbehandlungen", 109, "1 Std."),
  treatment("rein", "Klassische Ausreinigung", "Gesichtsbehandlungen", 99, "1 Std.", { detail: true, sentence: "Gründliche Ausreinigung für ein klares, ruhiges Hautbild.", image: "/images/ergebnis-5.jpg" }),
  treatment("aqua-micro", "Aquafacial x Microneedling Kombi", "Gesichtsbehandlungen", 169, "2 Std.", { oldPrice: 229 }),
  treatment("dermaplaning", "Dermaplaning", "Gesichtsbehandlungen", 99, "1 Std."),
  treatment("microdermabrasion", "Microdermabrasion", "Gesichtsbehandlungen", 119, "1 Std. 10 Min."),
  treatment("anti-akne", "Anti-Akne Face Reset", "Akne", 120, "1 Std.", { sentence: "Gezielte professionelle Behandlung für unreine Haut." }),
  treatment("akne-body", "Akne Body Behandlung", "Akne", 179, undefined, { from: true }),
  treatment("carboxy", "Carboxy-Therapie", "Anti-Aging", 120, "1 Std."),
  treatment("lash", "Korean Lashlifting inkl. Färben", "Liftings", 79, "1 Std. 30 Min.", { detail: true, sentence: "Geschwungene Wimpern mit koreanischer Lifting-Technik, ganz ohne Extensions.", image: "/images/lorena-portrait-1.jpg" }),
  treatment("brow", "Browlifting inkl. Färben + Formen", "Liftings", 69, "1 Std. 20 Min."),
  treatment("brow-color", "Augenbrauen färben", "Liftings", 20, "30 Min."),
  treatment("brow-shape", "Augenbrauen formen", "Liftings", 15, "30 Min."),
  treatment("natural", "Wimpernverlängerung Natural 1:1 Neu-Set", "Wimpernbehandlungen", 99, "2 Std."),
  treatment("wispy", "Wispy Neu-Set", "Wimpernbehandlungen", 120, "2 Std."),
  treatment("volumen", "Volumen Neu-Set", "Wimpernbehandlungen", 149, "2 Std."),
  treatment("refill", "Wimpern auffüllen", "Wimpernbehandlungen", 65, "1 Std. 20 Min.", { from: true }),
  treatment("glow-peel", "Glow-Peel", "Chemical Peel", 99, "1 Std."),
  treatment("refresh-peel", "Refresh-Peel", "Chemical Peel", 99),
  treatment("pure-peel", "Pure-Peel", "Chemical Peel", 99),
];
export function priceLabel(t: Treatment) { return `${t.from ? "ab " : ""}${t.price} €`; }
export const LEGACY_TREATMENT_SLUGS: Record<string, string> = { "glass-skin": "glass", aquafacial: "aqua", microneedling: "micro", ausreinigung: "rein", "lash-brow": "lash" };
export type ZoomArea = { id: string; area: string; problem: string; explain?: string; slug: string; help: string; x?: number; y?: number; video: boolean };
export const ZOOM_AREAS: ZoomArea[] = [
  { id: "stirn", area: "Stirn", problem: "Kleine Pickel", explain: "Entstehen oft, wenn Poren durch zu viel Talg verstopfen.", slug: "anti-akne", help: "Wir gehen gezielt an die Ursache, statt nur abzudecken.", x: 50, y: 21.3, video: true },
  { id: "augen", area: "Augen", problem: "Kurze, gerade Wimpern", explain: "Ohne Schwung wirken sie kürzer, als sie eigentlich sind.", slug: "lash", help: "Geliftet und gefärbt: wacher Blick, ganz ohne Mascara.", x: 40, y: 40.3, video: true },
  { id: "nase", area: "Nase", problem: "Mitesser und große Poren", explain: "Talg und Schmutz setzen sich in den Poren fest und werden dunkel.", slug: "aqua", help: "Tiefenreinigung mit viel Feuchtigkeit. Die Poren sind danach frei.", x: 50, y: 46.9, video: true },
  { id: "wangen", area: "Wangen", problem: "Aknenarben und Poren", explain: "Nach Pickeln bleiben oft kleine Vertiefungen in der Haut zurück.", slug: "micro", help: "Microneedling kann die Erneuerung anregen und das Hautbild glätten.", x: 70, y: 56, video: true },
  { id: "kinn", area: "Kinn", problem: "Unreinheiten", explain: "Kommen oft immer wieder an derselben Stelle.", slug: "rein", help: "Gründliche Ausreinigung von Hand, damit sich nichts mehr festsetzt.", x: 50, y: 67.5, video: true },
  { id: "glow", area: "Ganzes Gesicht", problem: "Fahle, trockene Haut", explain: "Abgestorbene Hautschüppchen schlucken das Licht, die Haut wirkt müde.", slug: "glass", help: "Mein Signature Treatment für Haut, die wieder strahlt.", video: true },
  { id: "unsicher", area: "Unsicher?", problem: "Du weißt nicht, was du brauchst", slug: "first", help: "Total normal. Wir starten mit einer Hautanalyse und machen direkt deine erste Behandlung.", video: false },
];
export const PROBLEMS = [
  { label: "Unreinheiten, die immer wiederkommen", text: "Du reinigst, pflegst, probierst neue Produkte. Und trotzdem sind sie nach ein paar Tagen wieder da.", slug: "anti-akne" },
  { label: "Verstopfte Poren und ein fahler Teint", text: "Make-up sitzt nicht mehr richtig, die Haut wirkt müde, egal wie viel du schläfst.", slug: "aqua" },
  { label: "Narben, große Poren, unebene Struktur", text: "Du siehst es jeden Morgen im Spiegel und versuchst, es mit Foundation zu verstecken.", slug: "micro" },
  { label: "Dir fehlt der Glow", text: "Du investierst viel in deine Haut, aber sie strahlt einfach nicht so, wie du es dir wünschst.", slug: "glass" },
  { label: "Du weißt nicht, was deine Haut wirklich braucht", text: "Zu viele Produkte, zu viele Meinungen. Du willst endlich wissen, was bei dir funktioniert.", slug: "first" },
];
export type Masterclass = { slug: string; name: string; format: string; group: "fachlich" | "business"; lead: string; text: string; tags: string[]; image: string };
const course = (slug: string, name: string, lead: string, text: string, format = "Online", group: "fachlich" | "business" = "fachlich"): Masterclass => ({ slug, name, lead, text, format, group, tags: [format, "Persönlich begleitet", "Nachbetreuung"], image: "/images/lorena-portrait-2.jpg" });
export const MASTERCLASSES: Masterclass[] = [
  course("aquafacial", "Aquafacial Masterclass", "Lerne nicht einfach eine Behandlung. Lerne, was dahintersteckt.", "Dein Einstieg in die apparative Kosmetik. Ich vermittle dir die Grundlagen der Haut, die Vorbereitung und die professionelle Umsetzung Schritt für Schritt."),
  course("microneedling", "Microneedling Masterclass", "Lerne, Hautbilder gezielt zu behandeln.", "Grundlagen, Hautbeurteilung, Technik und sichere Durchführung. Du lernst, wie Microneedling die Regeneration der Haut anregen kann."),
  course("kombi", "Aquafacial & Microneedling Kombi-Masterclass", "Zwei gefragte Behandlungskonzepte in einer Masterclass.", "Ich verbinde die Grundlagen und Abläufe von Aquafacial und Microneedling. Du lernst, Hautbilder zu beurteilen und beide Konzepte gezielt einzusetzen."),
  course("glass-skin", "Glass Skin Masterclass", "Mach den Glass-Skin-Glow zu deinem gefragtesten Signature-Treatment.", "12 aufeinander abgestimmte Schritte. Ich zeige dir, wie sie zusammenwirken und wie du sie an die Bedürfnisse der Haut anpasst."),
  course("korean-lash-lifting", "Korean Lash Lifting Masterclass", "Perfekt geliftete Wimpern ohne täglichen Stylingaufwand.", "Du lernst die koreanische Lifting-Technik, die Vorbereitung und den professionellen Ablauf für geschwungene Wimpern."),
  course("browlifting", "Browlifting Masterclass", "Ausdrucksstarke Augenbrauen, gezielt in Form gebracht.", "Ich begleite dich durch Vorbereitung, Lifting und Styling für gepflegte, in Form gebrachte Brauen."),
  course("zahnbleaching", "Zahnbleaching Masterclass", "Erweitere dein Beauty-Angebot um kosmetische Zahnaufhellung.", "Online-Unterlagen und ein persönlicher Live-Call. Ich erkläre dir den Ablauf der kosmetischen Zahnaufhellung und beantworte deine Fragen.", "Online · Live-Call"),
  course("hautkunde", "Hautkunde", "Verstehe die Haut und erkenne ihre Bedürfnisse.", "Dein digitales Fundament: Aufbau der Haut, Hauttypen und Hautzustände, verständlich aufbereitet als PDF.", "Digitales Produkt · PDF"),
  course("train-the-trainer", "Train the Trainer Masterclass", "Von der Beauty-Expertin zur Trainerin.", "Ich begleite dich zu deinen eigenen Schulungen: Unterlagen, Verträge, Zahlungsarten und eine saubere Preiskalkulation.", "Online · Live", "business"),
  course("social-media", "Social Media Masterclass", "Neue Kundinnen finden kaum den Weg zu dir?", "Ich zeige dir, wie du dein Können auf Instagram sichtbar machst, passende Inhalte entwickelst und daraus Termine machst.", "Online · Live", "business"),
  course("business-growth-mentoring", "Business Growth Mentoring", "Du hast bewiesen, dass du es kannst. Jetzt geht es darum, wie viel mehr möglich ist.", "Wir schauen gemeinsam auf dein Studio, deine Preise und deine Abläufe und planen deinen nächsten Schritt.", "1:1 · Premium", "business"),
];
export const LEGACY_COURSE_SLUGS: Record<string, string> = { "trainer-mentoring": "train-the-trainer", "lash-browlifting": "korean-lash-lifting" };
