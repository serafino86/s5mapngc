# Night Commando Reverse-Engineered Clone

Clone locale, studiabile e senza build step del sito analizzato.

Obiettivi:
- capire struttura, routing e separazione delle feature;
- avere un clone locale modificabile;
- documentare cosa e` statico, cosa e` client-side e dove potrebbe esistere logica server-side.

Avvio rapido:

```bash
cd "$(dirname "$0")"
python3 -m http.server 4173
```

Poi apri:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/events/ammo-bonanza/`
- `http://127.0.0.1:4173/servers/`
- `http://127.0.0.1:4173/maps/planner/`

Questo non e` il codice originale del sito.
E` un clone reverse-engineered della struttura e delle interazioni principali.

Leggi anche `ANALISI.md`.
