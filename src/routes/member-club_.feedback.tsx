import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Footer, FloatingNav, Section } from "@/components/site";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/data";
import { OG, seoHead } from "@/lib/seo";
import { getFeedbackInvite, submitFeedback } from "@/lib/feedback.functions";

export const Route = createFileRoute("/member-club_/feedback")({
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s["token"] === "string" ? s["token"] : "" }),
  head: () => seoHead({ path: "/member-club/feedback", title: "Dein Feedback · The Golden Cosmetics", description: "Teile Lorena mit, wie dir deine Behandlung bei The Golden Cosmetics in Brackenheim gefallen hat.", image: OG.behandlungen, noindex: true }),
  component: Feedback,
});

function Feedback() {
  const { token } = Route.useSearch();
  const invite = useServerFn(getFeedbackInvite);
  const submit = useServerFn(submitFeedback);
  const [state, setState] = useState<"busy" | "open" | "done" | "invalid" | "thanks">("busy");
  const [vorname, setVorname] = useState("");
  const [sterne, setSterne] = useState(0);
  const [text, setText] = useState("");
  const [publish, setPublish] = useState(false);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (!/^[a-f0-9]{48}$/.test(token)) { setState("invalid"); return; }
    invite({ data: { token } }).then(r => { setState(r.state); if ("vorname" in r) setVorname(r.vorname ?? ""); }).catch(() => setState("invalid"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    if (!sterne) { setMsg("Bitte wähle 1 bis 5 Sterne."); return; }
    setSending(true);
    try {
      const r = await submit({ data: { token, sterne, text, veroeffentlichen: publish } });
      if (r.ok) setState("thanks"); else setMsg(r.reason);
    } catch (err) { setMsg(err instanceof Error ? err.message : "Bitte versuch es erneut."); }
    setSending(false);
  };
  return <div className="bg-background">
    <FloatingNav back="/member-club" links={[]} cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
    <Section className="max-w-xl">
      <h1 className="text-4xl">Dein Feedback</h1>
      {state === "busy" && <p className="mt-6 text-muted-foreground">Einen Moment …</p>}
      {state === "invalid" && <p className="mt-6 text-muted-foreground">Dieser Feedback-Link ist ungültig.</p>}
      {state === "done" && <p className="mt-6 text-muted-foreground">Du hast bereits Feedback gegeben – danke dir!</p>}
      {state === "thanks" && <p className="mt-6 text-muted-foreground">Danke dir{vorname ? `, ${vorname}` : ""}! Dein Feedback ist bei mir angekommen.</p>}
      {state === "open" && <form onSubmit={send} className="mt-6 space-y-5 text-left">
        <p className="text-center text-muted-foreground">Hallo {vorname || "du"}, wie hat dir deine Behandlung gefallen?</p>
        <div role="radiogroup" aria-label="Bewertung" className="flex justify-center gap-2">{[1, 2, 3, 4, 5].map(n => <button key={n} type="button" role="radio" aria-checked={sterne === n} aria-label={`${n} von 5 Sternen`} onClick={() => setSterne(n)} className={`text-4xl transition-colors ${n <= sterne ? "text-primary" : "text-muted-foreground/40"}`}>★</button>)}</div>
        <label className="block"><span className="mb-2 block text-sm">Deine Worte (optional)</span><textarea value={text} onChange={e => setText(e.target.value)} maxLength={2000} rows={5} className="w-full rounded-3xl border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} className="mt-1" /><span>Lorena darf mein Feedback mit Vornamen auf der Website und in sozialen Medien zeigen. Widerruf jederzeit möglich.</span></label>
        {msg && <p role="alert" className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" disabled={sending} className="btn btn-primary w-full">{sending ? "Wird gesendet …" : "Feedback senden"}</Button>
      </form>}
      <Link to="/member-club" className="mt-6 inline-block text-sm underline underline-offset-4">Zum Member Club</Link>
    </Section>
    <Footer headline="Bereit für deinen Glow?" cta={{ label: "Termin buchen", href: CONTACT.beautinda, external: true }} />
  </div>;
}
