import { useEffect, useRef, useState } from "react";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CONTACT } from "@/lib/data";
import regularFont from "@fontsource/hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2?url";
import semiboldFont from "@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2?url";

type PreviewDraft = {
  betreff: string; vorschau: string; ueberschrift: string; text: string;
  button_text: string; button_url: string;
};

export function NewsletterPreview({ draft }: { draft: PreviewDraft }) {
  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setHtml(""); setError(""); setReady(false);
    const prepare = async () => {
      try {
        const [{ renderToStaticMarkup }, { template }] = await Promise.all([
          import("react-dom/server"), import("@/lib/email-templates/member-newsletter"),
        ]);
        const Newsletter = template.component;
        const markup = renderToStaticMarkup(<Newsletter origin={window.location.origin} vorname="Vorname"
          betreff={draft.betreff} vorschau={draft.vorschau} ueberschrift={draft.ueberschrift}
          text={draft.text} buttonText={draft.button_text} buttonUrl={draft.button_url}
          unsubscribeUrl={`${window.location.origin}/member-club/abmelden`} />);
        const doc = new DOMParser().parseFromString(markup, "text/html");
        doc.title = draft.betreff || "Newsletter · The Golden Cosmetics";
        const style = doc.createElement("style");
        style.textContent = `
          @font-face { font-family: 'Hanken Grotesk'; font-weight: 400; src: url('${new URL(regularFont, window.location.origin).href}') format('woff2'); }
          @font-face { font-family: 'Hanken Grotesk'; font-weight: 600; src: url('${new URL(semiboldFont, window.location.origin).href}') format('woff2'); }
          * { box-sizing: border-box; overflow-wrap: anywhere; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @media (max-width: 420px) { td[style*="40px 28px"] { padding: 28px 18px !important; } }
          @media print { @page { size: A4; margin: 12mm; } body { padding: 0 !important; } p, h1, h2, img, a { break-inside: avoid; } }
        `;
        doc.head.append(style);
        if (!cancelled) setHtml(`<!DOCTYPE html>${doc.documentElement.outerHTML}`);
      } catch {
        if (!cancelled) setError("Die Vorschau konnte nicht geladen werden. Bitte versuch es erneut.");
      }
    };
    void prepare();
    return () => { cancelled = true; };
  }, [open, draft]);

  const loaded = async () => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    doc.addEventListener("click", event => {
      if (event.target instanceof Element && event.target.closest("a")) event.preventDefault();
    });
    await Promise.all([
      doc.fonts.ready,
      ...Array.from(doc.images).map(img => img.decode().catch(() => undefined)),
    ]);
    if (doc === frame.current?.contentDocument) setReady(true);
  };

  return <>
    <Button type="button" variant="ghost" className="btn btn-ghost" onClick={() => setOpen(true)}>
      <Eye aria-hidden="true" className="size-4" /> Vorschau / PDF
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-24px)] max-w-2xl flex-col gap-3 p-4 sm:p-6">
        <DialogHeader className="pr-6">
          <DialogTitle>Newsletter-Vorschau</DialogTitle>
          <DialogDescription className="break-words">{draft.betreff || "Newsletter"}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-surface">
          {error ? <p role="alert" className="p-6 text-sm">{error}</p> : html ?
            <iframe ref={frame} title="Newsletter im Website-Stil" srcDoc={html}
              sandbox="allow-same-origin allow-modals" onLoad={() => { void loaded(); }}
              className="block h-[60dvh] w-full border-0" /> :
            <p role="status" className="p-6 text-sm">Vorschau wird geladen …</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Im Druckdialog „Als PDF speichern“ auswählen.</p>
          <Button type="button" className="btn btn-primary" disabled={!ready} onClick={() => frame.current?.contentWindow?.print()}>
            <Download aria-hidden="true" className="size-4" /> Als PDF speichern
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Die persönliche Anrede wird beim Versand ergänzt. Absender: {CONTACT.email}</p>
      </DialogContent>
    </Dialog>
  </>;
}