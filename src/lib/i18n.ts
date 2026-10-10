import { useSyncExternalStore } from "react";

/* Two UI languages only (it/en). Italian strings are the keys; EN maps them.
   The root remounts the page tree on language change, so plain t() calls stay current. */
export type Lang = "it" | "en";
const KEY = "qq-lang";
type State = { lang: Lang; chosen: boolean; ready: boolean };
let state: State = { lang: "it", chosen: false, ready: false };
const SERVER_STATE: State = { lang: "it", chosen: true, ready: false };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function initLang() {
  let lang: Lang = "it";
  let chosen = false;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "it" || v === "en") { lang = v; chosen = true; }
  } catch { /* storage unavailable */ }
  state = { lang, chosen, ready: true };
  document.documentElement.lang = lang;
  emit();
}
export function setLang(lang: Lang) {
  try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  state = { lang, chosen: true, ready: true };
  document.documentElement.lang = lang;
  emit();
}
export const getLang = () => state.lang;
export function useLangState() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => state, () => SERVER_STATE);
}
export const locale = () => (state.lang === "en" ? "en-IE" : "it-IT");

export function t(s: string, vars?: Record<string, string | number>) {
  let r = state.lang === "en" ? EN[s] ?? s : s;
  if (vars) for (const [k, v] of Object.entries(vars)) r = r.split(`{${k}}`).join(String(v));
  return r;
}

const EN: Record<string, string> = {
  // common / nav
  "Indietro": "Back", "Home": "Home", "Preventivi": "Quotes", "Nuovo preventivo": "New quote", "Nuovo": "New",
  "Clienti": "Customers", "Impostazioni": "Settings", "Chiudi": "Close", "Caricamento…": "Loading…",
  "Pagina non trovata": "Page not found", "Torna alla home": "Back to home", "Qualcosa è andato storto": "Something went wrong",
  "Riprova tra un istante.": "Please try again in a moment.", "Riprova": "Try again", "Sessione scaduta": "Session expired",
  "Lingua": "Language", "Scegli la lingua": "Choose your language", "Puoi cambiarla in qualsiasi momento dalle Impostazioni.": "You can change it any time in Settings.",
  // status
  "Bozza": "Draft", "Inviato": "Sent", "Accettato": "Accepted", "Rifiutato": "Rejected",
  // price
  "7,99 €/mese + IVA, se applicabile": "€7.99/month + VAT, if applicable",
  "Il totale finale può includere IVA o altre imposte in base alla tua posizione e viene mostrato prima della conferma.": "The final total may include VAT or other taxes based on your location and is shown before you confirm.",
  // landing
  "Preventivi professionali in": "Professional quotes in", "60 secondi": "60 seconds",
  "Per idraulici, elettricisti, imbianchini, giardinieri e tutti i professionisti locali.": "For plumbers, electricians, painters, gardeners and every local professional.",
  "Calcolo automatico di sconto, IVA e totale": "Automatic discount, VAT and total", "Invia su WhatsApp, email o salva in PDF": "Send via WhatsApp, email or save as PDF",
  "Pensata per il tuo telefono": "Designed for your phone", "Inizia gratis": "Start free", "Ho già un account": "I already have an account",
  "Come funziona": "How it works", "Inserisci cliente e lavoro": "Enter customer and job", "Nome, titolo e descrizione: bastano pochi tocchi.": "Name, title and description: just a few taps.",
  "Aggiungi i costi": "Add the costs", "Manodopera, materiali, sconto e IVA: il totale si calcola da solo.": "Labour, materials, discount and VAT: the total is calculated for you.",
  "Invia il preventivo": "Send the quote", "Condividi su WhatsApp o email, oppure scarica il PDF con il tuo logo.": "Share via WhatsApp or email, or download the PDF with your logo.",
  "Piani": "Plans", "5 preventivi gratuiti": "5 free quotes", "Tutte le funzioni, senza carta di credito.": "All features, no credit card.",
  "Preventivi illimitati": "Unlimited quotes", "Termini": "Terms", "Idraulici": "Plumbers", "Elettricisti": "Electricians", "Guida al preventivo": "Quote guide", "Come fare un preventivo": "How to write a quote", "Struttura, esempio e checklist da copiare": "Structure, example and a checklist to copy", "Contatti": "Contact",
  "Prezzi e limiti della prova": "Prices and free trial limits",
  "5 preventivi in totale per account, con tutte le funzioni e senza carta di credito. Raggiunto il limite, per crearne altri serve il piano Pro; i preventivi già creati restano consultabili.": "5 quotes in total per account, with every feature and no credit card. Once you reach the limit you need the Pro plan to create more; quotes you already made stay available.",
  "Abbonamento mensile con pagamento sicuro tramite Stripe, che puoi gestire o disdire dall'app.": "Monthly subscription with secure payment via Stripe, which you can manage or cancel from the app.",
  "Per il tuo mestiere": "For your trade",
  "Preventivo idraulico": "Plumbing quotes",
  "Preventivo elettricista": "Electrician quotes",
  "Esempio, voci tipiche e domande frequenti": "Example, typical items and FAQs",
  // auth
  "Email o password non corretti": "Incorrect email or password", "Email già registrata": "Email already registered",
  "Crea il tuo account": "Create your account", "Bentornato": "Welcome back", "Gratis. Pronto in 30 secondi.": "Free. Ready in 30 seconds.",
  "Accedi per gestire i tuoi preventivi.": "Sign in to manage your quotes.", "Controlla la tua email": "Check your email",
  "Ti abbiamo inviato un link a": "We sent a link to", "Aprilo per attivare l'account.": "Open it to activate your account.",
  "Nome attività": "Business name", "Es. Rossi Impianti": "E.g. Smith Plumbing", "Attendere…": "Please wait…", "Crea account": "Create account",
  "Accedi": "Sign in", "Hai già un account? Accedi": "Already have an account? Sign in", "Non hai un account? Registrati gratis": "No account? Sign up free",
  // dashboard
  "Ciao 👋": "Hi 👋", "La tua attività": "Your business", "Questo mese": "This month", "In attesa": "Pending", "Accettati": "Accepted",
  "Valore totale": "Total value", "Ultimi preventivi": "Recent quotes", "Vedi tutti": "See all", "Cliente": "Customer",
  "Nessun preventivo ancora. Tocca": "No quotes yet. Tap", "per iniziare.": "to get started.",
  // list
  "Cerca cliente, numero, lavoro": "Search customer, number, job", "Tutti": "All", "Nessun preventivo trovato.": "No quotes found.",
  // customers
  "Inserisci il nome": "Enter the name", "Cliente aggiornato": "Customer updated", "Cliente aggiunto": "Customer added",
  "Eliminare {name}? I preventivi resteranno salvati.": "Delete {name}? Their quotes will stay saved.", "Cliente eliminato": "Customer deleted",
  "Aggiungi": "Add", "Cerca cliente": "Search customer", "Nessun risultato.": "No results.",
  "Nessun cliente. I clienti vengono salvati automaticamente quando crei un preventivo.": "No customers yet. Customers are saved automatically when you create a quote.",
  "{n} preventivo": "{n} quote", "{n} preventivi": "{n} quotes", "Preventivo": "Quote", "Modifica": "Edit", "Elimina": "Delete",
  "Modifica cliente": "Edit customer", "Nuovo cliente": "New customer", "Nome *": "Name *", "Telefono": "Phone", "Indirizzo": "Address",
  "Salva cliente": "Save customer",
  // new quote
  "Inserisci il nome del cliente": "Enter the customer name", "Inserisci il titolo del lavoro": "Enter the job title",
  "Limite piano gratuito raggiunto": "Free plan limit reached", "Manodopera": "Labour", "Materiali": "Materials", "Altri costi": "Other costs",
  "Preventivo aggiornato": "Quote updated", "Preventivo creato": "Quote created", "Hai utilizzato i 5 preventivi gratuiti.": "You have used your 5 free quotes.",
  "Passa a QuickQuote Pro per continuare a creare preventivi illimitati.": "Upgrade to QuickQuote Pro to keep creating unlimited quotes.",
  "PASSA A PRO": "UPGRADE TO PRO", "Modifica preventivo": "Edit quote", "Cambia cliente": "Change customer", "Scegli cliente esistente": "Choose existing customer",
  "Nome cliente *": "Customer name *", "Mario Bianchi": "John Smith", "Telefono cliente": "Customer phone", "Email cliente": "Customer email",
  "Lavoro": "Job", "Titolo del lavoro *": "Job title *", "Es. Sostituzione caldaia": "E.g. Boiler replacement", "Descrizione": "Description",
  "Dettagli del lavoro, tempi, condizioni…": "Job details, timing, conditions…", "Costi": "Costs", "Sconto": "Discount", "IVA": "VAT",
  "Subtotale": "Subtotal", "Imponibile": "Taxable amount", "Totale": "Total", "Dettagli": "Details", "Data": "Date",
  "Numero preventivo": "Quote number", "Salvo…": "Saving…", "Salva e vedi": "Save and view", "Scegli cliente": "Choose customer", "Cerca…": "Search…",
  // preview
  "PREVENTIVO N.": "QUOTE NO.", "Cliente:": "Customer:", "Lavoro:": "Job:", "TOTALE": "TOTAL", "Stato": "Status", "Preventivo copiato": "Quote copied",
  "Logo non ancora disponibile. Riprova tra un momento.": "Logo not available yet. Try again in a moment.", "Impossibile scaricare il PDF. Riprova.": "Couldn't download the PDF. Please try again.",
  "Eliminare questo preventivo?": "Delete this quote?", "Logo azienda": "Business logo", "P.IVA": "VAT no.", "N.": "No.", "Oggetto": "Subject",
  "Voci del preventivo": "Quote items", "Voce": "Item", "Importo": "Amount", "Riepilogo finale": "Final summary", "TOTALE FINALE": "FINAL TOTAL",
  "Azioni preventivo": "Quote actions", "CONDIVIDI": "SHARE", "SALVA PDF": "SAVE PDF", "COPIA": "COPY", "Stampa": "Print", "Elimina preventivo": "Delete quote",
  // pdf
  "PREVENTIVO": "QUOTE", "CLIENTE": "CUSTOMER", "OGGETTO": "SUBJECT", "DESCRIZIONE": "DESCRIPTION", "VOCI DEL PREVENTIVO": "QUOTE ITEMS",
  "NOTE": "NOTES", "RIEPILOGO FINALE": "FINAL SUMMARY", "Data:": "Date:",
  // settings
  "Impostazioni salvate": "Settings saved", "Partita IVA": "VAT number", "Email": "Email", "IVA predefinita (%)": "Default VAT (%)",
  "Note a piè di pagina": "Footer notes", "Es. Validità 30 giorni. Pagamento a fine lavori.": "E.g. Valid for 30 days. Payment on completion.",
  "Salva impostazioni": "Save settings", "Piano": "Plan", "Gratuito": "Free", "{a} di {b} preventivi gratuiti utilizzati": "{a} of {b} free quotes used",
  "PASSA A PRO — 7,99 €/mese": "UPGRADE TO PRO — €7.99/month", "Esci": "Sign out", "Richiedi cancellazione account": "Request account deletion",
  "Logo salvato": "Logo saved", "Impossibile caricare il logo. Riprova.": "Couldn't upload the logo. Please try again.", "Logo rimosso": "Logo removed",
  "Impossibile rimuovere il logo. Riprova.": "Couldn't remove the logo. Please try again.", "Carica logo azienda": "Upload business logo",
  "Sostituisci logo": "Replace logo", "Carica logo": "Upload logo", "Rimuovi logo": "Remove logo", "Logo non leggibile": "Logo can't be read",
  "Scegli un’immagine PNG, JPG o WebP.": "Choose a PNG, JPG or WebP image.", "Il logo deve essere inferiore a 5 MB.": "The logo must be smaller than 5 MB.",
  "Impossibile leggere il logo.": "Couldn't read the logo.",
  // pro
  "PDF professionali con il tuo logo": "Professional PDFs with your logo", "Condivisione rapida su WhatsApp ed email": "Quick sharing via WhatsApp and email",
  "Archivio clienti completo": "Complete customer archive", "Tutte le funzioni attuali, senza limiti": "All current features, without limits",
  "Modalità test: nessun pagamento reale viene addebitato.": "Test mode: no real payment is charged.",
  "Il piano gratuito include {n} preventivi. Con Pro non ti fermi mai.": "The free plan includes {n} quotes. With Pro you never stop.",
  "/mese": "/month", "+ IVA, se applicabile": "+ VAT, if applicable", "Il tuo piano Pro è attivo": "Your Pro plan is active",
  "Gestisci abbonamento": "Manage subscription", "Pagamento ricevuto, attivazione del piano Pro in corso…": "Payment received, activating your Pro plan…",
  "PASSA A PRO — {p}/mese": "UPGRADE TO PRO — {p}/month", "Rinnovo mensile automatico, disdici quando vuoi.": "Renews monthly, cancel any time.",
  "Termini e Condizioni": "Terms and Conditions", "7,99 €": "€7.99",
  // legal shell
  "Ultimo aggiornamento:": "Last updated:", "Creato da ReplyToolsLab": "Created by ReplyToolsLab",
  "Richiesta cancellazione account QuickQuote": "QuickQuote account deletion request",
  "Ciao, chiedo la cancellazione del mio account QuickQuote e dei dati collegati. Email dell'account: ": "Hello, I request the deletion of my QuickQuote account and related data. Account email: ",
};