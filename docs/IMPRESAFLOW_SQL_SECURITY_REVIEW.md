# ImpresaFlow Incassi — revisione di sicurezza della bozza SQL

Stato: revisione statica del file incassi_schema_draft.sql. Non è un test PostgreSQL/Supabase e non certifica la sicurezza del database.

## Risultato principale

La bozza protegge già alcuni campi (verifica pagamenti, approvazione/invio solleciti, accettazione piani) con trigger e policy. Durante la revisione è emerso però un rischio importante: le policy di aggiornamento delle fatture consentono ancora al proprietario autenticato di modificare direttamente status e original_amount_cents. Un client potrebbe quindi provare a chiudere/annullare una fattura o cambiarne l'importo senza passare da una procedura contabile controllata.

## Correzione proposta

Prima di usare dati reali, aggiungere un trigger che, nelle richieste client autenticate, rifiuti modifiche dirette a:
- status;
- original_amount_cents;
- user_id;
- customer_id (cambio cliente della fattura);
- invoice_number (identificativo contabile).

Queste modifiche devono passare da funzioni server-side autorizzate, che verificano saldo, contestazioni, pagamenti verificati e scrivono l'evento di audit nella stessa transazione. Le operazioni amministrative con privilegi elevati devono avere autorizzazioni esplicite e log verificabili: non basta affidarsi al fatto che auth.uid() sia nullo.

## Altri punti ancora da verificare

1. La bozza crea un indice univoco su public.customers(id, user_id): può fallire se i dati esistenti contengono duplicati o se i tipi/colonne non corrispondono.
2. Il modello è per singolo utente (user_id), non ancora per azienda con membri e ruoli.
3. Non sono ancora implementate le funzioni transazionali per verifica pagamenti, saldo, invio solleciti, accettazione piani e audit.
4. L'isolamento RLS deve essere testato con due utenti autenticati reali di prova.
5. Le query eseguite nel dashboard hanno mostrato zero tabelle nel schema public del database selezionato; ciò non prova da solo quale progetto Supabase sia collegato a QuickQuote, né autorizza ad applicare lo schema.
6. Non applicare questa bozza al database esistente finché identità del progetto, struttura clienti e piano di rollback non sono stati verificati.

## Esito

Bloccato per uso in produzione. La prossima modifica deve essere la protezione dei campi contabili tramite trigger e la relativa verifica su un progetto isolato. Nessuna migrazione è stata eseguita su Supabase.