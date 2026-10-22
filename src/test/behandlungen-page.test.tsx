import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Route as TreatmentsRoute } from "@/routes/behandlungen.index";
import { routeTree } from "@/routeTree.gen";

// Render the real page so the check fails if the entry is ever re-added or the
// booking CTA leaves its centered wrapper.
async function renderTreatments() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/behandlungen"] }),
    context: { queryClient: new QueryClient() },
  });
  const { Container } = TreatmentsRoute;
  return render(<Container router={router} match={router.matchRoutes("/behandlungen").at(-1)!} />);
}

describe("Behandlungsseite", () => {
  it("hat keinen Eintrag mehr, der auf Stornobedingungen als Platzhalter verweist", async () => {
    const { container } = await renderTreatments();

    expect(screen.queryByText("Kann ich meinen Termin verschieben?")).toBeNull();
    expect(container.textContent).not.toMatch(/\[STORNOBEDINGUNGEN\]/);
  });

  it("zitiert den Buchungs-CTA im Lorena-Abschnitt in einer mittig ausgerichteten Zeile", async () => {
    await renderTreatments();

    const cta = screen.getByRole("link", { name: "Jetzt beraten lassen" });
    const wrapper = cta.parentElement?.parentElement;

    expect(wrapper?.className).toContain("justify-center");
    expect(wrapper?.className).toContain("flex");
  });
});
