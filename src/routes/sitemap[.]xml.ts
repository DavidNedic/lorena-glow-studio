import { createFileRoute } from "@tanstack/react-router";
import { MASTERCLASSES, TREATMENTS } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export function sitemapPaths() {
  return [
    "/", "/behandlungen",
    ...TREATMENTS.filter((t) => t.detail).map((t) => `/behandlungen/${t.slug}`),
    "/academy",
    ...MASTERCLASSES.map((m) => `/academy/${m.slug}`),
    "/rechtliches",
  ];
}

export function sitemapXml() {
  const urls = sitemapPaths().map((p) => `<url><loc>${SITE_URL}${p}</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: () => new Response(sitemapXml(), { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } }) } },
});
