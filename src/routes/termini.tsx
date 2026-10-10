import { breadcrumbLd, pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Todo } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/legal";
import { PLAN_LIMITS, PRO_PRICE_FULL } from "@/lib/quote";
import { getLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/termini")({
  staticData: { sitemap: true },
  head: () => pageHead("/termini", "Termini e Condizioni — QuickQuote", "Condizioni d'uso di QuickQuote: account, piano Free da 5 preventivi, abbonamento Pro, disdetta e responsabilità.", [breadcrumbLd("/termini", "Termini e Condizioni")]),
  component: Terms,
});

const Mail = () => <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

function Terms() {
  if (getLang() === "en") return (
    <LegalPage title="Terms and Conditions">
      <section><h2>1. Provider and service</h2><p>QuickQuote is a web application provided by <Todo it="ragione sociale / nome del titolare" en="legal entity / owner name" />, <Todo it="sede legale" en="registered address" />, VAT no. <Todo it="Partita IVA" en="VAT number" />. It lets professionals and small businesses create, manage and share quotes. By using the service you accept these Terms.</p></section>
      <section><h2>2. Account</h2><p>To use QuickQuote you must create an account with a valid email. You are responsible for keeping your credentials confidential and for activity carried out with your account.</p></section>
      <section><h2>3. Plans</h2><ul>
        <li><b>Free</b>: free of charge, up to {PLAN_LIMITS.free} quotes in total.</li>
        <li><b>Pro</b>: unlimited quotes for {t(PRO_PRICE_FULL)}. The final total may include VAT or other taxes based on the customer's location and is shown before payment is confirmed.</li>
      </ul></section>
      <section><h2>4. Payment and renewal</h2><p>The Pro subscription is paid in advance and renews automatically every month at the same price until cancelled. Payments are processed by Stripe; QuickQuote does not store card details. Any price change will be communicated in advance and will apply from the following renewal.</p></section>
      <section><h2>5. Cancellation</h2><p>You can cancel the subscription at any time from the Pro page ("Manage subscription"). Cancellation takes effect at the end of the monthly period already paid: until then you keep Pro, after which the account returns to the Free plan. Except where required by law, periods already paid are not refundable. <Todo it="verificare con il consulente l'eventuale diritto di recesso di 14 giorni per i consumatori" en="check with your advisor any 14-day consumer withdrawal right" /></p></section>
      <section><h2>6. Failed payment</h2><p>If a renewal fails, payment may be retried; if the subscription is no longer active, the account returns to the Free plan without losing quotes already created.</p></section>
      <section><h2>7. Content and responsibility</h2><p>Quotes, prices, VAT rates and data you enter are your responsibility: always check documents before sending them. QuickQuote is a support tool and does not provide tax or legal advice.</p></section>
      <section><h2>8. Acceptable use</h2><p>You may not use the service for unlawful activities or to enter third-party data without an adequate legal basis.</p></section>
      <section><h2>9. Availability and liability</h2><p>We strive to keep the service available and working, but cannot guarantee it will be free from interruptions or errors. To the extent permitted by law, QuickQuote's liability is limited to the amounts paid in the last 12 months.</p></section>
      <section><h2>10. Account closure</h2><p>You can request account deletion from Settings ("Request account deletion") or by writing to <Mail />. We may suspend accounts that breach these Terms.</p></section>
      <section><h2>11. Changes, governing law and jurisdiction</h2><p>These Terms may be updated; material changes will be communicated. Italian law applies, without prejudice to mandatory consumer rights. Competent court: <Todo it="foro competente" en="competent court" /> (for consumers, the court of their place of residence).</p></section>
      <section><h2>12. Contact</h2><p><Mail /></p></section>
    </LegalPage>
  );
  return (
    <LegalPage title="Termini e Condizioni">
      <section><h2>1. Fornitore e servizio</h2><p>QuickQuote è un'applicazione web fornita da <Todo it="ragione sociale / nome del titolare" en="legal entity / owner name" />, <Todo it="sede legale" en="registered address" />, P.IVA <Todo it="Partita IVA" en="VAT number" />. Permette a professionisti e piccole attività di creare, gestire e condividere preventivi. Usando il servizio accetti questi Termini.</p></section>
      <section><h2>2. Account</h2><p>Per usare QuickQuote devi creare un account con un'email valida. Sei responsabile della riservatezza delle credenziali e delle attività svolte con il tuo account.</p></section>
      <section><h2>3. Piani</h2><ul>
        <li><b>Free</b>: gratuito, fino a {PLAN_LIMITS.free} preventivi totali.</li>
        <li><b>Pro</b>: preventivi illimitati al prezzo di {PRO_PRICE_FULL}. Il totale finale può includere IVA o altre imposte in base alla posizione del cliente ed è mostrato prima della conferma del pagamento.</li>
      </ul></section>
      <section><h2>4. Pagamento e rinnovo</h2><p>L'abbonamento Pro si paga in anticipo e si rinnova automaticamente ogni mese alla stessa tariffa, finché non viene cancellato. I pagamenti sono gestiti da Stripe; QuickQuote non conserva i dati della carta. Eventuali modifiche di prezzo saranno comunicate in anticipo e si applicheranno dal rinnovo successivo.</p></section>
      <section><h2>5. Cancellazione</h2><p>Puoi cancellare l'abbonamento in qualsiasi momento dalla pagina Pro ("Gestisci abbonamento"). La cancellazione ha effetto alla fine del periodo mensile già pagato: fino ad allora mantieni il piano Pro, poi l'account torna al piano Free. Salvo quanto previsto dalla legge, i periodi già pagati non sono rimborsabili. <Todo it="verificare con il consulente l'eventuale diritto di recesso di 14 giorni per i consumatori" en="check with your advisor any 14-day consumer withdrawal right" /></p></section>
      <section><h2>6. Mancato pagamento</h2><p>Se un rinnovo non va a buon fine, il pagamento può essere ritentato; se l'abbonamento non risulta più attivo, l'account torna al piano Free senza perdita dei preventivi già creati.</p></section>
      <section><h2>7. Contenuti e responsabilità</h2><p>I preventivi, i prezzi, le aliquote IVA e i dati inseriti sono di tua responsabilità: verifica sempre la correttezza dei documenti prima di inviarli. QuickQuote è uno strumento di supporto e non fornisce consulenza fiscale o legale.</p></section>
      <section><h2>8. Uso corretto</h2><p>Non è consentito usare il servizio per attività illecite o per inserire dati di terzi senza una base giuridica adeguata.</p></section>
      <section><h2>9. Disponibilità e responsabilità</h2><p>Ci impegniamo a mantenere il servizio disponibile e funzionante, ma non possiamo garantire l'assenza di interruzioni o errori. Nei limiti consentiti dalla legge, la responsabilità di QuickQuote è limitata agli importi pagati negli ultimi 12 mesi.</p></section>
      <section><h2>10. Chiusura dell'account</h2><p>Puoi richiedere la cancellazione dell'account dalle Impostazioni ("Richiedi cancellazione account") o scrivendo a <Mail />. Possiamo sospendere account che violano questi Termini.</p></section>
      <section><h2>11. Modifiche, legge applicabile e foro</h2><p>I Termini possono essere aggiornati; le modifiche rilevanti saranno comunicate. Si applica la legge italiana, fatti salvi i diritti inderogabili dei consumatori. Foro competente: <Todo it="foro competente" en="competent court" /> (per i consumatori, il foro del luogo di residenza).</p></section>
      <section><h2>12. Contatti</h2><p><Mail /></p></section>
    </LegalPage>
  );
}