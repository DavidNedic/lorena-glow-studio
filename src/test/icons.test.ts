import { describe, expect, it } from "vitest";
import { sitemapPaths } from "@/routes/sitemap[.]xml";

const BASE = "http://localhost:8080";
const ICONS = ["/favicon.ico", "/favicon.svg", "/favicon-16x16.png", "/favicon-32x32.png", "/apple-touch-icon.png", "/android-chrome-192x192.png", "/android-chrome-512x512.png", "/android-chrome-maskable-512x512.png", "/site.webmanifest"];

describe("icons and manifest", () => {
  it.each(ICONS)("%s is reachable", async (p) => {
    expect((await fetch(BASE + p)).status).toBe(200);
  });
  it("manifest is valid JSON with icons and maskable variant", async () => {
    const m = JSON.parse(await (await fetch(BASE + "/site.webmanifest")).text());
    expect(m.name).toBe("The Golden Cosmetics & Academy");
    expect(m.short_name).toBe("Golden Cosmetics");
    expect(m.background_color).toBe("#F8F0EC");
    expect(m.icons.map((i: { sizes: string }) => i.sizes)).toEqual(["192x192", "512x512", "512x512"]);
    expect(m.icons.some((i: { purpose: string }) => i.purpose === "maskable")).toBe(true);
  });
});

const ONCE = ["<title>", 'name="description"', 'property="og:title"', 'property="og:description"', 'property="og:image"', 'property="og:url"', 'name="twitter:card"', 'property="og:type"', 'property="og:site_name"'];
describe.each(sitemapPaths())("share tags on %s", (path) => {
  it("each core tag appears exactly once", async () => {
    const html = await (await fetch(BASE + path)).text();
    for (const t of ONCE) expect(html.split(t).length - 1, t).toBe(1);
    for (const t of ['property="og:locale" content="de_DE"', 'property="og:image:alt"', 'name="twitter:image:alt"', 'name="twitter:title"', 'rel="manifest"', 'rel="apple-touch-icon"']) expect(html).toContain(t);
  });
});
