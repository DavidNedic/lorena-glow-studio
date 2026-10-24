import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/site";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { OG, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/reset-password")({
  head: () => seoHead({ path: "/reset-password", title: "Neues Passwort · The Golden Cosmetics", description: "Neues Passwort für den Verwaltungsbereich festlegen.", image: OG.behandlungen, noindex: true }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { setMsg("Das hat nicht geklappt. Bitte fordere einen neuen Link an."); return; }
    navigate({ to: "/admin", replace: true });
  };
  return <div className="bg-background"><Section className="max-w-md">
    <h1 className="text-4xl">Neues Passwort</h1>
    <form onSubmit={submit} className="mt-8 space-y-4 text-left">
      <label className="block"><span className="mb-2 block text-sm">Neues Passwort (mind. 8 Zeichen)</span><input required minLength={8} type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" className="w-full rounded-full border bg-surface px-5 py-3 outline-none focus:ring-1 focus:ring-ring" /></label>
      {msg && <p role="alert" className="text-sm text-destructive">{msg}</p>}
      <Button type="submit" className="btn btn-primary w-full">Passwort speichern</Button>
    </form>
  </Section></div>;
}
