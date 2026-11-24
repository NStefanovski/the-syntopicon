#!/usr/bin/env python3
"""Builds index.html: one self-contained page from src/ and data.json."""
import json, pathlib, sys
root = pathlib.Path(__file__).parent
src = root / 'src'
data = json.loads((root / 'data.json').read_text())
read = lambda n: (src / n).read_text()

# The Lyceum: src/courses/*.txt, one file per syllabus.
#   @ id | Course title | dept | volume.syllabus      starts a course; then its blurb,
#   ideas: idea-id, ...   thinkers: Name, ...         links into the Syntopicon
#   # Lecture title                                  starts a lecture; then its text,
#   ? question   = answer   ~ idea-id, ...           a recall card and optional idea links
#   ! why it matters   & an 'in your own words' prompt   > a reading (repeatable)      optional; blank lines in the text start new paragraphs
DEPTS = [('world', 'World History', '#f2b544'),
         ('econ', 'Economics', '#8fd16a'), ('lit', 'Literature', '#ff7096'),
         ('classics', 'Classics', '#71b4ff'), ('art', 'Art History', '#d59bff'),
         ('phil', 'Philosophy', '#36c4a9'), ('rel', 'Religion', '#e8c27a'),
         ('social', 'Social Science', '#ffa3b5'), ('phys', 'Physical Sciences', '#6fd3ff'),
         ('earth', 'Earth & Life Sciences', '#b5e36b'), ('eng', 'Math & Engineering', '#9aa6ff')]

def parse_courses(text):
    courses, c, l, gap = [], None, None, False
    for raw in text.splitlines():
        s = raw.strip()
        if not s:
            gap = True
            continue
        if s.startswith('@ '):
            cid, title, dept, vs = [x.strip() for x in s[2:].split('|')]
            v, sy = vs.split('.')
            c = {'id': cid, 'title': title, 'dept': dept, 'vol': int(v), 'syl': int(sy),
                 'blurb': '', 'ideas': [], 'thinkers': [], 'lectures': []}
            courses.append(c); l = None
        elif s.startswith('# '):
            l = {'title': s[2:].strip(), 'text': '', 'q': '', 'a': ''}; c['lectures'].append(l); gap = False
        elif l is None:
            if s.startswith('ideas:'): c['ideas'] = [x.strip() for x in s[6:].split(',') if x.strip()]
            elif s.startswith('thinkers:'): c['thinkers'] = [x.strip() for x in s[9:].split(',') if x.strip()]
            else: c['blurb'] = (c['blurb'] + ' ' + s).strip()
        elif s.startswith('? '): l['q'] = s[2:].strip()
        elif s.startswith('= '): l['a'] = s[2:].strip()
        elif s.startswith('~ '): l['ideas'] = [x.strip() for x in s[2:].split(',') if x.strip()]
        elif s.startswith('! '): l['why'] = s[2:].strip()
        elif s.startswith('& '): l['prompt'] = s[2:].strip()
        elif s.startswith('> '): l.setdefault('read', []).append(s[2:].strip())
        else: l['text'] = (l['text'] + ('\n\n' if gap and l['text'] else ' ') + s).strip()
        gap = False
    return courses

courses = [c for f in sorted((src / 'courses').glob('*.txt')) for c in parse_courses(f.read_text())]
ideas, people, depts = {i['id'] for i in data['ideas']}, set(data['people']), {d[0] for d in DEPTS}
for c in courses:
    bad = [x for x in c['ideas'] if x not in ideas] + [x for x in c['thinkers'] if x not in people]
    bad += [x for l in c['lectures'] for x in l.get('ideas', []) if x not in ideas]
    bad += ['incomplete: ' + l['title'] for l in c['lectures'] if not (l['text'] and l['q'] and l['a'])]
    if c['dept'] not in depts: bad.append('dept ' + c['dept'])
    if bad: sys.exit(f"{c['id']}: {bad}")
lyc = {'title': 'The Lyceum',
        'depts': [{'id': i, 'name': n, 'color': c} for i, n, c in DEPTS], 'courses': courses}
head = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Syntopicon</title>
<meta name="description" content="The 102 Great Ideas as an idea engine, plus a Lyceum of 40 courses: swipe the ideas and thinkers, read a lecture a night, map how they connect, and hold them in memory.">
<meta name="theme-color" content="#10142e">
<script>try{var th=localStorage.getItem('syn.theme');if(th==='light'||th==='reader'){document.documentElement.dataset.theme=th;document.querySelector('meta[name=theme-color]').content=th==='light'?'#f6f2e8':'#ffffff'}}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@500&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400&display=swap">
<style>
'''
html = (head + read('base.css') + read('syn.css') + '</style>\n</head>\n<body>\n' + read('body.html')
        + '<script>\n"use strict";\nconst DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'
        + 'const LYC = ' + json.dumps(lyc, ensure_ascii=False, separators=(',', ':')) + ';\n'
        + '\n'.join(read(n) for n in ['paint.js', 'emblems.js', 'busts.js', 'engine.js', 'web.js', 'app.js', 'lyceum.js', 'app2.js'])
        + '\n</script>\n</body>\n</html>\n')
(root / 'index.html').write_text(html)
print('wrote index.html', len(html)//1024, 'KB ·', len(courses), 'courses,', sum(len(c['lectures']) for c in courses), 'lectures')
