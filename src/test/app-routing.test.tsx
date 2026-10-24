import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it.each([["ausreinigung", "t-klassische-ausreinigung"], ["rein", "t-klassische-ausreinigung"], ["aqua", "t-aquafacial-ausreinigung"], ["micro", "t-microneedling"], ["micro-salmon", "t-microneedling-salmon-dna"], ["glass", "t-glass-skin"], ["anti-akne", "t-anti-akne-face-reset"]] as const)("permanently redirects alias %s to the treatment row", async (slug, hash) => {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [`/behandlungen/${slug}`] }), context: { queryClient: new QueryClient() }, isServer: true });
    await router.load();
    const result = router._serverResult;
    expect(result?.type).toBe("redirect");
    if (result?.type !== "redirect") throw new Error("Expected a permanent redirect");
    expect(result.redirect.status).toBe(301);
    expect(result.redirect.options.to).toBe("/behandlungen");
    expect(result.redirect.options.hash).toBe(hash);
  });
  it.each(["micro-cica", "glass-skin", "aha-egf", "aqua-micro", "dermaplaning", "microdermabrasion", "akne-body", "carboxy", "glow-peel", "refresh-peel", "pure-peel", "microneedling", "aquafacial-ausreinigung", "microneedling-salmon-dna", "biorepeel", "anti-akne-face-reset"])("former slug %s is a real treatment again and renders not found only without detail page", async (slug) => {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [`/behandlungen/${slug}`] }), context: { queryClient: new QueryClient() }, isServer: true });
    await router.load();
    const result = router._serverResult;
    expect(result?.type).not.toBe("redirect");
  });
  it("preserves the lash-brow alias with a permanent redirect to lash", async () => {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/behandlungen/lash-brow"] }), context: { queryClient: new QueryClient() }, isServer: true });
    await router.load();
    const result = router._serverResult;
    expect(result?.type).toBe("redirect");
    if (result?.type !== "redirect") throw new Error("Expected a permanent redirect");
    expect(result.redirect.status).toBe(301);
    expect(result.redirect.options.params).toEqual({ slug: "lash" });
  });
});
