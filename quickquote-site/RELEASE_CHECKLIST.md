# QuickQuote — checklist pre-pubblicazione

Questa checklist distingue i file prototipo già presenti dai servizi ancora da configurare. Non considerare il sito pronto alla vendita finché le verifiche obbligatorie non sono completate.

## A. Pagine e navigazione
- [x] Landing page HTML iniziale.
- [x] Prototipo area preventivi con dati nel browser.
- [x] Backup locale JSON e ripristino manuale.
- [x] Pagina di accesso/registrazione predisposta per Supabase.
- [x] Dashboard predisposta per mostrare dati dal database.
- [ ] Collegare tra loro autenticazione, dashboard e area preventivi con sessione reale.
- [ ] Verificare ogni link e ogni pulsante da smartphone e desktop.
- [ ] Aggiungere stati di caricamento, errori e pagine non trovate.

## B. Account e database
- [x] Schema SQL iniziale con profili, clienti, preventivi, righe e policy RLS.
- [ ] Creare il progetto Supabase QuickQuote e conservare le credenziali in modo sicuro.
- [ ] Applicare lo schema a un progetto vuoto e risolvere eventuali errori SQL.
- [ ] Creare il profilo al momento della registrazione.
- [ ] Gestire conferma email, accesso, uscita, recupero e cambio password.
- [ ] Connettere creazione/modifica/eliminazione di clienti e preventivi al database.
- [ ] Gestire correttamente righe preventivo e salvataggi atomici.
- [ ] Verificare isolamento dati con due account distinti e richieste non autorizzate.
- [ ] Implementare numerazione preventivi sicura e univoca per account.

## C. Preventivi e PDF
- [ ] Definire dati obbligatori e validazioni dei clienti.
- [ ] Verificare arrotondamenti, quantità, imponibile, IVA e totale lato server.
- [ ] Definire campi fiscali, condizioni di pagamento e validità del preventivo.
- [ ] Creare modello PDF professionale, leggibile anche stampato.
- [ ] Verificare numerazione, date, pagine multiple e caratteri accentati.
- [ ] Chiarire che il preventivo non sostituisce automaticamente una fattura fiscale.

## D. Pagamenti e piani
- [ ] Definire limiti reali del piano Free e vantaggi del piano Pro.
- [ ] Definire prezzo, rinnovo, cancellazione e gestione rimborsi.
- [ ] Implementare checkout lato server per Stripe e/o PayPal.
- [ ] Verificare firme dei webhook e gestione eventi duplicati.
- [ ] Attivare Pro solo dopo conferma server-side del pagamento.
- [ ] Testare pagamenti in ambiente sandbox/test prima del lancio.

## E. Privacy e sicurezza
- [ ] Informativa privacy, cookie e termini di servizio adeguati al prodotto.
- [ ] Procedura per esportare e cancellare l'account e i relativi dati.
- [ ] Nessuna chiave segreta nel codice client o nel repository.
- [ ] RLS abilitata e testata su tutte le tabelle esposte.
- [ ] Protezioni contro spam, abuso e tentativi di accesso ripetuti.
- [ ] Backup del database e procedura di ripristino provata.
- [ ] Non usare dati reali durante i test iniziali.

## F. Pubblicazione
- [ ] Scegliere hosting e configurare il dominio quando disponibile.
- [ ] HTTPS, redirect e variabili ambiente.
- [ ] SEO tecnico: title, description, sitemap, robots, canonical.
- [ ] Analytics con impostazioni privacy appropriate.
- [ ] Test da browser su Android e desktop.
- [ ] Verifica accessibilità, prestazioni, collegamenti e moduli.
- [ ] Lancio iniziale controllato e monitoraggio degli errori.

## G. Applicazione Android (fase successiva)
- [ ] Stabilizzare prima la versione web.
- [ ] Definire se realizzare PWA installabile, wrapper Android o app nativa.
- [ ] Riutilizzare autenticazione e API/database sicuri.
- [ ] Testare download, aggiornamenti, sessione, sincronizzazione e offline.
- [ ] Pubblicare APK firmato e fornire istruzioni sicure di installazione.

## Stato sintetico
Le caselle marcate completate indicano solo file/documentazione aggiunti al ramo di sviluppo, non servizi attivi o test superati. In particolare Supabase, hosting, pagamenti e sincronizzazione non sono ancora configurati. Il test manuale del proprietario verrà richiesto solo quando esisterà un ambiente di prova accessibile.
