# Syntopicon · Idea engine

`index.html` is the whole app: one self-contained file with no build step needed to run it. It only fetches Google Fonts.

To change it, edit the files in `src/` and run `python3 build.py`, which rebuilds `index.html` from:

- `data.json`: the 102 ideas, 7 domains and 93 thinkers, extracted from the original Syntopicon
- `src/base.css` and `src/syn.css`: the styles (Time Tunnel's night-museum system plus the new pieces)
- `src/body.html`: the page markup
- `src/paint.js`: the hand-painted look (boiling ink lines, washes, glow, grain)
- `src/emblems.js`: one painted emblem per idea, each with an arrival event
- `src/busts.js`: one marble bust per thinker, with a signature prop
- `src/engine.js`: the engine-room diorama, the owl, and the "living" emblems on cards
- `src/web.js`: the network graph and the mind map
- `src/app.js` and `src/app2.js`: data, progress, the views, sheets, Find, Stream, Recall, Ledger and the Web wiring

Progress is stored under the same browser key as the original app (`synstore:user:syntopicon:v2:progress`), so reviews, notes and streaks carry over when the page is served from the same place.
