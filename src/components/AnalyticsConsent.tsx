import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CONSENT_KEY, CONSENT_NOTICE, readConsent, saveConsent, updateAnalytics } from "@/lib/analytics";

export function AnalyticsConsent() {
  const path = useRouterState({ select: state => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [revision, setRevision] = useState(0);
  const [storageError, setStorageError] = useState(false);
  const id = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY ?? "";
  const configured = /^G-[A-Z0-9]+$/.test(id);

  useEffect(() => {
    if (!configured) return;
    setOpen(readConsent() === null);
    const settings = () => setOpen(true);
    const sync = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) {
        setOpen(readConsent() === null);
        setRevision(value => value + 1);
      }
    };
    window.addEventListener("golden-cookie-settings", settings);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("golden-cookie-settings", settings);
      window.removeEventListener("storage", sync);
    };
  }, [configured]);

  useEffect(() => { if (configured) updateAnalytics(id, path); }, [configured, id, path, revision]);

  function decide(accepted: boolean) {
    const saved = saveConsent(accepted);
    setStorageError(saved === null);
    setRevision(value => value + 1);
    if (saved || !accepted) setOpen(false);
  }

  if (!configured || !open) return null;
  return <section aria-label="Cookie-Einstellungen" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-h-[85dvh] max-w-xl overflow-y-auto rounded-lg border border-border bg-background p-5 text-foreground shadow-warm sm:p-6">
    <h2 className="text-xl font-semibold">Deine Privatsphäre</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{CONSENT_NOTICE}</p>
    <a href="/rechtliches#datenschutz" className="mt-3 inline-block text-sm underline underline-offset-4">Datenschutz</a>
    {storageError && <p role="alert" className="mt-3 text-sm">Deine Auswahl konnte nicht gespeichert werden. Die Statistik bleibt ausgeschaltet.</p>}
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Button variant="outline" className="h-auto min-h-11 whitespace-normal" onClick={() => decide(false)}>Ablehnen</Button>
      <Button variant="outline" className="h-auto min-h-11 whitespace-normal" onClick={() => decide(true)}>Akzeptieren</Button>
    </div>
  </section>;
}