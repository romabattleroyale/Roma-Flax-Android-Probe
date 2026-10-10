# QuickQuote Web — prima versione grafica

Questa cartella contiene la prima bozza responsive del sito pubblico QuickQuote.

## Cosa è presente
- Landing page italiana con hero, panoramica funzioni, passaggi, prezzi illustrativi, FAQ e footer.
- Layout responsive per desktop e smartphone.
- Menu mobile, FAQ espandibili e modali di anteprima.
- Testi che chiariscono quali funzioni non sono ancora operative.

## Cosa NON è ancora operativo
Questa versione è un prototipo front-end in un singolo file HTML. Non implementa ancora autenticazione, database, creazione/salvataggio di preventivi, generazione PDF, invio email, abbonamenti, né pagamenti PayPal/Stripe. I moduli sono volutamente dimostrativi e non inviano né salvano dati.

## Prossime fasi
1. Validare grafica e testi.
2. Convertire il prototipo in un'applicazione mantenibile, con pagine e componenti separati.
3. Scegliere e configurare il backend per account, dati clienti e preventivi.
4. Implementare il generatore PDF e i limiti Free/Pro.
5. Integrare i webhook di pagamento in ambiente sandbox.
6. Aggiungere privacy, cookie, condizioni di vendita e contatti reali.
7. Eseguire test su smartphone/desktop e collaudare prima del rilascio.

Non inserire segreti API in HTML o codice client.