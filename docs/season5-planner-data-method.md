# Season 5 Planner Data And Method

Ultimo aggiornamento: 2026-04-03

## Scopo del documento

Documentare:

- quali dati usa il planner locale;
- da dove arrivano;
- come vengono interpretati;
- come viene costruita la simulazione dei percorsi.

Questo documento serve come riferimento tecnico per continuare il lavoro senza dover ogni volta ricostruire le assunzioni.

## Fonti dati

### 1. Pagina live di riferimento

Fonte primaria funzionale:

- route live pubblica della mappa Season 5 interactive

Uso:

- verificare struttura reale della pagina;
- confermare naming e concetti della UI;
- verificare che esista davvero un planner alleanze Season 5.

### 2. Guide live di riferimento

Fonte primaria regole Golden Palace:

- guida live pubblica della conquista Golden Palace Season 5

Uso:

- finestre di attacco;
- condizione di adiacenza;
- presenza dei 4 cannoni;
- ricompensa `1.8m influence`;
- contesto strategico del Golden Palace.

### 3. Bundle JavaScript pubblico del sito live

Fonti tecniche dirette:

- `/_next/static/chunks/app/maps/season-5/interactive/page-940676f6bd574c22.js`
- `/_next/static/chunks/2437-a33108db525ce6f0.js`

Uso:

- leggere chiavi storage;
- leggere configurazione Season 5;
- leggere struttura `grids / alliances / pathSteps`;
- verificare import/export grids;
- inferire parte della logica di conteggio.

## Dataset locali nel clone

### `assets/data/season-5-territories.json`

Ruolo:

- dataset raw dei territori Season 5 estratto dal bundle pubblico.

Contiene:

- `id`
- `name`
- `level`
- `buff`
- `coordinates`

Esempi di nomi:

- `Stronghold`
- `Grand Nexus`
- `Golden Palace`
- `Warzone Outpost`
- `Trade Post`
- `Coyote Town`
- `Derby Grounds`
- `Sand County`
- `Waterhold`
- `Small/Medium/Large/Mega/Colossal CrystalGold Mine`

### `assets/data/season-5-poi-points.json`

Ruolo:

- modello punti dettagliato derivato dal dataset raw.

Uso nel planner:

- city / zone
- trade posts
- crystal mines
- outposts
- stronghold territories

Campi rilevanti:

- `id`
- `sourceId`
- `sourceName`
- `category`
- `label`
- `shortLabel`
- `level`
- `x`, `y`
- `gridX`, `gridY`
- `width`, `height`
- `buff`
- `resources`

### `assets/data/season-5-strategic-poi.json`

Ruolo:

- sottoinsieme strategico piu` compatto dei POI principali.

Uso nel planner:

- `Golden Palace`
- `Grand Nexus`
- `Warzone Outpost`

Motivo:

- questi POI sono quelli piu` utili da esporre come marcatori strategici puliti.

## Modello dati usato nel planner

Nel file:

- `assets/planner.js`

il planner costruisce due insiemi distinti:

### `points`

Uso:

- insieme dei POI visibili e strategicamente rilevanti.

Attualmente include:

- strategic POI normalizzati
- regional zones
- trade posts
- crystal mines

Scopo:

- tenere la UI leggibile;
- evitare di renderizzare tutta la mappa raw come rumore.

### `allPoints`

Uso:

- insieme piu` ampio usato per lookup e simulazione.

Contiene:

- dati raw normalizzati
- strategic POI sovrascritti dove serve

Scopo:

- permettere al motore di simulazione di usare anche stronghold territories e nodi non esposti come elementi primari nella UI.

## Categorie principali interpretate dal planner

### `capital`

Interpretazione:

- `Golden Palace`

Valore:

- target finale della simulazione;
- assegna `1.8m influence`.

### `nexus`

Interpretazione:

- `Grand Nexus`

Valore:

- nodo strategico principale di warzone;
- usato anche come fallback di frontier iniziale.

### `outpost`

Interpretazione:

- `Warzone Outpost`

Valore:

- nel simulatore sono trattati come obiettivi simili ai cannoni centrali, in attesa di validazione piu` precisa.

### `regional_zone`

Interpretazione:

- zone/citta` come `Coyote Town`, `Waterhold`, `Derby Grounds`, `Sand County`

Valore:

- entrano nei conteggi citta`;
- generano risorse e influenza nel modello locale.

### `stronghold_territory`

Interpretazione:

- tessere territoriali di stronghold.

Valore:

- sono usate dal motore di simulazione per costruire accessi e traiettorie verso il centro;
- i `lv 10` centrali vengono usati come proxy dei `Bank Stronghold` richiesti dalla regola di accesso al Golden Palace.

Nota importante:

- questa e` una inferenza tecnica utile, non ancora una conferma assoluta del mapping perfetto tra tessera raw e stronghold di gameplay.

## Regole Season 5 codificate

Regole tratte dalla guida live:

- il Golden Palace e` attaccabile il sabato di Week 5, 6 e 7;
- la battaglia parte alle 13:00 server time;
- serve terra adiacente tramite `lv 10 Bank Stronghold` oppure `lv 10 City`;
- ci sono 4 cannoni attorno al Golden Palace;
- il Golden Palace assegna `1.8m influence`.

Queste regole non simulano il combattimento reale, ma guidano la logica di validazione del percorso.

## Come funziona la simulazione attuale

### 1. Scelta del frontier

Per l'alleanza selezionata:

- se ha gia` territori assegnati, si prende il punto posseduto piu` vicino al Golden Palace;
- altrimenti si usa un `Grand Nexus` come frontier di fallback.

### 2. Scelta dell'entry point

Vengono cercati i `stronghold_territory` livello 10 piu` centrali.

Attualmente questi sono usati come:

- proxy dei `lv 10 Bank Stronghold`
- ingressi validi per la simulazione di accesso al Golden Palace

### 3. Costruzione del percorso

Il planner costruisce un grafo semplice per vicinanza ortogonale:

- stesso asse `x` con distanza `<= 100`
- oppure stesso asse `y` con distanza `<= 100`

Su questo grafo viene calcolato un path BFS:

- frontier -> entry point
- entry point -> eventuali cannoni/outpost
- obiettivo finale -> Golden Palace

### 4. Profili di simulazione

Il planner genera profili differenti in base al rango:

- `elite`
- `contender`
- `rising`

Ogni rango produce varianti diverse, ad esempio:

- `Cannon Control`
- `Balanced Push`
- `Direct Breach`
- `Low Risk Push`

### 5. Metriche di piano

Per ogni piano vengono stimate:

- `steps`
- `marchCost`
- `contaminatedSteps`
- `contestedCannons`
- `inefficiency`
- `crystalGold`
- `influence`
- `cities`
- `strongholds`
- `cannons`
- `entrySide`

## Come viene calcolato il punteggio

Il piano riceve uno score euristico.

Componenti positive:

- accesso valido al Golden Palace
- influence totale
- CrystalGold/h
- numero cannoni utili
- valore del lato d'ingresso

Componenti negative:

- costo marcia
- passi in contaminated land
- cannoni contesi
- inefficienza del percorso

Questo score serve solo per ordinare le proposte, non per sostituire la valutazione umana.

## Validazione umana prevista

Il planner non applica automaticamente il piano migliore come unica verita`.

Flusso previsto:

1. selezione alleanza
2. selezione rango
3. simulazione
4. confronto visivo di piu` piani candidati
5. applicazione manuale del piano scelto con `Apply`

Questa scelta e` intenzionale:

- l'occhio umano resta il validatore finale;
- il simulatore e` un assistente, non un decisore assoluto.

## Assunzioni aperte da validare

1. I `lv 10 Bank Stronghold` reali coincidono in modo affidabile con i `stronghold_territory` livello 10 centrali nel dataset derivato.
2. I 4 cannoni della guida possono essere mappati utilmente sugli outpost centrali gia` presenti nel dataset.
3. Il grafo di adiacenza ortogonale e` sufficiente per produrre percorsi plausibili a livello strategico.
4. Il peso di contaminated land e contesa cannoni e` ragionevole ma non ancora tarato sul meta reale.

## File del progetto da tenere d'occhio

- `/home/enrico/last-war-map-planner/maps/planner/index.html`
- `/home/enrico/last-war-map-planner/assets/planner.js`
- `/home/enrico/last-war-map-planner/assets/styles.css`
- `/home/enrico/last-war-map-planner/assets/data/season-5-territories.json`
- `/home/enrico/last-war-map-planner/assets/data/season-5-poi-points.json`
- `/home/enrico/last-war-map-planner/assets/data/season-5-strategic-poi.json`
