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
- `src/courses/*.txt`: the Lyceum curriculum, one file per syllabus (40 courses × 18 lectures). The format is documented at the top of `build.py`, which checks every idea and thinker link when it builds
- `src/lyceum.js`: the Lyceum tab — tonight's lecture in the book's rotation, syllabi, departments, lecture search, spaced review, and links both ways between lectures and Syntopicon pages
- `src/app.js` and `src/app2.js`: data, progress, the views, sheets, Find, Stream, Recall, Ledger and the Web wiring

Progress is stored under the same browser key as the original app (`synstore:user:syntopicon:v2:progress`), so reviews, notes and streaks carry over when the page is served from the same place.

## The Lyceum

A section of 40 courses in four syllabi per semester, five courses to a syllabus and eighteen one-page lectures to a course, plus all 102 Syntopicon ideas as lectures of their own. The idea lectures are grouped into seven Great Ideas courses, one per domain, and built from `data.json` (framing, senses, a dispute, the full outline of topics). Lectures are read one a night in rotation. After each round of five course lectures comes the great idea those five link to most, so all 102 ideas appear by night 612 of 822.

Each lecture has a recall question and links to the related Syntopicon ideas and thinkers. Progress is saved with the rest of the app's progress, and the day streak covers both sections. Course lectures are reviewed under `b:` keys. An idea lecture uses the idea's own review card and note, so reading it in the Lyceum also adds it to the Recall deck.
