import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Renders the real treatments page so the check fails if the pop-up is removed,
// fires too early, or can no longer be dismissed.
async function renderTreatments() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/behandlungen"] }),
    context: { queryClient: new QueryClient() },
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Member-Pop-up auf der Behandlungsseite", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("erscheint erst nach 5 Sekunden, bleibt sichtbar und lässt sich wegklicken", async () => {
    await renderTreatments();

    expect(screen.queryByRole("dialog")).toBeNull();

    act(() => { vi.advanceTimersByTime(4999); });
    expect(screen.queryByRole("dialog")).toBeNull();

    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByRole("dialog", { name: "Jetzt Member werden" })).toBeTruthy();
    expect(
      screen.getByText("Melde dich zum Newsletter an und bekomm einmalig 10 % auf eine Behandlung im Studio."),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Pop-up schließen" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
