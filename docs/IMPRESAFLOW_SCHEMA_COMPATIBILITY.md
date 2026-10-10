# ImpresaFlow — verifica di compatibilità dello schema esistente

Stato: ricognizione documentale basata su metadati letti in sola lettura. Non è una migrazione e non prova che il database osservato sia quello di produzione.

## Obiettivo

Prima di integrare Incassi, identificare lo schema dell'app già esistente ed evitare di creare una seconda anagrafica clienti o di assumere che le tabelle della bozza coincidano con quelle in uso.

## Metadati osservati nel progetto Lovable

Una ricognizione in sola lettura del progetto Lovable `03f257b5-2b0a-42b0-8cc1-127e43107f11` ha mostrato queste tabelle e colonne rilevanti:

- `customers`: `id uuid NOT NULL`, `user_id uuid NOT NULL`, `name text NOT NULL`, campi di contatto e `created_at`.
- `profiles`: `id uuid NOT NULL`, `email`, `plan`, `sandbox_plan`, `created_at`; nella vista di metadati consultata non risultava una colonna `user_id`.
- `quotes`: `id`, `user_id`, `customer_id` nullable, numero/data, campi e totali del preventivo.
- `quote_items`: `id`, `quote_id`, `user_id`, `kind`, `label`, `amount`, `position`.
- `business_profiles`: `id`, `user_id`, dati aziendali e partita IVA.
- `subscriptions`: `user_id` e campi Stripe.

Queste sono osservazioni parziali dei metadati, non una verifica completa di tipi, vincoli, indici, trigger, policy RLS o dati. Non presumere che `quotes` equivalga a una fattura emessa.

## Identità del database: blocco prima di ogni modifica

Una precedente verifica manuale in un dashboard Supabase separato aveva restituito zero tabelle applicative nello schema `public` e nessuna tabella `supabase_migrations.schema_migrations`. Questo risultato non coincide con la ricognizione Lovable descritta sopra e i due ambienti potrebbero essere progetti differenti.

**Decisione di sicurezza:** non applicare `incassi_schema_draft.sql`, non eseguire migrazioni e non cambiare policy finché il proprietario non ha identificato con certezza l'URL/ID del progetto Supabase effettivamente collegato all'app pubblicata.

## Mappatura richiesta prima dell'integrazione

| Concetto Incassi | Cosa verificare nell'app reale | Regola |
|---|---|---|
| Proprietario/tenant | Origine autenticata di `user_id`, eventuale azienda e membri | Mai fidarsi di un ID proprietario inviato dal browser |
| Cliente | PK, proprietario, policy RLS e vincolo FK | Riutilizzare l'anagrafica esistente se compatibile |
| Preventivo | Stati, numerazione, importi e collegamento cliente | Non trattare automaticamente un preventivo come fattura |
| Fattura | Presenza di una vera entità fattura e campi contabili immutabili | Se assente, definire conversione esplicita e tracciata |
| Pagamento | Importi in centesimi, valuta, stato pending/verified/rejected, idempotenza | Il client non può verificare né alterare il saldo |
| Audit | Eventi append-only e autorizzazioni | Registrare le transizioni autorevoli nella stessa transazione |

## Prossimi controlli tecnici in ambiente isolato

1. Confermare il progetto database usato dalla build pubblicata senza esporre chiavi o segreti.
2. Esportare solo i metadati necessari: colonne, tipi, nullabilità, chiavi, indici, trigger, funzioni e policy RLS.
3. Verificare la relazione autenticazione → `profiles.id` e le policy effettive per due utenti sintetici.
4. Confrontare la struttura effettiva con `quickquote-site/supabase/incassi_schema_draft.sql` e produrre una migrazione incrementale solo dopo la revisione.
5. Eseguire test su un progetto isolato: accesso incrociato, doppio pagamento, richieste ripetute, saldo concorrente e fattura contestata.
6. Solo dopo il superamento dei test, pianificare una distribuzione con backup e procedura di rollback.

## Cosa non è ancora dimostrato

- Che lo schema Incassi sia stato eseguito su PostgreSQL.
- Che RLS impedisca davvero l'accesso tra utenti.
- Che le procedure server-side descritte in `IMPRESAFLOW_SERVER_WORKFLOWS.md` siano implementate.
- Che esista un flusso reale di invio email/PEC o di verifica bancaria.
- Che Incassi sia pronto per produzione o vendita.

Questa ricognizione serve a evitare modifiche al database sbagliato e a definire i controlli necessari; non cambia alcun dato o schema.
