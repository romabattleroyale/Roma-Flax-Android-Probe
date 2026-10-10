import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { t } from "@/lib/i18n";
import { PageHeader, Page } from "@/components/AppShell";
import { currentPlan, profileQuery } from "@/lib/data";
import { PLAN_LIMITS, PRO_PRICE_FULL, PRO_PRICE_LABEL, PRO_TAX_NOTE } from "@/lib/quote";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession, createPortalSession } from "@/lib/payments.functions";

export const Route = createFileRoute("/_authenticated/pro")({
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): { checkout?: string | undefined } => ({
    checkout: typeof s["checkout"] === "string" ? s["checkout"] : undefined,
  }),
  head: () => ({ meta: [{ title: "Passa a Pro — QuickQuote" }, { name: "description", content: "Preventivi illimitati con QuickQuote Pro." }, { property: "og:title", content: "Passa a Pro — QuickQuote" }, { property: "og:description", content: "Preventivi illimitati con QuickQuote Pro." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ProPage,
});

const perks = [
  "Preventivi illimitati",
  "PDF professionali con il tuo logo",
  "Condivisione rapida su WhatsApp ed email",
  "Archivio clienti completo",
  "Tutte le funzioni attuali, senza limiti",
];

const testMode = (import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"] as string | undefined)?.startsWith("pk_test_");

function ProPage() {
  const { checkout } = Route.useSearch();
  const qc = useQueryClient();
  const { data: profile } = useQuery({ ...profileQuery, refetchInterval: checkout === "success" ? 3000 : false });
  const isPro = currentPlan(profile) === "pro";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (checkout === "success") qc.invalidateQueries({ queryKey: ["profile"] });
  }, [checkout, qc]);

  const options = useMemo(() => ({
    fetchClientSecret: async () => {
      const r = await createCheckoutSession({ data: { priceId: "pro_monthly", returnUrl: `${window.location.origin}/pro?checkout=success`, environment: getStripeEnvironment() } });
      if ("error" in r) throw new Error(r.error);
      return r.clientSecret;
    },
  }), []);

  async function manage() {
    const r = await createPortalSession({ data: { returnUrl: `${window.location.origin}/pro`, environment: getStripeEnvironment() } });
    if ("error" in r) return void toast.error(r.error);
    window.open(r.url, "_blank");
  }

  return (
    <>
      <PageHeader title="QuickQuote Pro" back="/dashboard" />
      {testMode && (
        <div className="no-print border-b bg-accent px-4 py-2 text-center text-xs font-semibold text-accent-foreground">
          {t("Modalità test: nessun pagamento reale viene addebitato.")}
        </div>
      )}
      <Page>
        <div className="space-y-4">
          <section className="rounded-2xl bg-navy p-6 text-navy-foreground">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">QuickQuote Pro</p>
            <h2 className="mt-2 text-2xl font-extrabold">{t("Preventivi illimitati")}</h2>
            <p className="mt-1 text-sm text-navy-foreground/70">{t("Il piano gratuito include {n} preventivi. Con Pro non ti fermi mai.", { n: PLAN_LIMITS.free })}</p>
            <p className="num mt-5 text-4xl font-extrabold">{t(PRO_PRICE_LABEL)}<span className="text-base font-semibold text-navy-foreground/60">{t("/mese")}</span></p>
            <p className="mt-1 text-sm font-semibold text-navy-foreground/80">{t("+ IVA, se applicabile")}</p>
          </section>
          <section className="rounded-2xl border bg-card p-5">
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="h-4 w-4" /></span>
                  {t(p)}
                </li>
              ))}
            </ul>
          </section>
          {isPro ? (
            <>
              <p className="rounded-xl bg-success/15 p-4 text-center font-bold text-success">{t("Il tuo piano Pro è attivo")}</p>
              <button onClick={manage} className="h-12 w-full rounded-xl border bg-card font-semibold">{t("Gestisci abbonamento")}</button>
            </>
          ) : checkout === "success" ? (
            <p className="rounded-xl bg-muted p-4 text-center font-semibold">{t("Pagamento ricevuto, attivazione del piano Pro in corso…")}</p>
          ) : open ? (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className="h-14 w-full rounded-xl bg-primary font-extrabold text-primary-foreground">
              {t("PASSA A PRO — {p}/mese", { p: t(PRO_PRICE_LABEL) })}
            </button>
          )}
          <p className="text-center text-xs text-muted-foreground">{t(PRO_PRICE_FULL)}. {t(PRO_TAX_NOTE)} {t("Rinnovo mensile automatico, disdici quando vuoi.")}</p>
          <p className="flex justify-center gap-4 text-xs font-semibold text-muted-foreground">
            <Link to="/termini" className="underline">{t("Termini e Condizioni")}</Link>
            <Link to="/privacy" className="underline">Privacy</Link>
          </p>
        </div>
      </Page>
    </>
  );
}