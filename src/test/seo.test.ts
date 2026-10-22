import { describe, expect, it } from "vitest";
import { sitemapPaths, sitemapXml } from "@/routes/sitemap[.]xml";
import { MASTERCLASSES, TREATMENTS } from "@/lib/data";

const BASE = "http://localhost:8080";
const pages = sitemapPaths();

describe("sitemap", () => {
  it("lists every public page with absolute thegoldencosmetics.com URLs", () => {
    expect(pages).toEqual(["/", "/behandlungen", "/behandlungen/first", "/behandlungen/lash", "/academy", ...MASTERCLASSES.map((m) => `/academy/${m.slug}`), "/rechtliches"]);
    expect(sitemapXml()).toContain("<loc>https://thegoldencosmetics.com/behandlungen/lash</loc>");
    expect(TREATMENTS.filter((t) => !t.detail).every((t) => !sitemapXml().includes(`/${t.slug}<`))).toBe(true);
  });
});

// Live SSR checks against the running dev server.
describe.each(pages)("head of %s", (path) => {
  it("has canonical, one h1, valid price-free JSON-LD and short meta", async () => {
    const html = await (await fetch(BASE + path)).text();
    expect(html).toContain(`<link rel="canonical" href="https://thegoldencosmetics.com${path}"`);
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => m[1]);
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(() => JSON.parse(b)).not.toThrow();
      expect(b).not.toMatch(/€|"price"|offers/i);
    }
    const title = html.match(/<title>(.*?)<\/title>/)![1].replaceAll("&amp;", "&");
    expect(title.length).toBeLessThanOrEqual(62);
    const desc = html.match(/<meta name="description" content="(.*?)"/)![1].replaceAll("&amp;", "&");
    expect(desc.length).toBeLessThanOrEqual(156);
    expect(html).toContain('property="og:image" content="https://thegoldencosmetics.com/images/og-');
  });
});
