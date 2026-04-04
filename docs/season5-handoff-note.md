# Season 5 Planner Handoff

## Stato attuale

- Il planner Season 5 e` allineato a una simulazione `day-by-day` multialleanza di benchmark.
- Il modello intra-server e` `cooperativo`, non ostile:
  - `Main`
  - `Vanguard A`
  - `Vanguard B`
  - `Wing 4` .. `Wing 10`
- Le alleanze del nostro server si coordinano secondo priorita` e possono fare `cooperative handoff` su terre rilasciate.
- Il planner UI supporta anche percorso manuale.

## Punto esatto in cui riprendere

Il prossimo lavoro non e` piu` sul benchmark astratto ma sulla UI reale del planner:

1. verificare nel browser che la simulazione della `Main` sia davvero meno dispersiva
2. valutare se la preview automatica vada bene per gli `R4`
3. migliorare l'editing manuale del percorso:
   - release manuali
   - handoff manuali
   - riordino step
4. se serve, collegare meglio la logica del benchmark alla UI timeline

## File chiave

- `assets/planner.js`
- `assets/styles.css`
- `maps/planner/index.html`
- `scripts/season5-multialliance-benchmark.js`
- `docs/season5-conquest-protocol.md`
- `docs/season5-multialliance-benchmark-report.md`
- `docs/season5-planner-todo.md`

## Stato benchmark

Ultimo stato utile:

- `0` violazioni protocollo
- `mainTrunkCaptures: 9` nel benchmark dedicato
- `mainSideCaptures: 0` nel benchmark dedicato
- `invalidMainTrunkHops: 0`
- `invalidMainAllCaptureHops: 0`

Nota:

- la UI del planner e il benchmark non sono la stessa cosa
- il benchmark ora e` una base corretta da cui continuare
- la prossima validazione deve essere soprattutto visiva e operativa nel planner reale
