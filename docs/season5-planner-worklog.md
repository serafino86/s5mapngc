# Season 5 Planner Worklog

Ultimo aggiornamento: 2026-04-03

## Obiettivo

Portare il planner locale Season 5 a uno stato utile per pianificazione umana di Last War, prendendo come riferimento operativo:

- la mappa live Season 5 interactive
- la guida live Golden Palace conquest

Il focus non e` soltanto "replicare la UI", ma costruire uno strumento locale che:

- mostri POI strategici coerenti con la mappa live;
- permetta assegnazione territori e path planning;
- integri regole di conquista Season 5;
- suggerisca piu` soluzioni confrontabili da validare a occhio.

## Cosa e` stato fatto

### 1. Recupero del contesto dopo la chiusura del terminale

E` stato ricostruito il contesto di lavoro partendo dal filesystem locale e dalla cronologia Codex.

Progetto identificato:

- `/home/enrico/last-war-map-planner`

File principali coinvolti:

- `maps/planner/index.html`
- `assets/planner.js`
- `assets/styles.css`
- `assets/data/season-5-poi-points.json`
- `assets/data/season-5-strategic-poi.json`
- `assets/data/season-5-territories.json`

### 2. Verifica della source of truth

E` stato verificato che la fonte corretta per l'allineamento e` la pagina live:

- route live pubblica della mappa Season 5 interactive

Sono stati ispezionati:

- l'HTML pubblico della route live;
- il chunk route loader:
  `/_next/static/chunks/app/maps/season-5/interactive/page-940676f6bd574c22.js`
- il chunk condiviso contenente la logica del planner:
  `/_next/static/chunks/2437-a33108db525ce6f0.js`

Da quel bundle sono stati verificati direttamente:

- chiavi storage `area-map-*`;
- configurazione Season 5 con `CrystalGold/h` e `Influence`;
- limiti `8 cities / 12 strongholds`;
- supporto reale a import/export grids;
- regole di conteggio citta`/stronghold piu` vicine alla logica live.

### 3. Riallineamento del planner locale

Il planner locale e` stato corretto per evitare di usare solo il dump raw da 1989 celle come se fosse gia` un planner strategico pronto.

Interventi principali:

- caricamento combinato di:
  - `season-5-strategic-poi.json`
  - `season-5-poi-points.json`
- normalizzazione POI con campi piu` vicini al bundle reale:
  - `name`
  - `sourceName`
  - `category`
  - `isCapitol`
- mantenimento della logica a `grids`, `alliances`, `selectedAllianceId`, `pathSteps`
- aggiunta import/export JSON delle grid

### 4. Integrazione regole Season 5 Golden Palace

Dal guide live sono state integrate nel planner locale le regole base operative:

- il Golden Palace e` attaccabile il sabato di Week 5, 6 e 7;
- la battaglia parte alle 13:00 server time;
- servono terre adiacenti tramite `lv 10 Bank Stronghold` oppure `lv 10 City`;
- ci sono 4 cannoni attorno al Golden Palace;
- il Golden Palace assegna `1.8m influence`.

Queste regole sono state esposte anche nella UI del planner come promemoria operativo.

### 5. Primo simulatore di percorso

E` stato aggiunto un pulsante di simulazione del percorso:

- selettore rango alleanza:
  - `elite`
  - `contender`
  - `rising`
- generazione di un percorso strategico verso il Golden Palace
- uso dei `lv 10 Bank Stronghold` centrali come entry point strategici
- uso degli outpost centrali come obiettivi assimilati ai cannoni

### 6. Evoluzione da una singola rotta a piu` piani candidati

Il simulatore e` stato esteso per produrre piu` soluzioni invece di una sola.

Ogni piano candidato mostra:

- steps
- CrystalGold/h stimato
- Influence stimata
- numero di cannoni/outpost toccati
- numero di citta`
- numero di stronghold
- score sintetico

Ogni piano ha un pulsante `Apply` per essere applicato manualmente alla grid dell'alleanza selezionata.

## Cosa si sta facendo ora

Il simulatore viene raffinato per rendere il confronto umano piu` utile.

Direzioni attive:

- penalita` per marcia lunga;
- valutazione esposizione in contaminated land;
- penalita` su cannoni piu` contesi;
- valore del lato d'ingresso verso il Golden Palace;
- penalita` sui percorsi inefficienti.

L'obiettivo e` evitare una proposta unica opaca e mostrare invece poche varianti leggibili, comparabili e difendibili.

## Stato attuale del planner

Ad oggi il planner locale:

- carica i POI Season 5 da dataset locali derivati dal bundle pubblico;
- consente creazione/duplicazione/eliminazione grid;
- consente creazione e selezione alleanze;
- salva stato in `localStorage`;
- genera e visualizza path di conquista;
- esporta e importa le grid in JSON;
- produce piu` soluzioni simulate per la conquista del Golden Palace.

## Limiti attuali

Il simulatore non e` ancora un modello "perfetto" del gameplay reale.

Limiti noti:

- il dataset locale e` ricostruito da dati pubblici estratti, non da API ufficiali del gioco;
- il concetto di "Bank Stronghold" e` attualmente inferito dal layer `stronghold_territory` livello 10 centrale;
- il pathfinding usa euristiche topologiche sul dataset locale;
- la contesa reale tra alleanze avversarie non e` ancora modellata;
- il tempo di marcia e la pressione sui cannoni sono stimati, non simulati con formule di gioco ufficiali.

## Prossimi passi suggeriti

1. Distinguere meglio i 4 cannoni reali dai restanti outpost.
2. Validare i lati d'ingresso contro screenshot o osservazione visiva della pagina live.
3. Inserire una scorecard esplicita per ogni piano con breakdown completo.
4. Aggiungere un confronto "economy first" vs "speed first" vs "capture first".
5. Valutare, in un secondo momento, un backend o salvataggio collaborativo solo dopo aver fissato bene il frontend.
