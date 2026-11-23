/* ---------- lyceum: a curriculum of forty courses and the 102 great ideas ----------
   Forty courses of eighteen one-page lectures, read one a night in rotation, plus one lecture for each
   Syntopicon idea (its framing, senses, a dispute and its outline of topics), woven in after every
   round of five. Everything is held in memory with the same scheduler as the rest of the app. */
const BDEPT=Object.fromEntries(LYC.depts.map(d=>[d.id,d]));
BDEPT.ideas={id:'ideas',name:'The Great Ideas',color:'#ffd86b'};
/* the great-ideas courses: one per Syntopicon domain, one lecture per idea, read from DATA */
const GIC=CLUSTERS.map(cl=>({id:'gi-'+cl.id,title:cl.name,dept:'ideas',great:true,color:CLC[cl.id],vol:0,syl:0,
  blurb:cl.blurb+' One lecture for each great idea in this domain: what it means, the senses of the term, a live dispute, and the outline of topics it covers.',
  ideas:[],thinkers:[],
  lectures:IORDER.filter(i=>i.cluster===cl.id).map(I=>({title:I.name,idea:I.id,text:I.framing,ideas:[I.id,...I.related],
    q:`${I.name}: what is it, and what is disputed about it?`,a:`${I.gist}${I.disputes[0]?' The live question: '+I.disputes[0].q:''}`}))}));
const BC=[...LYC.courses,...GIC];
const BCO=Object.fromEntries(BC.map(c=>[c.id,c]));
const BLEC={};BC.forEach(c=>c.lectures.forEach((l,k)=>{l.id=c.great?'gi-'+l.idea:c.id+'-'+(k+1);l.n=k+1;l.course=c;l.key=c.great?l.idea:'b:'+l.id;BLEC[l.id]=l}));
const GIL=Object.fromEntries(GIC.flatMap(c=>c.lectures).map(l=>[l.idea,l]));
const lecIdeas=l=>(l.ideas&&l.ideas.length?l.ideas:l.course.ideas).filter(i=>IBY[i]);
/* the rotation: within a syllabus, lecture 1 of each of its five courses, then lecture 2 of each, and so on.
   After each round of five comes one great idea: the unread idea those five lectures point to most often. */
const BORDER=(()=>{const o=[],left=new Set(IORDER.map(i=>i.id));
  const nextIdea=round=>{if(!left.size)return null;const score=new Map();round.forEach(l=>lecIdeas(l).forEach(i=>{if(left.has(i))score.set(i,(score.get(i)||0)+1)}));
    let best=null,bs=0;IORDER.forEach(i=>{const s=score.get(i.id)||0;if(s>bs){bs=s;best=i.id}});best=best||IORDER.find(i=>left.has(i.id)).id;left.delete(best);return GIL[best]};
  [1,2].forEach(v=>[1,2,3,4].forEach(s=>{const cs=LYC.courses.filter(c=>c.vol===v&&c.syl===s);const n=Math.max(...cs.map(c=>c.lectures.length));
    for(let k=0;k<n;k++){const round=cs.map(c=>c.lectures[k]).filter(Boolean);o.push(...round);const g=nextIdea(round);if(g)o.push(g)}}));
  left.forEach(i=>o.push(GIL[i]));return o})();
const BDAY=Object.fromEntries(BORDER.map((l,k)=>[l.id,k+1]));
const VOLN={1:'First Semester',2:'Second Semester'};
const BP=()=>{const b=prog.lyceum||(prog.lyceum={});if(!b.read)b.read={};if(!b.skip)b.skip={};return b};
const isRead=id=>!!BP().read[id];
const bkey=id=>BLEC[id]?BLEC[id].key:'b:'+id;
const courseDone=c=>c.lectures.filter(l=>isRead(l.id)).length;
const bcolor=c=>c.color||BDEPT[c.dept].color;
function tonight(){const P=BP();return BORDER.find(l=>!P.read[l.id]&&!P.skip[l.id])||BORDER.find(l=>!P.read[l.id])||null}
function markRead(id,on=true){
  const P=BP(),k=bkey(id);
  if(on){P.read[id]=now();delete P.skip[id];if(!prog.srs[k])prog.srs={...prog.srs,[k]:{reps:0,interval:0,ease:2.5,due:now()+DAY,last:now()}};prog=bumpDay(prog);prog.lyceum=P}
  else{delete P.read[id];if(k.startsWith('b:')){const s={...prog.srs};delete s[k];prog.srs=s}}
  saveProg();
}
const lycDue=()=>BORDER.filter(l=>isRead(l.id)&&isDue(bkey(l.id)));

/* ----- the view ----- */
const lyceumEl=$('#lyceum');let bTab='syllabi',bQ='',bSession=null;
function renderLyceum(){
  if(!lyceumEl)return;Living.clear(lyceumEl);BP();
  const t=tonight(),read=Object.keys(BP().read).filter(id=>BLEC[id]).length,ideasRead=GIC.reduce((a,c)=>a+courseDone(c),0),due=lycDue().length;
  const hero=t?(()=>{const c=t.course,col=bcolor(c),em=lecIdeas(t)[0];
    return`<section class="bhero" style="--c:${col}"><div class="meta"><span class="tag">Tonight · day ${BDAY[t.id]} of ${BORDER.length}</span><span class="tag k">${esc(BDEPT[c.dept].name)}</span></div>
      ${em?`<canvas class="emb" data-k="i:${em}" data-e=".15" aria-hidden="true"></canvas>`:''}
      <p class="bcourse">${t.idea?'A great idea · '+esc(c.title):esc(c.title)} <small>· ${t.idea?'idea '+t.n+' of '+c.lectures.length:'lecture '+t.n+' of '+c.lectures.length}</small></p><h2>${esc(t.title)}</h2>
      <p class="story">${esc(t.text.length>170?t.text.slice(0,170).replace(/\s+\S*$/,'')+'…':t.text)}</p>
      <div class="acts"><button class="btn go press" data-ba="open" data-id="${t.id}">${ico('page')}Read tonight's lecture</button><button class="btn press" data-ba="skip" data-id="${t.id}">${ico('next')}Not tonight</button></div></section>`})()
    :`<section class="bhero" style="--c:var(--gold)"><span class="tag">Graduated</span><h2>All ${BORDER.length} lectures read.</h2><p class="story">The degree is conferred. Keep it by reviewing what comes due.</p></section>`;
  const tabs=[['syllabi','Syllabi'],['depts','Departments'],['review','Review · '+due]];
  lyceumEl.innerHTML=`<div class="lyceum">
    <header class="bhead"><div class="kicker">The Lyceum</div><p>Forty courses of eighteen one-page lectures, with all ${IDEAS.length} great ideas woven in: after every five lectures comes the idea they point to most. One a night, each wired to the Syntopicon's ideas and thinkers.</p></header>
    ${hero}
    <div class="stats four"><div class="stat"><b>${read}</b><span>Lectures read</span></div><div class="stat"><b style="color:var(--gold)">${ideasRead}<small style="font-size:.5em;color:var(--soft)"> / ${IDEAS.length}</small></b><span>Great ideas studied</span></div><div class="stat"><b>${due}</b><span>Due for review</span></div><div class="stat"><b>${prog.streak.count||0}</b><span>Day streak</span></div></div>
    <div class="dist" title="${read} of ${BORDER.length} lectures">${read?`<i style="width:${read/BORDER.length*100}%;background:var(--gold)"></i>`:''}</div>
    <div class="btabs seg" role="group" aria-label="Lyceum views">${tabs.map(([k,l])=>`<button data-bt="${k}" aria-pressed="${bTab===k}">${esc(l)}</button>`).join('')}</div>
    <div id="bBody"></div></div>`;
  const cv=lyceumEl.querySelector('canvas.emb');if(cv)attachEmblem(cv);
  renderBBody();
}
function courseRow(c){const d=courseDone(c),n=c.lectures.length,col=bcolor(c);
  return`<button class="frow crow press" data-course="${c.id}" style="--cc:${col}"><span class="d"></span><span><b>${esc(c.title)}</b><span>${esc(BDEPT[c.dept].name)} · ${esc(c.blurb.length>90?c.blurb.slice(0,90).replace(/\s+\S*$/,'')+'…':c.blurb)}</span><span class="cbar"><i style="width:${d/n*100}%"></i></span></span><small>${d===n?'✓ credit':d+' / '+n}</small></button>`}
function renderBBody(){
  const body=$('#bBody');if(!body)return;Living.clear(body);
  if(bTab==='review')return renderBReview(body);
  const search=`<label class="search">${ico('search')}<input id="bQ" placeholder="Search the lectures…" value="${esc(bQ)}" autocomplete="off" aria-label="Search the lectures"></label>`;
  let html='';const q=bQ.trim().toLowerCase();
  if(q){const hits=BORDER.filter(l=>(l.title+' '+l.text+' '+l.course.title).toLowerCase().includes(q)).slice(0,80);
    html=hits.length?`<section class="fgroup"><h3>Lectures<small>${hits.length}${hits.length===80?'+':''}</small></h3>${hits.map(lecRow).join('')}</section>`:`<p class="your">Nothing matches. Try another word.</p>`}
  else if(bTab==='syllabi'){
    html=[1,2].map(v=>`<div class="sec-label">${VOLN[v]}</div>`+[1,2,3,4].map(s=>{const cs=BC.filter(c=>c.vol===v&&c.syl===s);const dn=cs.reduce((a,c)=>a+courseDone(c),0);
      return`<section class="fgroup"><h3>Syllabus ${s}<small>${dn} / ${cs.reduce((a,c)=>a+c.lectures.length,0)}</small></h3>${cs.map(courseRow).join('')}</section>`}).join('')).join('')
      +`<div class="sec-label">The Great Ideas · woven through both semesters</div><section class="fgroup"><h3>Seven domains<small>${GIC.reduce((a,c)=>a+courseDone(c),0)} / ${IDEAS.length}</small></h3>${GIC.map(courseRow).join('')}</section>`;
  }else{
    html=[...LYC.depts,BDEPT.ideas].map(d=>{const cs=BC.filter(c=>c.dept===d.id);if(!cs.length)return'';const n=cs.reduce((a,c)=>a+c.lectures.length,0),dn=cs.reduce((a,c)=>a+courseDone(c),0);
      return`<section class="fgroup" style="--cc:${d.color}"><h3>${esc(d.name)}<small>${dn} / ${n}</small></h3>${cs.map(courseRow).join('')}</section>`}).join('');
  }
  body.innerHTML=search+html;
  const inp=$('#bQ');inp.addEventListener('input',()=>{bQ=inp.value;const pos=inp.selectionStart;renderBBody();const n=$('#bQ');n.focus({preventScroll:true});try{n.setSelectionRange(pos,pos)}catch(e){}});
}
function lecRow(l){const c=l.course,r=isRead(l.id);return`<button class="frow press${r?' done':''}" data-lec="${l.id}" style="--cc:${bcolor(c)}"><span class="d"></span><span><b>${esc(l.title)}</b><span>${esc(c.title)} · lecture ${l.n}</span></span><small>${r?'✓ read':'day '+BDAY[l.id]}</small></button>`}

/* review: lectures you have read come back on the same spaced schedule as the ideas */
function renderBReview(body){
  if(!bSession||bSession.i>=bSession.ids.length&&!bSession.end){const d=lycDue();bSession={ids:shuffle(d).slice(0,20).map(l=>l.id),i:0,done:0,open:false,end:false}}
  const s=bSession,id=s.ids[s.i];
  if(!id){const anyRead=Object.keys(BP().read).length;
    body.innerHTML=`<div class="endcard"><span class="tag">${s.done?'Review complete':anyRead?'Nothing due':'Nothing read yet'}</span><div class="score">${s.done}<small> ${s.done===1?'lecture':'lectures'}</small></div><p class="story">${s.done?'Spacing does the rest. They will come back when due.':anyRead?'Every lecture you have read is scheduled ahead.':'Read tonight’s lecture first. It comes back for review the next day.'}</p><div class="acts">${anyRead?`<button class="btn go press" data-ba="anyway">Review a round anyway</button>`:`<button class="btn go press" data-ba="tonight">Tonight’s lecture</button>`}</div></div>`;return}
  const l=BLEC[id],c=l.course,col=bcolor(c);
  body.innerHTML=`<div class="rscreen"><div class="qtop"><span class="qcount">Card <b>${s.i+1}</b> / ${s.ids.length}</span></div><div class="bar"><i style="width:${s.i/s.ids.length*100}%"></i></div>
    <div class="rcard"><div class="rface${s.open?' flip':''}" style="--c:${col}"><span class="tag">${esc(c.title)} · ${l.n}</span>
    <div class="rname">${esc(l.title)}</div><p class="rprompt">${esc(l.q)}</p>
    ${s.open?`<p class="rrow"><b>Answer</b>${esc(l.a)}</p><p class="story" style="font-size:16px">${esc(l.text)}</p><button class="backline press" data-lec="${l.id}">${ico('page',14)}Open the lecture</button>
      <div class="rates">${RATES.map(r=>`<button class="rate press" data-bg="${r.g}">${r.label}<small>${r.hint}</small><kbd>${r.key}</kbd></button>`).join('')}</div>`
    :`<textarea class="scratch" placeholder="Answer from memory first. Generating it is what makes it stick."></textarea><button class="btn press" data-ba="reveal" style="align-self:flex-start">Reveal</button>`}
    </div></div></div>`;
}
function bRate(g,el){const s=bSession,id=s.ids[s.i];if(!id||!s.open)return;rate(bkey(id),g);if(g>=2&&el)burst(el);s.done++;s.i++;s.open=false;if(s.i>=s.ids.length)s.end=true;renderBReview($('#bBody'))}

lyceumEl.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.bt){bTab=b.dataset.bt;if(bTab==='review'&&bSession&&bSession.end)bSession=null;lyceumEl.querySelectorAll('[data-bt]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderBBody();return}
  if(b.dataset.course)return openCourse(b.dataset.course);
  if(b.dataset.lec)return openLecture(b.dataset.lec);
  if(b.dataset.bg!==undefined)return bRate(+b.dataset.bg,b);
  const a=b.dataset.ba;
  if(a==='open')openLecture(b.dataset.id);
  if(a==='skip'){BP().skip[b.dataset.id]=1;saveProg();renderLyceum();toast('Saved for another night')}
  if(a==='reveal'&&bSession){bSession.open=true;renderBReview($('#bBody'))}
  if(a==='anyway'){const r=BORDER.filter(l=>isRead(l.id));bSession={ids:shuffle(r).slice(0,20).map(l=>l.id),i:0,done:0,open:false,end:false};renderBReview($('#bBody'))}
  if(a==='tonight'){const t=tonight();if(t)openLecture(t.id)}
});
document.addEventListener('keydown',e=>{
  if(current!=='lyceum'||bTab!=='review'||!bSession||!sheet.hidden||/input|textarea/i.test(e.target.tagName))return;
  if((e.key===' '||e.key==='Enter')&&!bSession.open&&bSession.ids[bSession.i]){e.preventDefault();bSession.open=true;renderBReview($('#bBody'))}
  else if(bSession.open&&['1','2','3','4'].includes(e.key)){e.preventDefault();bRate(+e.key-1,lyceumEl.querySelector(`.rate[data-bg="${+e.key-1}"]`))}
});

/* ----- sheets: a course, a lecture ----- */
function syntoLinks(ideas,thinkers){const I=[...new Set(ideas)].filter(i=>IBY[i]),P=[...new Set(thinkers.map(pid))].filter(n=>PEOPLE[n]);
  if(!I.length&&!P.length)return'';
  return`<h3 class="deep-h">In the Syntopicon</h3><div class="links">${I.map(ilink).join('')}${P.map(n=>plink(n)).join('')}</div>`}
function openCourse(id,push=true){
  const c=BCO[id];if(!c)return;const col=bcolor(c),d=courseDone(c),next=c.lectures.find(l=>!isRead(l.id))||c.lectures[0],em=c.ideas.find(i=>IBY[i]);
  const html=`<div class="meta"><span class="tag">${esc(BDEPT[c.dept].name)}</span><span class="tag k">${c.great?'Woven through the rotation':VOLN[c.vol]+' · Syllabus '+c.syl}</span><span class="tag k">${d===c.lectures.length?'✓ credit':d+' / '+c.lectures.length+' read'}</span></div>
    ${em?`<canvas class="emb" data-k="i:${em}" data-e="0" aria-hidden="true"></canvas>`:''}
    <h2>${esc(c.title)}</h2><p class="story">${esc(c.blurb)}</p>
    <div class="cbar big"><i style="width:${d/c.lectures.length*100}%"></i></div>
    <section class="deep">
      ${syntoLinks(c.ideas,c.thinkers)}
      <h3 class="deep-h">The ${c.lectures.length} lectures</h3><div class="voices">${c.lectures.map(l=>`<button class="frow press${isRead(l.id)?' done':''}" data-lec="${l.id}" style="--cc:${col}"><span class="d"></span><span><b>${l.n}. ${esc(l.title)}</b><span>${esc(l.idea?IBY[l.idea].gist:l.q)}</span></span><small>${isRead(l.id)?'✓':'day '+BDAY[l.id]}</small></button>`).join('')}</div>
    </section>
    <div class="acts"><button class="btn go press" data-lec="${next.id}">${ico('page')}${d?(d===c.lectures.length?'Start again':'Continue · lecture '+next.n):'Begin the course'}</button><button class="btn press" data-ba="lyceum">${ico('card')}Lyceum</button></div>`;
  openSheet(html,col,'c:'+id,push);playEmblem(sheetIn.querySelector('canvas.emb'));
}
function openLecture(id,push=true){
  const l=BLEC[id];if(!l)return;if(l.idea)return openIdeaLecture(l,push);const c=l.course,col=bcolor(c),r=isRead(id),em=lecIdeas(l)[0],k=bkey(id),st=stage(k);
  const html=`<div class="meta"><span class="tag">${esc(BDEPT[c.dept].name)}</span><button class="tag k press" data-course="${c.id}">${esc(c.title)}</button><span class="tag k">Lecture ${l.n} of ${c.lectures.length}</span>${r?`<span class="tag k stage" style="--sc:${STAGE[st].color}"><i></i>${st==='new'?'Read':STAGE[st].label}</span>`:''}</div>
    ${em?`<canvas class="emb" data-k="i:${em}" data-e="0" aria-hidden="true"></canvas>`:''}
    <h2>${esc(l.title)}</h2><p class="story">${esc(l.text)}</p>
    <div class="think"><span class="think-k">${ico('think',14)}Test yourself</span><p class="think-q">${esc(l.q)}</p><button class="btn press" data-ba="ans" style="align-self:flex-start">Show the answer</button><p class="your banswer" hidden>${esc(l.a)}</p></div>
    <section class="deep">
      ${syntoLinks(lecIdeas(l),c.thinkers)}
      <div class="note"><div class="note-h"><h3 class="deep-h">In your own words</h3><em id="noteState">the Feynman test: explain it plainly</em></div><textarea id="noteBox" placeholder="Retell “${esc(l.title)}” in two sentences, as if to a friend.">${esc(prog.notes[k]||'')}</textarea></div>
    </section>
    <div class="acts"><button class="btn round press" data-ba="pl" aria-label="Previous lecture in this course">${ico('prev')}</button><button class="btn round press" data-ba="nl" aria-label="Next lecture in this course">${ico('next')}</button>
      <button class="btn ${r?'':'go '}press" data-ba="read">${r?'✓ Read · undo':ico('card')+'Mark as read'}</button>
      ${r?`<button class="btn go press" data-ba="tonight">${ico('next')}Next in the rotation</button>`:''}</div>`;
  openSheet(html,col,'b:'+id,push);playEmblem(sheetIn.querySelector('canvas.emb'));
  const nb=$('#noteBox');let nt;nb.addEventListener('input',()=>{$('#noteState').textContent='…';clearTimeout(nt);nt=setTimeout(()=>{saveNote(k,nb.value);const s=$('#noteState');if(s){s.textContent='Saved';s.className='saved'}},500)});
}
/* actions from inside a sheet */
function lycAct(a,b){
  const k=sheetKey||'';
  if(a==='ans'){const p=sheetIn.querySelector('.banswer');if(p){p.hidden=false;b.hidden=true}return}
  if(a==='lyceum'){closeSheet();show('lyceum');return}
  if(!k.startsWith('b:'))return;const l=BLEC[k.slice(2)];if(!l)return;const c=l.course;
  if(a==='pl'||a==='nl'){const i=l.n-1+(a==='pl'?-1:1);openLecture(c.lectures[(i+c.lectures.length)%c.lectures.length].id,false)}
  if(a==='read'){const on=!isRead(l.id);markRead(l.id,on);if(on){burst(b);toast(courseDone(c)===c.lectures.length?'Course complete · credit earned':'Read · it comes back for review tomorrow')}openLecture(l.id,false);if(current==='lyceum')renderLyceum()}
  if(a==='tonight'){const t=tonight();if(t)openLecture(t.id);else toast('Every lecture is read')}
}
/* back-links shown on Syntopicon pages: where an idea or thinker turns up in the curriculum */
function lycForIdea(id){
  const cs=BC.filter(c=>c.ideas.includes(id)),ls=BORDER.filter(l=>l.ideas&&l.ideas.includes(id)&&!cs.includes(l.course));
  if(!cs.length&&!ls.length)return'';
  return`<h3 class="deep-h">In the Lyceum</h3><div class="links">${cs.map(c=>`<button class="lk press" style="--cc:${bcolor(c)}" data-course="${c.id}">${esc(c.title)}</button>`).join('')}${ls.slice(0,12).map(l=>`<button class="lk press" style="--cc:${bcolor(l.course)}" data-lec="${l.id}">${esc(l.title)} <small>${esc(l.course.title)}</small></button>`).join('')}</div>`}
function lycForPerson(name){const cs=BC.filter(c=>c.thinkers.map(pid).includes(name));if(!cs.length)return'';
  return`<h3 class="deep-h">In the Lyceum</h3><div class="links">${cs.map(c=>`<button class="lk press" style="--cc:${bcolor(c)}" data-course="${c.id}">${esc(c.title)}</button>`).join('')}</div>`}

/* a great-idea lecture: the idea taught as a lesson, drawn from its Syntopicon page */
function openIdeaLecture(l,push=true){
  const I=IBY[l.idea],c=l.course,col=CLC[I.cluster],r=isRead(l.id),k=l.key,st=stage(k),d=I.disputes[0];
  const voices=[...new Set(I.positions.map(p=>pid(p.name)))].filter(n=>PEOPLE[n]);
  const html=`<div class="meta"><span class="tag">The Great Ideas</span><button class="tag k press" data-course="${c.id}">${esc(c.title)}</button><span class="tag k">Idea ${l.n} of ${c.lectures.length} · day ${BDAY[l.id]}</span>${r?`<span class="tag k stage" style="--sc:${STAGE[st].color}"><i></i>${st==='new'?'Read':STAGE[st].label}</span>`:''}</div>
    <canvas class="emb" data-k="i:${I.id}" data-e="0" aria-hidden="true"></canvas>
    <h2>${esc(I.name)}</h2><p class="story" style="color:var(--soft);font-style:italic">${esc(I.gist)}</p><p class="story">${esc(I.framing)}</p>
    <div class="whoa"><b>The hook.</b>${esc(I.hook)}</div>
    <section class="deep">
      <h3 class="deep-h">The senses of the term</h3><ol class="list">${I.senses.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
      ${d?`<h3 class="deep-h">A live dispute</h3><div class="think"><p class="think-q">${esc(d.q)}</p>${sidesHTML(d)}</div>`:''}
      <h3 class="deep-h">The outline of topics · ${I.topics.length}</h3><ol class="list">${I.topics.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
      <div class="whoa"><b>For instance.</b>${esc(I.example)}</div>
      <div class="think"><span class="think-k">${ico('think',14)}Test yourself</span><p class="think-q">${esc(l.q)}</p><button class="btn press" data-ba="ans" style="align-self:flex-start">Show the answer</button><p class="your banswer" hidden>${esc(l.a)}</p></div>
      <h3 class="deep-h">In the Syntopicon</h3><div class="links">${I.related.map(ilink).join('')}${voices.map(n=>plink(n)).join('')}</div>
      ${lycForIdea(I.id)}
      <div class="note"><div class="note-h"><h3 class="deep-h">In your own words</h3><em id="noteState">the Feynman test: explain it plainly</em></div><textarea id="noteBox" placeholder="Explain “${esc(I.name)}” as if to a curious beginner.">${esc(prog.notes[k]||'')}</textarea></div>
    </section>
    <div class="acts"><button class="btn round press" data-ba="pl" aria-label="Previous idea in this domain">${ico('prev')}</button><button class="btn round press" data-ba="nl" aria-label="Next idea in this domain">${ico('next')}</button>
      <button class="btn ${r?'':'go '}press" data-ba="read">${r?'✓ Read · undo':ico('card')+'Mark as read'}</button>
      <button class="btn press" data-idea="${I.id}">${ico('page')}Full page</button>
      ${r?`<button class="btn go press" data-ba="tonight">${ico('next')}Next in the rotation</button>`:''}</div>`;
  openSheet(html,col,'b:'+l.id,push);playEmblem(sheetIn.querySelector('canvas.emb'));
  const nb=$('#noteBox');let nt;nb.addEventListener('input',()=>{$('#noteState').textContent='…';clearTimeout(nt);nt=setTimeout(()=>{saveNote(k,nb.value);const s=$('#noteState');if(s){s.textContent='Saved';s.className='saved'}},500)});
}
