import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Zap, Smartphone, Share2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRO_PRICE_FULL } from "@/lib/quote";
import { t } from "@/lib/i18n";
import { LangSwitch } from "@/components/LangSwitch";
import { organizationLd, pageHead, webApplicationLd, webSiteLd } from "@/lib/seo";
import { BRAND_CREDIT, CONTACT_EMAIL } from "@/lib/legal";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "/",
      "QuickQuote — Preventivi per artigiani dal telefono",
      "Crea preventivi per idraulici, elettricisti, imbianchini e artigiani dal telefono: IVA e totale calcolati, invio su WhatsApp o PDF con logo. 5 preventivi gratis.",
      [webSiteLd(), webApplicationLd(), organizationLd()],
    ),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-12">
        <div className="flex items-center gap-2">
          <img src="/icon-192.png" alt="" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-extrabold tracking-tight">QuickQuote</span>
        </div>
        <h1 className="mt-14 text-4xl font-extrabold leading-tight tracking-tight">
          {t("Preventivi professionali in")} <span className="text-primary">{t("60 secondi")}</span>.
        </h1>
        <p className="mt-4 text-base text-navy-foreground/70">
          {t("Per idraulici, elettricisti, imbianchini, giardinieri e tutti i professionisti locali.")}
        </p>
        <ul className="mt-10 space-y-4 text-sm">
          {[
            [Zap, "Calcolo automatico di sconto, IVA e totale"],
            [Share2, "Invia su WhatsApp, email o salva in PDF"],
            [Smartphone, "Pensata per il tuo telefono"],
          ].map(([Icon, s], i) => {
            const I = Icon as typeof Zap;
            return (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-soft text-primary"><I className="h-5 w-5" /></span>
                {t(s as string)}
              </li>
            );
          })}
        </ul>
        <div className="mt-auto space-y-3 pt-12">
          <Link to="/auth" search={{ mode: "signup" }} className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground">
            {t("Inizia gratis")}
          </Link>
          <Link to="/auth" search={{ mode: "login" }} className="flex h-14 w-full items-center justify-center rounded-2xl border border-navy-soft text-base font-semibold">
            {t("Ho già un account")}
          </Link>
        </div>

        <section className="mt-16" aria-labelledby="come">
          <h2 id="come" className="text-2xl font-extrabold tracking-tight">{t("Come funziona")}</h2>
          <ol className="mt-5 space-y-4">
            {[
              ["Inserisci cliente e lavoro", "Nome, titolo e descrizione: bastano pochi tocchi."],
              ["Aggiungi i costi", "Manodopera, materiali, sconto e IVA: il totale si calcola da solo."],
              ["Invia il preventivo", "Condividi su WhatsApp o email, oppure scarica il PDF con il tuo logo."],
            ].map(([h, d], i) => (
              <li key={h} className="flex gap-4">
                <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-extrabold text-primary-foreground">{i + 1}</span>
                <div><p className="font-bold">{t(h!)}</p><p className="text-sm text-navy-foreground/70">{t(d!)}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16" aria-labelledby="mestieri">
          <h2 id="mestieri" className="text-2xl font-extrabold tracking-tight">{t("Per il tuo mestiere")}</h2>
          <div className="mt-5 space-y-3">
            {([
              ["/preventivo-idraulico", "Preventivo idraulico"],
              ["/preventivo-elettricista", "Preventivo elettricista"],
              ["/come-fare-un-preventivo", "Come fare un preventivo"],
            ] as const).map(([to, label]) => (
              <Link key={to} to={to} className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-navy-soft p-4">
                <span>
                  <span className="block font-bold">{t(label)}</span>
                  <span className="block text-sm text-navy-foreground/70">{t(to === "/come-fare-un-preventivo" ? "Struttura, esempio e checklist da copiare" : "Esempio, voci tipiche e domande frequenti")}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="piani">
          <h2 id="piani" className="text-2xl font-extrabold tracking-tight">{t("Piani")}</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-navy-soft p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-foreground/60">Free</p>
              <p className="mt-1 text-xl font-extrabold">{t("5 preventivi gratuiti")}</p>
              <p className="mt-1 text-sm text-navy-foreground/70">{t("Tutte le funzioni, senza carta di credito.")}</p>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-navy-soft p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Pro</p>
              <p className="mt-1 text-xl font-extrabold">{t("Preventivi illimitati")}</p>
              <p className="num mt-1 text-sm font-semibold">{t(PRO_PRICE_FULL)}</p>
            </div>
          </div>
          <Link to="/auth" search={{ mode: "signup" }} className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground">
            {t("Inizia gratis")}
          </Link>
        </section>

        <footer className="mt-16 border-t border-navy-soft pt-6 text-center text-xs text-navy-foreground/60">
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold">
            <Link to="/preventivo-idraulico">{t("Idraulici")}</Link>
            <Link to="/preventivo-elettricista">{t("Elettricisti")}</Link>
            <Link to="/come-fare-un-preventivo">{t("Guida al preventivo")}</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/termini">{t("Termini")}</Link>
            <a href={`mailto:${CONTACT_EMAIL}`}>{t("Contatti")}</a>
          </nav>
          <LangSwitch className="mt-4" />
          <p className="mt-3">{t(BRAND_CREDIT)}</p>
        </footer>
      </div>
    </div>
  );
}