# ImpresaFlow Incassi — Specifica MVP

## Obiettivo
Modulo per aiutare il titolare a controllare fatture scadute, registrare incassi e preparare solleciti verificabili. Assiste il creditore: non è un'agenzia di recupero crediti, non fornisce consulenza legale e non garantisce l'incasso.

Questa specifica descrive il lavoro da realizzare; non dichiara che le funzioni siano già implementate.

## Principi inderogabili
1. Nessun sollecito viene inviato senza approvazione esplicita di un utente autorizzato.
2. Una promessa di pagamento non è un pagamento.
3. Una proposta di rateizzazione non è un accordo accettato.
4. Un accordo accettato non prova che le rate siano state pagate.
5. Un pagamento parziale riduce il residuo solo dopo registrazione e verifica.
6. Una contestazione sospende la sequenza ordinaria dei solleciti finché non viene esaminata.
7. Il sistema non applica automaticamente interessi, penali o spese senza regole verificate e approvazione appropriata.
8. Ogni modifica significativa crea un evento storico; non si sovrascrive la cronologia.
9. I dati di un'azienda devono essere isolati da quelli di tutte le altre aziende.
10. In caso di dubbio sul saldo, sulla fattura o sul destinatario, il sistema blocca l'invio e chiede una verifica.

## Ambito MVP

### Incluso
- Anagrafica cliente e collegamento alla fattura.
- Importo originario, scadenza, importo pagato e saldo residuo.
- Registrazione di pagamenti totali e parziali.
- Elenco scadenze con filtri: in scadenza, scadute, da verificare, contestate, con promessa, con rateizzazione, saldate.
- Bozze di sollecito personalizzabili.
- Revisione e approvazione manuale prima dell'invio.
- Registrazione manuale dell'invio e del relativo canale; integrazione email reale in una fase successiva.
- Gestione delle risposte del cliente.
- Proposta di piano di rientro con rate, date e arrotondamento controllato.
- Registro cronologico degli eventi.
- Esportazione dei dati della singola posizione.

### Non incluso nel primo MVP
- Invio automatico senza supervisione.
- Recupero crediti per conto terzi.
- Garanzia di pagamento o di recupero.
- Calcolo automatico non verificato di interessi, penali o spese.
- Addebiti, pagamenti online e riconciliazione bancaria automatica.
- Decisioni legali automatizzate.
- App Android nativa; prima si valida la versione web responsiva.

## Stati della posizione
- in_scadenza
- scaduta_da_verificare
- pronta_per_bozza
- bozza_in_revisione
- approvata_da_inviare
- sollecito_registrato
- promessa_di_pagamento
- rateizzazione_proposta
- rateizzazione_accettata
- pagamento_parziale
- contestata_sospesa
- verifica_professionale
- saldata_chiusa

Gli stati sono derivati dagli eventi e dal saldo, con transizioni controllate. La chiusura è consentita solo se il saldo è pari a zero e il pagamento è stato verificato. Una posizione contestata non deve avanzare automaticamente nella sequenza ordinaria.

## Modello dati logico

### Company
- id
- name
- created_at

### Membership
- company_id
- user_id
- role: owner, admin, operator, viewer

### Customer
- id
- company_id
- name
- email (facoltativa)
- phone (facoltativo)
- created_at, updated_at

### Invoice
- id
- company_id
- customer_id
- invoice_number
- issue_date
- due_date
- original_amount_minor (intero in centesimi, mai floating point)
- currency
- status
- created_at, updated_at

### Payment
- id
- company_id
- invoice_id
- amount_minor (intero in centesimi)
- payment_date
- verification_status: pending, verified, rejected
- reference (facoltativa)
- created_by
- created_at

Il saldo è calcolato come importo originario meno pagamenti verificati, con controlli che impediscono saldi negativi non autorizzati.

### Reminder
- id
- company_id
- invoice_id
- stage
- draft_subject
- draft_body
- status: draft, approved, sent, cancelled
- approved_by, approved_at
- sent_at, channel, delivery_reference
- created_at, updated_at

### PaymentPlan
- id
- company_id
- invoice_id
- status: draft, proposed, accepted, declined, cancelled, completed
- total_amount_minor
- created_by
- accepted_at (solo dopo accettazione documentata)
- created_at, updated_at

### PaymentPlanInstallment
- id
- company_id
- payment_plan_id
- sequence_number
- due_date
- amount_minor
- status: scheduled, paid, late, disputed
- payment_id (facoltativo, collegato a un pagamento verificato)

### ActivityEvent
- id
- company_id
- invoice_id
- actor_user_id (null per eventi di sistema)
- event_type
- event_timestamp
- summary
- metadata (minimizzata, senza segreti o dati non necessari)

Tutte le tabelle contenenti dati di business devono avere company_id e controlli di accesso server-side. Il client non può decidere autonomamente il proprio company_id o ruolo.

## Flusso operativo
1. L'utente registra o importa una fattura e verifica cliente, numero, importo e scadenza.
2. Il sistema mostra la posizione come da verificare; non presume che ogni fattura scaduta sia ancora dovuta.
3. L'utente controlla pagamenti, note di credito, contestazioni e contatti.
4. Se idonea, il sistema prepara una bozza di messaggio.
5. Un utente autorizzato approva il testo, il destinatario e l'importo.
6. L'invio viene registrato solo dopo l'azione effettiva; approvazione e invio restano eventi distinti.
7. La risposta del cliente viene registrata come promessa, pagamento già effettuato da verificare, contestazione, richiesta copia, richiesta rate o nessuna risposta.
8. Il sistema suggerisce il prossimo passo; non invia autonomamente messaggi ripetitivi.
9. I pagamenti verificati aggiornano il residuo e la situazione delle rate.
10. La chiusura avviene quando il residuo è zero e la verifica è completata.

## Piano di rientro e arrotondamenti
- Una bozza non è un accordo.
- La proposta deve indicare saldo di riferimento, numero di rate, importo, scadenze e condizioni da confermare.
- Le rate sono calcolate in centesimi. La differenza dovuta all'arrotondamento viene assegnata esplicitamente all'ultima rata.
- Le scadenze generate devono essere controllate per date non valide e mesi con diverso numero di giorni.
- L'accettazione va registrata con data, metodo e prova disponibile; non si deve simulare una firma o un'accettazione.
- Una rata è pagata solo se collegata a un pagamento verificato.

## Sicurezza, privacy e affidabilità
- Autenticazione sicura e autorizzazione server-side per ogni operazione.
- Isolamento multi-azienda testato contro accessi incrociati.
- Ruoli con privilegi minimi; soltanto ruoli autorizzati approvano i solleciti.
- Protezione di segreti e credenziali, HTTPS, backup e procedura di ripristino.
- Log di audit minimizzati; niente credenziali o contenuti superflui nei log.
- Politica di conservazione, cancellazione ed esportazione dei dati da definire prima del lancio.
- Solleciti sobri e riservati; nessuna comunicazione del debito a terzi non autorizzati.
- Informative, basi giuridiche e processi GDPR da sottoporre a verifica professionale prima dell'uso con dati reali.
- Verificare caso per caso l'applicabilità della normativa sui ritardi di pagamento; non presentare interessi o spese come automaticamente dovuti.

## Criteri di accettazione
- Un pagamento parziale verificato riduce correttamente il residuo al centesimo.
- Un pagamento non verificato non riduce il saldo definitivo.
- Una fattura contestata resta sospesa e non genera il prossimo sollecito ordinario.
- Nessun messaggio può essere inviato senza approvazione e controllo finale del destinatario.
- Bozza approvata, approvazione e invio sono eventi distinti nello storico.
- Una promessa di pagamento crea un promemoria di controllo, non un pagamento fittizio.
- Il piano di rateizzazione gestisce correttamente arrotondamenti e date.
- La fattura non viene chiusa se il saldo verificato è maggiore di zero.
- Un utente di un'azienda non può leggere o modificare dati di un'altra azienda.
- L'esportazione include fattura, pagamenti verificati, residuo, comunicazioni registrate e cronologia accessibile all'utente.
- Test di permessi, validazione input, errori di rete, duplicati e ripristino prima del rilascio.

## Fasi consigliate
1. Backend, autenticazione, aziende, ruoli e schema dati.
2. Fatture, pagamenti parziali e calcolo saldo.
3. Scadenziario, stati e cronologia.
4. Bozze, approvazione manuale e risposte cliente.
5. Piani di rientro e scadenze delle rate.
6. Test di sicurezza, privacy, backup ed esportazione.
7. Solo dopo: invio email integrato, collegamenti di pagamento e app Android.

## Nota di rilascio
Questo documento è una specifica di prodotto per la revisione. Non attesta che schema database, autenticazione, invio email, pagamenti o controlli di sicurezza siano già stati implementati o verificati.
