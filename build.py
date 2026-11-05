#!/usr/bin/env python3
"""Builds index.html: one self-contained page from src/ and data.json."""
import json, pathlib
root = pathlib.Path(__file__).parent
src = root / 'src'
data = json.loads((root / 'data.json').read_text())
read = lambda n: (src / n).read_text()
head = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Syntopicon</title>
<meta name="description" content="The 102 Great Ideas as an idea engine: swipe the ideas and thinkers, map how they connect, and hold them in memory.">
<meta name="theme-color" content="#10142e">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@500&display=swap">
<style>
'''
html = (head + read('base.css') + read('syn.css') + '</style>\n</head>\n<body>\n' + read('body.html')
        + '<script>\n"use strict";\nconst DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'
        + '\n'.join(read(n) for n in ['paint.js', 'emblems.js', 'busts.js', 'engine.js', 'web.js', 'app.js', 'app2.js'])
        + '\n</script>\n</body>\n</html>\n')
(root / 'index.html').write_text(html)
print('wrote index.html', len(html)//1024, 'KB')
