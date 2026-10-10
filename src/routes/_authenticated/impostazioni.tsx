import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Page } from "@/components/AppShell";
import { Field, Section, TextInput, inputCls } from "@/components/Field";
import { businessQuery, currentPlan, profileQuery, quotesQuery } from "@/lib/data";
import { PLAN_LIMITS, PRO_PRICE_FULL, type Plan } from "@/lib/quote";
import { BRAND_CREDIT, deletionMailto } from "@/lib/legal";
import { t } from "@/lib/i18n";
import { LangSwitch } from "@/components/LangSwitch";
import { BusinessLogoSettings } from "@/components/BusinessLogoSettings";

export const Route = createFileRoute("/_authenticated/impostazioni")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Impostazioni — QuickQuote" }, { name: "description", content: "Dati della tua attività." }, { property: "og:title", content: "Impostazioni — QuickQuote" }, { property: "og:description", content: "Dati della tua attività." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Settings,
});

function Settings() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: biz } = useQuery(businessQuery);
  const { data: profile } = useQuery(profileQuery);
  const { data: quotes = [] } = useQuery(quotesQuery);
  const [f, setF] = useState({ business_name: "", vat_number: "", address: "", phone: "", email: "", default_vat: "22", notes: "" });

  useEffect(() => {
    if (biz) setF({
      business_name: biz.business_name, vat_number: biz.vat_number ?? "", address: biz.address ?? "",
      phone: biz.phone ?? "", email: biz.email ?? "", default_vat: String(biz.default_vat), notes: biz.notes ?? "",
    });
  }, [biz]);

  async function save() {
    if (!biz) return;
    const { error } = await supabase.from("business_profiles")
      .update({ ...f, default_vat: parseFloat(f.default_vat) || 0, updated_at: new Date().toISOString() })
      .eq("id", biz.id);
    if (error) return void toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["business"] });
    toast.success(t("Impostazioni salvate"));
  }
  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const plan = currentPlan(profile);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <>
      <PageHeader title={t("Impostazioni")} />
      <Page>
        <div className="space-y-4">
          <Section title={t("La tua attività")}>
            <TextInput label={t("Nome attività")} value={f.business_name} onChange={set("business_name")} />
            <TextInput label={t("Partita IVA")} value={f.vat_number} onChange={set("vat_number")} />
            <TextInput label={t("Indirizzo")} value={f.address} onChange={set("address")} />
            <TextInput label={t("Telefono")} type="tel" value={f.phone} onChange={set("phone")} />
            <TextInput label="Email" type="email" value={f.email} onChange={set("email")} />
            <BusinessLogoSettings business={biz} />
          </Section>
          <Section title={t("Preventivi")}>
            <TextInput label={t("IVA predefinita (%)")} inputMode="decimal" value={f.default_vat} onChange={set("default_vat")} />
            <Field label={t("Note a piè di pagina")}>
              <textarea className={`${inputCls} min-h-20`} value={f.notes} onChange={set("notes")} placeholder={t("Es. Validità 30 giorni. Pagamento a fine lavori.")} />
            </Field>
          </Section>
          <button onClick={save} className="h-14 w-full rounded-xl bg-navy font-bold text-navy-foreground">{t("Salva impostazioni")}</button>

          <Section title={t("Lingua")}>
            <LangSwitch big />
          </Section>

          <Section title={t("Piano")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{plan === "pro" ? "PRO" : t("Gratuito")}</p>
                <p className="text-sm text-muted-foreground">
                  {plan === "pro" ? t("Preventivi illimitati") : t("{a} di {b} preventivi gratuiti utilizzati", { a: Math.min(quotes.length, PLAN_LIMITS.free), b: PLAN_LIMITS.free })}
                </p>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                {plan === "pro" ? "∞" : `Free: ${PLAN_LIMITS.free}`}
              </span>
            </div>
            {plan !== "pro" && (
              <>
                <Link to="/pro" className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">{t("PASSA A PRO — 7,99 €/mese")}</Link>
                <p className="text-center text-xs text-muted-foreground">{t(PRO_PRICE_FULL)}</p>
              </>
            )}
          </Section>

          <button onClick={logout} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border bg-card text-sm font-semibold text-destructive">
            <LogOut className="h-4 w-4" /> {t("Esci")}
          </button>
          <div className="space-y-2 pt-2 text-center text-xs text-muted-foreground">
            <p className="flex justify-center gap-4 font-semibold">
              <Link to="/privacy" className="underline">Privacy</Link>
              <Link to="/termini" className="underline">{t("Termini")}</Link>
              <a href={deletionMailto(profile?.email)} className="underline">{t("Richiedi cancellazione account")}</a>
            </p>
            <p>{t(BRAND_CREDIT)}</p>
          </div>
        </div>
      </Page>
    </>
  );
}