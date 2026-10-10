import { createFileRoute } from "@tanstack/react-router";
import { TradeLanding, tradeHead, type TradeCopy } from "@/components/TradeLanding";

export const Route = createFileRoute("/preventivo-elettricista")({
  staticData: { sitemap: true },
  head: () =>
    tradeHead(
      "/preventivo-elettricista",
      "Preventivo elettricista dal telefono — QuickQuote",
      "Crea un preventivo da elettricista con manodopera, materiali, sconto e IVA calcolati in automatico. Invialo su WhatsApp o in PDF con il tuo logo. 5 preventivi gratis.",
    ),
  component: () => <TradeLanding it={IT} en={EN} />,
});

const IT: TradeCopy = {
  h1: "Preventivo da elettricista, chiaro e veloce",
  intro:
    "Un punto luce in più, un quadro da sostituire, un impianto da adeguare: il cliente vuole sapere subito quanto costa. Con QuickQuote prepari il preventivo dal telefono e lo invii prima di lasciare il cantiere.",
  why: {
    title: "Cosa mettere in un preventivo da elettricista",
    items: [
      "Descrizione chiara dell'intervento, così il cliente sa cosa è incluso.",
      "Manodopera e materiali (cavi, frutti, interruttori, quadri) come voci separate.",
      "Sconto e IVA (22%, 10%, 4% o 0%) con imponibile e totale calcolati in automatico.",
      "Intestazione con nome attività, Partita IVA, contatti e logo.",
      "Note finali per validità dell'offerta, tempi o condizioni di pagamento.",
    ],
  },
  example: {
    title: "Esempio: sostituzione quadro elettrico",
    lines: [
      ["Manodopera", "240,00 €"],
      ["Materiali", "310,00 €"],
      ["Sconto", "−50,00 €"],
      ["Imponibile", "500,00 €"],
      ["IVA 22%", "110,00 €"],
      ["Totale", "610,00 €"],
    ],
    note: "Importi di esempio. L'aliquota IVA corretta per il tuo lavoro dipende dal caso: verificala con il tuo commercialista.",
  },
  steps: {
    title: "Come si fa in 3 passaggi",
    items: [
      ["Cliente e intervento", "Nome del cliente, titolo e descrizione del lavoro."],
      ["Costi", "Manodopera, materiali, sconto e IVA: il totale si calcola da solo."],
      ["Invio", "WhatsApp, email, PDF con il tuo logo o stampa."],
    ],
  },
  faq: {
    title: "Domande frequenti",
    items: [
      [
        "Posso ritrovare i preventivi inviati?",
        "Sì, restano nell'elenco Preventivi con ricerca e filtri per stato, e ogni cliente ha il suo storico.",
      ],
      [
        "Funziona su Android?",
        "Sì, è pensata per il telefono: si apre dal browser e si può aggiungere alla schermata Home.",
      ],
      [
        "Quanto costa?",
        "I primi 5 preventivi sono gratuiti, senza carta di credito. Poi il piano Pro dà preventivi illimitati.",
      ],
      [
        "Posso cambiare l'IVA per ogni preventivo?",
        "Sì, scegli l'aliquota in ogni preventivo; quella predefinita si imposta nelle Impostazioni.",
      ],
    ],
  },
  other: { to: "/preventivo-idraulico", label: "Preventivo idraulico" },
};

const EN: TradeCopy = {
  h1: "Electrician quotes, clear and fast",
  intro:
    "An extra light point, a consumer unit to replace, a system to bring up to standard: the customer wants to know the price right away. With QuickQuote you prepare the quote on your phone and send it before leaving the site.",
  why: {
    title: "What to include in an electrician's quote",
    items: [
      "A clear description of the job, so the customer knows what's included.",
      "Labour and materials (cables, sockets, switches, panels) as separate lines.",
      "Discount and VAT (22%, 10%, 4% or 0%) with taxable amount and total calculated automatically.",
      "A header with business name, VAT number, contacts and logo.",
      "Closing notes on offer validity, timing or payment terms.",
    ],
  },
  example: {
    title: "Example: consumer unit replacement",
    lines: [
      ["Labour", "€240.00"],
      ["Materials", "€310.00"],
      ["Discount", "−€50.00"],
      ["Taxable amount", "€500.00"],
      ["VAT 22%", "€110.00"],
      ["Total", "€610.00"],
    ],
    note: "Example amounts. The right VAT rate for your job depends on the case: check with your accountant.",
  },
  steps: {
    title: "How it works in 3 steps",
    items: [
      ["Customer and job", "Customer name, title and job description."],
      ["Costs", "Labour, materials, discount and VAT: the total is calculated for you."],
      ["Send", "WhatsApp, email, PDF with your logo, or print."],
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      [
        "Can I find sent quotes again?",
        "Yes, they stay in the Quotes list with search and status filters, and each customer has their own history.",
      ],
      [
        "Does it work on Android?",
        "Yes, it's built for phones: open it in the browser and add it to your Home screen.",
      ],
      [
        "How much does it cost?",
        "Your first 5 quotes are free, no credit card needed. The Pro plan then gives unlimited quotes.",
      ],
      [
        "Can I change VAT on each quote?",
        "Yes, pick the rate on each quote; the default is set in Settings.",
      ],
    ],
  },
  other: { to: "/preventivo-idraulico", label: "Plumbing quotes" },
};