import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

type Search = { mode?: "login" | "signup" };

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): Search => ({ mode: s["mode"] === "signup" ? "signup" : "login" }),
  head: () => ({
    meta: [
      { title: "Accedi — QuickQuote" },
      { name: "description", content: "Accedi o crea il tuo account QuickQuote." },
      { property: "og:title", content: "Accedi — QuickQuote" },
      { property: "og:description", content: "Accedi o crea il tuo account QuickQuote." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const input = "h-13 w-full rounded-xl border border-input bg-card px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

function AuthPage() {
  const { mode = "login" } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const signup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { business_name: business } },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/dashboard" });
        else setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      const msg = (err as Error).message;
      toast.error(msg.includes("Invalid login") ? t("Email o password non corretti") : msg.includes("already") ? t("Email già registrata") : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy px-6 pb-10 pt-10 text-navy-foreground">
        <div className="mx-auto max-w-md">
          <div className="flex items-center gap-2">
            <img src="/icon-192.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="font-extrabold">QuickQuote</span>
          </div>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight">{signup ? t("Crea il tuo account") : t("Bentornato")}</h1>
          <p className="mt-1 text-navy-foreground/70">{signup ? t("Gratis. Pronto in 30 secondi.") : t("Accedi per gestire i tuoi preventivi.")}</p>
        </div>
      </div>
      <div className="mx-auto -mt-5 max-w-md px-4">
        {sent ? (
          <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
            <h2 className="text-lg font-bold">{t("Controlla la tua email")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("Ti abbiamo inviato un link a")} <b>{email}</b>. {t("Aprilo per attivare l'account.")}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
            {signup && (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">{t("Nome attività")}</span>
                <input className={input} value={business} onChange={(e) => setBusiness(e.target.value)} placeholder={t("Es. Rossi Impianti")} required />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Email</span>
              <input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Password</span>
              <input className={input} type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button disabled={loading} className="mt-2 h-14 w-full rounded-xl bg-navy text-base font-bold text-navy-foreground disabled:opacity-60">
              {loading ? t("Attendere…") : signup ? t("Crea account") : t("Accedi")}
            </button>
          </form>
        )}
        <button
          onClick={() => { setSent(false); navigate({ to: "/auth", search: { mode: signup ? "login" : "signup" } }); }}
          className="mt-4 h-12 w-full text-sm font-semibold text-accent-foreground"
        >
          {signup ? t("Hai già un account? Accedi") : t("Non hai un account? Registrati gratis")}
        </button>
      </div>
    </div>
  );
}