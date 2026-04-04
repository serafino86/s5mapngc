# Season 5 Planner TODO

## Obiettivo

Rifondare il planner Season 5 come simulatore `day-by-day` di conquista territori, invece di trattarlo come semplice pathfinder verso il Golden Palace.

Documento di riferimento vincolante:

- [season5-conquest-protocol.md](/home/enrico/last-war-map-planner/docs/season5-conquest-protocol.md)

Il problema attuale non e` piu` il rendering base della mappa: la mappa ora carica `1989` aree reali e la simulazione produce preview. Il problema vero e` la logica del piano, che oggi privilegia troppo il corridoio minimo di `bank` e non modella bene:

- scelta giornaliera delle conquiste
- terre da mantenere
- terre/citta` da abbandonare
- finestre war day
- `3 battle slots/day`
- `15-hour ceasefire / safe time`
- slot `city / bank`
- resa cumulata della progressione

## Stato attuale

Gia` corretto:

- uso delle `1989` aree reali del dataset
- preview del piano direttamente sulla mappa
- route giornaliera con badge giorno
- gestione base di `release` nel piano
- piu` soluzioni candidate in sidebar

Non corretto:

- il piano resta troppo `bank-heavy`
- le `release` sono ancora correttive, non native nel modello
- il planner ottimizza la distanza al centro, non la strategia settimanale
- i piani proposti non rappresentano bene scelte umane alternative

## TODO Prioritario

### 1. Rifare il modello di simulazione

Obiettivo:

- sostituire il modello `shortest path to lv10 bank` con un modello di stato giornaliero

Da fare:

- introdurre uno `state` esplicito dell'alleanza per ogni giorno
- tracciare:
  - territori posseduti
  - territori candidati conquistabili
  - slot citta` disponibili
  - slot bank disponibili
  - war day / non-war day
  - accesso al Golden Palace
- separare chiaramente:
  - `capture`
  - `release`
  - `hold`

Criterio di completamento:

- il motore deve poter spiegare per ogni giorno cosa prende, cosa lascia e perche'

### 2. Rifare la frontier expansion

Obiettivo:

- smettere di trattare il progresso come una singola linea verso il centro

Da fare:

- costruire la `frontier` dei territori attaccabili dal posseduto corrente
- generare candidati giornalieri dalla frontier, non da un solo path fisso
- distinguere tra:
  - territori di progresso
  - territori di resa
  - territori ponte da mantenere

Criterio di completamento:

- da uno stesso start il planner deve poter generare aperture diverse, non solo lo stesso corridoio di bank

### 2b. Classificare i territori posseduti

Obiettivo:

- far smettere il planner di scegliere e rilasciare territori senza ruolo

Da fare:

- classificare i territori posseduti in:
  - `keep`
  - `bridge`
  - `yield`
  - `release-candidate`
- proteggere i nodi ponte necessari alla frontier
- impedire release autodistruttive

Criterio di completamento:

- ogni release deve colpire solo territori classificati come `release-candidate`, salvo eccezioni esplicite

### 3. Rendere native le release

Obiettivo:

- le `release` devono essere decisioni strategiche del piano, non fallback tecnici

Da fare:

- introdurre una policy esplicita di `release`
- classificare i territori posseduti in:
  - da mantenere
  - sacrificabili
  - essenziali per adiacenza
  - ad alto valore economico
- evitare release di territori ancora necessari alla frontier

Criterio di completamento:

- ogni `release` deve avere una motivazione leggibile e coerente

### 4. Modellare bene i giorni di guerra

Obiettivo:

- le citta` non devono entrare nel piano come se fossero catturabili ogni giorno

Da fare:

- separare `war day` e `non-war day`
- fare in modo che il piano accumuli preparazione nei giorni normali
- riservare le catture di citta` ai war day
- aggiungere visibilita` in UI su:
  - giorni di preparazione
  - giorni di push citta`

Criterio di completamento:

- il piano deve mostrare una sequenza credibile di preparazione + exploit war day

### 4b. Introdurre battle slots e safe time

Obiettivo:

- allineare il motore alle regole ufficiali Season 5 confermate dalla guida Zendesk

Da fare:

- modellare `3 fixed battle slots/day`
- introdurre `1 hour` per slot come vincolo logico
- introdurre `15-hour ceasefire / safe time` per alleanza
- distinguere nel piano:
  - slot di battaglia usati
  - contesto safe time dell'alleanza
  - azioni pianificate per slot, non solo per giorno

Criterio di completamento:

- il piano non deve piu` apparire come progresso continuo nella giornata, ma come sequenza coerente con le finestre ufficiali di battaglia senza inventare blocchi di attacco non confermati

Nota aggiornata:

- dopo verifica su fonte ufficiale, il `rest time` non e` solo contesto: blocca gli attacchi nemici ai propri `Cities/Banks` in quello slot
- il benchmark va quindi corretto su questo punto prima di considerarsi pienamente allineato alle fonti

### 5. Ridefinire lo score dei piani

Obiettivo:

- il ranking deve premiare strategie realistiche, non solo path corti

Da fare:

- ridurre il peso implicito della sola raggiungibilita`
- aumentare il peso di:
  - resa cumulata
  - qualita` delle citta`
  - efficienza delle release
  - robustezza della frontier
  - tempo per arrivare a condizione Palace
- penalizzare:
  - corridoi di soli bank
  - troppe release
  - piani che rompono la continuita` del fronte

Criterio di completamento:

- il top 3 deve mostrare piani davvero diversi e leggibili

### 5b. Separare score giornaliero e score finale

Obiettivo:

- evitare che il planner premi solo l'esito finale ignorando la qualita` della progressione

Da fare:

- introdurre punteggio giornaliero delle scelte
- introdurre punteggio finale di stato
- combinare i due livelli senza schiacciare tutto sulla distanza dal centro

Criterio di completamento:

- il piano migliore deve essere plausibile sia giorno per giorno sia come esito finale

### 5c. Aggiungere benchmark validator

Obiettivo:

- smettere di correggere il motore "a occhio" senza un controllo ripetibile

Da fare:

- creare uno script che confronti:
  - percorso benchmark scritto
  - percorso base prodotto dal software
  - adiacenza severa del protocollo
  - salti non validi
- scrivere un report aggiornabile in `docs/`
- usare il report come gate prima di considerare valido un fix del motore

Criterio di completamento:

- esiste un report scritto aggiornabile e usato come controllo di coerenza del motore

### 5d. Aggiungere benchmark multialleanza giorno per giorno

Obiettivo:

- simulare `10` alleanze dello stesso warzone su stato condiviso per leggere meglio takeover, release e avanzamento reale della `Main`

Da fare:

- eseguire la simulazione giorno per giorno, non come path singolo
- rispettare nello script i vincoli base del protocollo:
  - `3 battle slots/day`
  - `2 bank captures/day`
  - city solo nei war day
- far avanzare tutte le alleanze in ordine di priorita`
- tracciare handoff cooperativi su terre rilasciate dalle alleanze piu` alte in classifica
- produrre un report scritto confrontabile con il benchmark geometrico della `Main`

Criterio di completamento:

- esiste un report dedicato che mostra per ogni giorno:
  - azioni delle 10 alleanze
  - handoff / release
  - stato city / bank
  - violazioni protocollo

### 6. Migliorare l'output per validazione umana

Obiettivo:

- il planner deve aiutare l'occhio umano a giudicare il piano

Da fare:

- mostrare per ogni giorno:
  - capture
  - release
  - slot occupati dopo il giorno
  - resa totale dopo il giorno
- distinguere visivamente sulla mappa:
  - territori presi
  - territori rilasciati
  - territori mantenuti come ponte
- aggiungere una vista sintetica giornaliera

Criterio di completamento:

- un utente deve poter capire il piano senza leggere il codice

## TODO Tecnico

### Dataset e classificazione

- verificare se `road` va trattata sempre come citta` ai fini della simulazione o solo come territorio speciale
- verificare se i `trade_post` devono restare fuori dal grafo principale oppure in un grafo separato di supporto
- verificare eccezioni centrali `lv 6 / lv 10` nel modello di accesso Palace

### Architettura codice

- separare la logica di simulazione da `planner.js` in moduli/funzioni piu` piccole
- introdurre funzioni pure per:
  - calcolo frontier
  - selezione candidate captures
  - release policy
  - scoring
  - timeline giornaliera
- aggiungere test di regressione sul motore

### Test da fare

- start periferico `city lv1`
- start su `bank`
- alleanza gia` piena di bank
- alleanza gia` piena di citta`
- caso con molte release necessarie
- caso con piu` aperture equivalenti verso il centro
- caso con battle slot sfavorevoli
- caso con safe time che blocca il war push previsto

## Ordine di esecuzione

1. rifare lo state model giornaliero
2. rifare la frontier expansion
3. integrare release native
4. rifare lo score
5. migliorare l'output umano
6. aggiungere test

## Definizione di successo

Il refactor e` considerato riuscito quando:

- il planner genera piani diversi davvero sensati
- il top plan non e` piu` un semplice corridoio minimo di bank
- le release sono comprensibili e giustificate
- i war day influenzano davvero la forma del piano
- una simulazione osservata da umano risulta leggibile e difendibile
