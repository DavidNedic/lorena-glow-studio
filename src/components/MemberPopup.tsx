import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/site";

// The offer shows 5 seconds after the treatments page is opened and stays on
// screen until the visitor actively clicks it away.
const DELAY = 5000;

export function MemberPopup() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), DELAY);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !cardRef.current) return;
      const items = cardRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  if (!open) return null;
  const dismiss = () => setOpen(false);

  return (
    <div className="member-pop" role="dialog" aria-modal="true" aria-labelledby="member-pop-title">
      <div className="member-pop-card" ref={cardRef}>
        <Button ref={closeRef} variant="ghost" size="icon" aria-label="Pop-up schließen" onClick={dismiss} className="member-pop-close">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </Button>
        <Label>Nur für meine Kundinnen</Label>
        <h2 id="member-pop-title" className="text-2xl md:text-3xl">Jetzt Member werden</h2>
        <p className="mt-4 text-muted-foreground">Melde dich zum Newsletter an und bekomm einmalig 10 % auf eine Behandlung im Studio.</p>
        <Button asChild variant="ghost" className="btn btn-primary mt-6 w-full"><Link to="/member-club" onClick={dismiss}>Jetzt Member werden</Link></Button>
        <Button variant="link" onClick={dismiss} className="mt-2 text-sm text-muted-foreground">Vielleicht später</Button>
      </div>
    </div>
  );
}
