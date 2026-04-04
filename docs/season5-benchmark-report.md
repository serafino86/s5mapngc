# Season 5 Benchmark Report

## Scopo

Confrontare il protocollo logico, il benchmark scritto e l'output reale del motore attuale.

## Scenario usato

- Start: `poi:A122`
- Target benchmark: `poi:I51` palace-adjacent lv10 bank
- Confronto tra:
  - benchmark a adiacenza severa
  - pathfinding base del software
  - piano top del motore attuale

## Esito sintetico

- Anche il piano finale mantiene `4` hop non coerenti rispetto all'adiacenza severa.
- Il corridoio principale del piano e' coerente; i salti residui arrivano soprattutto dalle deviazioni laterali di war day inserite nella stessa sequenza cronologica.

## Metriche

- Benchmark strict path: `30` nodi
- Software graph path: `30` nodi
- Software top plan captures: `32`
- Software top plan main trunk captures: `28`
- Software top plan side captures: `4`
- Software top plan total actions: `51`
- Software top plan total days: `14`

## Benchmark strict route

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

## Software graph route

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

## Software top plan captures

1. `poi:A13 Stronghold Lv.1 [bank]`
2. `poi:A14 Stronghold Lv.1 [bank]`
3. `poi:A15 Stronghold Lv.1 [bank]`
4. `poi:A16 Stronghold Lv.2 [bank]`
5. `poi:A17 Stronghold Lv.2 [bank]`
6. `poi:A18 Stronghold Lv.2 [bank]`
7. `poi:A183 Derby Grounds Lv.4 [city]`
8. `poi:A19 Stronghold Lv.4 [bank]`
9. `poi:A20 Stronghold Lv.4 [bank]`
10. `poi:A21 Stronghold Lv.5 [bank]`
11. `poi:A22 Stronghold Lv.5 [bank]`
12. `poi:A33 Stronghold Lv.5 [bank]`
13. `poi:A44 Stronghold Lv.5 [bank]`
14. `poi:A215 Sand County Lv.5 [city]`
15. `poi:A55 Stronghold Lv.5 [bank]`
16. `poi:A66 Stronghold Lv.5 [bank]`
17. `poi:A77 Stronghold Lv.5 [bank]`
18. `poi:A88 Stronghold Lv.5 [bank]`
19. `poi:A99 Stronghold Lv.5 [bank]`
20. `poi:A110 Stronghold Lv.5 [bank]`
21. `poi:A121 Stronghold Lv.5 [bank]`
22. `poi:B111 Stronghold Lv.5 [bank]`
23. `poi:A203 Sand County Lv.5 [city]`
24. `poi:B112 Stronghold Lv.5 [bank]`
25. `poi:B113 Stronghold Lv.5 [bank]`
26. `poi:B114 Stronghold Lv.5 [bank]`
27. `poi:B115 Stronghold Lv.5 [bank]`
28. `poi:I55 Stronghold Lv.6 [bank]`
29. `poi:I54 Stronghold Lv.7 [bank]`
30. `poi:A202 Sand County Lv.5 [city]`
31. `poi:I53 Stronghold Lv.8 [bank]`
32. `poi:I52 Stronghold Lv.9 [bank]`

## Software top plan main trunk

1. `poi:A13 Stronghold Lv.1 [bank]`
2. `poi:A14 Stronghold Lv.1 [bank]`
3. `poi:A15 Stronghold Lv.1 [bank]`
4. `poi:A16 Stronghold Lv.2 [bank]`
5. `poi:A17 Stronghold Lv.2 [bank]`
6. `poi:A18 Stronghold Lv.2 [bank]`
7. `poi:A19 Stronghold Lv.4 [bank]`
8. `poi:A20 Stronghold Lv.4 [bank]`
9. `poi:A21 Stronghold Lv.5 [bank]`
10. `poi:A22 Stronghold Lv.5 [bank]`
11. `poi:A33 Stronghold Lv.5 [bank]`
12. `poi:A44 Stronghold Lv.5 [bank]`
13. `poi:A55 Stronghold Lv.5 [bank]`
14. `poi:A66 Stronghold Lv.5 [bank]`
15. `poi:A77 Stronghold Lv.5 [bank]`
16. `poi:A88 Stronghold Lv.5 [bank]`
17. `poi:A99 Stronghold Lv.5 [bank]`
18. `poi:A110 Stronghold Lv.5 [bank]`
19. `poi:A121 Stronghold Lv.5 [bank]`
20. `poi:B111 Stronghold Lv.5 [bank]`
21. `poi:B112 Stronghold Lv.5 [bank]`
22. `poi:B113 Stronghold Lv.5 [bank]`
23. `poi:B114 Stronghold Lv.5 [bank]`
24. `poi:B115 Stronghold Lv.5 [bank]`
25. `poi:I55 Stronghold Lv.6 [bank]`
26. `poi:I54 Stronghold Lv.7 [bank]`
27. `poi:I53 Stronghold Lv.8 [bank]`
28. `poi:I52 Stronghold Lv.9 [bank]`

## Software top plan side captures

1. `poi:A183 Derby Grounds Lv.4 [city]`
2. `poi:A215 Sand County Lv.5 [city]`
3. `poi:A203 Sand County Lv.5 [city]`
4. `poi:A202 Sand County Lv.5 [city]`

## Hop non validi nel graph route

- Nessun hop invalido nel graph route.

## Hop non validi nel top plan

1. `poi:B111 Stronghold Lv.5 [bank]` -> `poi:A203 Sand County Lv.5 [city]`
2. `poi:A203 Sand County Lv.5 [city]` -> `poi:B112 Stronghold Lv.5 [bank]`
3. `poi:I54 Stronghold Lv.7 [bank]` -> `poi:A202 Sand County Lv.5 [city]`
4. `poi:A202 Sand County Lv.5 [city]` -> `poi:I53 Stronghold Lv.8 [bank]`

## Hop non validi nel main trunk

- Nessun hop invalido nel main trunk.

## Lettura contro protocollo

- Se il graph route e' gia' geometricamente troppo corto, il planner parte da un presupposto falsato prima ancora dello scoring.
- Se il top plan eredita hop non validi o rimane troppo corto, il problema principale non e' il ranking finale ma la costruzione della route desiderata.
- Finche' questo report non converge verso il benchmark, ogni ottimizzazione del punteggio resta secondaria.
