import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { getLang, t } from "@/lib/i18n";
import { PRO_PRICE_FULL } from "@/lib/quote";
import { BRAND_CREDIT } from "@/lib/legal";
import { LangSwitch } from "@/components/LangSwitch";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export type TradeCopy = {
  h1: string;
  intro: string;
  why: { title: string; items: string[] };
  example: { title: string; lines: [string, string][]; note: string };
  steps: { title: string; items: [string, string][] };
  faq: { title: string; items: [string, string][] };
  other: { to: "/preventivo-idraulico" | "/preventivo-elettricista"; label: string };
};

/** Public SEO landing for one trade; copy is passed in both languages. */
export function TradeLanding({ it, en }: { it: TradeCopy; en: TradeCopy }) {
  const c = getLang() === "en" ? en : it;
  const cta = (
    <Link
      to="/auth"
      search={{ mode: "signup" }}
      className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground"
    >
      {t("Inizia gratis")}
    </Link>
  );
  return (
    <div className="min-h-screen bg-navy text-navy-foreground">
      <div className="mx-auto w-full max-w-md px-6 pb-10 pt-10">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icon-192.png" alt="" width={32} height={32} className="rounded-lg" />
          <span className="font-extrabold tracking-tight">QuickQuote</span>
        </Link>
        <main>
          <h1 className="mt-10 text-3xl font-extrabold leading-tight tracking-tight">{c.h1}</h1>
          <p className="mt-4 text-navy-foreground/80">{c.intro}</p>
          <div className="mt-8">{cta}</div>

          <section className="mt-14" aria-labelledby="why">
            <h2 id="why" className="text-2xl font-extrabold tracking-tight">
              {c.why.title}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {c.why.items.map((s) => (
                <li key={s} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="ex">
            <h2 id="ex" className="text-2xl font-extrabold tracking-tight">
              {c.example.title}
            </h2>
            <dl className="mt-5 space-y-2 rounded-2xl border border-navy-soft p-5 text-sm">
              {c.example.lines.map(([k, v], i) => (
                <div
                  key={k}
                  className={`num flex justify-between gap-4 ${i === c.example.lines.length - 1 ? "border-t border-navy-soft pt-3 text-base font-extrabold" : ""}`}
                >
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-navy-foreground/60">{c.example.note}</p>
            <div className="mt-6">{cta}</div>
          </section>

          <section className="mt-14" aria-labelledby="steps">
            <h2 id="steps" className="text-2xl font-extrabold tracking-tight">
              {c.steps.title}
            </h2>
            <ol className="mt-5 space-y-4">
              {c.steps.items.map(([h, d], i) => (
                <li key={h} className="flex gap-4">
                  <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-extrabold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold">{h}</p>
                    <p className="text-sm text-navy-foreground/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14" aria-labelledby="faq">
            <h2 id="faq" className="text-2xl font-extrabold tracking-tight">
              {c.faq.title}
            </h2>
            <div className="mt-5 space-y-5">
              {c.faq.items.map(([q, a]) => (
                <div key={q}>
                  <h3 className="font-bold">{q}</h3>
                  <p className="mt-1 text-sm text-navy-foreground/70">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="price">
            <h2 id="price" className="text-2xl font-extrabold tracking-tight">
              {t("Prezzi e limiti della prova")}
            </h2>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-navy-soft p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy-foreground/60">
                  Free
                </p>
                <p className="mt-1 text-lg font-extrabold">{t("5 preventivi gratuiti")}</p>
                <p className="mt-1 text-sm text-navy-foreground/70">
                  {t(
                    "5 preventivi in totale per account, con tutte le funzioni e senza carta di credito. Raggiunto il limite, per crearne altri serve il piano Pro; i preventivi già creati restano consultabili.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-primary bg-navy-soft p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Pro</p>
                <p className="mt-1 text-lg font-extrabold">{t("Preventivi illimitati")}</p>
                <p className="num mt-1 text-sm font-semibold">{t(PRO_PRICE_FULL)}</p>
                <p className="mt-1 text-sm text-navy-foreground/70">
                  {t(
                    "Abbonamento mensile con pagamento sicuro tramite Stripe, che puoi gestire o disdire dall'app.",
                  )}
                </p>
              </div>
            </div>
            <div className="mt-5">{cta}</div>
          </section>
        </main>

        <footer className="mt-14 border-t border-navy-soft pt-6 text-center text-xs text-navy-foreground/60">
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold">
            <Link to="/">{t("Home")}</Link>
            <Link to={c.other.to}>{c.other.label}</Link>
            <Link to="/come-fare-un-preventivo">{t("Guida al preventivo")}</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/termini">{t("Termini")}</Link>
          </nav>
          <LangSwitch className="mt-4" />
          <p className="mt-3">{t(BRAND_CREDIT)}</p>
        </footer>
      </div>
    </div>
  );
}

export function tradeHead(path: string, title: string, description: string) {
  return pageHead(path, title, description, [breadcrumbLd(path, title.split(" — ")[0] ?? title)]);
}