# ImpresaFlow — registro rischi prima del collaudo

Stato aggiornato: revisione statica del candidato SQL iniziale. Questo documento non certifica la sicurezza né l'eseguibilità del database.

## Esito della revisione statica

Il file `quickquote-site/supabase/impresaflow_initial_install_review.sql` contiene 10 tabelle e 7 funzioni trigger, con RLS abilitata sulle 10 tabelle elencate. I delimitatori dollar-quoted risultano pari e non sono state rilevate istruzioni esplicite `DROP TABLE`, `TRUNCATE` o `DELETE FROM public...` nella scansione statica.

Questi controlli non equivalgono a un parser PostgreSQL e non provano che lo script sia eseguibile.

## Bloccanti identificati

1. **Nessuna funzione server-side di fiducia nel candidato SQL.** La scansione statica non rileva funzioni `SECURITY DEFINER` né `SET search_path`. Le operazioni privilegiate (verifica pagamento, approvazione/invio sollecito, accettazione piano) non devono essere autorizzate da una modifica del browser o da un trigger client-side.
2. **Compatibilità con lo schema esistente non dimostrata.** Verificare colonne e tipi reali di `public.customers`, `public.profiles` e `public.quotes`, nonché chiavi e indici richiesti.
3. **RLS non ancora testata con due utenti.** La presenza di policy nel file non dimostra che siano corrette contro richieste dirette o UUID manipolati.
4. **Saldo e pagamenti devono essere atomici.** La somma dei pagamenti verificati, la prevenzione dei duplicati e l'aggiornamento del saldo devono avvenire in una transazione server-side, con idempotenza e controlli di autorizzazione.
5. **Nessun invio reale deve partire automaticamente.** Prima dell'invio vanno ricontrollati importo residuo, contestazioni, note di credito/storni, destinatario e cronologia; mantenere approvazione esplicita e audit log.
6. **Il candidato combinato è soltanto per un progetto nuovo e vuoto.** Non eseguirlo nel progetto Supabase esistente finché non si è stabilito se contiene dati o tabelle utilizzate da altre funzioni.

## Procedura sicura prevista

- Conservare il progetto Supabase attuale senza applicare questo script.
- Creare, se necessario, un progetto di prova separato e vuoto; controllare piano/costi prima di crearne uno aggiuntivo.
- Eseguire prima un parser/linter SQL e poi la migrazione in ambiente di prova.
- Risolvere gli errori uno alla volta, senza dati reali.
- Testare isolamento A/B, ruoli, pagamenti duplicati/concorrenza, contestazioni, rate e audit.
- Solo dopo revisione e collaudo, pianificare una migrazione controllata per il progetto destinato all'app.

## Stato

- [x] Revisione statica di base e inventario tabelle/funzioni/policy
- [x] Registrazione dei rischi e dei blocchi
- [ ] Parsing/esecuzione PostgreSQL reale
- [ ] Test RLS con due utenti indipendenti
- [ ] Implementazione e test delle operazioni server-side privilegiate
- [ ] Revisione privacy, backup e recupero
- [ ] Collegamento del frontend e collaudo end-to-end

Non dichiarare il database pronto per la produzione finché tutti i blocchi sopra non sono risolti.
