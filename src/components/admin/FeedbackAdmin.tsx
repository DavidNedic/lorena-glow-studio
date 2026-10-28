import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListFeedback } from "@/lib/feedback.functions";
import type { FeedbackRow } from "@/lib/member-club";

export function FeedbackAdmin() {
  const list = useServerFn(adminListFeedback);
  const [rows, setRows] = useState<FeedbackRow[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => { list().then(setRows).catch(() => setErr("Feedback konnte nicht geladen werden.")); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (err) return <p className="text-sm text-muted-foreground">{err}</p>;
  if (!rows) return <p className="text-sm text-muted-foreground">Laden …</p>;
  const avg = rows.length ? (rows.reduce((s, r) => s + r.sterne, 0) / rows.length).toFixed(1) : "–";
  return <div className="text-left">
    <p className="text-sm text-muted-foreground">48 Stunden nach dem Einlösen eines Member-Gutscheins bekommt die Kundin automatisch eine Feedback-Mail. Jedes Feedback geht zusätzlich an thegoldencosmetics@web.de.</p>
    <div className="mt-4 grid grid-cols-2 gap-3"><div className="card p-4"><p className="text-xs text-muted-foreground">Feedbacks</p><p className="mt-1 text-2xl font-semibold">{rows.length}</p></div><div className="card p-4"><p className="text-xs text-muted-foreground">Durchschnitt</p><p className="mt-1 text-2xl font-semibold">{avg} ★</p></div></div>
    {!rows.length && <p className="mt-6 text-sm text-muted-foreground">Noch kein Feedback eingegangen.</p>}
    <div className="mt-5 divide-y text-sm">{rows.map(r => <div key={r.id} className="py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><span className="font-semibold">{r.vorname} {r.nachname} <span className="font-normal text-muted-foreground">{r.email}</span></span><span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("de-DE")}</span></div>
      <p className="mt-1 tracking-widest text-primary" aria-label={`${r.sterne} von 5 Sternen`}>{"★".repeat(r.sterne)}<span className="text-muted-foreground">{"★".repeat(5 - r.sterne)}</span></p>
      {r.behandlung && <p className="text-xs text-muted-foreground">Behandlung: {r.behandlung}</p>}
      {r.text && <p className="mt-2 whitespace-pre-line">{r.text}</p>}
      <p className="mt-2 text-xs text-muted-foreground">{r.veroeffentlichen ? "Darf auf der Website gezeigt werden" : "Nicht zur Veröffentlichung freigegeben"}</p>
    </div>)}</div>
  </div>;
}
