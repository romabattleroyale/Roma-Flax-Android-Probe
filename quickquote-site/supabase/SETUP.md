# QuickQuote — configurazione ambiente (guida interna)

Questa guida descrive i valori necessari per collegare le pagine al progetto Supabase. Non contiene chiavi vere e non va completata con segreti dentro al repository.

## Servizi da predisporre
1. Un progetto Supabase dedicato a QuickQuote.
2. URL del progetto e chiave pubblica (publishable/anon) per il browser.
3. Schema SQL in `supabase/schema.sql` applicato al database di test.
4. URL pubblico del sito per redirect email e recupero password.

## Dove usare le credenziali
- `SUPABASE_URL`: URL del progetto Supabase.
- `SUPABASE_ANON_KEY` oppure chiave publishable: è una chiave destinata al client; la sicurezza dipende dalle policy RLS corrette.
- La chiave `service_role` è segreta: non inserirla mai in HTML, JavaScript pubblico, issue o repository.
- Stripe secret key, PayPal client secret e segreti webhook devono stare esclusivamente in funzioni server/variabili ambiente del provider.

## File attualmente predisposti
- `auth.html` contiene placeholder, quindi non effettua ancora accesso.
- `workspace.html` contiene placeholder, quindi non carica dati online.
- `supabase/schema.sql` è una base iniziale; non è stato eseguito o testato in un progetto reale.

## Procedura quando sarà il momento
1. Creare il progetto Supabase e applicare lo schema in un ambiente nuovo di test.
2. Configurare conferma email e redirect consentiti.
3. Sostituire i placeholder con URL e chiave pubblica nei file client, oppure meglio spostarli in una configurazione pubblica dedicata.
4. Verificare accesso, registrazione, recupero password e logout.
5. Testare con due account che non possano leggere i dati l'uno dell'altro.
6. Solo dopo collegare operazioni di scrittura, numerazione e calcolo preventivi lato server.
7. Mai utilizzare dati reali di clienti finché test di sicurezza e informativa privacy non sono completati.

## Importante
Questa guida non sostituisce la configurazione del servizio né un audit di sicurezza. Non chiedere all'utente di incollare qui password o chiavi segrete. Se servono valori di configurazione, chiedere soltanto URL del progetto e chiave pubblica, e spiegare prima dove inserirli in modo sicuro.
