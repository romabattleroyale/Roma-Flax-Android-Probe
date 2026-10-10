# ImpresaFlow Incassi — checklist di verifica tecnica

Questo documento è un piano di test, non una certificazione. Nessun test database è dichiarato superato finché non viene eseguito contro un progetto Supabase isolato.

## Bloccanti prima di applicare lo schema
- [ ] Confermare la struttura reale di `public.customers`, in particolare `id`, `user_id` e tipi delle colonne.
- [ ] Verificare che l'indice univoco composto su `customers(id, user_id)` sia compatibile con i dati esistenti e non fallisca per duplicati.
- [ ] Applicare la migrazione solo su un progetto di prova vuoto o ripristinabile.
- [ ] Controllare che tutte le tabelle e le policy siano create senza errori, nell'ordine previsto.
- [ ] Verificare che il ruolo anonimo non possa leggere o modificare dati.

## Test di isolamento tra utenti
Usare due account autenticati indipendenti (A e B), due clienti e due fatture differenti.
- [ ] A legge solo fatture, pagamenti, solleciti, piani, rate ed eventi di A.
- [ ] B non può leggere né modificare righe di A cambiando UUID, parametri o richieste dirette.
- [ ] A non può collegare una propria fattura al cliente di B.
- [ ] A non può collegare pagamenti o rate a fatture/piani di B.
- [ ] Le operazioni fallite non lasciano dati parziali.

## Test di pagamenti e saldo
- [ ] Ogni nuovo pagamento creato dal browser nasce in stato `pending`.
- [ ] Un pagamento pending non riduce il saldo verificato.
- [ ] Il browser non può promuovere un pagamento a `verified`, modificare `verified_at` o alterare/eliminare un pagamento verificato.
- [ ] La procedura server-side verifica importo e saldo con transazione atomica e blocco/concorrenza.
- [ ] Due pagamenti concorrenti non possono causare un saldo verificato negativo.
- [ ] Le correzioni a pagamenti verificati sono tracciate e non cancellano silenziosamente la storia.
- [ ] La fattura si chiude solo dopo verifica e saldo pari a zero.

## Test di solleciti e piani
- [ ] Il browser può creare solo bozze di sollecito; approvazione e invio richiedono una procedura server-side autorizzata.
- [ ] Il browser non può falsificare `approved_by`, `approved_at`, `sent_at` o riferimenti di consegna.
- [ ] Le fatture contestate bloccano la normale sequenza di sollecito.
- [ ] Il browser non può dichiarare accettato un piano di rientro.
- [ ] Una rata risulta pagata solo se collegata a un pagamento verificato.
- [ ] La somma delle rate corrisponde al totale del piano al centesimo.
- [ ] Una promessa di pagamento resta distinta da un pagamento ricevuto.

## Altri test pre-rilascio
- [ ] Validazione di importi, date, stringhe vuote, duplicati e input anomali.
- [ ] Nessuna credenziale `service_role` o segreto è presente nel codice client o nel repository.
- [ ] Audit log generato da percorsi server-side fidati; un utente non può fabbricare eventi autorevoli.
- [ ] Backup e ripristino verificati; definita conservazione, esportazione e cancellazione.
- [ ] Test di accessibilità e uso su smartphone.
- [ ] Revisione privacy/GDPR e revisione professionale dei testi amministrativi prima di usare dati reali.

## Limiti noti dell'attuale bozza
- Il modello SQL è per singolo proprietario `user_id`, non implementa ancora aziende condivise e ruoli multi-utente come richiesto dalla specifica.
- La bozza non contiene ancora funzioni server-side atomiche per verifica pagamenti, approvazione/invio solleciti, accettazione piani e audit.
- La compatibilità con lo schema reale `customers` non è stata verificata.
- Le policy devono essere testate con due utenti reali di prova; la presenza di RLS da sola non prova l'isolamento.
- La demo HTML usa dati fittizi in memoria e non costituisce un sistema di contabilità o di incasso.
