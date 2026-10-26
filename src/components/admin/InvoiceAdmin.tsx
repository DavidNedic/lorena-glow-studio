import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { adminCreateInvoice, adminListInvoices, adminUpdateInvoiceStatus } from "@/lib/member.functions";
import { BUSINESS, euro, invoiceTotals, type Invoice, type InvoiceItem } from "@/lib/member-club";

const input = "w-full rounded-2xl border bg-surface px-4 py-3 outline-none focus:ring-1 focus:ring-ring";
const today = () => new Date().toISOString().slice(0, 10);
const de = (d: string) => new Date(d + (d.length === 10 ? "T12:00:00" : "")).toLocaleDateString("de-DE");
const blankItem = (): InvoiceItem => ({ text: "", menge: 1, einzelpreis: 0 });

export function InvoiceSheet({ inv }: { inv: Invoice }) {
  return <article className="invoice-sheet">
    <header className="invoice-head">
      <div><img src="/images/kolibri-gold.webp" alt="" className="invoice-logo" /><p className="invoice-brand">{BUSINESS.name}</p></div>
      <p className="invoice-sender">{BUSINESS.owner}<br />{BUSINESS.street}<br />{BUSINESS.city}<br />{BUSINESS.phone}<br />{BUSINESS.email}</p>
    </header>
    <p className="invoice-return">{BUSINESS.name} · {BUSINESS.street} · {BUSINESS.city}</p>
    <div className="invoice-meta">
      <p className="invoice-to">{inv.kunde_name}{inv.kunde_adresse ? <><br />{inv.kunde_adresse.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</> : null}</p>
      <dl><dt>Rechnungsnummer</dt><dd>{inv.nummer}</dd><dt>Rechnungsdatum</dt><dd>{de(inv.datum)}</dd><dt>Leistungsdatum</dt><dd>{de(inv.leistungsdatum)}</dd></dl>
    </div>
    <h1 className="invoice-title">{inv.storniert_at ? "Stornierte Rechnung" : "Rechnung"}</h1>
    <table className="invoice-table"><thead><tr><th>Leistung</th><th>Menge</th><th>Einzelpreis</th><th>Gesamt</th></tr></thead>
      <tbody>{inv.positionen.map((p, i) => <tr key={i}><td>{p.text}</td><td>{p.menge}</td><td>{euro(p.einzelpreis)}</td><td>{euro(p.menge * p.einzelpreis)}</td></tr>)}</tbody></table>
    <dl className="invoice-sum"><dt>Nettobetrag</dt><dd>{euro(inv.netto)}</dd><dt>zzgl. {inv.ust_satz.toLocaleString("de-DE")} % USt.</dt><dd>{euro(inv.ust)}</dd><dt className="invoice-total">Gesamtbetrag</dt><dd className="invoice-total">{euro(inv.brutto)}</dd></dl>
    <p className="invoice-note">{inv.bezahlt ? `Betrag dankend erhalten${inv.zahlungsart ? ` (${inv.zahlungsart})` : ""}.` : `Bitte begleiche den Betrag innerhalb von 14 Tagen${inv.zahlungsart ? ` per ${inv.zahlungsart}` : ""}.`}{inv.notiz ? <><br />{inv.notiz}</> : null}</p>
    <footer className="invoice-foot">{BUSINESS.name} · Inhaberin {BUSINESS.owner} · Einzelunternehmen · {BUSINESS.street}, {BUSINESS.city} · USt-IdNr. {BUSINESS.vatId}</footer>
  </article>;
}

export function InvoiceAdmin() {
  const list = useServerFn(adminListInvoices);
  const create = useServerFn(adminCreateInvoice);
  const update = useServerFn(adminUpdateInvoiceStatus);
  const [items, setItems] = useState<Invoice[]>([]);
  const [show, setShow] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ datum: today(), leistungsdatum: today(), kunde_name: "", kunde_adresse: "", kunde_email: "", zahlungsart: "Barzahlung", bezahlt: true, notiz: "" });
  const [pos, setPos] = useState<InvoiceItem[]>([blankItem()]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const totals = useMemo(() => invoiceTotals(pos), [pos]);

  const load = async () => { try { setItems(await list()); } catch (e) { setMsg(e instanceof Error ? e.message : "Laden fehlgeschlagen"); } };
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  const setP = (i: number, k: keyof InvoiceItem, v: string) => setPos(ps => ps.map((p, j) => j !== i ? p : { ...p, [k]: k === "text" ? v : Number(v.replace(",", ".")) || 0 }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    try {
      const inv = await create({ data: { ...form, positionen: pos, ust_satz: 19 } });
      setShow(inv); setPos([blankItem()]); setForm(f => ({ ...f, kunde_name: "", kunde_adresse: "", kunde_email: "", notiz: "" }));
      setMsg(`Rechnung ${inv.nummer} erstellt.`); await load();
    } catch (err) { setMsg(err instanceof Error ? err.message : "Fehler"); } finally { setBusy(false); }
  };
  const status = async (inv: Invoice, patch: { bezahlt?: boolean; storno?: boolean }) => {
    if (patch.storno && !window.confirm(`Rechnung ${inv.nummer} stornieren? Sie bleibt zur Aufbewahrung gespeichert.`)) return;
    try { await update({ data: { id: inv.id, ...patch } }); await load(); } catch (e) { setMsg(e instanceof Error ? e.message : "Fehler"); }
  };

  if (show) return <div>
    <div className="no-print mb-4 flex flex-wrap gap-2"><Button className="btn btn-primary" onClick={() => window.print()}>Drucken / als PDF speichern</Button><Button variant="ghost" className="btn btn-ghost" onClick={() => setShow(null)}>Zurück</Button></div>
    <div className="invoice-print"><InvoiceSheet inv={show} /></div>
  </div>;

  return <div className="text-left">
    <form onSubmit={submit} className="card p-5 md:p-7">
      <h2 className="text-2xl">Neue Rechnung</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm">Name der Kundin</span><input required value={form.kunde_name} onChange={setF("kunde_name")} maxLength={120} className={input} /></label>
        <label className="block"><span className="mb-2 block text-sm">E-Mail (optional)</span><input type="email" value={form.kunde_email} onChange={setF("kunde_email")} maxLength={255} className={input} /></label>
        <label className="block md:col-span-2"><span className="mb-2 block text-sm">Adresse (optional, bei Beträgen über 250 € Pflicht)</span><textarea value={form.kunde_adresse} onChange={setF("kunde_adresse")} rows={2} maxLength={300} className={`${input} resize-y`} placeholder={"Straße Nr.\nPLZ Ort"} /></label>
        <label className="block"><span className="mb-2 block text-sm">Rechnungsdatum</span><input type="date" required value={form.datum} onChange={setF("datum")} className={input} /></label>
        <label className="block"><span className="mb-2 block text-sm">Leistungsdatum</span><input type="date" required value={form.leistungsdatum} onChange={setF("leistungsdatum")} className={input} /></label>
      </div>
      <p className="mt-6 text-sm font-semibold">Positionen (Preise inkl. 19 % USt.)</p>
      <div className="mt-2 space-y-2">{pos.map((p, i) => <div key={i} className="grid grid-cols-[1fr_70px_110px_auto] gap-2 max-[600px]:grid-cols-[1fr_60px_90px_auto]">
        <input required aria-label="Leistung" placeholder="z. B. Korean Lashlifting inkl. Färben" value={p.text} onChange={e => setP(i, "text", e.target.value)} maxLength={200} className={input} />
        <input aria-label="Menge" inputMode="decimal" value={p.menge} onChange={e => setP(i, "menge", e.target.value)} className={input} />
        <input aria-label="Einzelpreis in Euro" inputMode="decimal" value={p.einzelpreis || ""} placeholder="€" onChange={e => setP(i, "einzelpreis", e.target.value)} className={input} />
        <Button type="button" variant="ghost" size="icon" aria-label="Position entfernen" disabled={pos.length === 1} onClick={() => setPos(ps => ps.filter((_, j) => j !== i))}>×</Button>
      </div>)}</div>
      <Button type="button" variant="link" className="mt-1 px-0" onClick={() => setPos(ps => [...ps, blankItem()])}>+ Position hinzufügen</Button>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm">Zahlungsart</span><select value={form.zahlungsart} onChange={setF("zahlungsart")} className={input}>{["Barzahlung", "EC-Karte", "Kreditkarte", "Überweisung", "PayPal", "Klarna"].map(z => <option key={z}>{z}</option>)}</select></label>
        <label className="flex items-center gap-3 self-end pb-3 text-sm"><input type="checkbox" checked={form.bezahlt} onChange={setF("bezahlt")} /> Bereits bezahlt</label>
        <label className="block md:col-span-2"><span className="mb-2 block text-sm">Hinweis auf der Rechnung (optional)</span><input value={form.notiz} onChange={setF("notiz")} maxLength={500} className={input} /></label>
      </div>
      <dl className="mt-5 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm"><dt>Netto</dt><dd>{euro(totals.netto)}</dd><dt>19 % USt.</dt><dd>{euro(totals.ust)}</dd><dt className="font-semibold">Gesamt</dt><dd className="font-semibold">{euro(totals.brutto)}</dd></dl>
      {msg && <p role="status" className="mt-4 text-sm">{msg}</p>}
      <Button type="submit" className="btn btn-primary mt-5 w-full" disabled={busy || totals.brutto <= 0}>{busy ? "Einen Moment …" : "Rechnung erstellen"}</Button>
      <p className="mt-3 text-xs text-muted-foreground">Rechnungsnummern werden fortlaufend vergeben. Rechnungen können nicht gelöscht, nur storniert werden, damit sie 10 Jahre aufbewahrt bleiben.</p>
    </form>
    <div className="mt-6">
      <h3 className="text-xl">Rechnungen</h3>
      <div className="mt-3 divide-y text-sm">{items.map(inv => <div key={inv.id} className="grid gap-1 py-3 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
        <span><span className="block font-semibold">{inv.nummer} · {inv.kunde_name}</span><span className="text-muted-foreground">{de(inv.datum)} · {euro(inv.brutto)}</span></span>
        <span>{inv.storniert_at ? <span className="text-destructive">storniert</span> : inv.bezahlt ? "bezahlt" : <span className="font-semibold">offen</span>}</span>
        <span className="flex flex-wrap gap-3"><Button variant="link" className="h-auto px-0" onClick={() => setShow(inv)}>Ansehen / PDF</Button>{!inv.storniert_at && <Button variant="link" className="h-auto px-0" onClick={() => status(inv, { bezahlt: !inv.bezahlt })}>{inv.bezahlt ? "als offen markieren" : "als bezahlt markieren"}</Button>}{!inv.storniert_at && <Button variant="link" className="h-auto px-0 text-destructive" onClick={() => status(inv, { storno: true })}>stornieren</Button>}</span>
      </div>)}{!items.length && <p className="py-4 text-muted-foreground">Noch keine Rechnungen.</p>}</div>
    </div>
  </div>;
}
