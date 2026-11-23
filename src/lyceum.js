/* ---------- lyceum: a curriculum of forty courses ----------
   Forty courses of eighteen one-page lectures, read one a night in the book's rotation,
   wired into the Syntopicon's ideas and thinkers, and held in memory with the same scheduler. */
const BC=LYC.courses, BDEPT=Object.fromEntries(LYC.depts.map(d=>[d.id,d]));
const BCO=Object.fromEntries(BC.map(c=>[c.id,c]));
const BLEC={};BC.forEach(c=>c.lectures.forEach((l,k)=>{l.id=c.id+'-'+(k+1);l.n=k+1;l.course=c;BLEC[l.id]=l}));
/* the book's rotation: within a syllabus, lecture 1 of each of its five courses, then lecture 2 of each, and so on */
const BORDER=(()=>{const o=[];[1,2].forEach(v=>[1,2,3,4].forEach(s=>{const cs=BC.filter(c=>c.vol===v&&c.syl===s);for(let k=0;k<18;k++)cs.forEach(c=>c.lectures[k]&&o.push(c.lectures[k]))}));return o})();
const BDAY=Object.fromEntries(BORDER.map((l,k)=>[l.id,k+1]));
const VOLN={1:'First Semester',2:'Second Semester'};
const BP=()=>{const b=prog.lyceum||(prog.lyceum={});if(!b.read)b.read={};if(!b.skip)b.skip={};return b};
const isRead=id=>!!BP().read[id];
const bkey=id=>'b:'+id;
const courseDone=c=>c.lectures.filter(l=>isRead(l.id)).length;
const bcolor=c=>BDEPT[c.dept].color;
const lecIdeas=l=>(l.ideas&&l.ideas.length?l.ideas:l.course.ideas).filter(i=>IBY[i]);
function tonight(){const P=BP();return BORDER.find(l=>!P.read[l.id]&&!P.skip[l.id])||BORDER.find(l=>!P.read[l.id])||null}
function markRead(id,on=true){
  const P=BP(),k=bkey(id);
  if(on){P.read[id]=now();delete P.skip[id];if(!prog.srs[k])prog.srs={...prog.srs,[k]:{reps:0,interval:0,ease:2.5,due:now()+DAY,last:now()}};prog=bumpDay(prog);prog.lyceum=P}
  else{delete P.read[id];const s={...prog.srs};delete s[k];prog.srs=s}
  saveProg();
}
const lycDue=()=>BORDER.filter(l=>isRead(l.id)&&isDue(bkey(l.id)));

/* ----- the view ----- */
const lyceumEl=$('#lyceum');let bTab='syllabi',bQ='',bSession=null;
function renderLyceum(){
  if(!lyceumEl)return;Living.clear(lyceumEl);BP();
  const t=tonight(),read=Object.keys(BP().read).filter(id=>BLEC[id]).length,credits=BC.filter(c=>courseDone(c)===c.lectures.length).length,due=lycDue().length;
  const hero=t?(()=>{const c=t.course,col=bcolor(c),em=lecIdeas(t)[0];
    return`<section class="bhero" style="--c:${col}"><div class="meta"><span class="tag">Tonight · day ${BDAY[t.id]} of ${BORDER.length}</span><span class="tag k">${esc(BDEPT[c.dept].name)}</span></div>
      ${em?`<canvas class="emb" data-k="i:${em}" data-e=".15" aria-hidden="true"></canvas>`:''}
      <p class="bcourse">${esc(c.title)} <small>· lecture ${t.n} of ${c.lectures.length}</small></p><h2>${esc(t.title)}</h2>
      <p class="story">${esc(t.text.length>170?t.text.slice(0,170).replace(/\s+\S*$/,'')+'…':t.text)}</p>
      <div class="acts"><button class="btn go press" data-ba="open" data-id="${t.id}">${ico('page')}Read tonight's lecture</button><button class="btn press" data-ba="skip" data-id="${t.id}">${ico('next')}Not tonight</button></div></section>`})()
    :`<section class="bhero" style="--c:var(--gold)"><span class="tag">Graduated</span><h2>All ${BORDER.length} lectures read.</h2><p class="story">The degree is conferred. Keep it by reviewing what comes due.</p></section>`;
  const tabs=[['syllabi','Syllabi'],['depts','Departments'],['review','Review · '+due]];
  lyceumEl.innerHTML=`<div class="lyceum">
    <header class="bhead"><div class="kicker">The Lyceum</div><p>Forty courses, eighteen one-page lectures each, read one a night in rotation. Every lecture is wired to the ideas and thinkers of the Syntopicon.</p></header>
    ${hero}
    <div class="stats four"><div class="stat"><b>${read}</b><span>Lectures read</span></div><div class="stat"><b style="color:var(--gold)">${credits}</b><span>Courses complete</span></div><div class="stat"><b>${due}</b><span>Due for review</span></div><div class="stat"><b>${prog.streak.count||0}</b><span>Day streak</span></div></div>
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
      return`<section class="fgroup"><h3>Syllabus ${s}<small>${dn} / ${cs.length*18}</small></h3>${cs.map(courseRow).join('')}</section>`}).join('')).join('');
  }else{
    html=LYC.depts.map(d=>{const cs=BC.filter(c=>c.dept===d.id);if(!cs.length)return'';const n=cs.length*18,dn=cs.reduce((a,c)=>a+courseDone(c),0);
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
  const html=`<div class="meta"><span class="tag">${esc(BDEPT[c.dept].name)}</span><span class="tag k">${VOLN[c.vol]} · Syllabus ${c.syl}</span><span class="tag k">${d===c.lectures.length?'✓ credit':d+' / '+c.lectures.length+' read'}</span></div>
    ${em?`<canvas class="emb" data-k="i:${em}" data-e="0" aria-hidden="true"></canvas>`:''}
    <h2>${esc(c.title)}</h2><p class="story">${esc(c.blurb)}</p>
    <div class="cbar big"><i style="width:${d/c.lectures.length*100}%"></i></div>
    <section class="deep">
      ${syntoLinks(c.ideas,c.thinkers)}
      <h3 class="deep-h">The eighteen lectures</h3><div class="voices">${c.lectures.map(l=>`<button class="frow press${isRead(l.id)?' done':''}" data-lec="${l.id}" style="--cc:${col}"><span class="d"></span><span><b>${l.n}. ${esc(l.title)}</b><span>${esc(l.q)}</span></span><small>${isRead(l.id)?'✓':'day '+BDAY[l.id]}</small></button>`).join('')}</div>
    </section>
    <div class="acts"><button class="btn go press" data-lec="${next.id}">${ico('page')}${d?(d===c.lectures.length?'Start again':'Continue · lecture '+next.n):'Begin the course'}</button><button class="btn press" data-ba="lyceum">${ico('card')}Lyceum</button></div>`;
  openSheet(html,col,'c:'+id,push);playEmblem(sheetIn.querySelector('canvas.emb'));
}
function openLecture(id,push=true){
  const l=BLEC[id];if(!l)return;const c=l.course,col=bcolor(c),r=isRead(id),em=lecIdeas(l)[0],k=bkey(id),st=stage(k);
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
