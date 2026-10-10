import { Link } from "@tanstack/react-router";
import { Home, FileText, Plus, Users, Settings, ChevronLeft } from "lucide-react";
import { t } from "@/lib/i18n";
import type { ReactNode } from "react";

export function PageHeader({ title, back, right }: { title: string; back?: string; right?: ReactNode }) {
  return (
    <header className="no-print sticky top-0 z-20 bg-navy text-navy-foreground">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4">
        {back && (
          <Link to={back} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-navy-soft" aria-label={t("Indietro")}>
            <ChevronLeft className="h-6 w-6" />
          </Link>
        )}
        <h1 className="flex-1 truncate text-lg font-bold tracking-tight">{title}</h1>
        {right}
      </div>
    </header>
  );
}

const item = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted-foreground";
const active = { className: "text-navy" };

export function BottomNav() {
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t bg-card safe-bottom">
      <div className="mx-auto flex max-w-2xl items-end px-2">
        <Link to="/dashboard" className={item} activeProps={active}><Home className="h-5 w-5" />{t("Home")}</Link>
        <Link to="/preventivi" className={item} activeProps={active} activeOptions={{ exact: true }}><FileText className="h-5 w-5" />{t("Preventivi")}</Link>
        <Link to="/preventivi/nuovo" className="-mt-6 flex flex-1 flex-col items-center gap-1 text-[11px] font-bold text-navy" aria-label={t("Nuovo preventivo")}>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-card">
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </span>
          {t("Nuovo")}
        </Link>
        <Link to="/clienti" className={item} activeProps={active}><Users className="h-5 w-5" />{t("Clienti")}</Link>
        <Link to="/impostazioni" className={item} activeProps={active}><Settings className="h-5 w-5" />{t("Impostazioni")}</Link>
      </div>
    </nav>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-2xl px-4 pb-32 pt-4">{children}</main>;
}