/* ---------- the Idea Engine (diorama) ----------
   A painted engine room that runs along the track. Every frame is a pure function of the
   track's scroll position: gears, rollers, the owl's wingbeat and every arrival event run
   backwards when you swipe back. Only the 12 fps boil and the idle breathing use the clock. */
const Engine=(()=>{
const cv=document.getElementById('dio');
const ctx=cv.getContext('2d');
const DH=176, FLOOR=DH-26, PLH=12;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let dW=0,dpr=1,XC=0,SC=1,cssW=0,cssH=0;

function colorsFor(c,p){const base=mix(c,NIGHT,.6-.25*p);return{c,base,shade:mix(base,NIGHT,.38),lit:mix(c,TEXT,.2+.1*p)}}

function sky(mid,T,tint){
  glow(XC,-30,Math.max(dW*.6,260),tint,.14);
  const par=.06,x0=mid*par-XC;
  for(let k=Math.floor(x0/24)-1;k<=Math.ceil((x0+dW)/24)+1;k++){
    if(hash(k,1)<.45)continue;
    const sx=k*24+hash(k,2)*24-mid*par+XC,sy=6+hash(k,3)*(FLOOR-90);
    const tw=.25+.55*(.5+.5*sin(T*(1+hash(k,4)*2)+k));
    cx.fillStyle=rgba(TEXT,tw*.75);const r=hash(k,5)<.85?1:1.6;cx.fillRect(sx,sy,r,r);
  }
}
/* far wall of slow, huge gears: they turn with the scroll, each meshing the next */
function farGears(mid,tint){
  boilSeed('fargears');
  const par=.22,sp=150,off=mid*par;
  const col=mix(tint,NIGHT,.82),rim=rgba(mix(tint,TEXT,.3),.18);
  for(let k=Math.floor((off-XC)/sp)-1;k<=Math.ceil((off-XC+dW)/sp)+1;k++){
    const r=34+hash(k,7)*26,gx=k*sp-off+XC+hash(k,8)*30,gy=FLOOR-40-hash(k,9)*36;
    const dir=k%2?1:-1;
    gear(gx,gy,r,Math.round(r/5),dir*mid/(r*3.2),col,{sw:1,ink:rim,j:.5,hub:false});
    E(gx,gy,r*.32,r*.32,mix(tint,NIGHT,.88),{ink:rim,sw:1,j:.3});
    for(let s=0;s<4;s++){const a=dir*mid/(r*3.2)+s*PI/2;stroke([[gx+cos(a)*r*.32,gy+sin(a)*r*.32],[gx+cos(a)*r*.72,gy+sin(a)*r*.72]],2,rgba(mix(tint,NIGHT,.6),.6),.3)}
  }
}
/* a brass steam pipe on the back wall, with valves that hiss */
function pipe(mid,T,tint){
  boilSeed('pipe');
  const par=.5,y=FLOOR-62,off=mid*par;
  cx.save();cx.globalAlpha=.55;
  stroke([[-10,y],[dW+10,y]],5,mix(BRASS,NIGHT,.55),.3);stroke([[-10,y-1.5],[dW+10,y-1.5]],1,rgba(TEXT,.12),.2);
  for(let k=Math.floor((off-XC)/110)-1;k<=Math.ceil((off-XC+dW)/110)+1;k++){
    const px=k*110-off+XC;R(px-3,y-5,6,10,mix(BRASS,NIGHT,.45),{sw:.8,j:.3});
    if(hash(k,3)<.35){E(px,y-9,4,2,mix(RED,NIGHT,.4),{sw:.7});if(!reduce)smoke(px,y-10,T,3,k,hash(k,4)<.5?1:-1,TEXT,.25)}
  }
  cx.restore();
}
/* the conveyor floor: rollers turn with the scroll, the belt carries the plinths */
function floor(mid,tint){
  boilSeed('floor');
  const top=FLOOR;
  R(-10,top,dW+20,DH-top+10,mix(tint,NIGHT,.84),{ink:rgba(mix(tint,TEXT,.3),.28),sw:1.2,j:.5});
  const sp=26,k0=Math.floor((mid-XC)/sp)-1,k1=Math.ceil((mid-XC+dW)/sp)+1;
  for(let k=k0;k<=k1;k++){const rx=k*sp-mid+XC;gear(rx,top+9,5.5,7,-mid/5.5,mix(BRASS,NIGHT,.5),{sw:.8,j:.3,hub:false});dot(rx,top+9,1.3,INK)}
  stroke([[-10,top+2],[dW+10,top+2]],1.4,rgba(TEXT,.14),.3);
  for(let k=k0;k<=k1;k++){const bx=k*sp-mid+XC+sp/2;stroke([[bx,top+15],[bx+6,top+15]],1,rgba(TEXT,.08),.2)}
}
function plinth(x,c,p){
  R(x-34,FLOOR-PLH,68,PLH,mix(c,NIGHT,.7-.15*p),{sw:1.2});
  stroke([[x-34,FLOOR-PLH+2],[x+34,FLOOR-PLH+2]],1,rgba(mix(BRASS,TEXT,.3),.5),.3);
  E(x,FLOOR-PLH/2+1,3,2,lamp(p,.5),{ink:null,j:.2});
  if(p>.05)glow(x,FLOOR-PLH/2,8+10*p,GOLD,.25*p);
}
/* thought-threads: arcs from the current station to its connections, with pulses running along */
function threads(i,sx0,T,p,eng){
  const links=eng.links(i);if(!links.length||p<.15)return;
  cx.save();
  links.forEach(([j,kind],n)=>{
    const tx=(eng.centers[j]-eng.centers[i])/SC+sx0;const dx=tx-sx0;
    const hgt=Math.min(110,34+abs(dx)*.12),c=[sx0+dx/2,FLOOR-PLH-60-hgt];
    const a=[sx0,FLOOR-PLH-40],b=[tx,FLOOR-PLH-40];
    const col=kind==='rival'?ROSE:kind==='ally'?SKY:GOLD;
    const grow=clamp((p-.15)/.6);
    const pts=bezPts(a,c,b,24,grow);
    cx.globalAlpha=.22+.35*p;stroke(pts,1.4,col,.4);
    cx.globalAlpha=.9*p;
    for(let q=0;q<2;q++){const t=frac(T*.35+n*.17+q*.5)*grow;const pt=bez(a,c,b,t);dot(pt[0],pt[1],1.8,col);glow(pt[0],pt[1],6,col,.5*p)}
    if(grow>.98&&tx>-20&&tx<dW+20){glow(tx,FLOOR-PLH-40,10,col,.4*p);dot(tx,FLOOR-PLH-40,2.4,col)}
  });
  cx.restore();
}
/* the owl of Minerva: perches beside the station you're at, takes off when you swipe */
function owl(x,T,mid,lean,face,amp,near){
  boilSeed('owl');
  const fly=clamp(amp*1.6);
  const bob=reduce?0:sin(T*2.1)*.8;
  const y=lerp(FLOOR-PLH-20-6,FLOOR-112,ease(fly))+bob-fly*sin(mid/9)*3;
  // perch post
  stroke([[x,FLOOR],[x,FLOOR-PLH-20]],2.4,mix(BRASS,NIGHT,.3),.3);stroke([[x-10,FLOOR-PLH-20],[x+10,FLOOR-PLH-20]],2.2,mix(BRASS,NIGHT,.2),.3);
  if(fly<.95){cx.fillStyle='rgba(0,0,0,.25)';cx.beginPath();cx.ellipse(x,FLOOR-PLH-19,9,2,0,0,TAU);cx.fill()}
  const f=face;cx.save();cx.translate(x,y);cx.rotate(lean*.18);
  const body='#8c7a68',dark='#5e4e42',facec='#e8dcc4';
  // wings: folded when perched, a full beat when flying (phase from scroll)
  const ph=mid/9,beat=sin(ph);
  for(const s of[-1,1]){
    if(fly>.05){const span=10+26*fly,up=beat*14*fly;P(poly([[s*6,-14],[s*(6+span*.5),-22-up*.6],[s*(6+span),-16-up],[s*(4+span*.75),-6-up*.4],[s*(4+span*.4),-4],[s*5,-2]],5),s===-f?dark:body,{sw:1.2});
      for(let q=1;q<4;q++)stroke([[s*(6+span*q*.22),-16-up*q*.22],[s*(6+span*q*.22+3),-6-up*q*.15]],.7,rgba(INK,.45),.2)}
    else P(poly([[s*7,-18],[s*11,-8],[s*8,2],[s*4,0]],4),dark,{sw:1})
  }
  E(0,-8,10,12,body,{sw:1.3});
  for(let q=0;q<3;q++)stroke(ell(0,-2-q*4,5-q,2,8,0,PI),.7,rgba(facec,.5),.2);
  E(0,-24,10.5,9,body,{sw:1.3});
  Tri(-7,-31,5,6,body,{sw:1});Tri(7,-31,5,6,body,{sw:1});
  E(-4.2,-24,4.6,4.6,facec,{sw:.9,j:.3});E(4.2,-24,4.6,4.6,facec,{sw:.9,j:.3});
  const blink=!reduce&&hash(Math.floor(T*3),91)>.93;
  const look=f*1.2;
  if(blink){stroke([[-7,-24],[-2,-24]],1.2,INK,.1);stroke([[2,-24],[7,-24]],1.2,INK,.1)}
  else{E(-4.2+look*.6,-24,2.6,2.6,GOLD,{ink:null,j:.1});E(4.2+look*.6,-24,2.6,2.6,GOLD,{ink:null,j:.1});dot(-4.2+look,-24,1.3,INK);dot(4.2+look,-24,1.3,INK)}
  glow(-4.2,-24,6+6*near,GOLD,.25+.2*near);glow(4.2,-24,6+6*near,GOLD,.25+.2*near);
  P(poly([[-1.6,-21],[1.6,-21],[0,-17]],2),'#e0a64a',{sw:.7,j:.2});
  if(fly<.4){stroke([[-3,3],[-3,6]],1.4,'#e0a64a',.2);stroke([[3,3],[3,6]],1.4,'#e0a64a',.2)}
  cx.restore();
  // a trail of thought-sparks while flying
  if(fly>.2&&!reduce)for(let k=0;k<5;k++){const a=frac(T*.9+k/5);cx.save();cx.globalAlpha=(1-a)*fly*.8;spark4(x-face*(8+a*40),y-10+sin(a*7+k)*6,2,1,GOLD);cx.restore()}
}

function draw(mid,T,lean,face,amp,eng){
  bindCanvas(ctx,dW,DH,FLOOR);
  cx.setTransform(dpr*SC,0,0,dpr*SC,0,0);cx.clearRect(0,0,dW,DH);
  const n=eng.centers.length;if(!n)return;
  let fi=0;
  const cs=eng.centers.map(c=>c/SC);
  if(mid>=cs[n-1])fi=n-1;else for(let i=0;i<n-1;i++){if(mid>=cs[i]&&mid<cs[i+1]){fi=i+(mid-cs[i])/(cs[i+1]-cs[i]);break}}
  const i0=Math.floor(fi),i1=Math.min(n-1,i0+1);
  const tint=mix(eng.color(i0),eng.color(i1),fi-i0);

  sky(mid,T,tint);farGears(mid,tint);pipe(mid,T,tint);floor(mid,tint);

  const vis=[];let near=0,ai=-1,ap=0;
  for(let i=0;i<n;i++){const sx=cs[i]-mid+XC;if(sx>-100&&sx<dW+100)vis.push([sx,i])}
  vis.forEach(([sx,i])=>{const p=ease(clamp(1-abs(sx-XC)/72));if(p>ap){ap=p;ai=i}});
  vis.sort((a,b)=>abs(b[0]-XC)-abs(a[0]-XC));
  for(const [sx,i] of vis){
    const p=ease(clamp(1-abs(sx-XC)/72));near=Math.max(near,p);
    const c=eng.color(i);const C=colorsFor(c,p);
    boilSeed('pl'+i);plinth(sx,c,p);
    glow(sx,FLOOR-PLH-30,30+30*p,c,.04+.12*p);
    const e=ease(clamp((p-.35)/.65));
    boilSeed(eng.lens+':'+i);
    cx.save();GY=FLOOR-PLH;
    try{eng.drawItem(i,sx,C,p,e,T,mid)}catch(err){if(!eng.broken[i]){eng.broken[i]=1;console.warn('engine item failed',i,err)}}
    cx.restore();GY=FLOOR;
  }
  if(ai>=0){boilSeed('threads');threads(ai,cs[ai]-mid+XC,T,ap,eng)}
  owl(XC-58,T,mid,lean,face,amp,near);
  grain(.06);
}

function resize(track){
  dpr=Math.min(2,window.devicePixelRatio||1);cssW=cv.clientWidth;cssH=cv.clientHeight||DH;
  SC=cssH/DH;dW=cssW/SC;   // taller canvas on big screens: same scene, drawn larger
  cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);
  const tr=track.getBoundingClientRect(),cr=cv.getBoundingClientRect();
  XC=(tr.left-cr.left+track.clientWidth/2)/SC;
}
let lastMid=null,lean=0,face=1,lastKey='',idle=0;
function start(getEng){
  function frame(now){
    requestAnimationFrame(frame);
    const eng=getEng();
    if(!eng||!eng.visible()||!cv.clientWidth)return;
    if(cv.clientWidth!==cssW||cv.clientHeight!==cssH)resize(eng.track);
    if(eng.dirty){eng.dirty=false;lastMid=null;lastKey=''}
    boilF=reduce?0:Math.floor(now/1000*BOIL);
    const T=boilF/BOIL;
    const mid=(eng.track.scrollLeft+eng.track.clientWidth/2)/SC;
    const v=lastMid===null?0:mid-lastMid;lastMid=mid;
    if(abs(v)>.4){face=Math.sign(v);idle=0}else if(++idle>24)face=1;
    lean+=(clamp(v/12,-1,1)-lean)*.14;if(abs(lean)<.001)lean=0;
    const amp=clamp(abs(lean)*3);
    const key=mid.toFixed(1)+'|'+boilF+'|'+lean.toFixed(3)+'|'+dW+'|'+eng.lens+'|'+face;
    if(key===lastKey)return;lastKey=key;
    draw(mid,T,lean,face,amp,eng);
  }
  window.addEventListener('resize',()=>{cssW=0});
  requestAnimationFrame(frame);
}
return {start};
})();

/* ---------- living emblems: one small canvas per card, drawn only while visible ---------- */
const Living=(()=>{
  const set=new Set();
  function add(canvas,fn){set.add({canvas,fn,ctx:canvas.getContext('2d'),w:0,h:0,last:''});}
  function clear(root){for(const it of[...set])if(!it.canvas.isConnected||(root&&root.contains(it.canvas)))set.delete(it)}
  function frame(now){
    requestAnimationFrame(frame);
    const bf=matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.floor(now/1000*BOIL);
    for(const it of set){
      const c=it.canvas;if(!c.isConnected){set.delete(it);continue}
      if(!c.offsetParent||c.dataset.live!=='1')continue;
      const r=c.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||r.width<2)continue;
      const dpr=Math.min(2,devicePixelRatio||1);
      if(it.w!==r.width||it.h!==r.height){it.w=r.width;it.h=r.height;c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr)}
      const ev=+(c.dataset.e||1),key=bf+'|'+ev.toFixed(3);if(key===it.last)continue;it.last=key;
      boilF=bf;const T=bf/BOIL;
      const s=Math.min(r.width/150,r.height/118);
      bindCanvas(it.ctx,r.width/s,r.height/s,r.height/s-10);
      cx.setTransform(dpr*s,0,0,dpr*s,0,0);cx.clearRect(0,0,W,H);
      try{it.fn(W/2,ev,T,bf*6)}catch(err){console.warn('emblem failed',err)}
      grain(.05);
    }
  }
  requestAnimationFrame(frame);
  return {add,clear};
})();
