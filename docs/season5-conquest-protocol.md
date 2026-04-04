# Season 5 Conquest Protocol

## Scopo

Definire un protocollo chiaro per la logica di conquista del planner Season 5.

Il planner deve restare uno strumento di supporto all'operatore:

- le proposte automatiche sono modificabili a mano
- catture, release e priorita` possono essere corrette manualmente
- il benchmark serve per leggere meglio il piano, non per sostituire il giudizio umano

Il planner non deve piu` essere trattato come:

- pathfinder lineare verso il centro
- solver di distanza minima
- sequenza greedily ordinata di bank

Deve invece simulare una progressione di alleanza `day-by-day` con:

- frontier reale
- vincoli di adiacenza
- limiti di citta` e bank
- war day
- release esplicite
- obiettivo strategico settimanale

## Fonti di base

Regole confermate o supportate da fonti pubbliche:

- `Cities + Banks` sostituiscono il vecchio sistema Cities + Strongholds
- `3 fixed battle slots/day`, ciascuno da `1 hour`
- ogni alleanza imposta `1` slot come `rest time`
- durante il `rest time` gli altri non possono attaccare i tuoi `Cities/Banks`
- anche durante il proprio `rest time` un'alleanza puo` ancora attaccare fuori dal rest time avversario
- limite iniziale: `8 cities / 4 strongholds`
- ogni city catturata aumenta il limite stronghold fino a `12`
- le city si possono prendere solo `Wednesday` e `Saturday`
- i bank si possono catturare ogni giorno
- serve `adjacent land`
- non sono validi salti diagonali
- Golden Palace attaccabile solo con terra adiacente tramite `lv 10 Bank Stronghold` o `lv 10 City`

Fonti:

- [S5 Alliance Battle Time & Rest Time – Last War Support](https://firstfungroup.zendesk.com/hc/en-us/articles/45137396113939-S5-Alliance-Battle-Time-Rest-Time)
- [S5 FAQ & MAP – Last War Support](https://firstfungroup.zendesk.com/hc/en-us/articles/45133752118419-S5-FAQ-MAP-NEW)
- [Bank Strongholds – Last War Support](https://firstfungroup.zendesk.com/hc/en-us/articles/45399739051283-Bank-Strongholds)
- [season-5-bank-strongholds](https://cpt-hedge.com/guides/season-5-bank-strongholds)
- [season-5-golden-palace-conquest](https://cpt-hedge.com/guides/season-5-golden-palace-conquest)
- [season-5-trade-war-tradeposts](https://cpt-hedge.com/guides/season-5-trade-war-tradeposts)

## Distinzione obbligatoria

Il planner deve distinguere sempre tra:

- `regola ufficiale`
- `inferenza pubblica`
- `ipotesi di benchmark`

Stato attuale:

- `3 slot/day`, `Wednesday/Saturday`, `rest time` difensivo: `regola ufficiale`
- `2 bank captures/day`: `inferenza pubblica`, non ancora confermata da una fonte ufficiale trovata
- `10 alleanze per warzone`, `big rilasciano e small prendono in carico con handoff cooperativo`: `ipotesi di benchmark`, utile per simulare ma non regola ufficiale

Per il benchmark intra-server corrente vale inoltre questa regola operativa:

- tra le nostre alleanze il modello e` `pacifico e coordinato`
- la classifica interna decide priorita`, handoff e copertura
- il benchmark non deve simulare ostilita` reale tra alleanze dello stesso server

## Principio 1: La conquista non e` un path, e` uno stato

Il planner deve ragionare su uno `state` dell'alleanza.

Lo state minimo per ogni giorno e`:

- territori posseduti
- frontier dei territori attaccabili
- city slots usati / disponibili
- bank slots usati / disponibili
- battle slots disponibili / bloccati
- rest time dell'alleanza
- resa corrente:
  - `Influence`
  - `CrystalGold/h`
- nodi ponte da mantenere
- adiacenza Palace pronta o non pronta

Conseguenza implementativa:

- il motore non deve iniziare da `shortestPath(frontier, center)`
- il motore deve partire da `owned -> frontier -> candidate actions`

## Principio 2: L'adiacenza deve essere severa

Regola:

- un territorio e` attaccabile solo se tocca terra posseduta in modo diretto
- no diagonali
- no corner-touch
- no scorciatoie geometriche per solo contatto apparente

Eccezioni:

- eccezioni centrali confermate dalle guide per `level 6 strongholds`
- Golden Palace va trattato come `palace zone`, includendo il fango / area immediatamente attorno alla capitale

Conseguenza implementativa:

- l'adiacenza deve usare contatto reale o bordo condiviso
- il planner non deve mai poter saltare livelli in modo non spiegabile

## Principio 3: Ogni giorno ha una funzione

I giorni non sono equivalenti.

In piu`, dentro il giorno esistono finestre ufficiali di battaglia:

- `3 fixed battle slots/day`
- ogni slot dura `1 hour`
- `1` slot per alleanza e` marcato come `rest time`
- nota ufficiale: durante il proprio rest time puoi ancora lanciare attacchi fuori dal rest time avversario

Conseguenza:

- non basta modellare solo `war day / build day`
- il planner deve distinguere `battle slot` e `rest time`
- il rest time non e` una tregua generale
- durante il rest time avversario non puoi attaccare i suoi `Cities/Banks`

### Build day

Obiettivo:

- prendere bank utili al progresso
- preparare la frontier per il war day
- evitare conquiste inutili solo per “andare avanti”

Limiti:

- max `2 bank captures/day`

### War day

Obiettivo:

- convertire la preparazione in city progression
- prendere le city di livello piu` utili disponibili
- solo dopo valutare bank aggiuntivi, se coerenti

Limiti:

- city solo `Wednesday / Saturday`

Conseguenza implementativa:

- il planner deve distinguere `preparation days` e `conversion days`
- il war day non deve essere un giorno qualsiasi con `+1` budget
- il planner non deve assumere disponibilita` continua 24/7
- la readiness del piano va letta anche rispetto alle finestre utili, non solo rispetto al numero del giorno

## Principio 4: Le release fanno parte del piano

Le release non sono bugfix.

Le release sono un'azione strategica con costo.

Ogni release deve rispondere a una di queste ragioni:

- liberare slot bank
- liberare slot city
- rientrare nel limite bank dopo una city
- eliminare un territorio a bassa resa non piu` necessario alla frontier

Una release non deve mai colpire:

- start area
- nodo ponte ancora utile
- nodo necessario per i prossimi target
- territorio ad alta resa senza ragione forte

Conseguenza implementativa:

- il planner deve classificare i territori posseduti in:
  - `keep`
  - `bridge`
  - `yield`
  - `release-candidate`

## Principio 5: Il piano deve scegliere tra candidati, non seguire una riga

Per ogni giorno il motore deve:

1. calcolare la frontier
2. filtrare i candidati validi del giorno
3. classificare i candidati per ruolo
4. scegliere un set giornaliero coerente

Ruoli dei candidati:

- `progress`:
  apre frontier migliori
- `yield`:
  aumenta resa in modo importante
- `bridge`:
  collega verso obiettivi successivi
- `palace-access`:
  avvicina o abilita accesso Palace

Conseguenza implementativa:

- il planner non deve piu` ordinare i nodi come unica lista lineare
- il planner deve comporre una giornata come set di scelte

## Principio 6: La città vale piu` della sua sola distanza

Le city non vanno prese solo per:

- aumentare il cap stronghold
- stare sul percorso verso il centro

Le city valgono anche per:

- resa
- forma del fronte
- apertura di ulteriori stronghold
- qualità del war day

Conseguenza implementativa:

- il punteggio di una city deve combinare:
  - livello
  - resa
  - effetto sul cap bank
  - utilita` sulla frontier

## Principio 7: Il Golden Palace non e` il primo obiettivo, e` una condizione

Errore da evitare:

- ottimizzare subito per “arrivare al Palace”

Modello corretto:

- il Palace e` una `condition readiness`
- prima si costruisce un fronte valido
- poi si prepara l'accesso adiacente
- poi si sfrutta la finestra corretta

Conseguenza implementativa:

- il planner deve separare:
  - `progress toward center`
  - `palace access readiness`
  - `palace attack timing`

## Protocollo operativo del motore

Per ogni simulazione:

1. leggere stato iniziale alleanza
2. validare lo `start`
3. inizializzare `owned`, `frontier`, `caps`, `yield`
4. ciclare giorno per giorno
5. per ogni giorno:
   - determinare `build day` o `war day`
   - generare candidati dalla frontier
   - classificare i candidati
   - scegliere le catture del giorno
   - decidere eventuali release
   - aggiornare stato
   - salvare snapshot giornaliero
6. valutare se:
   - il fronte migliora
   - la resa migliora
   - la readiness Palace migliora
7. ordinare i piani finali

## Regole di validazione del piano

Un piano e` da considerare sbagliato se:

- mostra salti non spiegabili di adiacenza
- sembra una singola linea di bank senza senso economico
- usa release casuali o autodistruttive
- riempie i war day con catture tutte uguali senza motivo
- non protegge i territori ponte
- tratta il Palace come unico obiettivo

Un piano e` plausibile se:

- mostra build day preparatori
- usa i war day per city di valore
- mantiene coerenza di frontier
- limita le release al necessario
- costruisce accesso Palace come conseguenza, non come scorciatoia

## Cosa deve cambiare nel codice

Priorita` immediata:

1. sostituire la logica `route first` con `state first`
2. aggiungere classificazione `keep / bridge / yield / release`
3. ricalcolare la frontier ogni giorno
4. separare scoring giornaliero e scoring finale
5. validare adiacenza con regola severa
6. introdurre `battle slots/day` e `safe time` come vincoli veri del motore

Priorita` successiva:

1. differenziare meglio i profili `Balanced / Direct / Cannon`
2. dare piu` visibilita` a readiness Palace
3. migliorare la leggibilita` delle release

## Decisione pratica

Da questo punto in poi ogni modifica al planner deve essere accettata solo se rispetta questo protocollo.

Se una patch migliora il rendering ma viola il protocollo di conquista, va considerata sbagliata.
