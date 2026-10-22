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
  it.each(["aqua", "micro", "micro-cica", "micro-salmon", "glass", "aha-egf", "rein", "aqua-micro", "dermaplaning", "microdermabrasion", "anti-akne", "akne-body", "carboxy", "glow-peel", "refresh-peel", "pure-peel", "glass-skin", "aquafacial", "microneedling", "ausreinigung"])("permanently redirects retired %s to the overview", async (slug) => {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [`/behandlungen/${slug}`] }), context: { queryClient: new QueryClient() }, isServer: true });
    await router.load();
    const result = router._serverResult;
    expect(result?.type).toBe("redirect");
    if (result?.type !== "redirect") throw new Error("Expected a permanent redirect");
    expect(result.redirect.options.statusCode).toBe(301);
    expect(result.redirect.options.to).toBe("/behandlungen");
  });
  it("preserves the lash-brow alias with a permanent redirect to lash", async () => {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/behandlungen/lash-brow"] }), context: { queryClient: new QueryClient() }, isServer: true });
    await router.load();
    const result = router._serverResult;
    expect(result?.type).toBe("redirect");
    if (result?.type !== "redirect") throw new Error("Expected a permanent redirect");
    expect(result.redirect.options.statusCode).toBe(301);
    expect(result.redirect.options.params).toEqual({ slug: "lash" });
  });
});
