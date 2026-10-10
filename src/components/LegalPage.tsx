import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BRAND_CREDIT, legalUpdated } from "@/lib/legal";
import { getLang, t } from "@/lib/i18n";
import { LangSwitch } from "@/components/LangSwitch";

/* Placeholder for legal data the owner must still provide (never invented). */
export function Todo({ it, en }: { it: string; en: string }) {
  return <mark className="rounded bg-accent px-1 font-semibold text-accent-foreground">[{getLang() === "en" ? `TO BE COMPLETED: ${en}` : `DA COMPLETARE: ${it}`}]</mark>;
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const en = getLang() === "en";
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy text-navy-foreground">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4">
          <Link to="/" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full" aria-label={t("Indietro")}><ChevronLeft className="h-6 w-6" /></Link>
          <span className="flex-1 font-extrabold">QuickQuote</span>
          <LangSwitch className="text-xs" />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-6">
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{t("Ultimo aggiornamento:")} {legalUpdated()}</p>
        <p role="note" className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
          {en
            ? "Draft: fields marked “TO BE COMPLETED” (legal and tax details) must be completed and reviewed by the owner or a legal advisor before actual commercial activity begins."
            : "Bozza: i campi “DA COMPLETARE” (dati legali e fiscali) devono essere completati e revisionati dal titolare o da un consulente legale prima dell'effettiva attività commerciale."}
        </p>
        <div className="mt-6 space-y-5 text-sm leading-relaxed [&_h2]:mb-1.5 [&_h2]:text-base [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">{children}</div>
        <p className="mt-10 text-center text-xs text-muted-foreground">{t(BRAND_CREDIT)}</p>
      </main>
    </div>
  );
}