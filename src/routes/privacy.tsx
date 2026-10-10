import { breadcrumbLd, pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Todo } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/legal";
import { getLang } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => pageHead("/privacy", "Informativa Privacy — QuickQuote", "Come QuickQuote tratta i dati personali di account, clienti e preventivi: finalità, conservazione, pagamenti Stripe e diritti dell'utente.", [breadcrumbLd("/privacy", "Informativa Privacy")]),
  component: Privacy,
});

const Mail = () => <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

function Privacy() {
  if (getLang() === "en") return (
    <LegalPage title="Privacy Policy">
      <section><h2>1. Data controller</h2><p>The data controller is <Todo it="ragione sociale / nome del titolare" en="legal entity / owner name" />, with registered office at <Todo it="sede legale" en="registered address" />, VAT no. <Todo it="Partita IVA" en="VAT number" />. Contact: <Mail />.</p></section>
      <section><h2>2. Data we process</h2><ul>
        <li>Account data: email address and password (stored only in encrypted/hashed form by the authentication service).</li>
        <li>Business data you enter in Settings: business name, VAT number, address, phone, email, footer notes and logo image (stored in a private storage area accessible only to your account).</li>
        <li>Your customers' data and your quotes: names, phone numbers, emails, addresses, job descriptions, amounts, dates and status.</li>
        <li>Subscription data: plan status, subscription and customer identifiers, renewal dates. Card details are handled exclusively by Stripe and are never stored by QuickQuote.</li>
        <li>Minimal technical data needed to run and secure the service (e.g. server logs, IP address, browser type).</li>
      </ul></section>
      <section><h2>3. Purposes and legal bases</h2><ul>
        <li>Providing the service and managing your account (performance of a contract).</li>
        <li>Managing the Pro subscription and payments (performance of a contract and legal obligations, including tax).</li>
        <li>Ensuring security and preventing abuse (legitimate interest).</li>
      </ul><p>We do not use your data for advertising, profiling or marketing, and we do not sell it.</p></section>
      <section><h2>4. Your customers' data</h2><p>For the customer data you enter in quotes, you are the data controller and QuickQuote acts as a processor, handling it only to provide the service. You are responsible for having a valid legal basis to enter it and for informing your customers.</p></section>
      <section><h2>5. Service providers</h2><p>We use providers that process data on our behalf: cloud infrastructure, database, authentication and file storage for hosting the service, and Stripe for payments and subscription management. Some providers may process data outside the European Economic Area under the safeguards required by law (e.g. Standard Contractual Clauses). The list of providers is available on request.</p></section>
      <section><h2>6. Cookies and local storage</h2><p>QuickQuote uses only technical storage on your device that is strictly necessary: keeping you signed in and remembering your language choice. We do not use analytics, advertising or profiling cookies. The Stripe payment form may use its own technical cookies for payment security and fraud prevention.</p></section>
      <section><h2>7. Retention</h2><p>Data is kept while your account is active. After account deletion it is erased within <Todo it="tempi di cancellazione (es. 30 giorni)" en="deletion timeframe (e.g. 30 days)" />, except data that must be kept by law (e.g. tax records relating to payments).</p></section>
      <section><h2>8. Data separation and security</h2><p>Each account can access only its own data: quotes, customers, settings and logo are not visible to other users. Access is protected by authentication and database-level access rules.</p></section>
      <section><h2>9. Your rights</h2><p>You can request access, rectification, erasure, restriction, portability and object to processing by writing to <Mail />. You can request account deletion from the app's Settings ("Request account deletion") or by email. You also have the right to lodge a complaint with your data protection authority (in Italy, the Garante per la protezione dei dati personali).</p></section>
      <section><h2>10. Changes</h2><p>This policy may be updated; the last update date is shown at the top.</p></section>
    </LegalPage>
  );
  return (
    <LegalPage title="Informativa Privacy">
      <section><h2>1. Titolare del trattamento</h2><p>Il titolare del trattamento è <Todo it="ragione sociale / nome del titolare" en="legal entity / owner name" />, con sede in <Todo it="sede legale" en="registered address" />, P.IVA <Todo it="Partita IVA" en="VAT number" />. Contatto: <Mail />.</p></section>
      <section><h2>2. Dati trattati</h2><ul>
        <li>Dati dell'account: email e password (conservata solo in forma cifrata dal servizio di autenticazione).</li>
        <li>Dati dell'attività inseriti nelle Impostazioni: nome, partita IVA, indirizzo, telefono, email, note a piè di pagina e immagine del logo (conservata in un archivio privato accessibile solo al tuo account).</li>
        <li>Dati dei tuoi clienti e dei preventivi: nomi, telefoni, email, indirizzi, descrizioni dei lavori, importi, date e stato.</li>
        <li>Dati dell'abbonamento: stato del piano, identificativi di abbonamento e cliente, date di rinnovo. I dati della carta sono gestiti esclusivamente da Stripe e non vengono mai conservati da QuickQuote.</li>
        <li>Dati tecnici minimi necessari al funzionamento e alla sicurezza del servizio (es. log del server, indirizzo IP, tipo di browser).</li>
      </ul></section>
      <section><h2>3. Finalità e basi giuridiche</h2><ul>
        <li>Fornire il servizio e gestire l'account (esecuzione del contratto).</li>
        <li>Gestire l'abbonamento Pro e i pagamenti (esecuzione del contratto e obblighi di legge, anche fiscali).</li>
        <li>Garantire la sicurezza e prevenire abusi (legittimo interesse).</li>
      </ul><p>Non utilizziamo i tuoi dati per pubblicità, profilazione o marketing e non li vendiamo a terzi.</p></section>
      <section><h2>4. Dati dei tuoi clienti</h2><p>Per i dati dei tuoi clienti inseriti nei preventivi, sei tu il titolare del trattamento e QuickQuote agisce come responsabile, trattandoli solo per fornirti il servizio. È tua responsabilità avere una base giuridica adeguata per inserirli e informare i tuoi clienti.</p></section>
      <section><h2>5. Fornitori</h2><p>Ci avvaliamo di fornitori che trattano dati per nostro conto: infrastruttura cloud, database, autenticazione e archiviazione file per l'hosting del servizio, e Stripe per pagamenti e gestione dell'abbonamento. Alcuni fornitori possono trattare dati anche al di fuori dello Spazio Economico Europeo, sulla base delle garanzie previste dalla normativa (es. clausole contrattuali standard). L'elenco dei fornitori è disponibile su richiesta.</p></section>
      <section><h2>6. Cookie e memorizzazione locale</h2><p>QuickQuote usa solo memorizzazione tecnica strettamente necessaria sul tuo dispositivo: mantenere l'accesso e ricordare la lingua scelta. Non usiamo cookie di statistica, pubblicità o profilazione. Il modulo di pagamento Stripe può usare propri cookie tecnici per la sicurezza dei pagamenti e la prevenzione delle frodi.</p></section>
      <section><h2>7. Conservazione</h2><p>I dati sono conservati finché l'account è attivo. Dopo la cancellazione dell'account vengono eliminati entro <Todo it="tempi di cancellazione (es. 30 giorni)" en="deletion timeframe (e.g. 30 days)" />, salvo quanto deve essere conservato per obblighi di legge (ad esempio dati fiscali relativi ai pagamenti).</p></section>
      <section><h2>8. Separazione e sicurezza dei dati</h2><p>Ogni account può accedere solo ai propri dati: preventivi, clienti, impostazioni e logo non sono visibili ad altri utenti. L'accesso è protetto da autenticazione e da regole di accesso a livello di database.</p></section>
      <section><h2>9. I tuoi diritti</h2><p>Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità dei dati e opporti al trattamento scrivendo a <Mail />. Puoi richiedere la cancellazione dell'account dalle Impostazioni dell'app ("Richiedi cancellazione account") o via email. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali.</p></section>
      <section><h2>10. Modifiche</h2><p>Questa informativa può essere aggiornata; la data di ultimo aggiornamento è indicata in alto.</p></section>
    </LegalPage>
  );
}