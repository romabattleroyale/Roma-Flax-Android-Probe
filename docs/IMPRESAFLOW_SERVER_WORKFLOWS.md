# ImpresaFlow Incassi — contratto delle operazioni server-side

Stato: specifica tecnica per implementazione e revisione. Non è codice deployato e non abilita operazioni in un database.

## Regole comuni

- Le operazioni autorevoli devono essere eseguite da funzioni database/RPC o API server-side con autenticazione verificata.
- L'identità del proprietario deriva dalla sessione autenticata; non fidarsi di `user_id`, ruoli, importi di saldo o campi di audit inviati dal client.
- Non esporre la chiave Supabase `service_role` nel browser. Se una funzione usa privilegi elevati, deve controllare esplicitamente l'utente e ogni record interessato.
- Ogni operazione che cambia uno stato autorevole scrive un evento di audit nello stesso commit/transazione.
- Le richieste ripetute devono essere idempotenti, per evitare doppie registrazioni quando la rete ritenta.
- Errori di autorizzazione, saldo, stato o concorrenza devono annullare l'intera operazione; niente aggiornamenti parziali.
- Le bozze possono essere modificabili dall'utente autorizzato; approvazioni, invii, verifiche e accettazioni devono avere una prova distinta.

## Operazioni richieste

### 1. `register_payment_pending`
**Input logico:** fattura, importo in centesimi, data pagamento, riferimento facoltativo, chiave idempotenza.

**Controlli:** sessione autenticata; fattura appartenente all'utente; fattura non annullata; importo intero positivo; data valida; nessun campo client può dichiarare il pagamento verificato.

**Risultato:** pagamento `pending`, evento di audit di registrazione. Il saldo residuo verificato non cambia.

### 2. `verify_payment`
**Input logico:** ID pagamento, esito verificato/rifiutato, motivazione obbligatoria per rifiuto, chiave idempotenza.

**Controlli:** percorso riservato a un ruolo autorizzato lato server; identità/permessi controllati; blocco transazionale della fattura e dei pagamenti correlati; pagamento ancora pending; importo non superiore al residuo; valuta coerente; nessun duplicato. Per pagamenti concorrenti, ricalcolare il saldo dentro la transazione dopo aver acquisito il lock.

**Risultato:** stato verificato o rifiutato, data di verifica server-generated e evento audit. Chiudere la fattura solo se il totale verificato raggiunge esattamente il totale dovuto e la fattura non è contestata/annullata. Un importo eccedente deve essere rifiutato o messo in revisione manuale, mai corretto in silenzio.

### 3. `create_reminder_draft`
**Input logico:** fattura, fase, oggetto e testo.

**Controlli:** proprietà fattura; saldo residuo positivo; fattura non contestata né annullata; dati destinatario presenti; contenuto coerente con la fase; nessuna aggiunta automatica non verificata di interessi o spese.

**Risultato:** bozza soltanto. Non invia email/PEC e non dichiara un invio.

### 4. `approve_and_send_reminder`
**Input logico:** bozza, canale, destinatario confermato, chiave idempotenza.

**Controlli:** ruolo autorizzato; revisione esplicita del testo finale; fattura ancora sollecitabile; saldo aggiornato; nessuna contestazione o pagamento in verifica che richieda sospensione; destinatario confermato; canale configurato. Per invio email/PEC, usare un provider lato server e registrare soltanto l'esito effettivamente restituito dal provider.

**Risultato:** approvazione e invio separati logicamente; evento audit. Se il provider fallisce, non registrare come inviato. Non simulare ricevute o consegne.

### 5. `propose_payment_plan`
**Input logico:** fattura, date e importi delle rate.

**Controlli:** fattura di proprietà dell'utente e non chiusa/annullata; saldo verificato aggiornato; rate positive; date ordinate; somma delle rate uguale al residuo concordato, al centesimo; nessuna rata duplicata. La proposta non è accettazione.

**Risultato:** piano `proposed` e rate programmate, evento audit. Non modificare il saldo della fattura.

### 6. `record_plan_acceptance`
**Input logico:** piano, prova di accettazione, canale/data della prova.

**Controlli:** verifica dell'accettazione effettiva e autorizzazione; non accettare solo perché il proprietario ha premuto un pulsante senza prova. La prova può contenere dati personali: conservare il minimo necessario, con accessi e retention definiti.

**Risultato:** piano `accepted`, data server-generated e audit. L'accettazione non significa che le rate siano pagate.

### 7. `record_dispute` e `resolve_dispute`
**Input logico:** fattura, motivo sintetico, esito/revisione.

**Controlli:** autorizzazione; minimizzazione dei dati; motivazione tracciata. Una contestazione attiva sospende i normali solleciti automatici. La riattivazione richiede revisione esplicita e un evento audit.

## Modello di stato e contabilità

- `pending` non è denaro incassato e non riduce il saldo.
- `verified` riduce il saldo soltanto dopo la transazione di verifica.
- `rejected` non riduce il saldo.
- Una promessa di pagamento non riduce il saldo.
- Un piano proposto o accettato non riduce il saldo; ogni rata incide solo tramite pagamento verificato.
- Una fattura chiusa non deve riaprirsi o chiudersi per aggiornamenti client non autorizzati.
- Le note descrittive non sostituiscono la prova di pagamento o di accettazione.

## Condizioni di test obbligatorie prima di implementare l'invio

1. Due utenti non possono invocare operazioni sugli oggetti dell'altro, neppure conoscendone gli UUID.
2. Due verifiche concorrenti sullo stesso residuo non producono saldo negativo né doppio conteggio.
3. Un retry della stessa richiesta non duplica pagamento, sollecito, piano o evento.
4. Un invio fallito non appare come inviato.
5. Una fattura contestata non riceve solleciti ordinari.
6. Nessun percorso client può impostare direttamente stati autorevoli, date di verifica, approvazione, invio o accettazione.
7. Tutti i cambi di stato autorevoli hanno eventi audit non modificabili dal browser.
8. Le procedure sono testate in un progetto Supabase isolato con dati sintetici.

## Dipendenze ancora da decidere/verificare

- Schema effettivo delle tabelle clienti e fatture già presenti.
- Modello azienda/membri/ruoli: l'attuale bozza SQL è solo per proprietario singolo.
- Fonte di verifica dei pagamenti: inserimento manuale documentato o futura integrazione bancaria; non è disponibile automaticamente.
- Provider di email/PEC, requisiti e costi prima di implementare invio reale.
- Politica di conservazione, esportazione e cancellazione dei dati.
