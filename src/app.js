/* ---------- data ---------- */
const IDEAS=DATA.ideas, CLUSTERS=DATA.clusters;
const CLC={being:'#71b4ff',divine:'#b892ff',mind:'#36c4a9',nature:'#8fd16a',good:'#f2b544',expr:'#ff7096',polis:'#ff8a5c'};
const CLS={being:'Being',divine:'Divine',mind:'Mind',nature:'Nature',good:'Good life',expr:'Art',polis:'Polis'};
const CLN=Object.fromEntries(CLUSTERS.map(c=>[c.id,c.name]));
const IBY=Object.fromEntries(IDEAS.map(i=>[i.id,i]));
const pid=n=>DATA.people[n]&&DATA.people[n].aliasOf||n;
/* periods by birth year, so the axis never overlaps */
const ERA_GROUPS=[
  {id:'greece',name:'Hellenic world',short:'Hellenic',color:'#71b4ff',to:-200},
  {id:'rome',name:'Rome & late antiquity',short:'Rome',color:'#ff8a5c',to:300},
  {id:'middle',name:'Middle Ages',short:'Middle Ages',color:'#b892ff',to:1450},
  {id:'ren',name:'Renaissance',short:'Renaissance',color:'#36c4a9',to:1560},
  {id:'sci',name:'Scientific Revolution',short:'Sci. Revolution',color:'#8fd16a',to:1650},
  {id:'enl',name:'Enlightenment',short:'Enlightenment',color:'#f2b544',to:1760},
  {id:'modern',name:'Modern',short:'Modern',color:'#ff7096',to:1e9}];
const EG=p=>{const y=p&&p.sortYear!=null?p.sortYear:1900;return ERA_GROUPS.find(g=>y<g.to)};

const PEOPLE=(()=>{const o={};
  Object.keys(DATA.people).forEach(k=>{const n=pid(k);if(o[n])return;o[n]={id:n,...DATA.people[n],appearances:[],rivals:new Map(),allies:new Map(),quotes:[]}});
  IDEAS.forEach(i=>i.positions.forEach(p=>{const n=pid(p.name);if(o[n])o[n].appearances.push({id:i.id,claim:p.claim})}));
  IDEAS.forEach(i=>(i.quotes||[]).forEach(q=>{const n=pid(q.who);if(o[n])o[n].quotes.push({...q,idea:i.id})}));
  // allies and rivals: thinkers named on the same / opposite sides of the same dispute
  const names=Object.keys(DATA.people).sort((a,b)=>b.length-a.length);
  const res=names.map(n=>[n,new RegExp('\\b'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b')]);
  const who=t=>{const f=[];for(const [n,re] of res){if(re.test(t)){f.push(pid(n));t=t.replace(re,'')}}return[...new Set(f)]};
  IDEAS.forEach(i=>i.disputes.forEach(d=>{const S=d.sides.map(s=>who(s.who));d._who=S;
    const add=(m,a,b)=>{m.set(b,(m.get(b)||0)+1)};
    S.forEach((A,x)=>{A.forEach(a=>A.forEach(b=>{if(a!==b)add(o[a].allies,a,b)}));S.forEach((B,y)=>{if(x===y)return;A.forEach(a=>B.forEach(b=>{if(a!==b)add(o[a].rivals,a,b)}))})})}));
  return o})();
const PLIST=Object.values(PEOPLE).sort((a,b)=>(a.sortYear??9999)-(b.sortYear??9999)||a.name.localeCompare(b.name));
const IORDER=CLUSTERS.flatMap(c=>IDEAS.filter(i=>i.cluster===c.id).sort((a,b)=>a.name.localeCompare(b.name)));
const INUM=Object.fromEntries(IORDER.map((i,k)=>[i.id,k+1]));
const topN=(m,n=6)=>[...m].sort((a,b)=>b[1]-a[1]).slice(0,n);

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const yr=y=>y<0?`${-y} BC`:(y<1000?`AD ${y}`:`${y}`);
const pad3=n=>String(n).padStart(3,'0');
const ICO={
  prev:'<path d="M15 6l-6 6 6 6"/>',next:'<path d="M9 6l6 6-6 6"/>',
  web:'<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="7" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.3 7.2l9.4.4M6.4 8.2l4.4 7.6M17.7 9.2l-4.5 6.8"/>',
  mind:'<circle cx="12" cy="12" r="3"/><path d="M9.5 10.5C7 9 5 9 3 10M14.5 10.5C17 9 19 8 21 8M10 14.5C8 17 6 18 4 18M14 14.5c1.5 2.5 3.5 4 6 4.5"/>',
  page:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',think:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 6l-6 6 6 6"/>',card:'<rect x="3" y="5" width="14" height="16" rx="2.5"/><path d="M7 3h11a3 3 0 0 1 3 3v11"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'};
const ico=(k,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[k]}</svg>`;
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1800)}

/* ---------- progress: spaced repetition, notes, streak ----------
   Same scheduler and the same storage key as the original Syntopicon, so progress carries over. */
const DAY=864e5,now=()=>Date.now(),dstr=t=>new Date(t).toISOString().slice(0,10);
const STAGE={new:{label:'Unread',color:'#7c80aa'},learning:{label:'Learning',color:'#71b4ff'},young:{label:'Familiar',color:'#b892ff'},mature:{label:'Mastered',color:'#ffd86b'}};
const stageOf=r=>!r||!r.reps?'new':r.interval<3?'learning':r.interval<21?'young':'mature';
function schedule(r,g){let{reps:n=0,interval:i=0,ease:o=2.5}=r||{};
  if(g===0){n=0;i=0;o=Math.max(1.3,o-.2)}else if(g===1){i=Math.max(1,Math.round((i||1)*1.2));o=Math.max(1.3,o-.15);n+=1}
  else if(g===2){i=n===0?1:n===1?3:Math.round((i||1)*o);n+=1}else{i=Math.round(Math.max(i||1,1)*o*1.3)+1;o+=.1;n+=1}
  return{reps:n,interval:i,ease:o,due:now()+i*DAY,last:now()}}
const KEY='synstore:user:syntopicon:v2:progress';
const fresh=()=>({srs:{},notes:{},streak:{count:0,last:null},today:{day:null,count:0}});
let prog=fresh();try{const r=localStorage.getItem(KEY);if(r)prog={...fresh(),...JSON.parse(r)}}catch(e){}
function saveProg(){try{localStorage.setItem(KEY,JSON.stringify(prog))}catch(e){}}
function bumpDay(s){const t=dstr(now());let td=s.today.day===t?s.today:{day:t,count:0};td={...td,count:td.count+1};let k=s.streak;if(k.last!==t)k={count:k.last===dstr(now()-DAY)?k.count+1:1,last:t};return{...s,today:td,streak:k}}
function rate(id,g){prog=bumpDay({...prog,srs:{...prog.srs,[id]:schedule(prog.srs[id],g)}});saveProg();updateCounts();markStations()}
const isDue=id=>{const r=prog.srs[id];return!r||(r.due&&r.due<=now())};
const stage=id=>stageOf(prog.srs[id]);
function saveNote(id,t){prog={...prog,notes:{...prog.notes,[id]:t}};saveProg()}
function updateCounts(){const n=IDEAS.filter(i=>prog.srs[i.id]&&prog.srs[i.id].reps).length;$('#passN').textContent=n;$('#passT').textContent=IDEAS.length}
const PKEY='syntopicon-engine:prefs';let prefs={lens:'ideas',at:{ideas:0,thinkers:0}};
try{Object.assign(prefs,JSON.parse(localStorage.getItem(PKEY)||'{}'))}catch(e){}
const savePrefs=()=>{try{localStorage.setItem(PKEY,JSON.stringify(prefs))}catch(e){}};

/* ---------- views ---------- */
const VIEWS=['engine','stream','web','recall','ledger'];let current='engine';
function show(v){
  if(!VIEWS.includes(v))v='engine';current=v;
  VIEWS.forEach(id=>{$('#'+id).hidden=id!==v});
  document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-current',b.dataset.view===v?'page':'false'));
  $('#lines').classList.toggle('off',v!=='engine');
  if(v==='engine')requestAnimationFrame(()=>{layout();go(active,false)});
  if(v==='stream'&&!feed.children.length)resetFeed();
  if(v==='web'){ensureWeb();Web.show()}else if(webReady)Web.hide();
  if(v==='recall'&&!session)startSession();
  if(v==='ledger')renderLedger();
  try{history.replaceState(null,'','#'+v)}catch(e){}
}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));

/* ---------- the engine ---------- */
const track=$('#track'),digits=$('#digits'),panel=$('#panel'),chips=$('#chips');
let lens=prefs.lens==='thinkers'?'thinkers':'ideas',items=[],stations=[],centers=[],active=0;
function buildItems(){
  items = lens==='ideas'
    ? IORDER.map((i,k)=>({key:'i:'+i.id,kind:'idea',ref:i,color:CLC[i.cluster],group:i.cluster,num:k+1}))
    : PLIST.map(p=>({key:'p:'+p.id,kind:'person',ref:p,color:EG(p).color,group:EG(p).id}));
  const at={};items.forEach((it,k)=>at[it.key]=k);
  items.forEach(it=>{
    it.links = it.kind==='idea' ? it.ref.related.map(r=>[at['i:'+r],'see']).filter(x=>x[0]!==undefined)
      : [...topN(it.ref.rivals,4).map(([n])=>[at['p:'+n],'rival']),...topN(it.ref.allies,3).map(([n])=>[at['p:'+n],'ally'])].filter(x=>x[0]!==undefined);
  });
  ENG.lens=lens;ENG.broken={};ENG.dirty=true;
}
const ENG={track,get centers(){return centers},lens:'ideas',broken:{},dirty:false,
  color:i=>items[i]?items[i].color:'#71b4ff',links:i=>items[i]?items[i].links:[],
  drawItem:(i,x,C,p,e,T,m)=>{const it=items[i];if(it.kind==='idea'){const f=EM[it.ref.id]||EM[it.ref.id.split('-')[0]];f(x,C,p,e,T,m)}else drawBust(x,it.ref.id,it.ref,e,T,m,C)},
  visible:()=>current==='engine'};
for(let i=0;i<4;i++){const d=document.createElement('span');d.className='dg';d.innerHTML='<span class="strip">'+[...'0123456789'].map(n=>`<span>${n}</span>`).join('')+'</span>';digits.appendChild(d)}
function setDigits(str,len){[...digits.children].forEach((d,i)=>{d.classList.toggle('off',i<4-len);d.firstChild.style.transform=`translateY(${-Number(str[i])}em)`})}
function setOdo(it){
  if(it.kind==='idea'){const n=pad3(it.num);setDigits('0'+n,3);digits.setAttribute('aria-label','Idea number '+it.num);
    $('#odoKick').innerHTML=`Now turning · <i>${esc(CLN[it.group])}</i>`;$('#odoAbout').textContent='No.';$('#odoAbout').style.visibility='visible';$('#odoEra').textContent=CLS[it.group];$('#odoSub').innerHTML=esc(it.ref.gist)}
  else{const p=it.ref,y=p.sortYear??0,s=String(Math.abs(y));setDigits(s.padStart(4,'0'),s.length);digits.setAttribute('aria-label','Born '+yr(y));
    $('#odoKick').innerHTML=`Now listening · <i>${esc(p.era)}</i>`;const approx=/c\.|fl\.|century|–\s*present|BC\s*–/.test(p.dates)||/century/.test(p.dates);$('#odoAbout').textContent=approx?'about':'born';$('#odoAbout').style.visibility='visible';$('#odoEra').textContent=y<0?'BC':'AD';$('#odoSub').innerHTML=`${esc(p.name)} <small>· ${esc(p.dates)}</small>`}
}
function buildChips(){
  chips.innerHTML='';
  const groups=lens==='ideas'?CLUSTERS.map(c=>({id:c.id,short:CLS[c.id],color:CLC[c.id],n:c.count})):ERA_GROUPS.map(g=>({id:g.id,short:g.short,color:g.color,n:items.filter(i=>i.group===g.id).length}));
  groups.forEach(g=>{if(!g.n)return;const b=document.createElement('button');b.className='chip press';b.style.setProperty('--cc',g.color);b.dataset.g=g.id;b.innerHTML=`<span class="d"></span>${esc(g.short)}<small>${g.n}</small>`;b.addEventListener('click',()=>go(items.findIndex(i=>i.group===g.id)));chips.appendChild(b)});
  const w=document.createElement('button');w.className='chip warp press';w.innerHTML=`${ico('bolt',16)}Spin the engine`;
  w.addEventListener('click',()=>{let i;do{i=Math.floor(Math.random()*items.length)}while(i===active&&items.length>1);go(i)});chips.appendChild(w);
}
function buildTrack(){
  track.innerHTML='';stations=[];centers=[];const frag=document.createDocumentFragment();
  const sp=()=>{const e=document.createElement('div');e.className='spacer';return e};frag.appendChild(sp());
  items.forEach((it,i)=>{
    const b=document.createElement('button');b.className='st';b.style.setProperty('--c',it.color);
    const top=it.kind==='idea'?pad3(it.num):yr(it.ref.sortYear??0);
    b.setAttribute('aria-label',it.kind==='idea'?`${it.ref.name}, ${CLN[it.group]}`:`${it.ref.name}, ${it.ref.dates}`);
    b.innerHTML=`<span class="yr">${top}</span><span class="dot"></span><span class="nm">${esc(it.ref.name)}</span>`;
    b.addEventListener('click',()=>{if(!suppress)go(i)});frag.appendChild(b);stations.push(b);
    if(i<items.length-1){const n=items[i+1],g=document.createElement('div');g.className='gap';g.style.setProperty('--a',it.color);g.style.setProperty('--b',n.color);
      if(it.kind==='idea'){if(n.group!==it.group){g.classList.add('book');g.innerHTML=`<span>${esc(CLS[n.group])} →</span>`}}
      else{const d=(n.ref.sortYear??0)-(it.ref.sortYear??0);g.innerHTML=`<span>${d<=0?'same time':'+'+d.toLocaleString('en-US')+' yrs'}</span>`}
      frag.appendChild(g)}
  });
  frag.appendChild(sp());track.appendChild(frag);markStations();
}
function markStations(){if(lens!=='ideas')return;stations.forEach((s,i)=>{const st=stage(items[i].ref.id);s.classList.toggle('seen',st!=='new')})}
function layout(){centers=stations.map(st=>st.offsetLeft+st.offsetWidth/2)}
function go(i,smooth=true){i=Math.max(0,Math.min(items.length-1,i));if(!centers.length||!track.clientWidth||!centers[centers.length-1]){setActive(i);return}
  track.scrollTo({left:centers[i]-track.clientWidth/2,behavior:smooth?'smooth':'auto'});setActive(i)}
let ticking=false;
track.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;if(!centers.length)layout();const mid=track.scrollLeft+track.clientWidth/2;let best=0,bd=Infinity;for(let i=0;i<centers.length;i++){const d=Math.abs(centers[i]-mid);if(d<bd){bd=d;best=i}}if(best!==active)setActive(best)})},{passive:true});
track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(active+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(active-1)}});
let drag=null,suppress=false;
track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;drag={x:e.clientX,s:track.scrollLeft,m:false}});
window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(!drag.m&&Math.abs(dx)>4){drag.m=true;track.classList.add('dragging')}if(drag.m)track.scrollLeft=drag.s-dx});
window.addEventListener('pointerup',()=>{if(!drag)return;const m=drag.m;drag=null;track.classList.remove('dragging');if(m){suppress=true;setTimeout(()=>suppress=false,60);go(active)}});
window.addEventListener('resize',()=>layout());

function buildScale(){
  const box=$('#scaleBox');
  if(lens==='ideas'){
    const bar=CLUSTERS.map(c=>`<i style="background:${CLC[c.id]};flex-grow:${c.count}" title="${esc(c.name)}"></i>`).join('');
    box.innerHTML=`<div class="scale-head"><b>Where it connects</b><span id="scaleNote"></span></div><div class="scale" id="scaleBar">${bar}<span class="pin" id="pin"></span></div><div class="scale-ends"><span style="left:0">${CLS.being}</span><span style="left:100%">${CLS.polis}</span></div>`;
  }else{
    const bar=ERA_GROUPS.map(g=>`<i style="background:${g.color};flex-grow:${items.filter(i=>i.group===g.id).length}" title="${esc(g.name)}"></i>`).join('');
    box.innerHTML=`<div class="scale-head"><b>Who they argue with</b><span id="scaleNote"></span></div><div class="scale" id="scaleBar">${bar}<span class="pin" id="pin"></span></div><div class="scale-ends"><span style="left:0">${yr(PLIST[0].sortYear)}</span><span style="left:100%">${yr(PLIST[PLIST.length-1].sortYear)}</span></div>`;
  }
}
function setScale(i){
  const pos=k=>(k+.5)/items.length*100,it=items[i];
  $('#pin').style.left=pos(i)+'%';
  const bar=$('#scaleBar');bar.querySelectorAll('.tick').forEach(t=>t.remove());
  it.links.forEach(([j,kind])=>{const t=document.createElement('b');t.className='tick';t.style.left=pos(j)+'%';t.style.background=kind==='rival'?'var(--v2)':kind==='ally'?'var(--being)':'var(--gold)';bar.appendChild(t)});
  $('#scaleNote').textContent= it.kind==='idea' ? `${it.ref.related.length} cross-references · ${it.ref.positions.length} voices · ${it.ref.disputes.length} disputes`
    : `${it.ref.rivals.size} rivals · ${it.ref.allies.size} allies · ${it.ref.appearances.length} ideas`;
}
function setActive(i){
  if(!items.length)return;active=i;prefs.at[lens]=i;savePrefs();
  const it=items[i],rel=new Set(it.links.map(l=>l[0]));
  stations.forEach((s,k)=>{s.classList.toggle('on',k===i);s.classList.toggle('rel',rel.has(k))});
  $('#engine').style.setProperty('--c',it.color);
  chips.querySelectorAll('.chip[data-g]').forEach(c=>c.classList.toggle('on',c.dataset.g===it.group));
  setOdo(it);setScale(i);renderPanel(it);
  if(typeof markSide==='function'){if(slMode!==lens)setSideMode(lens);else markSide(true)}
}
const stageTag=id=>{const s=stage(id);return`<span class="tag k stage" style="--sc:${STAGE[s].color}"><i></i>${STAGE[s].label}</span>`};
function sidesHTML(d){return`<div class="sides">${d.sides.map((s,k)=>`<button class="side press pick-${'ab'[k%2]}" data-side="${k}"><b>${k?'Another view':'One view'}</b>${esc(s.view)}<span class="who">${esc(s.who)}</span></button>`).join('')}</div><p class="your" aria-live="polite">Tap the view you find stronger. Then see who holds it.</p>`}
const ilink=id=>{const i=IBY[id];return`<button class="lk press" style="--cc:${CLC[i.cluster]}" data-idea="${i.id}">${esc(i.name)}</button>`};
const plink=(n,cls='p',extra='')=>`<button class="lk ${cls} press" data-person="${esc(n)}">${esc(n)}${extra}</button>`;
function renderPanel(it){
  panel.classList.remove('swap');
  const nav=`<button class="btn round press" data-a="prev" aria-label="Previous">${ico('prev')}</button><button class="btn round press" data-a="next" aria-label="Next">${ico('next')}</button>`;
  if(it.kind==='idea'){const I=it.ref,d=I.disputes[0];
    panel.innerHTML=`<div class="meta"><span class="tag">${esc(CLN[I.cluster])}</span>${stageTag(I.id)}<span class="tag k">No. ${pad3(it.num)}</span></div>
      <h2>${esc(I.name)}</h2><p class="story">${esc(I.framing)}</p>
      <div class="whoa"><b>The hook.</b>${esc(I.hook)}</div>
      ${d?`<div class="think"><span class="think-k">${ico('think',14)}Pick a side</span><p class="think-q">${esc(d.q)}</p>${sidesHTML(d)}</div>`:''}
      <div class="deep"><h3 class="deep-h">Wired to</h3><div class="links">${I.related.map(ilink).join('')}</div></div>
      <div class="acts">${nav}<button class="btn go press" data-a="open">${ico('page')}Open the page</button><button class="btn press" data-a="web">${ico('web')}Its web</button></div>`;
  }else{const p=it.ref,q=p.quotes[0];
    panel.innerHTML=`<div class="meta"><span class="tag">${esc(p.era)}</span><span class="tag k">${esc(p.dates)}</span><span class="tag k">${p.appearances.length} ideas</span></div>
      <h2>${esc(p.name)}</h2><p class="story">${esc(p.note)}</p>
      ${p.works?`<div class="whoa"><b>Read.</b>${esc(p.works)}</div>`:''}
      ${q?`<figure class="quote"><blockquote>${esc(q.text)}</blockquote><figcaption>${esc(q.work)} · ${esc(q.when)}</figcaption></figure>`:''}
      ${p.rivals.size||p.allies.size?`<div class="deep"><h3 class="deep-h">Argues with</h3><div class="links">${topN(p.rivals,5).map(([n,c])=>plink(n,'p rv',` <small>×${c}</small>`)).join('')}${topN(p.allies,3).map(([n])=>plink(n,'p al')).join('')}</div></div>`:''}
      <div class="acts">${nav}<button class="btn go press" data-a="open">${ico('page')}Open the file</button><button class="btn press" data-a="web">${ico('web')}Their web</button></div>`;
  }
  void panel.offsetWidth;panel.classList.add('swap');
}
panel.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const it=items[active];
  if(b.dataset.side!==undefined)return pickSide(b);
  if(b.dataset.idea)return openIdea(b.dataset.idea);
  if(b.dataset.person)return openPerson(b.dataset.person);
  const a=b.dataset.a;
  if(a==='prev')go(active-1);if(a==='next')go(active+1);
  if(a==='open')it.kind==='idea'?openIdea(it.ref.id):openPerson(it.ref.id);
  if(a==='web')toWeb(it.key,'net');
});
function pickSide(b){const box=b.closest('.sides');if(!box)return;box.querySelectorAll('.side').forEach(x=>x.classList.toggle('chosen',x===b));box.classList.add('told');const n=box.nextElementSibling;if(n)n.textContent='Good. Now the hard part: what is the strongest point the other side could make?'}
function setLens(l,toIdx){
  if(l!==lens){prefs.at[lens]=active;lens=l;prefs.lens=l;savePrefs();buildItems();buildChips();buildTrack();buildScale();
    document.querySelectorAll('#lines button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lens===l));
    $('#carLabel').textContent=l==='ideas'?'Now thinking':'Now listening';
    track.setAttribute('aria-label',l==='ideas'?'Swipe through the ideas. Arrow keys work too.':'Swipe through the thinkers, oldest first. Arrow keys work too.');
    active=-1;const i=toIdx??prefs.at[l]??0;setActive(Math.min(i,items.length-1));requestAnimationFrame(()=>{layout();go(active,false)});
    if(toIdx===undefined)toast(l==='ideas'?'The engine runs on 102 ideas':'The engine runs on 93 thinkers, oldest first');
  }else if(toIdx!==undefined)go(toIdx);
}
$('#lines').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setLens(b.dataset.lens)});
function toEngine(key){show('engine');const l=key.startsWith('i:')?'ideas':'thinkers';const findIdx=()=>items.findIndex(i=>i.key===key);if(l!==lens){setLens(l,0);setTimeout(()=>go(findIdx(),false),30)}else setTimeout(()=>go(findIdx()),30)}

/* ---------- sheets: idea pages, person files, find ---------- */
const sheet=$('#sheet'),sheetIn=$('#sheetIn');let sheetFrom=null,stack=[],sheetKey=null;
function openSheet(html,c,key,push=true){
  if(push&&sheetKey&&!sheet.hidden&&sheetKey!==key)stack.push(sheetKey);if(sheet.hidden){stack=[];sheetFrom=document.activeElement}
  sheetKey=key;Living.clear(sheetIn);
  sheetIn.style.setProperty('--c',c);
  const back=stack.length?`<button class="backline press" data-back>${ico('back',14)}Back to ${esc(keyName(stack[stack.length-1]))}</button>`:'';
  sheetIn.innerHTML=`<button class="sheet-x press" data-x aria-label="Close">${ico('x')}</button>${back}${html}`;
  sheet.hidden=false;requestAnimationFrame(()=>sheet.classList.add('open'));sheetIn.scrollTop=0;sheetIn.focus({preventScroll:true});
  sheetIn.querySelectorAll('canvas.emb').forEach(attachEmblem);
}
const keyName=k=>k==='find'?'Find':k.startsWith('i:')?IBY[k.slice(2)].name:k.slice(2);
function reopen(k,push=false){if(k==='find')openFind(false);else if(k.startsWith('i:'))openIdea(k.slice(2),push);else openPerson(k.slice(2),push)}
function closeSheet(){if(sheet.hidden)return;sheet.classList.remove('open');setTimeout(()=>{sheet.hidden=true;Living.clear(sheetIn)},250);stack=[];sheetKey=null;if(sheetFrom)sheetFrom.focus({preventScroll:true});if(current==='engine')renderPanel(items[active]);if(current==='ledger')renderLedger()}
sheet.addEventListener('click',e=>{
  if(e.target===sheet||e.target.closest('[data-x]'))return closeSheet();
  if(e.target.closest('[data-back]')){const k=stack.pop();return reopen(k,false)}
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.side!==undefined)return pickSide(b);
  if(b.dataset.idea)return openIdea(b.dataset.idea);
  if(b.dataset.person)return openPerson(b.dataset.person);
  const a=b.dataset.a,k=sheetKey;
  if(a==='engine'){closeSheet();toEngine(k)}
  if(a==='web'){closeSheet();toWeb(k,'net')}
  if(a==='mind'){closeSheet();toWeb(k,'mind')}
  if(a==='recallone'){closeSheet();show('recall');startSession([k.slice(2)])}
  if(a==='pi'||a==='ni'){const L=IORDER,i=L.findIndex(x=>x.id===k.slice(2));openIdea(L[(i+(a==='pi'?-1:1)+L.length)%L.length].id,false)}
  if(a==='pp'||a==='np'){const i=PLIST.findIndex(x=>x.id===k.slice(2));openPerson(PLIST[(i+(a==='pp'?-1:1)+PLIST.length)%PLIST.length].id,false)}
  if(b.dataset.fm)findState.m=b.dataset.fm,findState.f='all',renderFindList(true);
  if(b.dataset.ff)findState.f=b.dataset.ff,renderFindList(true);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
function attachEmblem(c){
  const k=c.dataset.k;const it=k.startsWith('i:')?{kind:'idea',id:k.slice(2)}:{kind:'person',id:k.slice(2)};
  let color;if(it.kind==='idea')color=CLC[IBY[it.id].cluster];else{const p=PEOPLE[it.id];color=EG(p).color}
  c.dataset.live='1';if(c.dataset.e===undefined)c.dataset.e='1';
  Living.add(c,(x,e,T,m)=>{const C={c:color,base:mix(color,NIGHT,.35),shade:mix(mix(color,NIGHT,.35),NIGHT,.38),lit:mix(color,TEXT,.3)};
    glow(x,GY-40,70,color,.12);
    if(it.kind==='idea'){const f=EM[it.id]||EM[it.id.split('-')[0]];f(x,C,1,e,T,m)}else drawBust(x,it.id,PEOPLE[it.id],e,T,m,C)});
}
function playEmblem(c,dur=900){if(!c)return;const t0=performance.now();c.dataset.e='0';const step=t=>{const k=Math.min(1,(t-t0)/dur);c.dataset.e=String(k);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
function openIdea(id,push=true){
  const I=IBY[id];if(!I)return;const c=CLC[I.cluster];
  const html=`<div class="meta"><span class="tag">${esc(CLN[I.cluster])}</span>${stageTag(id)}<span class="tag k">No. ${pad3(INUM[id])}</span></div>
    <canvas class="emb" data-k="i:${id}" data-e="0" aria-hidden="true"></canvas>
    <h2>${esc(I.name)}</h2><p class="story" style="color:var(--soft);font-style:italic">${esc(I.gist)}</p><p class="story">${esc(I.framing)}</p>
    <div class="whoa"><b>The hook.</b>${esc(I.hook)}</div>
    <section class="deep">
      <h3 class="deep-h">The senses of the term</h3><ol class="list">${I.senses.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
      <h3 class="deep-h">Where it is disputed</h3>${I.disputes.map(d=>`<div class="think"><p class="think-q">${esc(d.q)}</p>${sidesHTML(d)}</div>`).join('')}
      <h3 class="deep-h">In the Great Conversation</h3><div class="voices">${I.positions.map(p=>{const P2=PEOPLE[pid(p.name)];return`<button class="voice press" data-person="${esc(pid(p.name))}"><b>${esc(p.name)}${P2?`<small>${esc(P2.dates)}</small>`:''}</b><span>${esc(p.claim)}</span></button>`}).join('')}</div>
      <h3 class="deep-h">An outline of topics</h3><ol class="list">${I.topics.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>
      <div class="whoa"><b>For instance.</b>${esc(I.example)}</div>
      ${(I.quotes||[]).length?`<h3 class="deep-h">In context</h3>${I.quotes.map(q=>`<figure class="quote"><blockquote>${esc(q.text)}</blockquote><figcaption>${esc(q.who)}, ${esc(q.work)} · ${esc(q.when)}</figcaption><p>${esc(q.context)}</p></figure>`).join('')}`:''}
      <h3 class="deep-h">Read</h3><div class="reading">${I.key_texts.map(t=>`<div><span>${esc(t.text)}</span><b>${esc(t.when||'')}</b></div>`).join('')}</div>
      <h3 class="deep-h">Wired to</h3><div class="links">${I.related.map(ilink).join('')}</div>
      <div class="note"><div class="note-h"><h3 class="deep-h">In your own words</h3><em id="noteState">the Feynman test: explain it plainly</em></div><textarea id="noteBox" placeholder="Explain “${esc(I.name)}” as if to a curious beginner. Where you stall is where to study.">${esc(prog.notes[id]||'')}</textarea></div>
    </section>
    <div class="acts"><button class="btn round press" data-a="pi" aria-label="Previous idea">${ico('prev')}</button><button class="btn round press" data-a="ni" aria-label="Next idea">${ico('next')}</button><button class="btn go press" data-a="mind">${ico('mind')}Mind map</button><button class="btn press" data-a="web">${ico('web')}Its web</button><button class="btn press" data-a="engine">${ico('gear')}Engine</button><button class="btn press" data-a="recallone">${ico('card')}Recall it</button></div>`;
  openSheet(html,c,'i:'+id,push);playEmblem(sheetIn.querySelector('canvas.emb'));
  const nb=$('#noteBox');let nt;nb.addEventListener('input',()=>{$('#noteState').textContent='…';clearTimeout(nt);nt=setTimeout(()=>{saveNote(id,nb.value);const s=$('#noteState');if(s){s.textContent='Saved';s.className='saved'}},500)});
}
function openPerson(name,push=true){
  const p=PEOPLE[pid(name)];if(!p)return;const g=EG(p);
  const html=`<div class="meta"><span class="tag">${esc(p.era)}</span><span class="tag k">${esc(p.dates)}</span></div>
    <canvas class="emb" data-k="p:${esc(p.id)}" data-e="0" aria-hidden="true"></canvas>
    <h2>${esc(p.name)}</h2><p class="story" style="color:var(--soft);font-style:italic">${esc(p.role)}</p><p class="story">${esc(p.note)}</p>
    ${p.works?`<div class="whoa"><b>Principal works.</b>${esc(p.works)}</div>`:''}
    <section class="deep">
      ${p.quotes.length?`<h3 class="deep-h">In their own words</h3>${p.quotes.map(q=>`<figure class="quote"><blockquote>${esc(q.text)}</blockquote><figcaption>${esc(q.work)} · ${esc(q.when)}</figcaption><p>${esc(q.context)}</p></figure>`).join('')}`:''}
      ${p.rivals.size?`<h3 class="deep-h">Opposed on a dispute</h3><div class="links">${topN(p.rivals,12).map(([n,c])=>plink(n,'p rv',c>1?` <small>×${c}</small>`:'')).join('')}</div>`:''}
      ${p.allies.size?`<h3 class="deep-h">On the same side</h3><div class="links">${topN(p.allies,12).map(([n,c])=>plink(n,'p al',c>1?` <small>×${c}</small>`:'')).join('')}</div>`:''}
      <h3 class="deep-h">Positions taken · ${p.appearances.length}</h3><div class="voices">${p.appearances.slice().sort((a,b)=>IBY[a.id].name.localeCompare(IBY[b.id].name)).map(a=>`<button class="voice press" data-idea="${a.id}" style="box-shadow:inset 3px 0 0 ${CLC[IBY[a.id].cluster]},0 0 0 1px var(--rim) inset"><b>${esc(IBY[a.id].name)}<small>${esc(CLS[IBY[a.id].cluster])}</small></b><span>${esc(a.claim)}</span></button>`).join('')}</div>
    </section>
    <div class="acts"><button class="btn round press" data-a="pp" aria-label="Previous thinker">${ico('prev')}</button><button class="btn round press" data-a="np" aria-label="Next thinker">${ico('next')}</button><button class="btn go press" data-a="mind">${ico('mind')}Mind map</button><button class="btn press" data-a="web">${ico('web')}Their web</button><button class="btn press" data-a="engine">${ico('gear')}Engine</button></div>`;
  openSheet(html,g.color,'p:'+p.id,push);playEmblem(sheetIn.querySelector('canvas.emb'),1200);
}
/* find: the index and the register, searchable */
const findState={m:'ideas',f:'all',q:''};
function openFind(push=true){
  openSheet(`<div class="find"><h2>Find</h2><label class="search">${ico('search')}<input id="findQ" placeholder="Search ideas, thinkers, disputes…" value="${esc(findState.q)}" autocomplete="off"></label><div id="findBody"></div></div>`,'#71b4ff','find',push);
  const q=$('#findQ');q.addEventListener('input',()=>{findState.q=q.value;renderFindList()});renderFindList(true);setTimeout(()=>q.focus({preventScroll:true}),60);
}
$('#findBtn').addEventListener('click',()=>openFind());
function renderFindList(){
  const body=$('#findBody');if(!body)return;const q=findState.q.trim().toLowerCase();
  const modes=`<div class="fchips"><button class="fchip press" data-fm="ideas" aria-pressed="${findState.m==='ideas'}">Ideas · ${IDEAS.length}</button><button class="fchip press" data-fm="thinkers" aria-pressed="${findState.m==='thinkers'}">Thinkers · ${PLIST.length}</button></div>`;
  let filt='',groups=[];
  if(findState.m==='ideas'){
    const dueN=IDEAS.filter(i=>isDue(i.id)).length;
    const fs=[['all','All'],['due','Due · '+dueN],['new','Unread'],['mastered','Mastered'],...CLUSTERS.map(c=>['c:'+c.id,CLS[c.id]])];
    filt=`<div class="fchips">${fs.map(([k,l])=>`<button class="fchip press" data-ff="${k}" aria-pressed="${findState.f===k}">${esc(l)}</button>`).join('')}</div>`;
    const ok=i=>{if(q&&!(i.name+' '+i.gist+' '+i.framing+' '+i.disputes.map(d=>d.q).join(' ')).toLowerCase().includes(q))return false;const f=findState.f;
      return f==='due'?isDue(i.id):f==='new'?stage(i.id)==='new':f==='mastered'?stage(i.id)==='mature':f.startsWith('c:')?i.cluster===f.slice(2):true};
    groups=CLUSTERS.map(c=>({name:c.name,color:CLC[c.id],rows:IORDER.filter(i=>i.cluster===c.id&&ok(i)).map(i=>`<button class="frow press" data-idea="${i.id}" style="--cc:${CLC[i.cluster]}"><span class="d"></span><span><b>${esc(i.name)}</b><span>${esc(i.gist)}</span></span><small style="color:${STAGE[stage(i.id)].color}">${STAGE[stage(i.id)].label}</small></button>`)}));
  }else{
    const fs=[['all','All'],...ERA_GROUPS.map(g=>['g:'+g.id,g.short])];
    filt=`<div class="fchips">${fs.map(([k,l])=>`<button class="fchip press" data-ff="${k}" aria-pressed="${findState.f===k}">${esc(l)}</button>`).join('')}</div>`;
    const ok=p=>{if(q&&!(p.name+' '+p.role+' '+p.note+' '+p.dates+' '+(p.works||'')).toLowerCase().includes(q))return false;return findState.f.startsWith('g:')?EG(p).id===findState.f.slice(2):true};
    groups=ERA_GROUPS.map(g=>({name:g.name,color:g.color,rows:PLIST.filter(p=>EG(p)===g&&ok(p)).map(p=>`<button class="frow p press" data-person="${esc(p.id)}"><span class="d"></span><span><b>${esc(p.name)}</b><span>${esc(p.role)}</span></span><small>${esc(p.dates)}</small></button>`)}));
  }
  groups=groups.filter(g=>g.rows.length);
  body.innerHTML=modes+filt+(groups.length?groups.map(g=>`<section class="fgroup" style="--cc:${g.color}"><h3>${esc(g.name)}<small>${g.rows.length}</small></h3>${g.rows.join('')}</section>`).join(''):`<p class="your">Nothing matches. Try another word.</p>`);
}
