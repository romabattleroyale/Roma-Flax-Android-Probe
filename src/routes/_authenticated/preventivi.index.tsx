import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { t } from "@/lib/i18n";
import { PageHeader, Page } from "@/components/AppShell";
import { inputCls } from "@/components/Field";
import { quotesQuery } from "@/lib/data";
import { STATUS_CLASS, STATUS_LABEL, dateIt, euro, type QuoteStatus } from "@/lib/quote";

export const Route = createFileRoute("/_authenticated/preventivi/")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Preventivi — QuickQuote" }, { name: "description", content: "Tutti i tuoi preventivi." }, { property: "og:title", content: "Preventivi — QuickQuote" }, { property: "og:description", content: "Tutti i tuoi preventivi." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: QuotesList,
});

function QuotesList() {
  const { data: quotes = [], isLoading } = useQuery(quotesQuery);
  const [filter, setFilter] = useState<QuoteStatus | "all">("all");
  const [q, setQ] = useState("");
  const list = quotes.filter(
    (x) => (filter === "all" || x.status === filter) &&
      (!q || `${x.customer_name} ${x.number} ${x.title}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHeader
        title={t("Preventivi")}
        right={<Link to="/preventivi/nuovo" className="flex h-10 items-center gap-1 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"><Plus className="h-4 w-4" />{t("Nuovo")}</Link>}
      />
      <Page>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className={`${inputCls} pl-11`} placeholder={t("Cerca cliente, numero, lavoro")} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {(["all", "bozza", "inviato", "accettato", "rifiutato"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold ${filter === s ? "bg-navy text-navy-foreground" : "border bg-card text-muted-foreground"}`}>
              {s === "all" ? t("Tutti") : t(STATUS_LABEL[s])} <span className="opacity-60">{s === "all" ? quotes.length : quotes.filter((x) => x.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {isLoading && <p className="text-muted-foreground">{t("Caricamento…")}</p>}
          {!isLoading && list.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">{t("Nessun preventivo trovato.")}</p>
              <Link to="/preventivi/nuovo" className="mt-4 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-bold text-primary-foreground"><Plus className="h-5 w-5" />{t("Nuovo preventivo")}</Link>
            </div>
          )}
          {list.map((x) => (
            <Link key={x.id} to="/preventivi/$id" params={{ id: x.id }} className="block rounded-2xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold">{x.customer_name}</p>
                  <p className="truncate text-sm text-muted-foreground">{x.title}</p>
                </div>
                <p className="num shrink-0 text-base font-extrabold">{euro(Number(x.total))}</p>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="num">{t("N.")} {x.number} · {dateIt(x.quote_date)}</span>
                <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_CLASS[x.status]}`}>{t(STATUS_LABEL[x.status])}</span>
              </div>
            </Link>
          ))}
        </div>
      </Page>
    </>
  );
}