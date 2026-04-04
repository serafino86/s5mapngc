# Season 5 Benchmark Route

## Scopo

Definire un caso benchmark scritto per confrontare il planner con una sequenza reale e verificabile.

Questo benchmark non e` il “piano migliore” di Season 5.

E` invece:

- un caso geometrico certo
- una baseline di adiacenza
- un controllo anti-salto
- un riferimento per capire se il software sta inventando scorciatoie non valide

## Scenario benchmark

Start area:

- `poi:A122`
- `Coyote Town Lv.1`
- coordinate `0.5, 0.5`

Obiettivo benchmark:

- raggiungere una `lv10 Bank Stronghold` adiacente alla `palace zone`

Palace zone:

- `Golden Palace`
- piu` i `4` tiles di fango / crystal mine immediatamente adiacenti alla capitale

## Regola usata per il benchmark

L'adiacenza valida e` solo:

- sovrapposizione reale
- bordo condiviso con overlap positivo

Non sono validi:

- diagonali
- corner touch
- salti di convenienza

## Risultato geometrico minimo verificato

Con l'adiacenza severa, il percorso minimo verificato da `poi:A122` a `poi:I50` e`:

`31` territori totali:

- `1 city`
- `30 bank`

Sequenza:

1. `poi:A122` `Coyote Town` `city` `Lv.1`
2. `poi:A13` `Stronghold` `bank` `Lv.1`
3. `poi:A14` `Stronghold` `bank` `Lv.1`
4. `poi:A15` `Stronghold` `bank` `Lv.1`
5. `poi:A16` `Stronghold` `bank` `Lv.2`
6. `poi:A17` `Stronghold` `bank` `Lv.2`
7. `poi:A18` `Stronghold` `bank` `Lv.2`
8. `poi:A19` `Stronghold` `bank` `Lv.4`
9. `poi:A20` `Stronghold` `bank` `Lv.4`
10. `poi:A21` `Stronghold` `bank` `Lv.5`
11. `poi:A22` `Stronghold` `bank` `Lv.5`
12. `poi:A33` `Stronghold` `bank` `Lv.5`
13. `poi:A44` `Stronghold` `bank` `Lv.5`
14. `poi:A55` `Stronghold` `bank` `Lv.5`
15. `poi:A66` `Stronghold` `bank` `Lv.5`
16. `poi:A77` `Stronghold` `bank` `Lv.5`
17. `poi:A88` `Stronghold` `bank` `Lv.5`
18. `poi:A99` `Stronghold` `bank` `Lv.5`
19. `poi:A110` `Stronghold` `bank` `Lv.5`
20. `poi:A121` `Stronghold` `bank` `Lv.5`
21. `poi:B111` `Stronghold` `bank` `Lv.5`
22. `poi:B112` `Stronghold` `bank` `Lv.5`
23. `poi:B113` `Stronghold` `bank` `Lv.5`
24. `poi:B114` `Stronghold` `bank` `Lv.5`
25. `poi:B115` `Stronghold` `bank` `Lv.5`
26. `poi:I55` `Stronghold` `bank` `Lv.6`
27. `poi:I54` `Stronghold` `bank` `Lv.7`
28. `poi:I53` `Stronghold` `bank` `Lv.8`
29. `poi:I52` `Stronghold` `bank` `Lv.9`
30. `poi:I51` `Stronghold` `bank` `Lv.10`
31. `poi:I50` `Stronghold` `bank` `Lv.10`

## Alternative centrali equivalenti

Percorso minimo verificato verso altri bank adiacenti alla palace zone:

- verso `poi:I62`: `31` territori
- verso `poi:I60`: `33` territori
- verso `poi:I72`: `33` territori

## Cosa dimostra questo benchmark

1. Se il software parte da `poi:A122` e dichiara accesso Palace con molto meno di `31` conquiste, sta quasi certamente violando l'adiacenza.
2. Se il software mostra salti tipo `Lv.2 -> Lv.5` senza ponte credibile, la logica e` sbagliata.
3. Se il software produce un piano molto piu` corto, va verificato se:
   - non sta davvero arrivando alla palace zone
   - oppure sta usando collegamenti non validi

## Uso del benchmark

Da qui in poi il planner va confrontato contro questo scenario:

- start fisso `poi:A122`
- obiettivo `palace-adjacent lv10 bank`
- confronto tra:
  - sequenza benchmark
  - sequenza software
  - differenze di adiacenza
  - differenze di slot
  - differenze di release

Il benchmark serve per validare la geometria del piano prima ancora della sua qualita` strategica.
