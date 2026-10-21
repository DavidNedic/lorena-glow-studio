export const CONTACT = {
  name: "The Golden Cosmetics & Academy",
  owner: "Lorena Kovacevic",
  street: "Austraße 26",
  city: "74336 Brackenheim",
  phone: "[TELEFON]",
  email: "[E-MAIL]",
  hours: "[ÖFFNUNGSZEITEN]",
  beautinda: "https://www.beautinda.de",
  whatsapp: "https://wa.me/[NUMMER]",
  calendly: "https://calendly.com/thegoldencosmetics",
  instagram: "https://www.instagram.com/thegoldencosmetics",
  instagramAcademy: "https://www.instagram.com/academy_thegoldencosmetics",
};

export type Category = "Reine Haut" | "Glow" | "Struktur" | "Augen";

export type Treatment = {
  slug: string;
  name: string;
  sub: string;
  sentence: string;
  image: string;
  categories: Category[];
  tags: string[];
  price: string;
  duration: string;
  bookingUrl: string;
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "glass-skin", name: "Glass Skin", sub: "Signature",
    sentence: "12 abgestimmte Schritte für strahlende, ebenmäßige Haut.",
    image: "/images/ergebnis-1.jpg", categories: ["Glow"],
    tags: ["fahler Teint", "Feuchtigkeitsmangel", "besondere Anlässe"],
    price: "[XX]", duration: "[XX]", bookingUrl: CONTACT.beautinda,
  },
  {
    slug: "aquafacial", name: "Aquafacial", sub: "Tiefenreinigung",
    sentence: "Reinigung, Feuchtigkeit und frischer Glow in einer Behandlung.",
    image: "/images/ergebnis-4.jpg", categories: ["Reine Haut", "Glow"],
    tags: ["verstopfte Poren", "trockene Haut", "müder Teint"],
    price: "[XX]", duration: "[XX]", bookingUrl: CONTACT.beautinda,
  },
  {
    slug: "microneedling", name: "Microneedling", sub: "Hautstruktur",
    sentence: "Kann die natürliche Regeneration der Haut anregen.",
    image: "/images/ergebnis-3.jpg", categories: ["Struktur"],
    tags: ["unebenes Hautbild", "vergrößerte Poren", "feine Linien"],
    price: "[XX]", duration: "[XX]", bookingUrl: CONTACT.beautinda,
  },
  {
    slug: "ausreinigung", name: "Ausreinigung", sub: "Auch als Men Edition",
    sentence: "Gründliche Ausreinigung für ein klares, ruhiges Hautbild.",
    image: "/images/ergebnis-5.jpg", categories: ["Reine Haut"],
    tags: ["Unreinheiten", "Mitesser", "Männerhaut"],
    price: "[XX]", duration: "[XX]", bookingUrl: CONTACT.beautinda,
  },
  {
    slug: "lash-brow", name: "Lash & Brow", sub: "Korean Lash Lifting",
    sentence: "Geschwungene Wimpern und gepflegte Brauen, ganz ohne Extensions.",
    image: "/images/lorena-portrait-1.jpg", categories: ["Augen"],
    tags: ["gerade Wimpern", "unruhige Brauen", "wenig Zeit am Morgen"],
    price: "[XX]", duration: "[XX]", bookingUrl: CONTACT.beautinda,
  },
  {
    slug: "zahnaufhellung", name: "Zahnaufhellung", sub: "Kosmetisch",
    sentence: "Schonende kosmetische Zahnaufhellung, mit Beratung vorab.",
    image: "/images/studio.jpg", categories: [],
    tags: ["Verfärbungen", "strahlendes Lächeln"],
    price: "[XX]", duration: "[XX]", bookingUrl: CONTACT.beautinda,
  },
];

export const PROBLEMS = [
  { label: "Unreine Haut", slug: "ausreinigung" },
  { label: "Verstopfte Poren", slug: "aquafacial" },
  { label: "Unebenmäßiges Hautbild", slug: "microneedling" },
  { label: "Der Glow fehlt", slug: "glass-skin" },
];

export type Masterclass = {
  slug: string;
  name: string;
  format: string;
  group: "fachlich" | "business";
  lead: string;
  text: string;
  tags: string[];
  image: string;
  inPackage?: boolean;
};

export const MASTERCLASSES: Masterclass[] = [
  {
    slug: "hautkunde", name: "Hautkunde", format: "Online · PDF", group: "fachlich",
    lead: "Das Fundament für jede Behandlung.",
    text: "Du lernst Aufbau, Hauttypen und Hautzustände sicher zu erkennen. Zum Abschluss bekommst du das Zertifikat „Fachkunde der Haut“ per Post.",
    tags: ["Online", "Zertifikat per Post", "Einstieg"], image: "/images/zertifikat-box.jpg",
  },
  {
    slug: "aquafacial", name: "Aquafacial", format: "Vor Ort · Praxis", group: "fachlich",
    lead: "Lerne nicht einfach eine Behandlung. Lerne, was dahintersteckt.",
    text: "Ablauf, Geräteführung und Hautanalyse, damit du jede Kundin sicher behandelst.",
    tags: ["Praxis am Modell", "Zertifikat"], image: "/images/absolventinnen-2.jpg", inPackage: true,
  },
  {
    slug: "glass-skin", name: "Glass Skin", format: "Vor Ort · Signature", group: "fachlich",
    lead: "12 aufeinander abgestimmte Schritte.",
    text: "Mein Signature-Treatment, Schritt für Schritt. Du lernst, wie die Schritte zusammenwirken und wie du sie an jede Haut anpasst.",
    tags: ["Signature-Treatment", "Zertifikat"], image: "/images/absolventinnen-3.jpg", inPackage: true,
  },
  {
    slug: "microneedling", name: "Microneedling", format: "Vor Ort · Praxis", group: "fachlich",
    lead: "Sicher arbeiten, sichtbar überzeugen.",
    text: "Indikationen, Hygiene, Nadeltiefen und Nachsorge. Mit viel Praxis und klaren Abläufen.",
    tags: ["Praxis am Modell", "Zertifikat"], image: "/images/absolventinnen-4.jpg", inPackage: true,
  },
  {
    slug: "lash-browlifting", name: "Korean Lash Lifting & Browlifting", format: "Vor Ort · Praxis", group: "fachlich",
    lead: "Ein Treatment, das deine Kundinnen immer wieder buchen.",
    text: "Lifting, Färben und Styling von Wimpern und Brauen mit koreanischer Technik.",
    tags: ["Praxis am Modell", "Zertifikat"], image: "/images/absolventinnen-1.jpg",
  },
  {
    slug: "zahnbleaching", name: "Zahnbleaching", format: "Online + Live-Call", group: "fachlich",
    lead: "Nicht nur ein PDF. Ich bin live für dich da.",
    text: "Kosmetisches Zahnbleaching mit Online-Unterlagen und einem persönlichen Live-Call für deine Fragen.",
    tags: ["Online", "Live-Call", "Zertifikat"], image: "/images/absolventinnen-2.jpg",
  },
  {
    slug: "business-growth-mentoring", name: "Business Growth Mentoring", format: "1:1 · Premium", group: "business",
    lead: "Du hast bewiesen, dass du es kannst. Jetzt geht es darum, wie viel mehr möglich ist.",
    text: "Wir schauen gemeinsam auf dein Studio, deine Preise und deine Abläufe und planen deinen nächsten Schritt.",
    tags: ["1:1", "Studio", "Umsatz"], image: "/images/success-is-a-decision.jpg",
  },
  {
    slug: "trainer-mentoring", name: "Trainer Mentoring", format: "1:1 · Mentoring", group: "business",
    lead: "Von der Beauty-Expertin zur Trainerin.",
    text: "Du bekommst Unterlagen, Verträge, Zahlungsarten und eine saubere Preiskalkulation für deine eigenen Schulungen.",
    tags: ["Unterlagen", "Verträge", "Preiskalkulation"], image: "/images/absolventinnen-3.jpg",
  },
  {
    slug: "social-media", name: "Social Media Masterclass", format: "Online · Gruppe", group: "business",
    lead: "Neue Kundinnen finden kaum den Weg zu dir?",
    text: "Du lernst, wie du dein Können auf Instagram zeigst und daraus Termine machst.",
    tags: ["Instagram", "Content", "Kundinnen"], image: "/images/absolventinnen-4.jpg",
  },
];
