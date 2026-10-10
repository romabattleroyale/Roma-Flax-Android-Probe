import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Share2, Printer, FileDown, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/lib/i18n";
import { PageHeader, Page } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { businessQuery, quoteQuery, type Business, type Quote, type QuoteItem } from "@/lib/data";
import { STATUS_LABEL, dateIt, euro, type QuoteStatus } from "@/lib/quote";
import { businessLogoQuery, LOGO_BUCKET } from "@/lib/business-logo";

export const Route = createFileRoute("/_authenticated/preventivi/$id")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Anteprima preventivo — QuickQuote" },
    { name: "description", content: "Riepilogo degli importi e condivisione del tuo preventivo professionale." },
    { property: "og:title", content: "Anteprima preventivo — QuickQuote" },
    { property: "og:description", content: "Riepilogo degli importi e condivisione del tuo preventivo professionale." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Preview,
});

function quoteText(q: Quote, items: QuoteItem[], b?: Business) {
  const lines = [
    `${t("PREVENTIVO N.")} ${q.number} — ${dateIt(q.quote_date)}`,
    b?.business_name || q.business_name || "",
    "",
    `${t("Cliente:")} ${q.customer_name}`,
    `${t("Lavoro:")} ${q.title}`,
    q.description ? `\n${q.description}\n` : "",
    ...items.filter((i) => Number(i.amount) > 0).map((i) => `${t(i.label)}: ${euro(Number(i.amount))}`),
    `${t("Subtotale")}: ${euro(Number(q.subtotal))}`,
    Number(q.discount) > 0 ? `${t("Sconto")}: −${euro(Number(q.discount))}` : "",
    `${t("Imponibile")}: ${euro(Number(q.taxable))}`,
    `${t("IVA")} ${Number(q.vat_rate)}%: ${euro(Number(q.vat_amount))}`,
    `${t("TOTALE")}: ${euro(Number(q.total))}`,
  ];
  return lines.filter((l) => l !== "").join("\n");
}

function Preview() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(quoteQuery(id));
  const { data: biz } = useQuery(businessQuery);
  const { data: logo, isPending: logoPending, isError: logoError } = useQuery(businessLogoQuery(biz?.logo_path));
  const { data: shareFile } = useQuery({
    queryKey: ["quote-logo-share", data, biz, logo],
    enabled: Boolean(data && logo),
    queryFn: async () => {
      if (!data || !logo) return null;
      const { createQuotePdf, quotePdfFilename } = await import("@/lib/quote-pdf");
      return new File([createQuotePdf(data.quote, data.items, biz, logo).output("blob")], quotePdfFilename(data.quote), { type: "application/pdf" });
    },
  });
  const logoUnavailable = Boolean(biz?.logo_path && (logoPending || logoError));

  if (isLoading || !data) return <><PageHeader title={t("Preventivo")} back="/preventivi" /><Page><p className="text-muted-foreground">{t("Caricamento…")}</p></Page></>;
  const { quote: q, items } = data;
  const text = quoteText(q, items, biz);

  async function setStatus(status: QuoteStatus) {
    const { error } = await supabase.from("quotes").update({ status }).eq("id", q.id);
    if (error) return void toast.error(error.message);
    qc.invalidateQueries();
    toast.success(`${t("Stato")}: ${t(STATUS_LABEL[status])}`);
  }
  async function copy() {
    await navigator.clipboard.writeText(text);
    toast.success(t("Preventivo copiato"));
  }
  async function share() {
    if (biz?.logo_path && (logoUnavailable || !shareFile)) {
      toast.error(t(t(t(t("Logo non ancora disponibile. Riprova tra un momento.")))));
      return;
    }
    if (navigator.share) {
      try {
        if (shareFile && navigator.canShare?.({ files: [shareFile] })) {
          await navigator.share({ title: `${t("Preventivo")} ${q.number}`, text, files: [shareFile] });
        } else if (biz?.logo_path) {
          const { data: link, error } = await supabase.storage.from(LOGO_BUCKET).createSignedUrl(biz.logo_path, 604800);
          if (error) throw error;
          await navigator.share({ title: `${t("Preventivo")} ${q.number}`, text: `${text}\n${link.signedUrl}` });
        } else await navigator.share({ title: `${t("Preventivo")} ${q.number}`, text });
        if (q.status === "bozza") setStatus("inviato");
      } catch { /* annullato */ }
    } else {
      if (!biz?.logo_path) {
        window.open(`https://wa.me/${(q.customer_phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
        return;
      }
      const target = window.open("about:blank", "_blank");
      let sharedText = text;
      if (biz?.logo_path) {
        const { data: link } = await supabase.storage.from(LOGO_BUCKET).createSignedUrl(biz.logo_path, 604800);
        if (link) sharedText += `\n${link.signedUrl}`;
      }
      if (target) target.location.href = `https://wa.me/${(q.customer_phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(sharedText)}`;
    }
  }
  function print() {
    if (logoUnavailable) return void toast.error("Logo non ancora disponibile. Riprova tra un momento.");
    const prev = document.title;
    document.title = `${t("Preventivo")}-${q.number}`;
    window.print();
    document.title = prev;
  }
  async function savePdf() {
    if (logoUnavailable) return void toast.error("Logo non ancora disponibile. Riprova tra un momento.");
    try {
      const { downloadQuotePdf } = await import("@/lib/quote-pdf");
      downloadQuotePdf(q, items, biz, logo);
    } catch {
      toast.error(t("Impossibile scaricare il PDF. Riprova."));
    }
  }
  async function remove() {
    if (!confirm(t("Eliminare questo preventivo?"))) return;
    const { error } = await supabase.from("quotes").delete().eq("id", q.id);
    if (error) return void toast.error(error.message);
    await qc.invalidateQueries();
    navigate({ to: "/preventivi" });
  }

  return (
    <>
      <PageHeader
        title={`${t("Preventivo")} ${q.number}`}
        back="/preventivi"
        right={
          <Link to="/preventivi/nuovo" search={{ edit: q.id }} className="flex h-10 items-center gap-1 rounded-full bg-navy-soft px-3 text-sm font-semibold">
            <Pencil className="h-4 w-4" /> {t("Modifica")}
          </Link>
        }
      />
      <main className="mx-auto max-w-2xl px-4 pt-3 pb-[calc(12rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(10rem+env(safe-area-inset-bottom))]">
        <div className="no-print mb-4 flex gap-1 rounded-xl bg-muted p-1">
          {(Object.keys(STATUS_LABEL) as QuoteStatus[]).map((s) => (
            <Button variant="ghost" key={s} onClick={() => setStatus(s)} className={`h-10 min-w-0 flex-1 px-1 rounded-lg text-xs font-bold ${q.status === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t(STATUS_LABEL[s])}
            </Button>
          ))}
        </div>

        <article className="print-sheet rounded-2xl border bg-card p-5 text-sm shadow-sm sm:p-8">
          <header className="flex items-start justify-between gap-4 border-b pb-5">
            <div className="flex min-w-0 items-start gap-2 sm:gap-3">
              {logo && <img src={logo} alt={t("Logo azienda")} className="h-10 w-10 shrink-0 object-contain sm:h-16 sm:w-16" />}
              <div className="min-w-0 break-words">
              <p className="text-lg font-extrabold leading-tight">{biz?.business_name || q.business_name}</p>
              <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {biz?.address && <p>{biz.address}</p>}
                {biz?.vat_number && <p>{t("P.IVA")} {biz.vat_number}</p>}
                {(biz?.phone || biz?.email) && <p>{[biz?.phone, biz?.email].filter(Boolean).join(" · ")}</p>}
              </div>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">{t("Preventivo")}</p>
              <p className="num text-base font-extrabold">{t("N.")} {q.number}</p>
              <p className="text-xs text-muted-foreground">{dateIt(q.quote_date)}</p>
            </div>
          </header>

          <section className="border-b py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Cliente")}</p>
            <p className="mt-1 font-bold">{q.customer_name}</p>
            {q.customer_phone && <p className="text-xs text-muted-foreground">{q.customer_phone}</p>}
            {q.customer_email && <p className="text-xs text-muted-foreground">{q.customer_email}</p>}
          </section>

          <section className="border-b py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Oggetto")}</p>
            <p className="mt-1 text-base font-bold">{q.title}</p>
            {q.description && <p className="mt-2 whitespace-pre-line text-foreground/80">{q.description}</p>}
          </section>

          <section className="num py-4" aria-label={t("Voci del preventivo")}>
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="pb-2 text-left font-bold">{t("Voce")}</th>
                  <th className="pb-2 text-right font-bold">{t("Importo")}</th>
                </tr>
              </thead>
              <tbody>
                {items.filter((i) => Number(i.amount) > 0).map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="py-2.5">{t(i.label)}</td>
                    <td className="py-2.5 text-right font-semibold">{euro(Number(i.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {biz?.notes && <p className="border-t py-4 text-xs whitespace-pre-line text-muted-foreground">{biz.notes}</p>}

          <section className="num border-t pt-4" aria-label={t("Riepilogo finale")}>
            <dl className="space-y-3">
              <Line k="Subtotale" v={euro(Number(q.subtotal))} />
              <Line k="Sconto" v={`${Number(q.discount) > 0 ? "− " : ""}${euro(Number(q.discount))}`} />
              <Line k="Imponibile" v={euro(Number(q.taxable))} />
              <Line k={`${t("IVA")} ${Number(q.vat_rate)}%`} v={euro(Number(q.vat_amount))} />
              <div className="mt-4 rounded-xl bg-navy p-4 text-navy-foreground">
                <dt className="text-sm font-bold">{t("TOTALE FINALE")}</dt>
                <dd className="mt-1 break-words text-3xl font-extrabold leading-tight text-primary">{euro(Number(q.total))}</dd>
              </div>
            </dl>
          </section>
        </article>

        <section className="no-print mt-3 grid grid-cols-2 gap-2" aria-label={t("Azioni preventivo")}>
          <Button onClick={share} disabled={Boolean(biz?.logo_path && (logoPending || (!logoError && !shareFile)))} className="col-span-2 h-14 rounded-xl text-base font-extrabold"><Share2 /> {t("CONDIVIDI")}</Button>
          <Button variant="outline" onClick={savePdf} className="h-12 rounded-xl bg-card text-xs font-bold"><FileDown /> {t("SALVA PDF")}</Button>
          <Button variant="outline" onClick={copy} className="h-12 rounded-xl bg-card text-xs font-bold"><Copy /> {t("COPIA")}</Button>
          <Button variant="ghost" onClick={print} className="col-span-2 h-12"><Printer /> {t("Stampa")}</Button>
        </section>
        <Button variant="ghost" onClick={remove} className="no-print mt-3 h-12 w-full rounded-xl text-sm font-semibold text-destructive">
          <Trash2 /> {t("Elimina preventivo")}
        </Button>
      </main>
    </>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
      <dt className="text-muted-foreground">{t(k)}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  );
}