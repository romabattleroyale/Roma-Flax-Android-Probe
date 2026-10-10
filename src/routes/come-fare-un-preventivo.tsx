import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { getLang, t } from "@/lib/i18n";
import { BRAND_CREDIT } from "@/lib/legal";
import { LangSwitch } from "@/components/LangSwitch";
import { SITE_URL, breadcrumbLd, pageHead } from "@/lib/seo";

const PATH = "/come-fare-un-preventivo";
const TITLE = "Come fare un preventivo professionale: guida ed esempio — QuickQuote";
const DESC =
  "Cosa scrivere in un preventivo per lavori: dati obbligatori utili, voci, IVA, validità e condizioni. Con esempio compilabile e checklist da copiare.";

export const Route = createFileRoute("/come-fare-un-preventivo")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(PATH, TITLE, DESC, [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Come fare un preventivo professionale",
        description: DESC,
        inLanguage: "it",
        datePublished: "2026-10-09",
        dateModified: "2026-10-09",
        mainEntityOfPage: SITE_URL + PATH,
        author: { "@type": "Organization", name: "ReplyToolsLab", url: `${SITE_URL}/` },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      breadcrumbLd(PATH, "Come fare un preventivo"),
    ]),
  component: Guide,
});

type Copy = {
  h1: string;
  intro: string;
  sections: { id: string; h: string; p?: string; items?: string[] }[];
  exTitle: string;
  exIntro: string;
  ex: [string, string][];
  exNote: string;
  checkTitle: string;
  check: string[];
  mistakesTitle: string;
  mistakes: [string, string][];
  ctaTitle: string;
  ctaText: string;
};

const IT: Copy = {
  h1: "Come fare un preventivo professionale",
  intro:
    "Un buon preventivo fa capire al cliente cosa farai, quanto costa e a quali condizioni. Ecco come strutturarlo, con un esempio da copiare e gli errori più comuni da evitare.",
  sections: [
    {
      id: "intestazione",
      h: "1. Intestazione: chi sei e a chi scrivi",
      items: [
        "I tuoi dati: nome dell'attività, Partita IVA, indirizzo, telefono, email ed eventualmente il logo.",
        "I dati del cliente: nome e cognome o ragione sociale, telefono o email, indirizzo del lavoro se diverso.",
        "Numero e data del preventivo, per ritrovarlo e citarlo facilmente (es. 2026-001).",
      ],
    },
    {
      id: "oggetto",
      h: "2. Oggetto e descrizione del lavoro",
      p: "Scrivi in una riga cosa farai (es. \"Sostituzione miscelatore bagno\") e poi descrivi in modo concreto le attività incluse. Indica anche cosa NON è incluso: è la fonte più comune di discussioni a fine lavoro.",
    },
    {
      id: "voci",
      h: "3. Voci di costo separate",
      items: [
        "Manodopera: a corpo oppure ore × tariffa oraria.",
        "Materiali: anche raggruppati, purché il cliente capisca cosa paga.",
        "Eventuali altre voci: uscita, smaltimento, noleggio attrezzature.",
        "Sconto, se previsto, indicato come importo chiaro.",
      ],
    },
    {
      id: "iva",
      h: "4. Imponibile, IVA e totale",
      p: "Mostra il subtotale, lo sconto, l'imponibile, l'aliquota IVA applicata con il suo importo e il totale finale ben in evidenza. L'aliquota corretta (22%, 10%, 4% o esente) dipende dal tipo di lavoro e di cliente: in caso di dubbio chiedi al tuo commercialista.",
    },
    {
      id: "condizioni",
      h: "5. Validità e condizioni",
      items: [
        "Validità dell'offerta (es. 30 giorni).",
        "Tempi indicativi di esecuzione.",
        "Modalità di pagamento (es. acconto, saldo a fine lavori, bonifico).",
        "Spazio per l'accettazione del cliente, anche solo una risposta scritta.",
      ],
    },
  ],
  exTitle: "Esempio compilabile",
  exIntro: "Sostituisci i valori tra parentesi con i tuoi. Gli importi sono solo un esempio.",
  ex: [
    ["Attività", "[Nome attività] — P.IVA [00000000000]"],
    ["Cliente", "[Mario Rossi] — [telefono]"],
    ["Preventivo n.", "[2026-001] del [data]"],
    ["Oggetto", "[Sostituzione miscelatore bagno]"],
    ["Manodopera", "150,00 €"],
    ["Materiali", "80,00 €"],
    ["Imponibile", "230,00 €"],
    ["IVA 22%", "50,60 €"],
    ["Totale", "280,60 €"],
  ],
  exNote: "Validità: [30 giorni]. Pagamento: [saldo a fine lavori]. Non incluso: [opere murarie].",
  checkTitle: "Checklist prima di inviare",
  check: [
    "Dati tuoi e del cliente completi e corretti",
    "Numero e data presenti",
    "Lavoro descritto, con cosa è escluso",
    "Manodopera e materiali separati",
    "IVA e totale calcolati correttamente",
    "Validità e modalità di pagamento indicate",
    "Inviato in un formato che il cliente apre ovunque (PDF o messaggio)",
  ],
  mistakesTitle: "Errori comuni",
  mistakes: [
    ["Solo il totale", "Senza voci il cliente non capisce il prezzo e tende a contrattare."],
    ["Descrizione vaga", "\"Lavori idraulici\" non dice cosa è incluso: meglio elencare le attività."],
    ["Nessuna scadenza", "Senza validità rischi di dover rispettare prezzi vecchi mesi dopo."],
    ["Inviarlo tardi", "Il cliente spesso sceglie chi risponde per primo: meglio mandarlo subito."],
  ],
  ctaTitle: "Fallo dal telefono con QuickQuote",
  ctaText:
    "QuickQuote ha già questa struttura: inserisci cliente, manodopera, materiali, sconto e IVA, e ottieni un preventivo con il tuo logo da inviare su WhatsApp o in PDF. I primi 5 preventivi sono gratuiti.",
};

const EN: Copy = {
  h1: "How to write a professional quote",
  intro:
    "A good quote tells the customer what you'll do, what it costs and on what terms. Here's how to structure it, with an example to copy and common mistakes to avoid.",
  sections: [
    {
      id: "intestazione",
      h: "1. Header: who you are and who it's for",
      items: [
        "Your details: business name, VAT number, address, phone, email and your logo if you have one.",
        "Customer details: name or company, phone or email, job address if different.",
        "Quote number and date, so it's easy to find and refer to (e.g. 2026-001).",
      ],
    },
    {
      id: "oggetto",
      h: "2. Subject and job description",
      p: "Write one line saying what you'll do (e.g. \"Bathroom mixer tap replacement\"), then describe the included work concretely. Also state what is NOT included: it's the most common cause of disputes at the end of a job.",
    },
    {
      id: "voci",
      h: "3. Separate cost items",
      items: [
        "Labour: fixed price or hours × hourly rate.",
        "Materials: grouped is fine, as long as the customer understands what they pay for.",
        "Other items if any: call-out, disposal, equipment hire.",
        "Discount, if any, as a clear amount.",
      ],
    },
    {
      id: "iva",
      h: "4. Taxable amount, VAT and total",
      p: "Show subtotal, discount, taxable amount, the VAT rate with its amount, and a clearly highlighted final total. The correct VAT rate depends on the job and the customer: if in doubt, ask your accountant.",
    },
    {
      id: "condizioni",
      h: "5. Validity and terms",
      items: [
        "Offer validity (e.g. 30 days).",
        "Estimated timing.",
        "Payment terms (e.g. deposit, balance on completion, bank transfer).",
        "A way for the customer to accept, even just a written reply.",
      ],
    },
  ],
  exTitle: "Fill-in example",
  exIntro: "Replace the values in brackets with yours. Amounts are only an example.",
  ex: [
    ["Business", "[Business name] — VAT [00000000000]"],
    ["Customer", "[John Smith] — [phone]"],
    ["Quote no.", "[2026-001] dated [date]"],
    ["Subject", "[Bathroom mixer tap replacement]"],
    ["Labour", "€150.00"],
    ["Materials", "€80.00"],
    ["Taxable", "€230.00"],
    ["VAT 22%", "€50.60"],
    ["Total", "€280.60"],
  ],
  exNote: "Valid for: [30 days]. Payment: [on completion]. Not included: [masonry work].",
  checkTitle: "Checklist before sending",
  check: [
    "Your and the customer's details complete and correct",
    "Number and date present",
    "Job described, including what's excluded",
    "Labour and materials separated",
    "VAT and total calculated correctly",
    "Validity and payment terms stated",
    "Sent in a format the customer can open anywhere (PDF or message)",
  ],
  mistakesTitle: "Common mistakes",
  mistakes: [
    ["Total only", "Without items the customer can't understand the price and tends to haggle."],
    ["Vague description", "\"Plumbing work\" doesn't say what's included: list the tasks."],
    ["No expiry", "Without a validity period you may have to honour old prices months later."],
    ["Sending it late", "Customers often pick whoever answers first: send it right away."],
  ],
  ctaTitle: "Do it from your phone with QuickQuote",
  ctaText:
    "QuickQuote already uses this structure: enter customer, labour, materials, discount and VAT, and get a quote with your logo to send on WhatsApp or as a PDF. Your first 5 quotes are free.",
};

const h2 = "text-2xl font-extrabold tracking-tight";

function Guide() {
  const c = getLang() === "en" ? EN : IT;
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
          <article>
            <h1 className="mt-10 text-3xl font-extrabold leading-tight tracking-tight">{c.h1}</h1>
            <p className="mt-4 text-navy-foreground/80">{c.intro}</p>

            <nav className="mt-8 rounded-2xl border border-navy-soft p-5 text-sm" aria-label="Indice">
              <ol className="space-y-2">
                {c.sections.map((s) => (
                  <li key={s.id}>
                    <a className="underline-offset-4 hover:underline" href={`#${s.id}`}>{s.h}</a>
                  </li>
                ))}
                <li><a className="underline-offset-4 hover:underline" href="#esempio">{c.exTitle}</a></li>
                <li><a className="underline-offset-4 hover:underline" href="#checklist">{c.checkTitle}</a></li>
              </ol>
            </nav>

            {c.sections.map((s) => (
              <section key={s.id} id={s.id} className="mt-12 scroll-mt-6">
                <h2 className={h2}>{s.h}</h2>
                {s.p && <p className="mt-4 text-sm text-navy-foreground/80">{s.p}</p>}
                {s.items && (
                  <ul className="mt-4 space-y-3 text-sm">
                    {s.items.map((i) => (
                      <li key={i} className="flex gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                        {i}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section id="esempio" className="mt-12 scroll-mt-6">
              <h2 className={h2}>{c.exTitle}</h2>
              <p className="mt-3 text-sm text-navy-foreground/70">{c.exIntro}</p>
              <dl className="mt-5 space-y-2 rounded-2xl border border-navy-soft p-5 text-sm">
                {c.ex.map(([k, v], i) => (
                  <div
                    key={k}
                    className={`num grid grid-cols-[auto_minmax(0,1fr)] gap-4 ${i === c.ex.length - 1 ? "border-t border-navy-soft pt-3 text-base font-extrabold" : ""}`}
                  >
                    <dt>{k}</dt>
                    <dd className="text-right break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-navy-foreground/60">{c.exNote}</p>
            </section>

            <section id="checklist" className="mt-12 scroll-mt-6">
              <h2 className={h2}>{c.checkTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {c.check.map((i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className={h2}>{c.mistakesTitle}</h2>
              <div className="mt-5 space-y-5">
                {c.mistakes.map(([q, a]) => (
                  <div key={q}>
                    <h3 className="font-bold">{q}</h3>
                    <p className="mt-1 text-sm text-navy-foreground/70">{a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-2xl border-2 border-primary bg-navy-soft p-5">
              <h2 className="text-xl font-extrabold tracking-tight">{c.ctaTitle}</h2>
              <p className="mt-3 text-sm text-navy-foreground/80">{c.ctaText}</p>
              <div className="mt-5">{cta}</div>
            </section>
          </article>
        </main>

        <footer className="mt-14 border-t border-navy-soft pt-6 text-center text-xs text-navy-foreground/60">
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold">
            <Link to="/">{t("Home")}</Link>
            <Link to="/preventivo-idraulico">{t("Idraulici")}</Link>
            <Link to="/preventivo-elettricista">{t("Elettricisti")}</Link>
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