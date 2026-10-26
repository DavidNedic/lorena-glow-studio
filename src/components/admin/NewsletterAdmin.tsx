import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { adminListNewsletters, adminSaveNewsletter, adminSendNewsletter } from "@/lib/member.functions";
import type { Newsletter } from "@/lib/member-club";
import { CONTACT } from "@/lib/data";
import { NewsletterPreview } from "./NewsletterPreview";

const input = "w-full rounded-2xl border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring";
const empty = { betreff: "", vorschau: "", ueberschrift: "", text: "", button_text: "Termin buchen", button_url: CONTACT.beautinda };
type Draft = typeof empty & { id?: string };

export function NewsletterAdmin() {
  const list = useServerFn(adminListNewsletters);
  const save = useServerFn(adminSaveNewsletter);
  const send = useServerFn(adminSendNewsletter);
  const [items, setItems] = useState<Newsletter[]>([]);
  const [recipients, setRecipients] = useState(0);
  const [draft, setDraft] = useState<Draft>(empty);
  const [testEmail, setTestEmail] = useState(CONTACT.email);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => { try { const r = await list(); setItems(r.list); setRecipients(r.recipients); } catch (e) { setMsg(e instanceof Error ? e.message : "Laden fehlgeschlagen"); } };
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(d => ({ ...d, [k]: e.target.value }));
  const run = async (fn: () => Promise<string>) => { setBusy(true); setMsg(""); try { setMsg(await fn()); await load(); } catch (e) { setMsg(e instanceof Error ? e.message : "Fehler"); } finally { setBusy(false); } };
  const persist = async () => { const r = await save({ data: draft }); setDraft(d => ({ ...d, id: r.id })); return r.id; };

  const onSave = () => run(async () => { await persist(); return "Entwurf gespeichert."; });
  const onTest = () => run(async () => { const id = await persist(); await send({ data: { id, test: true, testEmail } }); return `Test an ${testEmail} gesendet. Schau dir die Mail an, bevor du an alle sendest.`; });
  const onSend = () => {
    if (!window.confirm(`Newsletter „${draft.betreff}“ jetzt an ${recipients} Mitglieder senden? Das kann nicht rückgängig gemacht werden.`)) return;
    void run(async () => { const id = await persist(); const r = await send({ data: { id, test: false } }); setDraft(empty); return `Gesendet an ${r.sent} Mitglieder${r.skipped ? `, ${r.skipped} nicht zustellbar` : ""}.`; });
  };
  const sent = items.find(i => i.id === draft.id)?.status === "gesendet";

  return <div className="text-left">
    <div className="card p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-2xl">{draft.id ? "Newsletter bearbeiten" : "Neuer Newsletter"}</h2><p className="text-sm text-muted-foreground">{recipients} bestätigte Empfängerinnen</p></div>
      <div className="mt-5 space-y-4">
        <label className="block"><span className="mb-2 block text-sm">Betreff</span><input value={draft.betreff} onChange={set("betreff")} maxLength={150} className={input} placeholder="z. B. Neu im Studio: Glass Skin" /></label>
        <label className="block"><span className="mb-2 block text-sm">Vorschautext (erscheint im Postfach neben dem Betreff)</span><input value={draft.vorschau} onChange={set("vorschau")} maxLength={150} className={input} /></label>
        <label className="block"><span className="mb-2 block text-sm">Überschrift</span><input value={draft.ueberschrift} onChange={set("ueberschrift")} maxLength={150} className={input} /></label>
        <label className="block"><span className="mb-2 block text-sm">Text (Leerzeile = neuer Absatz). Die Anrede „Hallo Vorname,“ kommt automatisch.</span><textarea value={draft.text} onChange={set("text")} maxLength={5000} rows={8} className={`${input} resize-y`} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm">Button-Text (optional)</span><input value={draft.button_text} onChange={set("button_text")} maxLength={60} className={input} /></label>
          <label className="block"><span className="mb-2 block text-sm">Button-Link</span><input value={draft.button_url} onChange={set("button_url")} maxLength={500} className={input} placeholder="https://" /></label>
        </div>
      </div>
      {msg && <p role="status" className="mt-4 text-sm">{msg}</p>}
      <div className="mt-5"><NewsletterPreview draft={draft} /></div>
      {sent ? <p className="mt-5 text-sm text-muted-foreground">Dieser Newsletter wurde bereits gesendet.</p> : <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
        <label className="block"><span className="mb-2 block text-sm">Test-E-Mail</span><input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} className={input} /></label>
        <Button variant="ghost" className="btn btn-ghost" disabled={busy} onClick={onTest}>Test senden</Button>
        <Button variant="ghost" className="btn btn-ghost" disabled={busy} onClick={onSave}>Entwurf speichern</Button>
      </div>}
      {!sent && <Button className="btn btn-primary mt-4 w-full" disabled={busy || !recipients} onClick={onSend}>{busy ? "Einen Moment …" : `An alle ${recipients} Mitglieder senden`}</Button>}
      <p className="mt-3 text-xs text-muted-foreground">Jede Mail enthält automatisch einen Abmeldelink. Abgemeldete und unbestätigte Mitglieder bekommen nichts.</p>
    </div>
    <div className="mt-6">
      <div className="flex items-center justify-between"><h3 className="text-xl">Bisherige Newsletter</h3><Button variant="link" onClick={() => { setDraft(empty); setMsg(""); }}>Neuer Newsletter</Button></div>
      <div className="mt-3 divide-y text-sm">
        {items.map(n => <button key={n.id} type="button" onClick={() => { setDraft({ id: n.id, betreff: n.betreff, vorschau: n.vorschau, ueberschrift: n.ueberschrift, text: n.text, button_text: n.button_text, button_url: n.button_url }); setMsg(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex w-full flex-wrap items-center justify-between gap-2 py-3 text-left">
          <span className="font-semibold">{n.betreff}</span>
          <span className="text-muted-foreground">{n.status === "gesendet" ? `gesendet ${n.gesendet_at ? new Date(n.gesendet_at).toLocaleDateString("de-DE") : ""} · ${n.empfaenger} Empfängerinnen` : "Entwurf"}</span>
        </button>)}
        {!items.length && <p className="py-4 text-muted-foreground">Noch keine Newsletter.</p>}
      </div>
    </div>
  </div>;
}
