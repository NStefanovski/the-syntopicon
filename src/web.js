/* ---------- the Web: network graph + mind map ----------
   Network: a force-directed graph (no libraries). Ideas are circles in their domain's
   colour, thinkers are gold diamonds. Edges: SEE ALSO (idea-idea), ARGUES (thinker-idea),
   RIVAL / ALLY (thinkers on opposite / the same side of a dispute). Tap to focus.
   Mind map: a radial map around one idea or thinker, painted as tapering branches that
   grow out when you re-centre. Both share the same pan / pinch / wheel camera. */
const Web=(()=>{
const cv=document.getElementById('webCanvas');
const ctx=cv.getContext('2d');
let cw=0,ch=0,dpr=1,G=null,opts=null;
let mode='net', layers={see:true,argues:true,rivals:false};
const cam={x:0,y:0,k:.8},tgt={x:0,y:0,k:.8};let camAnim=false;
let focus=null,hover=null,alpha=1,needs=true,running=false,visibleNow=false;
let grabbed=null;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let tFocus=0,fitted=false;
const EDGE={see:{len:110,k:.04,col:SOFT,label:'SEE ALSO'},argues:{len:74,k:.03,col:GOLD,label:'ARGUES'},rival:{len:96,k:.02,col:ROSE,label:'RIVAL'},ally:{len:86,k:.02,col:SKY,label:'ALLY'}};

function init(o){opts=o;G={nodes:o.nodes,edges:o.edges,byId:{}};
  G.nodes.forEach((n,i)=>{n.i=i;G.byId[n.id]=n;n.vx=0;n.vy=0;n.deg=0});
  G.edges.forEach(e=>{e.A=G.byId[e.a];e.B=G.byId[e.b];e.A.deg++;e.B.deg++});
  G.nodes.forEach(n=>{n.r=n.r||(n.type==='idea'?7+Math.sqrt(n.deg)*1.5:4+Math.sqrt(n.deg)*1.25)});
  // seed: ideas on a ring by domain, thinkers near the centroid of their ideas
  const doms=[...new Set(G.nodes.filter(n=>n.type==='idea').map(n=>n.group))];
  G.nodes.filter(n=>n.type==='idea').forEach((n,k)=>{const d=doms.indexOf(n.group),a=d/doms.length*TAU+hash(k,3)*.8,r=180+hash(k,4)*140;n.x=cos(a)*r;n.y=sin(a)*r});
  G.nodes.filter(n=>n.type==='person').forEach((n,k)=>{const nb=G.edges.filter(e=>e.type==='argues'&&e.A===n).map(e=>e.B);let x=0,y=0;nb.forEach(b=>{x+=b.x;y+=b.y});const c=nb.length||1;n.x=x/c+(hash(k,5)-.5)*80;n.y=y/c+(hash(k,6)-.5)*80});
  for(let i=0;i<260;i++)tick(1-i/320);alpha=.4;
  const ds=G.nodes.filter(n=>n.type==='idea').map(n=>n.deg).sort((a,b)=>b-a);G.hub=ds[Math.floor(ds.length*.25)]||0;
}
const isVis=n=>n.type==='idea'||layers.argues||layers.rivals;
const edgeVis=e=>(e.type==='see'&&layers.see)||(e.type==='argues'&&layers.argues)||((e.type==='rival'||e.type==='ally')&&layers.rivals);
function tick(a){
  const N=G.nodes.filter(isVis),Ed=G.edges.filter(e=>edgeVis(e)&&isVis(e.A)&&isVis(e.B));
  for(let i=0;i<N.length;i++){const p=N[i];for(let j=i+1;j<N.length;j++){const q=N[j];let dx=q.x-p.x,dy=q.y-p.y,d2=dx*dx+dy*dy+.01;if(d2>250000)continue;const d=Math.sqrt(d2);const f=(p.type==='idea'&&q.type==='idea'?4200:p.type==='person'&&q.type==='person'?900:1600)*a/d2;dx/=d;dy/=d;p.vx-=dx*f;p.vy-=dy*f;q.vx+=dx*f;q.vy+=dy*f;const minD=(p.r||10)+(q.r||10)+4;if(d<minD){const push=(minD-d)*.25;p.vx-=dx*push;p.vy-=dy*push;q.vx+=dx*push;q.vy+=dy*push}}}
  Ed.forEach(e=>{const s=EDGE[e.type],p=e.A,q=e.B;let dx=q.x-p.x,dy=q.y-p.y;const d=Math.hypot(dx,dy)||1;const f=(d-s.len)*s.k*a*(e.w||1)**.3;dx/=d;dy/=d;p.vx+=dx*f;p.vy+=dy*f;q.vx-=dx*f;q.vy-=dy*f});
  N.forEach(n=>{n.vx-=n.x*.0016*a;n.vy-=n.y*.0016*a;if(n===grabbed){n.vx=n.vy=0;return}n.vx*=.82;n.vy*=.82;n.x+=clamp(n.vx,-20,20);n.y+=clamp(n.vy,-20,20)});
}
function reheat(a=.6){alpha=Math.max(alpha,a);needs=true}
function setLayers(l){Object.assign(layers,l);if(!layers.argues)layers.rivals=false;if(focus&&!isVis(focus))setFocus(null);reheat(.7)}

/* ---------- camera ---------- */
const toW=(sx,sy)=>[(sx-cw/2)/cam.k+cam.x,(sy-ch/2)/cam.k+cam.y];
function flyTo(x,y,k){tgt.x=x;tgt.y=y;tgt.k=clamp(k??cam.k,.25,3.2);camAnim=true;needs=true}
function fit(){
  if(!cw||!ch)return;
  const N=mode==='net'?G.nodes.filter(isVis):mm.nodes;if(!N.length)return;
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;N.forEach(n=>{const x=mode==='net'?n.x:n.tx,y=mode==='net'?n.y:n.ty;x0=min(x0,x);y0=min(y0,y);x1=max(x1,x);y1=max(y1,y)});
  const k=min(cw/(x1-x0+140),(ch-150)/(y1-y0+140));flyTo((x0+x1)/2,(y0+y1)/2+20/max(k,.2),clamp(k,.25,1.6));
}

/* ---------- focus (network) ---------- */
let nbr=new Set(),fEdges=[];
function setFocus(n,fly=true){
  focus=n;tFocus=performance.now();nbr=new Set();fEdges=[];
  if(n){G.edges.forEach(e=>{if(!edgeVis(e)||!isVis(e.A)||!isVis(e.B))return;if(e.A===n||e.B===n){fEdges.push(e);nbr.add(e.A===n?e.B:e.A)}});if(fly)flyTo(n.x,n.y+30/max(cam.k,1.1),max(cam.k,1.1))}
  opts.onFocus&&opts.onFocus(n,fEdges);needs=true;
}
function focusId(id){const n=G.byId[id];if(!n)return;if(!isVis(n)){setLayers({argues:true});opts.onLayers&&opts.onLayers(layers)}setFocus(n)}

/* ---------- mind map ---------- */
const mm={root:null,nodes:[],t0:0,stack:[]};
function wrap(t,max){const w=String(t).split(' ');const L=[];let s='';w.forEach(x=>{if((s+' '+x).trim().length>max&&s){L.push(s);s=x}else s=(s+' '+x).trim()});if(s)L.push(s);if(L.length>3){L.length=3;L[2]=L[2].replace(/.{0,2}$/,'…')}return L}
function buildMind(rootId){
  const tree=opts.mindTree(rootId);if(!tree)return;
  const out=[];const R0=0,R1=150,R2=270,R3=360;
  const leaves=n=>n.kids&&n.kids.length?n.kids.reduce((s,k)=>s+leaves(k),0):1;
  const root={...tree,depth:0,tx:0,ty:0,ang:0};out.push(root);
  const total=leaves(root);let a0=-PI/2-PI/total;
  root.kids.forEach((b,bi)=>{
    const span=leaves(b)/total*TAU,am=a0+span/2;
    const bn={...b,depth:1,parent:root,ang:am,tx:cos(am)*R1,ty:sin(am)*R1*.82,color:b.color,branch:bi};out.push(bn);
    let c0=a0;
    (b.kids||[]).forEach((c,ci)=>{
      const cs=leaves(c)/leaves(b)*span,ca=c0+cs/2;const rr=c.kids&&c.kids.length?R2-20:R2+((ci%2)?28:0);
      const cn={...c,depth:2,parent:bn,ang:ca,tx:cos(ca)*rr,ty:sin(ca)*rr*.82,color:c.color||b.color,branch:bi};out.push(cn);
      let d0=c0;(c.kids||[]).forEach((d,di)=>{const ds=cs/(c.kids.length),da=d0+ds/2;out.push({...d,depth:3,parent:cn,ang:da,tx:cos(da)*(R3+(di%2)*26),ty:sin(da)*(R3+(di%2)*26)*.82,color:d.color||cn.color,branch:bi});d0+=ds});
      c0+=cs});
    a0+=span;
  });
  out.forEach(n=>{n.lines=wrap(n.label,n.depth===0?14:n.depth===1?16:20);n.x=n.parent?n.parent.tx*.2:0;n.y=n.parent?n.parent.ty*.2:0});
  mm.root=root;mm.nodes=out;mm.t0=performance.now();needs=true;
}
function mindmap(id,push=true){if(push&&mm.root&&mm.root.ref!==id)mm.stack.push(mm.root.ref);buildMind(id);flyTo(0,10,clamp(min(cw,ch-140)/560,.45,1.2));opts.onMind&&opts.onMind(mm.root,mm.stack.length)}
function mindBack(){const id=mm.stack.pop();if(id)mindmap(id,false)}

/* ---------- drawing ---------- */
function labelFont(px,w=700){return `${w} ${px}px "Atkinson Hyperlegible",Verdana,sans-serif`}
function drawNet(T,now){
  const N=G.nodes.filter(isVis),Ed=G.edges.filter(e=>edgeVis(e)&&isVis(e.A)&&isVis(e.B));
  const dimOthers=!!focus;
  // edges
  Ed.forEach((e,k)=>{
    const on=focus&&(e.A===focus||e.B===focus);
    if(dimOthers&&!on){cx.globalAlpha=.05}else cx.globalAlpha=on?.85:(e.type==='see'?.28:e.type==='argues'?.14:.4);
    const s=EDGE[e.type];const a=e.A,b=e.B;const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;const dx=b.x-a.x,dy=b.y-a.y;const bend=(hash(k,2)-.5)*.25;
    const c=[mx-dy*bend+jit(.6/cam.k),my+dx*bend+jit(.6/cam.k)];
    cx.strokeStyle=s.col;cx.lineWidth=(on?2:1)/Math.sqrt(cam.k)*(e.type==='rival'||e.type==='ally'?1+min(2,(e.w||1)*.25):1);
    cx.beginPath();cx.moveTo(a.x,a.y);cx.quadraticCurveTo(c[0],c[1],b.x,b.y);cx.stroke();
    if(on){
      // relationship label + flowing ink pulses, neo4j-style
      const t0=.5,pt=bez([a.x,a.y],c,[b.x,b.y],t0);
      if(!reduce)for(let q=0;q<2;q++){const t=frac((now-tFocus)/1400+q*.5+k*.07);const pp=bez([a.x,a.y],c,[b.x,b.y],e.A===focus?t:1-t);cx.globalAlpha=1;dot(pp[0],pp[1],2.2/Math.sqrt(cam.k),s.col);glow(pp[0],pp[1],7/Math.sqrt(cam.k),s.col,.5)}
      if(cam.k>.7&&(fEdges.length<=12||cam.k>1.5)){cx.globalAlpha=.95;const fs=8.5/cam.k*1.1;cx.font=`500 ${fs}px "DM Mono",monospace`;const tw=cx.measureText(s.label).width;cx.fillStyle=rgba(NIGHT,.85);cx.fillRect(pt[0]-tw/2-3/cam.k,pt[1]-fs*.75,tw+6/cam.k,fs*1.4);cx.fillStyle=s.col;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(s.label,pt[0],pt[1])}
    }
  });
  cx.globalAlpha=1;
  // nodes
  const order=N.slice().sort((a,b)=>(a===focus)-(b===focus)||nbr.has(a)-nbr.has(b));
  order.forEach(n=>{
    const on=!focus||n===focus||nbr.has(n);cx.globalAlpha=on?1:.18;
    boilSeed('n'+n.i);
    const r=n.r;
    if(n===focus){glow(n.x,n.y,r*3.2,n.color,.45);const age=(now-tFocus)/1000;if(!reduce)for(let q=0;q<2;q++){const t=frac(age*.6+q*.5);cx.save();cx.globalAlpha=(1-t)*.6;cx.strokeStyle=n.color;cx.lineWidth=1.6/cam.k;cx.beginPath();cx.arc(n.x,n.y,r+t*r*2.4,0,TAU);cx.stroke();cx.restore()}}
    else if(n===hover)glow(n.x,n.y,r*2.4,n.color,.3);
    const jw=.9/cam.k;
    if(n.type==='idea'){paint(ell(n.x,n.y,r,r,14),{wash:mix(n.color,NIGHT,n===focus?.1:.35),ink:mix(n.color,TEXT,.25),sw:1.6/Math.sqrt(cam.k),j:jw});E(n.x-r*.3,n.y-r*.35,r*.3,r*.2,rgba(TEXT,.25),{ink:null,j:jw*.5})}
    else{paint([[n.x,n.y-r*1.15],[n.x+r,n.y],[n.x,n.y+r*1.15],[n.x-r,n.y]],{wash:mix(GOLD,NIGHT,n===focus?.05:.45),ink:mix(GOLD,TEXT,.3),sw:1.4/Math.sqrt(cam.k),j:jw})}
    const showL=n===focus||nbr.has(n)||n===hover||(n.type==='idea'?(cam.k>.8||(cam.k>.32&&n.deg>=G.hub)):cam.k>1.05);
    if(showL&&on){const fs=(n.type==='idea'?11:9.5)/Math.min(1.6,max(cam.k,.55))*(n===focus?1.25:1);cx.font=labelFont(fs,n.type==='idea'?700:400);cx.textAlign='center';cx.textBaseline='top';
      cx.lineWidth=3/cam.k;cx.strokeStyle=rgba(NIGHT,.9);cx.strokeText(n.label,n.x,n.y+r+3/cam.k);cx.fillStyle=n.type==='idea'?TEXT:pale(GOLD,.4);cx.fillText(n.label,n.x,n.y+r+3/cam.k)}
  });
  cx.globalAlpha=1;
}
function pillPath(x,y,w,h){const r=h/2;return [...ell(x-w/2+r,y,r,r,8,PI/2,PI*1.5),...ell(x+w/2-r,y,r,r,8,-PI/2,PI/2)]}
function drawMind(T,now){
  const age=(now-mm.t0)/1000;const g=reduce?1:clamp(age/1.1);
  // ease nodes toward their targets
  mm.nodes.forEach(n=>{const k=reduce?1:clamp(age*2.2-n.depth*.35);n.x=lerp(n.parent?n.parent.x:0,n.tx,easeOut(k));n.y=lerp(n.parent?n.parent.y:0,n.ty,easeOut(k));n.k=k});
  // branches: tapered painted ribbons that grow out from the centre
  mm.nodes.forEach((n,i)=>{if(!n.parent||n.k<=0)return;const p=n.parent;boilSeed('mb'+i);
    const dx=n.x-p.x,dy=n.y-p.y,mx=(p.x+n.x)/2,my=(p.y+n.y)/2,bend=n.depth===1?.18:.12;const c=[mx-dy*bend,my+dx*bend];
    const pts=bezPts([p.x,p.y],c,[n.x,n.y],14,1);const w0=n.depth===1?11:n.depth===2?5:3,w1=n.depth===1?4.5:n.depth===2?2.4:1.4;
    ribbon(pts,w0,w1,mix(n.color,NIGHT,n.depth===1?.25:.4),{ink:rgba(INK,.6),sw:1,j:.7});
  });
  // nodes
  mm.nodes.forEach((n,i)=>{if(n.k<=.05)return;boilSeed('mn'+i);cx.globalAlpha=clamp(n.k*1.6);
    if(n.depth===0){const r=46;glow(0,0,r*2.4,n.color,.35);paint(ell(n.x,n.y,r,r*.92,20),{wash:mix(n.color,NIGHT,.2),ink:mix(n.color,TEXT,.4),sw:2.2,j:1});
      if(!reduce){const t=frac(age*.35);cx.save();cx.globalAlpha=(1-t)*.5;cx.strokeStyle=n.color;cx.lineWidth=1.6;cx.beginPath();cx.arc(n.x,n.y,r+t*40,0,TAU);cx.stroke();cx.restore()}
      cx.font='800 17px "Bricolage Grotesque","Arial Black",sans-serif';cx.fillStyle=TEXT;cx.textAlign='center';cx.textBaseline='middle';n.lines.forEach((l,k)=>cx.fillText(l,n.x,n.y+(k-(n.lines.length-1)/2)*18));
      cx.font='500 9px "DM Mono",monospace';cx.fillStyle=rgba(TEXT,.7);cx.fillText(n.kicker||'',n.x,n.y+n.lines.length*9+12);return}
    if(n.depth===1){cx.font='500 11px "DM Mono",monospace';const tw=cx.measureText(n.label.toUpperCase()).width+18;paint(pillPath(n.x,n.y,tw,20),{wash:mix(n.color,NIGHT,.15),ink:mix(n.color,TEXT,.4),sw:1.4,j:.6});cx.fillStyle=NIGHT;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(n.label.toUpperCase(),n.x,n.y+.5);return}
    const go=!!n.ref;const fs=n.depth===2&&n.kids&&n.kids.length?11:10.5;cx.font=labelFont(fs,go||n.kids?700:400);
    const right=cos(n.ang)>=-.15;cx.textAlign=abs(cos(n.ang))<.25?'center':right?'left':'right';cx.textBaseline='middle';
    const lx=n.x+(abs(cos(n.ang))<.25?0:right?8:-8),ly=n.y+(abs(cos(n.ang))<.25?(sin(n.ang)>0?12:-12)-(sin(n.ang)>0?0:(n.lines.length-1)*12):0)-(abs(cos(n.ang))<.25?0:(n.lines.length-1)*6);
    if(go){let w2=0;n.lines.forEach(l=>w2=max(w2,cx.measureText(l).width));const bx=cx.textAlign==='left'?lx-4:cx.textAlign==='right'?lx-w2-4:lx-w2/2-4;cx.fillStyle=rgba(mix(n.color,NIGHT,.55),.9);cx.beginPath();if(cx.roundRect)cx.roundRect(bx,ly-8,w2+8,n.lines.length*12+4,6);else cx.rect(bx,ly-8,w2+8,n.lines.length*12+4);cx.fill();cx.strokeStyle=rgba(n.color,.9);cx.lineWidth=1.2;cx.stroke()}
    dot(n.x,n.y,go?3.4:2.4,n.color);
    cx.fillStyle=go?TEXT:mix(TEXT,n.color,.25);n.lines.forEach((l,k)=>cx.fillText(l,lx,ly+k*12));
    n.hit={x0:Math.min(lx,n.x)-12,x1:Math.max(lx,n.x)+12,y0:ly-10,y1:ly+n.lines.length*12};
  });
  cx.globalAlpha=1;
}
function frame(now){
  requestAnimationFrame(frame);
  if(!visibleNow||!G)return;
  if(cv.clientWidth!==cw||cv.clientHeight!==ch){dpr=Math.min(1.5,devicePixelRatio||1);cw=cv.clientWidth;ch=cv.clientHeight;cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr);needs=true;if(!fitted&&cw>0&&ch>0){fitted=true;if(mode==='net'&&!focus){fit();cam.x=tgt.x;cam.y=tgt.y;cam.k=tgt.k;camAnim=false}}}
  const bf=reduce?0:Math.floor(now/1000*BOIL);
  const animMind=mode==='mind'&&(now-mm.t0)<2600;
  const live=alpha>.02||camAnim||(focus&&!reduce)||animMind||grabbed;
  if(!needs&&!live&&bf===boilF)return;
  boilF=bf;needs=false;
  if(mode==='net'&&alpha>.02){tick(alpha);alpha*=.985}
  if(camAnim){cam.x=lerp(cam.x,tgt.x,.14);cam.y=lerp(cam.y,tgt.y,.14);cam.k=lerp(cam.k,tgt.k,.14);if(abs(cam.x-tgt.x)<.3&&abs(cam.y-tgt.y)<.3&&abs(cam.k-tgt.k)<.002)camAnim=false}
  bindCanvas(ctx,cw,ch,ch);
  cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,cw,ch);
  // backdrop: faint dot grid that pans with the camera
  const gs=40*cam.k;if(gs>10){cx.fillStyle=rgba(TEXT,.05);const ox=(-cam.x*cam.k+cw/2)%gs,oy=(-cam.y*cam.k+ch/2)%gs;for(let x=ox;x<cw;x+=gs)for(let y=oy;y<ch;y+=gs)cx.fillRect(x,y,1.2,1.2)}
  cx.setTransform(dpr*cam.k,0,0,dpr*cam.k,dpr*(cw/2-cam.x*cam.k),dpr*(ch/2-cam.y*cam.k));
  const T=bf/BOIL;
  if(mode==='net')drawNet(T,now);else drawMind(T,now);
  cx.setTransform(dpr,0,0,dpr,0,0);
}

/* ---------- input ---------- */
const ptrs=new Map();let down=null,pinch=null;
function hitNet(wx,wy){let best=null,bd=1e9;G.nodes.forEach(n=>{if(!isVis(n))return;const d=Math.hypot(n.x-wx,n.y-wy);const rr=max(n.r+4,14/cam.k);if(d<rr&&d<bd){bd=d;best=n}});return best}
function hitMind(wx,wy){let best=null;for(const n of mm.nodes){if(n.depth===0){if(Math.hypot(n.x-wx,n.y-wy)<50)return n;continue}if(n.depth===1&&Math.hypot(n.x-wx,n.y-wy)<30){best=n;continue}if(n.hit&&wx>=n.hit.x0&&wx<=n.hit.x1&&wy>=n.hit.y0&&wy<=n.hit.y1)best=n;else if(Math.hypot(n.x-wx,n.y-wy)<10)best=n}return best}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),k:cam.k,c:toW((a.x+b.x)/2,(a.y+b.y)/2)};down=null;grabbed=null;return}
  const [wx,wy]=toW(e.offsetX,e.offsetY);const n=mode==='net'?hitNet(wx,wy):null;
  down={x:e.offsetX,y:e.offsetY,cx:cam.x,cy:cam.y,t:performance.now(),moved:false,node:n};camAnim=false;
  if(n){grabbed=n}});
cv.addEventListener('pointermove',e=>{
  if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
  if(pinch&&ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);const k=clamp(pinch.k*d/pinch.d,.25,3.2);const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;cam.k=k;cam.x=pinch.c[0]-(mx-cw/2)/k;cam.y=pinch.c[1]-(my-ch/2)/k;tgt.k=cam.k;needs=true;return}
  if(!down){if(e.pointerType==='mouse'&&mode==='net'){const [wx,wy]=toW(e.offsetX,e.offsetY);const h=hitNet(wx,wy);if(h!==hover){hover=h;needs=true;cv.style.cursor=h?'pointer':'grab'}}else if(e.pointerType==='mouse'){const [wx,wy]=toW(e.offsetX,e.offsetY);const h=hitMind(wx,wy);cv.style.cursor=h&&(h.ref||h.depth===0)?'pointer':'grab'}return}
  const dx=e.offsetX-down.x,dy=e.offsetY-down.y;if(abs(dx)+abs(dy)>6)down.moved=true;
  if(!down.moved)return;
  if(grabbed){const [wx,wy]=toW(e.offsetX,e.offsetY);grabbed.x=wx;grabbed.y=wy;reheat(.25)}
  else{cam.x=down.cx-dx/cam.k;cam.y=down.cy-dy/cam.k;tgt.x=cam.x;tgt.y=cam.y;needs=true}});
function up(e){ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;
  if(!down)return;const d=down;down=null;const g=grabbed;grabbed=null;
  if(d.moved)return;
  const [wx,wy]=toW(e.offsetX,e.offsetY);
  if(mode==='net'){const n=hitNet(wx,wy);if(n){if(n===focus)opts.onOpen(n.id);else setFocus(n)}else setFocus(null,false)}
  else{const n=hitMind(wx,wy);if(!n)return;if(n.depth===0)opts.onOpen(n.ref);else if(n.ref)mindmap(n.ref);}
}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);down=null;grabbed=null;pinch=null});
cv.addEventListener('wheel',e=>{e.preventDefault();const [wx,wy]=toW(e.offsetX,e.offsetY);const k=clamp(cam.k*Math.exp(-e.deltaY*.0015),.25,3.2);cam.x=wx-(e.offsetX-cw/2)/k;cam.y=wy-(e.offsetY-ch/2)/k;cam.k=k;tgt.x=cam.x;tgt.y=cam.y;tgt.k=k;camAnim=false;needs=true},{passive:false});
cv.addEventListener('dblclick',e=>{const [wx,wy]=toW(e.offsetX,e.offsetY);flyTo(wx,wy,cam.k*1.6)});

function setMode(m,root){mode=m;needs=true;if(m==='mind'){mindmap(root||(focus&&focus.id)||(mm.root&&mm.root.ref)||opts.defaultRoot(),!!mm.root)}else{opts.onMind&&opts.onMind(null,0);if(focus)flyTo(focus.x,focus.y,max(cam.k,1));else fit()}}
function show(){visibleNow=true;needs=true;if(!running){running=true;requestAnimationFrame(frame)}}
function hide(){visibleNow=false}
return {init,show,hide,setMode,get mode(){return mode},focusId,setFocus,setLayers,get layers(){return layers},fit,mindmap,mindBack,zoom:f=>flyTo(cam.x,cam.y,cam.k*f),get focus(){return focus},get mindRoot(){return mm.root},stackLen:()=>mm.stack.length,poke:()=>{needs=true}};
})();
