/* ---------- stream: a feed of disputes, lines, voices, recalls and hooks ---------- */
const feed=$('#feed');let fSeq=0,recent=new Set(),fCur=0;
const POOLS=(()=>{const d=[],q=[],h=[];IDEAS.forEach(i=>{i.disputes.forEach(x=>d.push({t:'dispute',idea:i,d:x}));(i.quotes||[]).forEach(x=>q.push({t:'quote',idea:i,q:x}));h.push({t:'hook',idea:i})});return{dispute:d,quote:q,hook:h,thinker:PLIST.map(p=>({t:'thinker',p}))}})();
const ckey=c=>c.t==='thinker'?'p:'+c.p.id:'i:'+c.idea.id;
function nextBatch(){
  const pat=['dispute','quote','recall','dispute','thinker','quote','recall','dispute','hook'];const o=Math.floor(Math.random()*pat.length);const seq=pat.slice(o).concat(pat.slice(0,o));
  const due=IDEAS.filter(i=>isDue(i.id));
  const fresh=pool=>{for(let g=0;g<14;g++){const c=pick(pool);if(!recent.has(ckey(c)))return c}return pick(pool)};
  return seq.map(t=>{const c=t==='recall'?{t:'recall',idea:due.length&&Math.random()<.8?pick(due):pick(IDEAS)}:fresh(POOLS[t]);recent.add(ckey(c));if(recent.size>26)recent.delete(recent.values().next().value);return c});
}
const fio=new IntersectionObserver(es=>es.forEach(en=>{
  const c=en.target,cv=c.querySelector('canvas.emb');
  if(en.isIntersecting){c.classList.add('live');if(cv)cv.dataset.live='1';fCur=+c.dataset.seq;$('#fbLabel').innerHTML=`No. <b>${pad3(fCur+1)}</b>`;if(fCur>=fSeq-4)feedMore()}
  else if(cv)cv.dataset.live='0';
}),{root:feed,threshold:.6});
function cardHTML(c){
  const I=c.idea,cl=I?CLN[I.cluster]:'',open=I?`<button class="btn go press" data-a="open">${ico('page')}Open the page</button><button class="btn press" data-a="mind">${ico('mind')}Mind map</button>`:'';
  switch(c.t){
    case 'dispute':return`<span class="tag">The dispute · ${esc(I.name)}</span><h2>${esc(c.d.q)}</h2><p class="tap">Tap — who takes which side</p>
      <div class="reveal" hidden><div class="sides">${c.d.sides.map((s,k)=>`<div class="side"><b>${esc(s.who)}</b>${esc(s.view)}</div>`).join('')}</div><div class="acts">${open}</div></div>`;
    case 'quote':return`<span class="tag">The line · ${esc(I.name)}</span><p class="qline">${esc(c.q.text)}</p><p class="tap">Tap — who said it, and what it means</p>
      <div class="reveal" hidden><p class="src">${esc(c.q.who)}, ${esc(c.q.work)} · ${esc(c.q.when)}</p><p class="ctx">${esc(c.q.context)}</p><div class="acts">${open}</div></div>`;
    case 'thinker':{const p=c.p;return`<span class="tag">The voice · ${esc(p.era)}</span><h2>${esc(p.name)}</h2><p class="src">${esc(p.dates)}</p><p class="ctx">${esc(p.role)}</p><p class="tap">Tap — why they matter</p>
      <div class="reveal" hidden><p class="ctx" style="color:var(--text)">${esc(p.note)}</p><div class="acts"><button class="btn go press" data-a="person">${ico('page')}${p.appearances.length} ${p.appearances.length===1?'position':'positions'} — open the file</button><button class="btn press" data-a="pmind">${ico('mind')}Mind map</button></div></div>`}
    case 'recall':return`<span class="tag">From memory · ${esc(cl)}</span><h2>${esc(I.name)}</h2><p class="ctx">What is this idea, and where is it disputed?</p><p class="tap">Tap — then judge yourself honestly</p>
      <div class="reveal" hidden><p class="ctx" style="color:var(--text)">${esc(I.framing)}</p><p class="src">A live dispute · ${esc(I.disputes[0].q)}</p><div class="acts"><button class="btn press" data-rate="0">Again <span style="opacity:.55">1</span></button><button class="btn go press" data-rate="2">Got it <span style="opacity:.55">2</span></button></div></div>`;
    default:return`<span class="tag">The idea · ${esc(cl)}</span><h2>${esc(I.name)}</h2><p class="ctx">${esc(I.gist)}</p><p class="tap">Tap — the question it hides</p>
      <div class="reveal" hidden><p class="ctx" style="color:var(--text)"><i>${esc(I.hook)}</i></p><p class="ctx">${esc(I.framing)}</p><div class="acts">${open}</div></div>`;
  }
}
function feedMore(){
  const frag=document.createDocumentFragment();const add=[];
  nextBatch().forEach(c=>{
    const a=document.createElement('article');a.className='card';a.dataset.seq=fSeq++;
    const color=c.t==='thinker'?(ERA2G[c.p.era]||ERA_GROUPS[5]).color:CLC[c.idea.cluster];a.style.setProperty('--c',color);
    const k=c.t==='thinker'?'p:'+c.p.id:'i:'+c.idea.id;a.dataset.k=k;
    const word=c.t==='thinker'?c.p.name.split(' ').pop():c.idea.name.split(' ')[0];
    a.innerHTML=`<div class="wm word" aria-hidden="true">${esc(word)}</div><canvas class="emb" data-k="${esc(k)}" data-e="0" data-live="0" aria-hidden="true"></canvas><div class="card-in">${cardHTML(c)}</div>`;
    a._c=c;frag.appendChild(a);add.push(a);
  });
  if(fSeq<=9){const f=add[0];const h=document.createElement('div');h.className='hint';h.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>Swipe up · tap a card to reveal';f.classList.add('first');f.appendChild(h)}
  feed.appendChild(frag);add.forEach(a=>{attachEmblem(a.querySelector('canvas.emb'));a.querySelector('canvas.emb').dataset.e='.12';fio.observe(a)});
}
function resetFeed(){fio.disconnect();Living.clear(feed);feed.innerHTML='';fSeq=0;feedMore();feed.scrollTop=0;const s=prog.streak&&prog.streak.count>1?prog.streak.count:0;$('#fbStreak').textContent=s?`· streak ${s}`:''}
function revealCard(a){if(!a||a.classList.contains('open'))return;a.classList.add('open');const r=a.querySelector('.reveal');if(r)r.hidden=false;const t=a.querySelector('.tap');if(t)t.hidden=true;const cv=a.querySelector('canvas.emb');if(cv){const t0=performance.now(),from=+cv.dataset.e;const step=tt=>{const k=Math.min(1,(tt-t0)/900);cv.dataset.e=String(from+(1-from)*k);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}}
function feedStep(d){const c=feed.querySelector(`[data-seq="${fCur+d}"]`);if(c)c.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
feed.addEventListener('click',e=>{
  const a=e.target.closest('.card');if(!a)return;const b=e.target.closest('button');const c=a._c;
  if(!b){revealCard(a);return}
  if(b.dataset.rate!==undefined){if(a.dataset.rated)return;a.dataset.rated='1';rate(c.idea.id,+b.dataset.rate);toast(+b.dataset.rate?'Scheduled further out':'It will come back soon');setTimeout(()=>feedStep(1),280);return}
  const k=a.dataset.k;
  if(b.dataset.a==='open')openIdea(c.idea.id);
  if(b.dataset.a==='mind')toWeb(k,'mind');
  if(b.dataset.a==='person')openPerson(c.p.id);
  if(b.dataset.a==='pmind')toWeb(k,'mind');
});
feed.addEventListener('scroll',()=>{const h=feed.querySelector('.hint');if(h&&feed.scrollTop>40)h.style.opacity=0},{passive:true});

/* ---------- recall: spaced-repetition flashcards ---------- */
const recallEl=$('#recall');let session=null;
const RATES=[{g:0,label:'Again',hint:'blank',key:'1'},{g:1,label:'Hard',hint:'a struggle',key:'2'},{g:2,label:'Good',hint:'recalled',key:'3'},{g:3,label:'Easy',hint:'instant',key:'4'}];
function startSession(only){
  const due=IDEAS.filter(i=>isDue(i.id));
  const ids=only||shuffle(due.length?due:IDEAS).slice(0,24).map(i=>i.id);
  session={ids,i:0,done:0,open:false,mode:session?session.mode:'forward'};renderRecall();
}
function renderRecall(flip=false){
  const s=session,id=s.ids[s.i];
  if(!id){recallEl.innerHTML=`<div class="rscreen"><div class="endcard"><span class="tag">${s.done?'Session complete':'Nothing due'}</span><div class="score">${s.done}<small> ${s.done===1?'idea':'ideas'}</small></div><p class="story">${s.done?'Spacing does the rest. Return when they come due.':'Every idea is scheduled ahead. You can still study a fresh round now.'}</p><div class="acts"><button class="btn go press" data-r="again">${s.done?'Review more':'Study a round anyway'}</button><button class="btn press" data-r="ledger">See your ledger</button></div></div></div>`;return}
  const I=IBY[id],c=CLC[I.cluster];
  const top=`<div class="qtop"><span class="qcount">Card <b>${s.i+1}</b> / ${s.ids.length}</span><div class="seg" role="group" aria-label="Prompt direction" style="margin-left:auto"><button data-mode="forward" aria-pressed="${s.mode==='forward'}">Idea → meaning</button><button data-mode="identify" aria-pressed="${s.mode==='identify'}">Clue → idea</button></div></div><div class="bar"><i style="width:${s.i/s.ids.length*100}%"></i></div>`;
  let body;
  if(!s.open){
    body=`<span class="tag">${s.mode==='forward'?esc(CLN[I.cluster]):'Name the idea'}</span>
      <canvas class="emb" data-k="i:${id}" data-e=".1" aria-hidden="true"></canvas>
      ${s.mode==='forward'?`<div class="rname">${esc(I.name)}</div><p class="rprompt">Recall its meaning, its central tension, and one voice from the conversation.</p>`:`<p class="rclue">${esc(I.gist)}</p><p class="rprompt">Also asks: ${esc(I.topics[0])}</p>`}
      <textarea class="scratch" placeholder="Say it out loud, or jot the gist here first. Generating the answer is what makes it stick."></textarea>
      <button class="btn press" data-r="reveal" style="align-self:flex-start">Reveal <span style="color:var(--faint);font-family:var(--f-mono);font-size:12px">space</span></button>`;
  }else{
    body=`<span class="tag">${esc(CLN[I.cluster])}</span><canvas class="emb" data-k="i:${id}" data-e="0" aria-hidden="true"></canvas>
      <div class="rname">${esc(I.name)}</div><p class="rprompt" style="font-style:italic">${esc(I.gist)}</p><p class="story" style="font-size:16px">${esc(I.framing)}</p>
      <p class="rrow"><b>A live dispute</b>${esc(I.disputes[0].q)}</p><p class="rrow"><b>Voice</b>${esc(I.positions[0].name)} — ${esc(I.positions[0].claim)}</p><p class="rrow"><b>Hook</b><i>${esc(I.hook)}</i></p>
      <button class="backline press" data-r="page">${ico('page',14)}Open the full page</button>
      <div class="rates">${RATES.map(r=>`<button class="rate press" data-g="${r.g}">${r.label}<small>${r.hint}</small><kbd>${r.key}</kbd></button>`).join('')}</div>`;
  }
  Living.clear(recallEl);
  recallEl.innerHTML=`<div class="rscreen">${top}<div class="rcard"><div class="rface${flip?' flip':''}" style="--c:${c}">${body}</div></div><p class="hintline">Rate honestly. “Again” brings it back soon, “Easy” pushes it far out. Difficulty is what makes it stick.</p></div>`;
  const cv=recallEl.querySelector('canvas.emb');if(cv){attachEmblem(cv);if(s.open)playEmblem(cv,1000)}
}
function burst(el){const r=el.getBoundingClientRect();for(let k=0;k<14;k++){const d=document.createElement('i');d.className='burst';const a=k/14*TAU;d.style.left=r.left+r.width/2+'px';d.style.top=r.top+r.height/2+'px';d.style.setProperty('--dx',Math.cos(a)*60+'px');d.style.setProperty('--dy',Math.sin(a)*60+'px');document.body.appendChild(d);setTimeout(()=>d.remove(),900)}}
function rateCard(g,el){const s=session,id=s.ids[s.i];if(!id||!s.open)return;rate(id,g);if(g>=2&&el)burst(el);s.done++;s.i++;s.open=false;renderRecall()}
recallEl.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||!session)return;
  if(b.dataset.mode){session.mode=b.dataset.mode;session.open=false;renderRecall();return}
  if(b.dataset.g!==undefined)return rateCard(+b.dataset.g,b);
  const r=b.dataset.r;
  if(r==='reveal'){session.open=true;renderRecall(true)}
  if(r==='again')startSession();
  if(r==='ledger')show('ledger');
  if(r==='page')openIdea(session.ids[session.i]);
});
document.addEventListener('keydown',e=>{
  if(!sheet.hidden||/input|textarea/i.test(e.target.tagName))return;
  if(current==='recall'&&session){if((e.key===' '||e.key==='Enter')&&!session.open&&session.ids[session.i]){e.preventDefault();session.open=true;renderRecall(true)}
    else if(session.open&&['1','2','3','4'].includes(e.key)){e.preventDefault();rateCard(+e.key-1,recallEl.querySelector(`.rate[data-g="${+e.key-1}"]`))}}
  if(current==='stream'){const a=feed.querySelector(`[data-seq="${fCur}"]`);
    if(e.key==='ArrowDown'||e.key==='j'){e.preventDefault();feedStep(1)}else if(e.key==='ArrowUp'||e.key==='k'){e.preventDefault();feedStep(-1)}
    else if(e.key===' '){e.preventDefault();revealCard(a)}else if(a&&a.classList.contains('open')&&(e.key==='1'||e.key==='2')){const b=a.querySelector(`[data-rate="${e.key==='1'?0:2}"]`);if(b)b.click()}}
});

/* ---------- ledger ---------- */
const ledgerEl=$('#ledger');
function renderLedger(){
  const S={new:0,learning:0,young:0,mature:0},per={};CLUSTERS.forEach(c=>per[c.id]={new:0,learning:0,young:0,mature:0,total:0});
  let due=0;IDEAS.forEach(i=>{const s=stage(i.id);S[s]++;per[i.cluster][s]++;per[i.cluster].total++;if(isDue(i.id))due++});
  const today=prog.today.day===dstr(now())?prog.today.count:0,ks=['new','learning','young','mature'];
  const notes=IORDER.filter(i=>(prog.notes[i.id]||'').trim());
  ledgerEl.innerHTML=`<div class="ledger">
    <section class="passport"><h2>Your ledger</h2><p>Memory is built by return visits. Move each idea from unread toward the gold of mastery.</p>
      <div class="stats four"><div class="stat"><b>${prog.streak.count||0}</b><span>Day streak</span></div><div class="stat"><b style="color:var(--gold)">${S.mature}</b><span>Mastered</span></div><div class="stat"><b>${due}</b><span>Due now</span></div><div class="stat"><b>${today}</b><span>Reviewed today</span></div></div>
      <div class="stamps big">${IORDER.map(i=>`<button class="stamp s-${stage(i.id)} press" style="--c:${CLC[i.cluster]}" data-idea="${i.id}" title="${esc(i.name)} · ${STAGE[stage(i.id)].label}" aria-label="${esc(i.name)}, ${STAGE[stage(i.id)].label}"></button>`).join('')}</div>
      <div class="legend"><span><i class="s1"></i>Unread</span><span><i class="s2"></i>Learning</span><span><i class="s3"></i>Familiar</span><span><i class="s4"></i>Mastered</span></div>
    </section>
    <div class="modes"><button class="mode press" data-l="recall" style="--mc:var(--gold)"><span class="ic">${ico('card',24)}</span><span><h3>Begin review · ${due} due</h3><p>Flashcards, spaced so they stick.</p></span><span class="arr">${ico('next',20)}</span></button></div>
    <div class="sec-label">The whole corpus · ${IDEAS.length} ideas</div>
    <div class="dist">${ks.map(k=>S[k]?`<i style="width:${S[k]/IDEAS.length*100}%;background:${STAGE[k].color}" title="${STAGE[k].label}: ${S[k]}"></i>`:'').join('')}</div>
    <div class="legend" style="margin-top:-6px">${ks.map(k=>`<span><i style="background:${STAGE[k].color}"></i>${STAGE[k].label} · ${S[k]}</span>`).join('')}</div>
    <div class="sec-label">Coverage by domain</div>
    <div class="cov">${CLUSTERS.map(c=>{const f=per[c.id];return`<div class="covrow" style="--cc:${CLC[c.id]}"><div class="t"><b>${esc(c.name)}</b><span>${f.mature} mastered · ${f.total} total</span></div><div class="covtrack">${ks.map(k=>f[k]&&k!=='new'?`<i style="width:${f[k]/f.total*100}%;background:${k==='mature'?'var(--gold)':`color-mix(in srgb,${CLC[c.id]} ${k==='learning'?45:100}%,transparent)`}"></i>`:'').join('')}</div></div>`}).join('')}</div>
    ${notes.length?`<div class="sec-label">In your own words · ${notes.length}</div><div class="notes">${notes.map(i=>`<button class="frow press" data-idea="${i.id}" style="--cc:${CLC[i.cluster]}"><span class="d"></span><span><b>${esc(i.name)}</b><span>${esc(prog.notes[i.id].slice(0,140))}${prog.notes[i.id].length>140?'…':''}</span></span></button>`).join('')}</div>`:''}
    <button class="reset press" data-l="reset">Reset all progress</button>
  </div>`;
}
ledgerEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.idea)return openIdea(b.dataset.idea);
  if(b.dataset.l==='recall'){show('recall');startSession()}
  if(b.dataset.l==='reset'){if(!confirm('Reset all review scheduling, notes, and streaks? This cannot be undone.'))return;prog=fresh();saveProg();updateCounts();markStations();renderLedger();toast('Progress reset')}});

/* ---------- the web ---------- */
let webReady=false;
function ensureWeb(){
  if(webReady)return;webReady=true;
  const nodes=[...IDEAS.map(i=>({id:'i:'+i.id,type:'idea',label:i.name,color:CLC[i.cluster],group:i.cluster})),...PLIST.map(p=>{const g=ERA2G[p.era]||ERA_GROUPS[5];return{id:'p:'+p.id,type:'person',label:p.name,color:GOLD,group:g.id,year:p.sortYear??0,era:g.short,eraColor:g.color,eraIdx:ERA_GROUPS.indexOf(g)}})];
  const edges=[],seen=new Set();
  IDEAS.forEach(i=>i.related.forEach(r=>{const k=[i.id,r].sort().join('|');if(seen.has(k))return;seen.add(k);edges.push({a:'i:'+i.id,b:'i:'+r,type:'see'})}));
  PLIST.forEach(p=>{const ids=new Set(p.appearances.map(a=>a.id));ids.forEach(id=>edges.push({a:'p:'+p.id,b:'i:'+id,type:'argues'}))});
  const rs=new Set();PLIST.forEach(p=>{p.rivals.forEach((c,n)=>{const k=[p.id,n].sort().join('|');if(rs.has(k))return;rs.add(k);edges.push({a:'p:'+p.id,b:'p:'+n,type:'rival',w:c})});p.allies.forEach((c,n)=>{const k='a'+[p.id,n].sort().join('|');if(rs.has(k))return;rs.add(k);if(!p.rivals.has(n))edges.push({a:'p:'+p.id,b:'p:'+n,type:'ally',w:c})})});
  Web.init({nodes,edges,mindTree,
    defaultRoot:()=>items[active]?items[active].key:'i:mind',
    onOpen:id=>id.startsWith('i:')?openIdea(id.slice(2)):openPerson(id.slice(2)),
    onFocus:(n,es)=>renderWCard(n,es),onMind:(root,depth)=>renderWMind(root,depth),onLayers:l=>renderLayers()});
  renderLayers();
  requestAnimationFrame(()=>Web.fit());
}
function mindTree(id){
  if(id.startsWith('i:')){const I=IBY[id.slice(2)];if(!I)return null;const c=CLC[I.cluster];
    const firstWho=(d,k)=>{const n=(d._who&&d._who[k]||[])[0];return n?'p:'+n:null};
    return{label:I.name,ref:id,color:c,kicker:CLN[I.cluster].toUpperCase(),kids:[
      {label:'Senses',color:'#b2b5d8',kids:I.senses.map(s=>({label:s}))},
      {label:'Disputes',color:ROSE,kids:I.disputes.map(d=>({label:d.q,kids:d.sides.map((s,k)=>({label:s.who,ref:firstWho(d,k),color:firstWho(d,k)?GOLD:'#e9a0aa'}))}))},
      {label:'Voices',color:GOLD,kids:I.positions.map(p=>({label:p.name,ref:'p:'+pid(p.name),color:GOLD}))},
      {label:'Wired to',color:c,kids:I.related.map(r=>({label:IBY[r].name,ref:'i:'+r,color:CLC[IBY[r].cluster]}))},
      {label:'Topics',color:'#36c4a9',kids:I.topics.map(t=>({label:t}))}].filter(b=>b.kids.length)}}
  const p=PEOPLE[id.slice(2)];if(!p)return null;
  const apps=p.appearances.map(a=>IBY[a.id]);const byC={};apps.forEach(i=>(byC[i.cluster]=byC[i.cluster]||[]).push(i));
  const argues=apps.length>9?Object.entries(byC).map(([c,L])=>({label:CLS[c],color:CLC[c],kids:L.map(i=>({label:i.name,ref:'i:'+i.id,color:CLC[c]}))})):apps.map(i=>({label:i.name,ref:'i:'+i.id,color:CLC[i.cluster]}));
  return{label:p.name,ref:id,color:GOLD,kicker:(p.era+' · '+p.dates).toUpperCase(),kids:[
    {label:'Argues',color:'#f2b544',kids:argues},
    {label:'Rivals',color:ROSE,kids:topN(p.rivals,6).map(([n])=>({label:n,ref:'p:'+n,color:ROSE}))},
    {label:'Allies',color:SKY,kids:topN(p.allies,5).map(([n])=>({label:n,ref:'p:'+n,color:SKY}))},
    {label:'Works',color:'#b2b5d8',kids:(p.works||'').split(';').map(s=>s.trim()).filter(Boolean).map(s=>({label:s}))}].filter(b=>b.kids.length)};
}
const wLayers=$('#wLayers'),wCard=$('#wCard'),wMind=$('#wMind'),wHint=$('#wHint');
function renderLayers(){const L=Web.layers;
  wLayers.innerHTML=[['see','Cross-references','#b2b5d8'],['argues','Thinkers','#ffd86b'],['rivals','Rivals & allies','#ef5d71']].map(([k,l,c])=>`<button class="wl press" data-l="${k}" style="--lc:${c}" aria-pressed="${!!L[k]}" ${k==='rivals'&&!L.argues?'disabled':''}><i></i>${l}</button>`).join('');
  wLayers.hidden=Web.mode==='mind';}
wLayers.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const k=b.dataset.l;Web.setLayers({[k]:!Web.layers[k]});renderLayers();if(Web.focus)renderWCard(Web.focus,null)});
function renderWCard(n,es){
  if(!n){wCard.hidden=true;wHint.hidden=Web.mode!=='net';return}
  wHint.hidden=true;wCard.hidden=false;
  if(!es)es=[];const cnt={see:0,argues:0,rival:0,ally:0};(Web.focus===n?[]:[]).length;
  const isI=n.type==='idea';const ref=isI?IBY[n.id.slice(2)]:PEOPLE[n.id.slice(2)];
  const c=isI?CLC[ref.cluster]:GOLD;wCard.style.setProperty('--c',c);
  const deg=isI?`<b>${ref.related.length}</b> cross-refs · <b>${PLIST.filter(p=>p.appearances.some(a=>a.id===ref.id)).length}</b> thinkers`:`<b>${ref.appearances.length}</b> ideas · <b>${ref.rivals.size}</b> rivals · <b>${ref.allies.size}</b> allies`;
  wCard.innerHTML=`<div class="meta"><span class="tag">${isI?esc(CLN[ref.cluster]):esc(ref.era)}</span><span class="wcount">${deg}</span></div><h2>${esc(ref.name)}</h2><p>${esc(isI?ref.gist:ref.role)}</p>
    <div class="acts"><button class="btn go press" data-w="mind">${ico('mind')}Mind map</button><button class="btn press" data-w="open">${ico('page')}${isI?'Page':'File'}</button><button class="btn press" data-w="engine">${ico('gear')}Engine</button></div>`;
}
wCard.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const n=Web.focus;if(!n)return;
  if(b.dataset.w==='mind')setWMode('mind',n.id);if(b.dataset.w==='open')n.id.startsWith('i:')?openIdea(n.id.slice(2)):openPerson(n.id.slice(2));if(b.dataset.w==='engine')toEngine(n.id)});
function renderWMind(root,depth){
  if(!root){wMind.hidden=true;return}
  wMind.hidden=false;wCard.hidden=true;wHint.hidden=true;
  wMind.innerHTML=`${depth?`<button class="btn press" data-m="back">${ico('back')}Back</button>`:''}<button class="btn press" data-m="open">${ico('page')}${root.ref.startsWith('i:')?'Page':'File'}</button><button class="btn press" data-m="net">${ico('web')}In the network</button>`;
}
wMind.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const r=Web.mindRoot;
  if(b.dataset.m==='back')Web.mindBack();if(b.dataset.m==='open'&&r)r.ref.startsWith('i:')?openIdea(r.ref.slice(2)):openPerson(r.ref.slice(2));
  if(b.dataset.m==='net'&&r){setWMode('net');Web.focusId(r.ref)}});
function setWMode(m,root){document.querySelectorAll('#wMode button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));Web.setMode(m,root);renderLayers();if(m==='net'){wMind.hidden=true;renderWCard(Web.focus,null)}}
$('#wMode').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setWMode(b.dataset.m)});
$('#wIn').addEventListener('click',()=>Web.zoom(1.35));$('#wOut').addEventListener('click',()=>Web.zoom(1/1.35));$('#wFit').addEventListener('click',()=>Web.fit());
const wS=$('#wSearch'),wR=$('#wRes');
function wSearch(){const q=wS.value.trim().toLowerCase();if(!q){wR.innerHTML='';return}
  const hits=[...IDEAS.filter(i=>i.name.toLowerCase().includes(q)).map(i=>({k:'i:'+i.id,n:i.name,c:CLC[i.cluster],s:CLS[i.cluster]})),...PLIST.filter(p=>p.name.toLowerCase().includes(q)).map(p=>({k:'p:'+p.id,n:p.name,c:GOLD,s:p.dates,p:1}))].slice(0,8);
  wR.innerHTML=hits.map(h=>`<button class="${h.p?'p':''}" data-k="${esc(h.k)}" style="--cc:${h.c}"><i></i>${esc(h.n)}<small>${esc(h.s)}</small></button>`).join('')||'';}
wS.addEventListener('input',wSearch);wS.addEventListener('keydown',e=>{if(e.key==='Enter'){const b=wR.querySelector('button');if(b)b.click()}if(e.key==='Escape'){wS.value='';wSearch();wS.blur()}});
wR.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;wS.value='';wR.innerHTML='';wS.blur();if(Web.mode==='mind')Web.mindmap(k);else Web.focusId(k)});
function toWeb(key,m){show('web');setTimeout(()=>{if(m==='mind')setWMode('mind',key);else{setWMode('net');Web.focusId(key)}},40)}

/* ---------- side list (desktop): every idea and thinker ---------- */
const slList=$('#slList'),slQ=$('#slQ');let slMode='ideas';
function renderSide(){
  if(!slList)return;const q=(slQ.value||'').trim().toLowerCase();let html='';
  if(slMode==='ideas'){CLUSTERS.forEach(c=>{const L=IORDER.filter(i=>i.cluster===c.id&&(!q||i.name.toLowerCase().includes(q)));if(!L.length)return;
      html+=`<div class="sl-g" style="--cc:${CLC[c.id]}">${esc(CLS[c.id])}<small>${L.length}</small></div>`+L.map(i=>`<button class="sl-i" style="--cc:${CLC[i.cluster]}" data-k="i:${i.id}"><i></i><span>${esc(i.name)}</span><small>${pad3(INUM[i.id])}</small></button>`).join('')})}
  else ERA_GROUPS.forEach(g=>{const L=PLIST.filter(p=>ERA2G[p.era]===g&&(!q||p.name.toLowerCase().includes(q)));if(!L.length)return;
      html+=`<div class="sl-g" style="--cc:${g.color}">${esc(g.short)}<small>${L.length}</small></div>`+L.map(p=>`<button class="sl-i p" style="--cc:${g.color}" data-k="p:${esc(p.id)}"><i></i><span>${esc(p.name)}</span><small>${esc(yr(p.sortYear??0))}</small></button>`).join('')});
  slList.innerHTML=html||'<p class="sl-empty">Nothing matches.</p>';markSide(true);
}
function setSideMode(m){if(m===slMode)return;slMode=m;document.querySelectorAll('#sideList [data-sl]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sl===m));renderSide()}
function markSide(scroll){if(!slList||!items[active])return;const k=items[active].key;slList.querySelectorAll('.sl-i.on').forEach(b=>b.classList.remove('on'));const b=slList.querySelector(`[data-k="${CSS.escape(k)}"]`);if(b){b.classList.add('on');if(scroll&&getComputedStyle($('#sideList')).display!=='none')b.scrollIntoView({block:'nearest'})}}
if(slList){
  $('#sideList').addEventListener('click',e=>{const m=e.target.closest('[data-sl]');if(m){setSideMode(m.dataset.sl);return}
    const b=e.target.closest('.sl-i');if(!b)return;const k=b.dataset.k;
    if(current==='engine')toEngine(k);
    else if(current==='web'){if(Web.mode==='mind')Web.mindmap(k);else Web.focusId(k)}
    else k.startsWith('i:')?openIdea(k.slice(2)):openPerson(k.slice(2));});
  slQ.addEventListener('input',renderSide);
}

/* ---------- boot ---------- */
updateCounts();
document.querySelectorAll('#lines button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lens===lens));
$('#carLabel').textContent=lens==='ideas'?'Now thinking':'Now listening';
buildItems();buildChips();buildTrack();buildScale();
slMode=lens;document.querySelectorAll('#sideList [data-sl]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sl===lens));renderSide();
setActive(Math.min(prefs.at[lens]||0,items.length-1));
Engine.start(()=>ENG);
const startView=(location.hash||'').slice(1);
show(VIEWS.includes(startView)?startView:'engine');
requestAnimationFrame(()=>{layout();go(active,false)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{layout();go(active,false)});
