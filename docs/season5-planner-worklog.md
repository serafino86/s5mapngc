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

## Aggiornamento 2026-04-09: Fix meccaniche reali da video

### Fonti usate

- Transcript video EN (outpost conquest rules)
- Guida video DE (Season 5 overview)
- Transcript video EN "season wrap-up" (QB18)
- Transcript video EN "first look Season 5" (QB18)

### Regole reali confermate

**Outpost (8 Warzone Outpost):**
- Ogni server ha il proprio outpost nel ring interno attorno al Golden Palace
- Attacco: Venerdi` di Week 5, 6, 7 — 12h dopo il daily reset
- Tutti gli 8 outpost aprono in simultanea
- Ogni outpost conquistato da 100k influence a TUTTE le alleanze della war zone
- Per attaccare serve terra adiacente (bank o city che tocca l'outpost)
- Tutti i membri del war zone possono partecipare all'attacco e alla difesa
- L'alleanza con piu` contributo conquista e controlla l'outpost
- Se non viene conquistato al 100%, il proprietario lo mantiene

**Golden Palace:**
- Attacco: Sabato di Week 5, 6, 7 — 13:00 server time
- Richiede terra adiacente tramite lv10 Bank o lv10 City
- 4 outpost cardinali (N/S/E/W) funzionano anche come posizioni cannone durante l'assedio
- Valore: 1.8M influence

**Strategia duale:**
- Alleanza A: GP + 4 citta` lv10 → challenge rewards
- Alleanza B: tutti gli 8 outpost (800k influence totale) → challenge rewards
- Le due strategie non si escludono a vicenda e possono essere coordinate

**Scadenza territori:**
- **Bank**: scadono ogni **3 giorni** — servono riconquiste periodiche
- **City**: scadono ogni **6 giorni**
- Difendere una citta` la protegge solo per UNA finestra — chi attacca e vince la tiene 6 giorni
- Le bank sono relativamente piu` facili da conquistare (100% capture in una battaglia = 3 giorni)

**Timing di battaglia:**
- 3 finestre di battaglia al giorno
- Ogni alleanza puo` impostare fino a 15 ore consecutive di immunita`
- Di fatto restano ~2 finestre di attacco utili per 24h

**Trade post:**
- NON contano come territorio per l'adiacenza
- 3 battaglie totali per i trade post nella season
- 3 battaglie totali per il Golden Palace

### Fix applicati al planner (commit deb0b89)

- Aggiunto `influence: 100000` a tutti gli 8 outpost in `season-5-poi-points.json`
- Rimosso double-count dell'influence del GP in `simulateConquestPath`
- Corretto timing nella nota (Venerdi` outpost, Sabato GP)
- Aggiunto profilo simulazione "Outpost Raid" per tutti i ranghi
- Aggiunta funzione `outpostAdjacentEntries()` per trovare bank adiacenti agli outpost
- Aggiunto piano Outpost Raid con bonus 100k influence

### Fix applicati al planner (commit successivo — 2026-04-09)

- Aggiunto `territory.bankExpiryDays: 3` e `cityExpiryDays: 6` in SEASON_CONFIG
- Aggiunto `battle.immuneWindowHours: 7` (finestra effettiva, non max)
- Aggiornata nota simulazione con info su scadenza bank/city e trade post
- Aggiornato worklog con tutte le regole reali confermate

## Stato attuale del planner

Ad oggi il planner locale:

- carica i POI Season 5 da dataset locali derivati dal bundle pubblico;
- consente creazione/duplicazione/eliminazione grid;
- consente creazione e selezione alleanze;
- salva stato in `localStorage`;
- genera e visualizza path di conquista;
- esporta e importa le grid in JSON;
- produce soluzioni simulate per conquista Golden Palace (Balanced, Cannon Control, Direct Breach);
- produce simulazione "Outpost Raid" verso gli outpost del settore;
- mostra timing corretti e regole reali nella nota di simulazione.

## Limiti attuali

- Il dataset locale e` ricostruito da dati pubblici, non da API ufficiali;
- La **scadenza di bank (3gg) e city (6gg)** NON e` ancora modellata nella simulazione — i piani mostrano giorni minimi di conquista, non l'intero ciclo stagionale;
- La contesa reale tra alleanze avversarie non e` modellata;
- Il tempo di marcia reale non e` simulato;
- I 4 outpost cardinali come posizioni cannone non sono distinti dagli altri 4 nella visualizzazione.

## Prossimi passi suggeriti

1. Modellare la scadenza bank/city nel simulatore (ogni 3/6 giorni le territory tornano neutrali).
2. Distinguere visivamente i 4 outpost cardinali (cannon positions) dagli altri 4.
3. Validare i lati d'ingresso verso GP contro screenshot live.
4. Aggiungere confronto "economy first" vs "speed first" vs "capture first".
5. Eventuale backend/salvataggio collaborativo solo dopo aver fissato il frontend.
