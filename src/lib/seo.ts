import { CONTACT } from "@/lib/data";

export const SITE_URL = "https://thegoldencosmetics.com";
export const OG = { behandlungen: "/images/og-behandlungen.jpg", academy: "/images/og-academy.jpg", lorena: "/images/og-lorena.jpg" };

export const OG_ALT: Record<string, string> = {
  [OG.behandlungen]: "Behandlungsliege im Kosmetikstudio The Golden Cosmetics in Brackenheim",
  [OG.academy]: "Strahlende Haut nach einer Behandlung – The Golden Academy",
  [OG.lorena]: "Gepflegte Haut und geliftete Wimpern bei The Golden Cosmetics",
};

export const abs = (path: string) => SITE_URL + (path === "/" ? "/" : path);

/** Shorten text at a word boundary so descriptions stay within ~155 characters. */
export function clip(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:·-]+$/, "") + "…";
}

export const BEAUTY_SALON = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${SITE_URL}/#salon`,
  name: CONTACT.name,
  founder: { "@type": "Person", name: CONTACT.owner, jobTitle: "Anerkannte Fachkosmetikerin" },
  url: SITE_URL,
  image: abs(OG.behandlungen),
  logo: abs("/android-chrome-512x512.png"),
  telephone: "+491629709213",
  address: { "@type": "PostalAddress", streetAddress: CONTACT.street, postalCode: "74336", addressLocality: "Brackenheim", addressCountry: "DE" },
  areaServed: ["Brackenheim", "Heilbronn"],
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "20:00" }],
  sameAs: [CONTACT.instagram],
  potentialAction: { "@type": "ReserveAction", target: CONTACT.beautinda },
};

export const ACADEMY_ORG = { "@type": "Organization", name: "The Golden Cosmetics Academy", url: `${SITE_URL}/academy`, logo: abs("/android-chrome-512x512.png") };

export function breadcrumbs(items: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })) };
}

type HeadInput = { path: string; title: string; description: string; image: string; type?: string; jsonLd?: object[]; noindex?: boolean };

export function seoHead({ path, title, description, image, type = "website", jsonLd = [], noindex }: HeadInput) {
  const url = abs(path), img = abs(image), desc = clip(description), alt = OG_ALT[image] ?? title;
  return {
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:site_name", content: "The Golden Cosmetics & Academy" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:image", content: img },
      { property: "og:image:secure_url", content: img },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: alt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: img },
      { name: "twitter:image:alt", content: alt },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: noindex ? [] : [{ rel: "canonical", href: url }],
    scripts: jsonLd.map((d) => ({ type: "application/ld+json", children: JSON.stringify(d) })),
  };
}
