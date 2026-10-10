# QuickQuote — passaggio alla sincronizzazione online

Questo documento descrive il prossimo passaggio tecnico. La demo attuale in `app.html` salva i dati nel browser; non è ancora collegata a un account o a un database.

## Base database

Il file `supabase/schema.sql` prepara le tabelle per:
- profilo e dati dell'attività;
- rubrica clienti;
- preventivi e relative righe;
- regole Row Level Security (RLS) per isolare i dati per account.

Il file SQL è una base iniziale da revisionare, non una dichiarazione di produzione già collaudata. Non eseguirlo sul database di un altro progetto senza prima controllare l'ambiente.

## Sequenza di implementazione

1. Creare un progetto Supabase dedicato a QuickQuote.
2. Applicare e verificare lo schema su un progetto vuoto.
3. Collegare registrazione, accesso, recupero password e uscita.
4. Sostituire progressivamente il salvataggio locale con operazioni autenticate su profili, clienti, preventivi e righe.
5. Calcolare importi anche lato server e verificare l'IVA prima di salvare.
6. Implementare esportazione/cancellazione dati e informative privacy prima di usare dati reali.
7. Integrare i pagamenti solo tramite endpoint server e webhook verificati; mai mettere chiavi segrete nel browser.
8. Pubblicare un ambiente di prova, fare test manuali e solo dopo valutare il lancio pubblico.

## Regole di sicurezza

- La chiave Supabase `service_role` non deve mai essere inserita in HTML o JavaScript pubblico.
- Le chiavi di pagamento segrete restano esclusivamente lato server.
- La RLS va mantenuta attiva e testata con almeno due account distinti.
- Non usare dati reali di clienti nella demo locale.
- Il piano Free/Pro non deve essere deciso fidandosi di un valore modificabile dal browser: i diritti Pro devono essere verificati lato server.
- La conformità GDPR, i termini di servizio e la fatturazione vanno verificati prima della vendita.

## Stato attuale

- Landing page: prototipo HTML presente.
- Area preventivi: prototipo HTML con dati locali e backup manuale.
- Database: schema iniziale scritto, non ancora applicato né testato.
- Account e sincronizzazione: non implementati.
- Stripe / PayPal: non collegati.
- Hosting e dominio: non configurati.
- APK Android: da affrontare dopo aver stabilizzato la versione web.
