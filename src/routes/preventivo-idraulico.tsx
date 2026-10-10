import { createFileRoute } from "@tanstack/react-router";
import { TradeLanding, tradeHead, type TradeCopy } from "@/components/TradeLanding";

export const Route = createFileRoute("/preventivo-idraulico")({
  staticData: { sitemap: true },
  head: () =>
    tradeHead(
      "/preventivo-idraulico",
      "Preventivo idraulico dal telefono — QuickQuote",
      "Crea un preventivo da idraulico con manodopera, materiali, sconto e IVA calcolati in automatico. Invialo su WhatsApp o in PDF con il tuo logo. 5 preventivi gratis.",
    ),
  component: () => <TradeLanding it={IT} en={EN} />,
});

const IT: TradeCopy = {
  h1: "Preventivo da idraulico, pronto dal telefono",
  intro:
    "Sei dal cliente per una perdita, una caldaia o un bagno da rifare? Con QuickQuote scrivi il preventivo sul posto: inserisci manodopera e materiali, scegli l'IVA e invialo subito su WhatsApp o in PDF.",
  why: {
    title: "Cosa ti serve in un preventivo idraulico",
    items: [
      "Voci separate per manodopera e materiali (tubi, raccordi, rubinetteria, sanitari).",
      "Sconto e aliquota IVA a scelta (22%, 10%, 4% o 0%), con imponibile e totale calcolati da soli.",
      "I tuoi dati: nome attività, Partita IVA, indirizzo, telefono e logo in intestazione.",
      "Note a piè di pagina, per esempio validità dell'offerta o modalità di pagamento.",
      "Stato del preventivo (bozza, inviato, accettato, rifiutato) e archivio clienti.",
    ],
  },
  example: {
    title: "Esempio: sostituzione miscelatore",
    lines: [
      ["Manodopera", "150,00 €"],
      ["Materiali", "80,00 €"],
      ["Imponibile", "230,00 €"],
      ["IVA 22%", "50,60 €"],
      ["Totale", "280,60 €"],
    ],
    note: "Importi di esempio. L'aliquota IVA corretta per il tuo lavoro dipende dal caso: verificala con il tuo commercialista.",
  },
  steps: {
    title: "Come si fa in 3 passaggi",
    items: [
      [
        "Cliente e lavoro",
        "Scrivi il nome del cliente e cosa c'è da fare, oppure scegli un cliente già salvato.",
      ],
      [
        "Costi",
        "Inserisci manodopera, materiali, eventuale sconto e IVA: il totale si aggiorna mentre scrivi.",
      ],
      ["Invio", "Condividi su WhatsApp o email, scarica il PDF o stampalo."],
    ],
  },
  faq: {
    title: "Domande frequenti",
    items: [
      [
        "Serve un computer?",
        "No. QuickQuote funziona dal browser del telefono e si può aggiungere alla schermata Home.",
      ],
      [
        "Il PDF ha il mio logo?",
        "Sì, se carichi il logo in Impostazioni compare in alto nel preventivo, nel PDF e nella stampa.",
      ],
      [
        "Quanto costa?",
        "I primi 5 preventivi sono gratuiti, senza carta di credito. Poi il piano Pro dà preventivi illimitati.",
      ],
      [
        "QuickQuote emette fatture?",
        "No, QuickQuote crea preventivi. Per le fatture continua a usare il tuo sistema di fatturazione.",
      ],
    ],
  },
  other: { to: "/preventivo-elettricista", label: "Preventivo elettricista" },
};

const EN: TradeCopy = {
  h1: "Plumbing quotes, ready on your phone",
  intro:
    "At a customer's for a leak, a boiler or a bathroom refit? With QuickQuote you write the quote on site: add labour and materials, pick the VAT rate and send it straight away via WhatsApp or as a PDF.",
  why: {
    title: "What a plumbing quote needs",
    items: [
      "Separate lines for labour and materials (pipes, fittings, taps, fixtures).",
      "Discount and VAT rate of your choice (22%, 10%, 4% or 0%), with taxable amount and total calculated for you.",
      "Your details: business name, VAT number, address, phone and logo in the header.",
      "Footer notes, for example offer validity or payment terms.",
      "Quote status (draft, sent, accepted, rejected) and a customer archive.",
    ],
  },
  example: {
    title: "Example: mixer tap replacement",
    lines: [
      ["Labour", "€150.00"],
      ["Materials", "€80.00"],
      ["Taxable amount", "€230.00"],
      ["VAT 22%", "€50.60"],
      ["Total", "€280.60"],
    ],
    note: "Example amounts. The right VAT rate for your job depends on the case: check with your accountant.",
  },
  steps: {
    title: "How it works in 3 steps",
    items: [
      [
        "Customer and job",
        "Type the customer's name and the work to do, or pick a saved customer.",
      ],
      ["Costs", "Enter labour, materials, any discount and VAT: the total updates as you type."],
      ["Send", "Share via WhatsApp or email, download the PDF or print it."],
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      [
        "Do I need a computer?",
        "No. QuickQuote runs in your phone's browser and can be added to your Home screen.",
      ],
      [
        "Does the PDF show my logo?",
        "Yes, once you upload it in Settings it appears at the top of the quote, the PDF and the printout.",
      ],
      [
        "How much does it cost?",
        "Your first 5 quotes are free, no credit card needed. The Pro plan then gives unlimited quotes.",
      ],
      [
        "Does QuickQuote issue invoices?",
        "No, QuickQuote creates quotes. Keep using your invoicing system for invoices.",
      ],
    ],
  },
  other: { to: "/preventivo-elettricista", label: "Electrician quotes" },
};