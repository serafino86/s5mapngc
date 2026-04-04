# Season 5 Multi-alliance Benchmark Report

## Scopo

Simulare 10 alleanze dello stesso warzone giorno per giorno, con stato condiviso, per confrontare il motore con il protocollo logico e con un benchmark geometrico severo verso la capitale.

## Stato fonti

Allineato a fonti ufficiali:

- `3 battle slots/day`
- city solo `Wednesday / Saturday`
- `rest time` difensivo su `Cities/Banks`
- `Cities + Banks`
- `8 warzones`

Non ancora pienamente allineato a fonti ufficiali:

- il benchmark modella il blocco del `rest time` su `Cities/Banks`, ma oggi l'effetto e' limitato perche' il modello evita quasi tutto il conflitto diretto intra-server
- `2 bank captures/day` e` trattato come inferenza pubblica, non come regola ufficiale confermata
- `10 alleanze per warzone` e `big release -> small cooperative handoff` sono ipotesi di benchmark, non regole ufficiali

## Base fonti

- `Cities + Banks`
- `8 cities / 4 banks` iniziali con crescita del cap stronghold tramite city
- `3 fixed battle slots/day`
- `2 bank captures/day`
- city solo nei war day
- adiacenza severa senza diagonali
- accesso Palace tramite `lv10 Bank` o `lv10 City` adiacente
- 8 warzone sul continente Season 5

Riferimenti: `season5-conquest-protocol.md`, guida ufficiale Zendesk Season 5 Highlights, guide Season 5 su Cities/Banks/Golden Palace gia' raccolte nel protocollo.

## Scenario benchmark

- Warzone simulato: `WZ6`
- Alleanze simulate: `10`
- Giorni simulati: `10`
- Ordine di priorita': `WZ6 Main (P1) > WZ6 Vanguard A (P2) > WZ6 Vanguard B (P2) > WZ6 Wing 4 (P4) > WZ6 Wing 5 (P5) > WZ6 Wing 6 (P6) > WZ6 Wing 7 (P7) > WZ6 Wing 8 (P8) > WZ6 Wing 9 (P9) > WZ6 Wing 10 (P10)`
- Main alliance start: `poi:A122 Coyote Town Lv.1 [city]`
- Main strict benchmark target: `poi:I51 Stronghold Lv.10 [bank]`

## Esito sintetico

- Violazioni protocollo rilevate: `0`
- Handoff cooperativi su terre rilasciate dalle big: `14`
- Release totali nel benchmark: `44`
- Terre finali occupate dal server: `146`
- Influence finale del server: `21000000`
- CrystalGold/h finale del server: `1230`
- Main benchmark strict path: `30` nodi
- Main trunk catturato dal software: `9`
- Main side captures del software: `0`
- Main invalid trunk hops: `0`
- Main invalid all-capture hops: `0`

## Lettura contro protocollo

- Nel benchmark multialleanza il motore resta dentro i vincoli base del protocollo giorno per giorno.
- Il main trunk della Main alliance resta coerente con l'adiacenza severa.
- Anche la sequenza completa delle catture della Main alliance e' coerente nel benchmark.
- Il benchmark mostra il comportamento atteso del server: le big avanzano e rilasciano, mentre le minori prendono in carico dietro con handoff cooperativi.

## Main strict benchmark route

1. `poi:A122 Coyote Town Lv.1 [city]`
2. `poi:A13 Stronghold Lv.1 [bank]`
3. `poi:A14 Stronghold Lv.1 [bank]`
4. `poi:A15 Stronghold Lv.1 [bank]`
5. `poi:A16 Stronghold Lv.2 [bank]`
6. `poi:A17 Stronghold Lv.2 [bank]`
7. `poi:A18 Stronghold Lv.2 [bank]`
8. `poi:A19 Stronghold Lv.4 [bank]`
9. `poi:A20 Stronghold Lv.4 [bank]`
10. `poi:A21 Stronghold Lv.5 [bank]`
11. `poi:A22 Stronghold Lv.5 [bank]`
12. `poi:A33 Stronghold Lv.5 [bank]`
13. `poi:A44 Stronghold Lv.5 [bank]`
14. `poi:A55 Stronghold Lv.5 [bank]`
15. `poi:A66 Stronghold Lv.5 [bank]`
16. `poi:A77 Stronghold Lv.5 [bank]`
17. `poi:A88 Stronghold Lv.5 [bank]`
18. `poi:A99 Stronghold Lv.5 [bank]`
19. `poi:A110 Stronghold Lv.5 [bank]`
20. `poi:A121 Stronghold Lv.5 [bank]`
21. `poi:B111 Stronghold Lv.5 [bank]`
22. `poi:B112 Stronghold Lv.5 [bank]`
23. `poi:B113 Stronghold Lv.5 [bank]`
24. `poi:B114 Stronghold Lv.5 [bank]`
25. `poi:B115 Stronghold Lv.5 [bank]`
26. `poi:I55 Stronghold Lv.6 [bank]`
27. `poi:I54 Stronghold Lv.7 [bank]`
28. `poi:I53 Stronghold Lv.8 [bank]`
29. `poi:I52 Stronghold Lv.9 [bank]`
30. `poi:I51 Stronghold Lv.10 [bank]`

## Main software trunk captures

1. `poi:A3 Stronghold Lv.1 [bank]`
2. `poi:A4 Stronghold Lv.1 [bank]`
3. `poi:A5 Stronghold Lv.1 [bank]`
4. `poi:A6 Stronghold Lv.1 [bank]`
5. `poi:A7 Stronghold Lv.1 [bank]`
6. `poi:A8 Stronghold Lv.4 [bank]`
7. `poi:A9 Stronghold Lv.4 [bank]`
8. `poi:A10 Stronghold Lv.5 [bank]`
9. `poi:A11 Stronghold Lv.5 [bank]`

## Day-by-day

### Day 1 · Build day

- `WZ6 Main`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 4/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A3 Stronghold Lv.1 [bank]` [main-trunk]
  - S2 Capture `poi:A4 Stronghold Lv.1 [bank]` [main-trunk]
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Wing 4`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 3/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A47 Stronghold Lv.2 [bank]` [support-side]
  - S2 Capture `poi:A48 Stronghold Lv.3 [bank]` [support-side]
- `WZ6 Wing 5`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 3/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A37 Stronghold Lv.2 [bank]` [support-side]
  - S2 Capture `poi:A38 Stronghold Lv.3 [bank]` [support-side]
- `WZ6 Wing 6`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 3/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A70 Stronghold Lv.3 [bank]` [support-side]
  - S2 Capture `poi:A81 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 7`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 2/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A49 Stronghold Lv.3 [bank]` [support-side]
  - S2 Capture `poi:A50 Stronghold Lv.3 [bank]` [support-side]
- `WZ6 Wing 8`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 2/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A17 Stronghold Lv.2 [bank]` [support-side]
  - S2 Capture `poi:A18 Stronghold Lv.2 [bank]` [support-side]
- `WZ6 Wing 9`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 2/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A7 Stronghold Lv.1 [bank]` [support-side]
  - S2 Capture `poi:A8 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 10`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 2/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A51 Stronghold Lv.3 [bank]` [support-side]
  - S2 Capture `poi:A52 Stronghold Lv.4 [bank]` [support-side]

Violations:
- None

### Day 2 · Build day

- `WZ6 Main`: 2 captures, 1 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A5 Stronghold Lv.1 [bank]` [main-trunk]
  - Release `poi:A1 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A6 Stronghold Lv.1 [bank]` [main-trunk]
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Wing 4`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A35 Stronghold Lv.1 [bank]` [main-trunk]
  - S2 Capture `poi:A24 Stronghold Lv.1 [bank]` [main-trunk]
- `WZ6 Wing 5`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A14 Stronghold Lv.1 [bank]` [main-trunk]
  - S2 Capture `poi:A39 Stronghold Lv.3 [bank]` [support-side]
- `WZ6 Wing 6`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A82 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A83 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 7`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 4/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A60 Stronghold Lv.3 [bank]` [support-side]
  - S2 Capture `poi:A71 Stronghold Lv.3 [bank]` [support-side]
- `WZ6 Wing 8`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 4/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A19 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A20 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 9`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 4/5, Influence 100000, CrystalGold/h 18
  - S1 Capture `poi:A9 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A10 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 10`: 2 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 4/5, Influence 200000, CrystalGold/h 19
  - S1 Capture `poi:A53 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A54 Stronghold Lv.5 [bank]` [support-side]

Violations:
- None

### Day 3 · War day

- `WZ6 Main`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Wing 4`: 3 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 5/8, Influence 600000, CrystalGold/h 74
  - S1 Capture `poi:A156 Waterhold Lv.2 [city]` [war-day-side]
  - S2 Capture `poi:A126 Coyote Town Lv.1 [city]` [war-day-side]
  - S3 Capture `poi:A146 Waterhold Lv.2 [city]` [war-day-side]
- `WZ6 Wing 5`: 3 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 5/8, Influence 700000, CrystalGold/h 75
  - S1 Capture `poi:A165 Waterhold Lv.2 [city]` [war-day-side]
  - S2 Capture `poi:A143 Coyote Town Lv.1 [city]` [war-day-side]
  - S3 Capture `poi:A174 Waterhold Lv.2 [city]` [war-day-side]
- `WZ6 Wing 6`: 3 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 5/8, Influence 900000, CrystalGold/h 77
  - S1 Capture `poi:A179 Derby Grounds Lv.4 [city]` [war-day-side]
  - S2 Capture `poi:A157 Waterhold Lv.2 [city]` [war-day-side]
  - S3 Capture `poi:A137 Coyote Town Lv.1 [city]` [war-day-side]
- `WZ6 Wing 7`: 3 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 4/8, Influence 1300000, CrystalGold/h 81
  - S1 Capture `poi:A168 Derby Grounds Lv.4 [city]` [war-day-side]
  - S2 Capture `poi:A167 Lawless Road Lv.3 [city]` [war-day-side]
  - S3 Capture `poi:A158 Derby Grounds Lv.4 [city]` [war-day-side]
- `WZ6 Wing 8`: 3 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 4/8, Influence 1500000, CrystalGold/h 83
  - S1 Capture `poi:A203 Sand County Lv.5 [city]` [main-trunk]
  - S2 Capture `poi:A193 Derby Grounds Lv.4 [city]` [war-day-side]
  - S3 Capture `poi:A202 Sand County Lv.5 [city]` [war-day-side]
- `WZ6 Wing 9`: 3 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 4/8, Influence 1400000, CrystalGold/h 82
  - S1 Capture `poi:A212 Sand County Lv.5 [city]` [main-trunk]
  - S2 Capture `poi:A192 Derby Grounds Lv.4 [city]` [war-day-side]
  - S3 Capture `poi:A182 Derby Grounds Lv.4 [city]` [war-day-side]
- `WZ6 Wing 10`: 3 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 4/8, Influence 1600000, CrystalGold/h 84
  - S1 Capture `poi:A216 Sand County Lv.5 [city]` [main-trunk]
  - S2 Capture `poi:A196 Derby Grounds Lv.4 [city]` [war-day-side]
  - S3 Capture `poi:A206 Sand County Lv.5 [city]` [war-day-side]

Violations:
- None

### Day 4 · Build day

- `WZ6 Main`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Wing 4`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 7/8, Influence 600000, CrystalGold/h 74
  - S1 Capture `poi:A59 Stronghold Lv.3 [bank]` [support-side]
  - S2 Capture `poi:A57 Stronghold Lv.2 [bank]` [support-side]
- `WZ6 Wing 5`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 7/8, Influence 700000, CrystalGold/h 75
  - S1 Capture `poi:A40 Stronghold Lv.3 [bank]` [support-side]
  - S2 Capture `poi:A41 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 6`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 7/8, Influence 900000, CrystalGold/h 77
  - S1 Capture `poi:A95 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A106 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 7`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 6/8, Influence 1300000, CrystalGold/h 81
  - S1 Capture `poi:A72 Stronghold Lv.3 [bank]` [support-side]
  - S2 Capture `poi:A73 Stronghold Lv.3 [bank]` [support-side]
- `WZ6 Wing 8`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 6/8, Influence 1500000, CrystalGold/h 83
  - S1 Capture `poi:A32 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:A43 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 9`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 6/8, Influence 1400000, CrystalGold/h 82
  - S1 Capture `poi:A22 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:A33 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 10`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 6/8, Influence 1600000, CrystalGold/h 84
  - S1 Capture `poi:A66 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:A77 Stronghold Lv.5 [bank]` [support-side]

Violations:
- None

### Day 5 · Build day

- `WZ6 Main`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Wing 4`: 2 captures, 1 releases, 0 handoffs, Cities 4/8, Banks 8/8, Influence 600000, CrystalGold/h 74
  - S1 Capture `poi:A68 Stronghold Lv.2 [bank]` [support-side]
  - Release `poi:A35 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A79 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 5`: 2 captures, 1 releases, 1 handoffs, Cities 4/8, Banks 8/8, Influence 700000, CrystalGold/h 75
  - S1 Capture `poi:A36 Stronghold Lv.2 [bank]` [main-trunk]
  - Release `poi:A25 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A35 Stronghold Lv.1 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 4
- `WZ6 Wing 6`: 2 captures, 1 releases, 0 handoffs, Cities 4/8, Banks 8/8, Influence 900000, CrystalGold/h 77
  - S1 Capture `poi:A107 Stronghold Lv.5 [bank]` [support-side]
  - Release `poi:A70 Stronghold Lv.3 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A108 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 7`: 2 captures, 0 releases, 1 handoffs, Cities 4/8, Banks 8/8, Influence 1300000, CrystalGold/h 81
  - S1 Capture `poi:A70 Stronghold Lv.3 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 6
  - S2 Capture `poi:A74 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 8`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 8/8, Influence 1500000, CrystalGold/h 83
  - S1 Capture `poi:A16 Stronghold Lv.2 [bank]` [main-trunk]
  - S2 Capture `poi:A15 Stronghold Lv.1 [bank]` [main-trunk]
- `WZ6 Wing 9`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 8/8, Influence 1400000, CrystalGold/h 82
  - S1 Capture `poi:A44 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:A55 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 10`: 2 captures, 0 releases, 0 handoffs, Cities 4/8, Banks 8/8, Influence 1600000, CrystalGold/h 84
  - S1 Capture `poi:A88 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:A99 Stronghold Lv.5 [bank]` [support-side]

Violations:
- None

### Day 6 · War day

- `WZ6 Main`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 3 captures, 0 releases, 0 handoffs, Cities 2/8, Banks 3/6, Influence 300000, CrystalGold/h 37
  - S1 Capture `poi:A25 Stronghold Lv.1 [bank]` [main-trunk]
  - S2 Capture `poi:A26 Stronghold Lv.2 [bank]` [main-trunk]
  - S3 Capture `poi:A154 Waterhold Lv.2 [city]` [war-day-side]
- `WZ6 Wing 4`: 3 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 8/11, Influence 1300000, CrystalGold/h 132
  - S1 Capture `poi:A139 Derby Grounds Lv.4 [city]` [war-day-side]
  - S2 Capture `poi:A145 Waterhold Lv.2 [city]` [war-day-side]
  - S3 Capture `poi:A127 Coyote Town Lv.1 [city]` [war-day-side]
- `WZ6 Wing 5`: 3 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 8/11, Influence 1400000, CrystalGold/h 133
  - S1 Capture `poi:A195 Derby Grounds Lv.4 [city]` [war-day-side]
  - S2 Capture `poi:A164 Waterhold Lv.2 [city]` [war-day-side]
  - S3 Capture `poi:A142 Coyote Town Lv.1 [city]` [war-day-side]
- `WZ6 Wing 6`: 3 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 8/11, Influence 2300000, CrystalGold/h 142
  - S1 Capture `poi:A190 Sand County Lv.5 [city]` [war-day-side]
  - S2 Capture `poi:A189 Derby Grounds Lv.4 [city]` [war-day-side]
  - S3 Capture `poi:A181 Sand County Lv.5 [city]` [war-day-side]
- `WZ6 Wing 7`: 3 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 8/11, Influence 2400000, CrystalGold/h 143
  - S1 Capture `poi:A198 Derby Grounds Lv.4 [city]` [war-day-side]
  - S2 Capture `poi:A188 Derby Grounds Lv.4 [city]` [war-day-side]
  - S3 Capture `poi:A177 Lawless Road Lv.3 [city]` [war-day-side]
- `WZ6 Wing 8`: 3 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 8/11, Influence 2900000, CrystalGold/h 148
  - S1 Capture `poi:A215 Sand County Lv.5 [city]` [war-day-side]
  - S2 Capture `poi:A183 Derby Grounds Lv.4 [city]` [war-day-side]
  - S3 Capture `poi:A214 Sand County Lv.5 [city]` [war-day-side]
- `WZ6 Wing 9`: 3 captures, 0 releases, 0 handoffs, Cities 6/8, Banks 9/10, Influence 2400000, CrystalGold/h 126
  - S1 Capture `poi:A213 Sand County Lv.5 [city]` [war-day-side]
  - S2 Capture `poi:B45 Stronghold Lv.5 [bank]` [support-side]
  - S3 Capture `poi:B126 Sand County Lv.5 [city]` [war-day-side]
- `WZ6 Wing 10`: 3 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 8/11, Influence 3000000, CrystalGold/h 149
  - S1 Capture `poi:A217 Sand County Lv.5 [city]` [war-day-side]
  - S2 Capture `poi:A186 Derby Grounds Lv.4 [city]` [war-day-side]
  - S3 Capture `poi:A205 Sand County Lv.5 [city]` [war-day-side]

Violations:
- None

### Day 7 · Build day

- `WZ6 Main`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 2/8, Banks 3/6, Influence 300000, CrystalGold/h 37
  - No actions
- `WZ6 Wing 4`: 2 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 10/11, Influence 1300000, CrystalGold/h 132
  - S1 Capture `poi:A91 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A102 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 5`: 2 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 10/11, Influence 1400000, CrystalGold/h 133
  - S1 Capture `poi:A42 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A31 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 6`: 2 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 10/11, Influence 2300000, CrystalGold/h 142
  - S1 Capture `poi:A109 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:A110 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 7`: 2 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 10/11, Influence 2400000, CrystalGold/h 143
  - S1 Capture `poi:A86 Stronghold Lv.4 [bank]` [support-side]
  - S2 Capture `poi:A87 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 8`: 2 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 10/11, Influence 2900000, CrystalGold/h 148
  - S1 Capture `poi:A21 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:A30 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 9`: 2 captures, 1 releases, 0 handoffs, Cities 6/8, Banks 10/10, Influence 2400000, CrystalGold/h 126
  - S1 Capture `poi:B56 Stronghold Lv.5 [bank]` [support-side]
  - Release `poi:A7 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:B67 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 10`: 2 captures, 0 releases, 0 handoffs, Cities 7/8, Banks 10/11, Influence 3000000, CrystalGold/h 149
  - S1 Capture `poi:B89 Stronghold Lv.5 [bank]` [support-side]
  - S2 Capture `poi:B100 Stronghold Lv.5 [bank]` [support-side]

Violations:
- None

### Day 8 · Build day

- `WZ6 Main`: 1 captures, 1 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - Release `poi:A2 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A7 Stronghold Lv.1 [bank]` [main-trunk]
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 2/8, Banks 3/6, Influence 300000, CrystalGold/h 37
  - No actions
- `WZ6 Wing 4`: 2 captures, 1 releases, 0 handoffs, Cities 7/8, Banks 11/11, Influence 1300000, CrystalGold/h 132
  - S1 Capture `poi:A103 Stronghold Lv.5 [bank]` [support-side]
  - Release `poi:A46 Stronghold Lv.2 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A104 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 5`: 2 captures, 1 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 1400000, CrystalGold/h 133
  - S1 Capture `poi:A46 Stronghold Lv.2 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 4
  - Release `poi:A14 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A29 Stronghold Lv.2 [bank]` [support-side]
- `WZ6 Wing 6`: 2 captures, 1 releases, 0 handoffs, Cities 7/8, Banks 11/11, Influence 2300000, CrystalGold/h 142
  - S1 Capture `poi:A121 Stronghold Lv.5 [bank]` [support-side]
  - Release `poi:A81 Stronghold Lv.4 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:B111 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 7`: 2 captures, 1 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 2400000, CrystalGold/h 143
  - S1 Capture `poi:A81 Stronghold Lv.4 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 6
  - Release `poi:A49 Stronghold Lv.3 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A98 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 8`: 2 captures, 1 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 2900000, CrystalGold/h 148
  - S1 Capture `poi:A14 Stronghold Lv.1 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 5
  - Release `poi:A15 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A28 Stronghold Lv.2 [bank]` [support-side]
- `WZ6 Wing 9`: 2 captures, 2 releases, 0 handoffs, Cities 6/8, Banks 10/10, Influence 2400000, CrystalGold/h 126
  - Release `poi:A8 Stronghold Lv.4 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:B78 Stronghold Lv.5 [bank]` [support-side]
  - Release `poi:A9 Stronghold Lv.4 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:B34 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 10`: 2 captures, 1 releases, 0 handoffs, Cities 7/8, Banks 11/11, Influence 3000000, CrystalGold/h 149
  - S1 Capture `poi:B101 Stronghold Lv.5 [bank]` [support-side]
  - Release `poi:A52 Stronghold Lv.4 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:B102 Stronghold Lv.5 [bank]` [support-side]

Violations:
- None

### Day 9 · Build day

- `WZ6 Main`: 2 captures, 2 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - Release `poi:A3 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A8 Stronghold Lv.4 [bank]` [main-trunk]
  - Release `poi:A4 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A9 Stronghold Lv.4 [bank]` [main-trunk]
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 2/8, Banks 3/6, Influence 300000, CrystalGold/h 37
  - No actions
- `WZ6 Wing 4`: 2 captures, 2 releases, 0 handoffs, Cities 7/8, Banks 11/11, Influence 1300000, CrystalGold/h 132
  - Release `poi:A47 Stronghold Lv.2 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A105 Stronghold Lv.5 [bank]` [support-side]
  - Release `poi:A57 Stronghold Lv.2 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A116 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 5`: 2 captures, 2 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 1400000, CrystalGold/h 133
  - Release `poi:A35 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A47 Stronghold Lv.2 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 4
  - Release `poi:A37 Stronghold Lv.2 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A52 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 6`: 2 captures, 2 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 2300000, CrystalGold/h 142
  - Release `poi:A82 Stronghold Lv.4 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A57 Stronghold Lv.2 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 4
  - Release `poi:A58 Stronghold Lv.2 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:I11 Stronghold Lv.6 [bank]` [support-side]
- `WZ6 Wing 7`: 2 captures, 2 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 2400000, CrystalGold/h 143
  - Release `poi:A50 Stronghold Lv.3 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A82 Stronghold Lv.4 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 6
  - Release `poi:A60 Stronghold Lv.3 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A76 Stronghold Lv.5 [bank]` [support-side]
- `WZ6 Wing 8`: 2 captures, 2 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 2900000, CrystalGold/h 148
  - Release `poi:A17 Stronghold Lv.2 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A3 Stronghold Lv.1 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Main
  - Release `poi:A14 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A27 Stronghold Lv.2 [bank]` [support-side]
- `WZ6 Wing 9`: 2 captures, 2 releases, 1 handoffs, Cities 6/8, Banks 10/10, Influence 2400000, CrystalGold/h 126
  - Release `poi:A10 Stronghold Lv.5 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A17 Stronghold Lv.2 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 8
  - Release `poi:A17 Stronghold Lv.2 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:B79 Stronghold Lv.4 [bank]` [support-side]
- `WZ6 Wing 10`: 2 captures, 2 releases, 1 handoffs, Cities 7/8, Banks 11/11, Influence 3000000, CrystalGold/h 149
  - Release `poi:A53 Stronghold Lv.4 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A50 Stronghold Lv.3 [bank]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 7
  - Release `poi:A51 Stronghold Lv.3 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:B103 Stronghold Lv.5 [bank]` [support-side]

Violations:
- None

### Day 10 · War day

- `WZ6 Main`: 2 captures, 2 releases, 0 handoffs, Cities 1/8, Banks 5/5, Influence 100000, CrystalGold/h 18
  - Release `poi:A5 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A10 Stronghold Lv.5 [bank]` [main-trunk]
  - Release `poi:A6 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S2 Capture `poi:A11 Stronghold Lv.5 [bank]` [main-trunk]
- `WZ6 Vanguard A`: 0 captures, 0 releases, 0 handoffs, Cities 1/8, Banks 1/5, Influence 100000, CrystalGold/h 18
  - No actions
- `WZ6 Vanguard B`: 0 captures, 0 releases, 0 handoffs, Cities 2/8, Banks 3/6, Influence 300000, CrystalGold/h 37
  - No actions
- `WZ6 Wing 4`: 3 captures, 2 releases, 0 handoffs, Cities 8/8, Banks 11/12, Influence 2100000, CrystalGold/h 157
  - Release `poi:A24 Stronghold Lv.1 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A37 Stronghold Lv.2 [bank]` [main-trunk]
  - S2 Capture `poi:A171 Sand County Lv.5 [city]` [war-day-side]
  - Release `poi:A126 Coyote Town Lv.1 [city]` [release] - Release city slot before capturing Derby Grounds
  - S3 Capture `poi:A149 Derby Grounds Lv.4 [city]` [war-day-side]
- `WZ6 Wing 5`: 3 captures, 2 releases, 1 handoffs, Cities 8/8, Banks 11/12, Influence 2200000, CrystalGold/h 158
  - S1 Capture `poi:A126 Coyote Town Lv.1 [city]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 4
  - Release `poi:A143 Coyote Town Lv.1 [city]` [release] - Release city slot before capturing Sand County
  - S2 Capture `poi:A204 Sand County Lv.5 [city]` [war-day-side]
  - Release `poi:A142 Coyote Town Lv.1 [city]` [release] - Release city slot before capturing Derby Grounds
  - S3 Capture `poi:A185 Derby Grounds Lv.4 [city]` [war-day-side]
- `WZ6 Wing 6`: 3 captures, 1 releases, 0 handoffs, Cities 8/8, Banks 12/12, Influence 2800000, CrystalGold/h 164
  - Release `poi:A83 Stronghold Lv.4 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:A58 Stronghold Lv.2 [bank]` [main-trunk]
  - S2 Capture `poi:A180 Sand County Lv.5 [city]` [war-day-side]
  - S3 Capture `poi:I10 Stronghold Lv.6 [bank]` [support-side]
- `WZ6 Wing 7`: 3 captures, 2 releases, 0 handoffs, Cities 8/8, Banks 11/12, Influence 3200000, CrystalGold/h 168
  - S1 Capture `poi:A208 Sand County Lv.5 [city]` [war-day-side]
  - Release `poi:A167 Lawless Road Lv.3 [city]` [release] - Release city slot before capturing Derby Grounds
  - S2 Capture `poi:A199 Derby Grounds Lv.4 [city]` [war-day-side]
  - Release `poi:A177 Lawless Road Lv.3 [city]` [release] - Release city slot before capturing Sand County
  - S3 Capture `poi:A207 Sand County Lv.5 [city]` [war-day-side]
- `WZ6 Wing 8`: 3 captures, 2 releases, 1 handoffs, Cities 8/8, Banks 11/12, Influence 3300000, CrystalGold/h 169
  - S1 Capture `poi:A142 Coyote Town Lv.1 [city]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 5
  - Release `poi:A142 Coyote Town Lv.1 [city]` [release] - Release city slot before capturing Derby Grounds
  - S2 Capture `poi:A194 Derby Grounds Lv.4 [city]` [war-day-side]
  - Release `poi:A193 Derby Grounds Lv.4 [city]` [release] - Release city slot before capturing Derby Grounds
  - S3 Capture `poi:A184 Derby Grounds Lv.4 [city]` [war-day-side]
- `WZ6 Wing 9`: 3 captures, 1 releases, 0 handoffs, Cities 8/8, Banks 10/12, Influence 3400000, CrystalGold/h 170
  - S1 Capture `poi:B129 Sand County Lv.5 [city]` [war-day-side]
  - S2 Capture `poi:B139 Derby Grounds Lv.4 [city]` [war-day-side]
  - Release `poi:B139 Derby Grounds Lv.4 [city]` [release] - Release city slot before capturing Sand County
  - S3 Capture `poi:B128 Sand County Lv.5 [city]` [war-day-side]
- `WZ6 Wing 10`: 3 captures, 2 releases, 1 handoffs, Cities 8/8, Banks 11/12, Influence 3500000, CrystalGold/h 171
  - Release `poi:A50 Stronghold Lv.3 [bank]` [release] - Release bank slot before capturing Stronghold
  - S1 Capture `poi:B90 Stronghold Lv.4 [bank]` [main-trunk]
  - S2 Capture `poi:B139 Derby Grounds Lv.4 [city]` [main-trunk] - Cooperative handoff after release from WZ6 Wing 9
  - Release `poi:A196 Derby Grounds Lv.4 [city]` [release] - Release city slot before capturing Sand County
  - S3 Capture `poi:B160 Sand County Lv.5 [city]` [war-day-side]

Violations:
- None

## Hop non validi nel main trunk

- Nessun hop invalido nel main trunk.

## Hop non validi in tutte le catture Main

- Nessun hop invalido nella sequenza completa delle catture Main.
