import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Section } from "@/components/site";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { OG, seoHead } from "@/lib/seo";
import { adminOverview, adminSetRedeemed } from "@/lib/member.functions";
import { newsletterCsv, normalizeCode, type AdminRow } from "@/lib/member-club";
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute("/admin")({
  head: () => seoHead({ path: "/admin", title: "Verwaltung · The Golden Cosmetics", description: "Interner Bereich von The Golden Cosmetics.", image: OG.behandlungen, noindex: true }),
  component: Admin,
});

const input = "w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring";
const fmt = (d: string) => new Date(d).toLocaleDateString("de-DE");
type Filter = "alle" | "offen" | "eingelöst" | "abgemeldet";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg("Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort.");
  };
  const forgot = async () => {
    if (!email) { setMsg("Bitte zuerst deine E-Mail eintragen."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) { setMsg('Der Link konnte nicht angefordert werden. Bitte versuch es später erneut.'); return; }
    setMsg("Falls ein Konto existiert, ist ein Link zum Passwort-Setzen unterwegs.");
  };
  return <Section className="max-w-md"><h1 className="text-4xl">Verwaltung</h1>
    <form onSubmit={login} className="mt-8 space-y-4 text-left">
      <label className="block"><span className="mb-2 block text-sm">Benutzername (E-Mail)</span><input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" className={input} /></label>
      <label className="block"><span className="mb-2 block text-sm">Passwort</span><input required type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className={input} /></label>
      {msg && <p role="alert" className="text-sm text-muted-foreground">{msg}</p>}
      <Button type="submit" className="btn btn-primary w-full">Anmelden</Button>
      <Button type="button" variant="link" onClick={forgot} className="w-full">Passwort festlegen / vergessen</Button>
    </form>
    <Link to="/" className="btn btn-ghost mt-6 w-full">Zurück zur Startseite</Link>
  </Section>;
}

function Admin() {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [denied, setDenied] = useState(false);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("alle");
  const [quick, setQuick] = useState("");
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState("");
  const overview = useServerFn(adminOverview);
  const setRedeemed = useServerFn(adminSetRedeemed);
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    setRows([]);
    await supabase.auth.signOut();
  };

  const load = async () => {
    try { setRows(await overview()); setDenied(false); } catch { setDenied(true); }
  };
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => { setSignedIn(!!data.user); if (data.user) await load(); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange(event => {
      if (event === "SIGNED_IN") { setSignedIn(true); load(); }
      if (event === "SIGNED_OUT") { setSignedIn(false); setRows([]); }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => ({
    members: rows.length,
    confirmed: rows.filter(r => r.status === "bestätigt").length,
    open: rows.filter(r => r.code && !r.redeemed_at).length,
    redeemed: rows.filter(r => r.redeemed_at).length,
  }), [rows]);
  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter(r => (!s || r.vorname.toLowerCase().includes(s) || r.email.includes(s) || (r.code ?? "").toLowerCase().includes(s))
      && (filter === "alle" || (filter === "offen" && r.code && !r.redeemed_at) || (filter === "eingelöst" && r.redeemed_at) || (filter === "abgemeldet" && r.status === "abgemeldet")));
  }, [rows, q, filter]);
  const match = quick.trim() ? rows.find(r => r.code === normalizeCode(quick)) : undefined;

  const toggle = async (code: string, redeemed: boolean) => {
    if (!window.confirm(redeemed ? `Code ${code} jetzt als eingelöst markieren?` : `Einlösung von ${code} rückgängig machen?`)) return;
    const res = await setRedeemed({ data: { code, redeemed, note: redeemed ? note : "" } });
    setFlash(res.ok ? (redeemed ? `${code} ist eingelöst.` : `${code} ist wieder offen.`) : res.reason);
    setNote(""); await load();
  };
  const exportCsv = () => {
    const blob = new Blob(["\ufeff" + newsletterCsv(rows)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "newsletter-empfaenger.csv"; a.click(); URL.revokeObjectURL(a.href);
  };

  if (!ready) return <div className="bg-background"><Section><p className="text-muted-foreground">Laden …</p></Section></div>;
  if (!signedIn) return <div className="bg-background"><Login /></div>;
  if (denied) return <div className="bg-background"><Section className="max-w-md"><h1 className="text-4xl">Zugriff nicht möglich</h1><p className="mt-4 text-muted-foreground">Prüfe deine Verwaltungsrechte oder versuch es erneut.</p><Button variant="ghost" className="btn btn-ghost mt-6" onClick={load}>Erneut laden</Button><Button variant="ghost" className="btn btn-ghost mt-6" onClick={signOut}>Abmelden</Button><Link to="/" className="btn btn-ghost mt-6 w-full">Zurück zur Startseite</Link></Section></div>;

  return <div className="bg-background">
    <Section className="max-w-4xl !pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl md:text-4xl">Member Club</h1><div className="flex items-center gap-2"><Link to="/" className="btn btn-ghost">Zurück zur Startseite</Link><Button variant="ghost" className="btn btn-ghost" onClick={signOut}>Abmelden</Button></div></div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Mitglieder", stats.members], ["Bestätigt", stats.confirmed], ["Gutscheine offen", stats.open], ["Eingelöst", stats.redeemed]].map(([l, n]) => <div key={l} className="card p-4 text-left"><p className="text-xs text-muted-foreground">{l}</p><p className="mt-1 text-2xl font-semibold">{n}</p></div>)}
      </div>
    </Section>

    <Section className="max-w-4xl !py-4"><div className="card p-5 text-left">
      <p className="font-semibold">Code einlösen</p>
      <input value={quick} onChange={e => { setQuick(e.target.value.toUpperCase()); setFlash(""); }} placeholder="Code eingeben, z. B. 7K3P8M" autoCapitalize="characters" autoComplete="off" inputMode="text" aria-label="Code eingeben" className={`${input} mt-3 font-mono tracking-widest`} />
      {quick.trim() && !match && <p className="mt-3 text-sm text-muted-foreground">Kein Gutschein mit diesem Code gefunden.</p>}
      {match && match.code && <div className="mt-4 space-y-3">
        <p><span className="font-semibold">{match.vorname}</span> <span className="text-sm text-muted-foreground">{match.email}</span></p>
        {match.redeemed_at
          ? <><p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">Bereits eingelöst am {fmt(match.redeemed_at)}{match.redeemed_note ? ` · ${match.redeemed_note}` : ""}</p><Button variant="ghost" className="btn btn-ghost w-full" onClick={() => { if (match.code) void toggle(match.code, false); }}>Einlösung rückgängig machen</Button></>
          : <><p className="rounded-2xl bg-surface-2 px-4 py-3 text-sm font-semibold">Offen · 10 % einmalig</p><input value={note} onChange={e => setNote(e.target.value)} maxLength={200} placeholder="Notiz (optional), z. B. Lashlifting" className={input} /><Button className="btn btn-primary w-full" onClick={() => { if (match.code) void toggle(match.code, true); }}>Als eingelöst markieren</Button></>}
      </div>}
      {flash && <p role="status" className="mt-3 text-sm">{flash}</p>}
    </div></Section>

    <Section className="max-w-4xl !pt-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Suche nach Name, E-Mail oder Code" aria-label="Suche" className={input} />
        <Button variant="ghost" className="btn btn-ghost shrink-0" onClick={exportCsv}>CSV Newsletter</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{(["alle", "offen", "eingelöst", "abgemeldet"] as Filter[]).map(f => <Button key={f} variant="ghost" className="chip capitalize" data-active={filter === f} onClick={() => setFilter(f)}>{f}</Button>)}</div>
      <div className="mt-5 divide-y text-left text-sm">
        {visible.map(r => <div key={r.member_id} className="grid gap-1 py-3 md:grid-cols-[1.4fr_1fr_1fr] md:items-center">
          <span><span className="block font-semibold">{r.vorname}</span><span className="break-all text-muted-foreground">{r.email}</span><span className="block text-xs text-muted-foreground">angemeldet {fmt(r.created_at)} · Newsletter {r.status}</span></span>
          <span className="font-mono tracking-widest">{r.code ?? "–"}</span>
          <span className="flex items-center gap-2">{r.code ? (r.redeemed_at ? <><span className="font-semibold text-destructive">eingelöst am {fmt(r.redeemed_at)}</span><Button variant="link" className="h-auto px-0 text-xs" onClick={() => { if (r.code) void toggle(r.code, false); }}>rückgängig</Button></> : <><span>offen</span><Button variant="link" className="h-auto px-0 text-xs" onClick={() => { if (r.code) void toggle(r.code, true); }}>einlösen</Button></>) : <span className="text-muted-foreground">kein Gutschein</span>}</span>
        </div>)}
        {!visible.length && <p className="py-6 text-center text-muted-foreground">Keine Einträge.</p>}
      </div>
    </Section>
  </div>;
}
