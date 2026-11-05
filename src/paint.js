/* ---------- paint: the hand-painted look ----------
   Shared by the engine diorama, the living emblems and the web.
   Ideas from ClaudeAnimationBase: flat washes + ink outlines that "boil"
   (jitter reseeded 12x a second, per element), hash() for anything that
   must stay put, additive glow() for light, paper grain over the top.
   Drawing goes to whatever canvas is bound with bindCanvas(). */
const PI=Math.PI,TAU=PI*2,sin=Math.sin,cos=Math.cos,abs=Math.abs,min=Math.min,max=Math.max;
let cx=null, W=0, H=0, GY=0, boilF=0, sd=1;
const BOIL=12;
function bindCanvas(ctx,w,h,gy){cx=ctx;W=w;H=h;GY=gy}

const NIGHT='#10142e',DEEP='#181e44',RAISE='#242b5c',TEXT='#f2efe7',SOFT='#b2b5d8',INK='#070a1c',GOLD='#ffd86b',ROSE='#ef5d71';
const STONE='#8d8aa6',MARBLE='#d9d4c6',WOOD='#7a5a48',BRONZE='#c98b4a',BRASS='#c9a24a',RED='#d65a4e',GREEN='#5fae6e',BLUE='#5b8fd6',SNOW='#dfe6f2',SAND='#c9a96e',WATER='#3a6fb0',LEAF='#4f9a63',SKY='#7fb2ff',VIOLET='#9b7bff',SKIN='#d9b59a';

/* colour */
const _hx={};
const hx=h=>_hx[h]||(_hx[h]=(()=>{h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))})());
const mix=(a,b,k)=>{const A=hx(a),B=hx(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')};
const rgba=(h,a)=>{const c=hx(h);return`rgba(${c[0]},${c[1]},${c[2]},${a})`};
const dim=(c,k=.5)=>mix(c,NIGHT,k);
const pale=(c,k=.35)=>mix(c,TEXT,k);
const lamp=(p,k=.55)=>mix(GOLD,NIGHT,k*(1-.85*p));

/* randomness: hash for things that must stay put, jit for the boil */
const hash=(i,j=0)=>{const x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x)};
function boilSeed(k){let h=2166136261;const s=k+'|'+boilF;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}sd=h>>>0}
const rnd=()=>{sd=(Math.imul(sd,1664525)+1013904223)>>>0;return sd/4294967296};
const jit=a=>(rnd()*2-1)*a;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const easeOut=k=>1-Math.pow(1-k,3);
const backOut=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};
const frac=v=>v-Math.floor(v);
const seg=(t,a,b)=>clamp((t-a)/(b-a));

/* shapes: point lists, subdivided so the boil can wobble the edges */
function poly(P,step=9){const o=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/step));for(let k=0;k<n;k++)o.push([lerp(a[0],b[0],k/n),lerp(a[1],b[1],k/n)])}return o}
const rect=(x,y,w,h)=>poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
function ell(x,y,rx,ry,n=16,a0=0,a1=TAU){const o=[],full=abs(a1-a0)>=TAU-1e-6;const m=full?n:n+1;for(let i=0;i<m;i++){const a=a0+(a1-a0)*i/n;o.push([x+cos(a)*rx,y+sin(a)*ry])}return o}
function trace(P,j,closed){
  const Q=P.map(p=>[p[0]+jit(j),p[1]+jit(j)]);
  cx.beginPath();
  if(closed){
    const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
    const s=m(Q[Q.length-1],Q[0]);cx.moveTo(s[0],s[1]);
    for(let i=0;i<Q.length;i++){const a=Q[i],e=m(a,Q[(i+1)%Q.length]);cx.quadraticCurveTo(a[0],a[1],e[0],e[1])}
    cx.closePath();
  }else{
    cx.moveTo(Q[0][0],Q[0][1]);
    for(let i=1;i<Q.length-1;i++){const e=[(Q[i][0]+Q[i+1][0])/2,(Q[i][1]+Q[i+1][1])/2];cx.quadraticCurveTo(Q[i][0],Q[i][1],e[0],e[1])}
    const L=Q[Q.length-1];cx.lineTo(L[0],L[1]);
  }
}
/* paint = flat wash + boiling ink outline (wash and ink take separate jitter, like a real brush) */
function paint(P,o={}){
  const j=o.j??1;
  if(o.wash){trace(P,j*.5,true);cx.fillStyle=o.wash;cx.fill()}
  if(o.ink!==null){cx.strokeStyle=o.ink||INK;cx.lineWidth=o.sw||1.5;cx.lineJoin=cx.lineCap='round';trace(P,j,true);cx.stroke()}
}
function stroke(P,sw=1.5,col=INK,j=.9){
  const Q=[];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/10));for(let k=0;k<n;k++)Q.push([lerp(a[0],b[0],k/n),lerp(a[1],b[1],k/n)])}
  Q.push(P[P.length-1]);
  cx.strokeStyle=col;cx.lineWidth=sw;cx.lineCap=cx.lineJoin='round';trace(Q,j,false);cx.stroke();
}
function glow(x,y,r,col,a=.5){
  if(!(r>1)||a<=0)return;
  cx.save();cx.globalCompositeOperation='lighter';
  const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,Math.min(1,a)));g.addColorStop(1,rgba(col,0));
  cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);cx.restore();
}
function dot(x,y,r,col){if(r<=0)return;cx.fillStyle=col;cx.beginPath();cx.arc(x+jit(.3),y+jit(.3),r,0,TAU);cx.fill()}
/* a tapered ribbon along a path, as one outline (tails, branches, vines) */
function ribbon(Pts,w0,w1,col,o={}){
  const L=[],R=[],n=Pts.length;
  for(let i=0;i<n;i++){const a=Pts[Math.max(0,i-1)],b=Pts[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;const w=lerp(w0,w1,i/(n-1||1))/2;L.push([Pts[i][0]-dy*w,Pts[i][1]+dx*w]);R.push([Pts[i][0]+dy*w,Pts[i][1]-dx*w])}
  paint([...L,...R.reverse()],{wash:col,...o});
}
function bez(a,b,c,t){const u=1-t;return[u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1]]}
function bezPts(a,b,c,n=12,t1=1){const o=[];for(let i=0;i<=n;i++)o.push(bez(a,b,c,t1*i/n));return o}

/* paper grain, boiling with the linework */
let _grain=null,_pats=new WeakMap();
function grainPattern(){
  if(!_grain){_grain=document.createElement('canvas');_grain.width=_grain.height=96;const g=_grain.getContext('2d'),d=g.createImageData(96,96);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0)}
  let p=_pats.get(cx);if(!p){p=cx.createPattern(_grain,'repeat');_pats.set(cx,p)}return p;
}
function grain(a=.06){
  const pat=grainPattern();if(!pat)return;
  cx.save();cx.globalCompositeOperation='source-atop';cx.globalAlpha=a;
  const o=(boilF*37)%96;cx.translate(-o,-(boilF*53)%96);cx.fillStyle=pat;cx.fillRect(0,0,W+96,H+96);cx.restore();
}

/* ---------- prop library ---------- */
const P=(pts,wash,o={})=>paint(pts,{wash,...o});
const R=(x,y,w,h,col,o)=>P(rect(x,y,w,h),col,o);
const E=(x,y,rx,ry,col,o)=>P(ell(x,y,rx,ry,Math.max(8,Math.min(20,Math.round((rx+ry)/1.6)))),col,o);
const Dome=(x,y,rx,ry,col,o)=>P(ell(x,y,rx,ry,14,PI,TAU),col,o);
const Bowl=(x,y,rx,ry,col,o)=>P(ell(x,y,rx,ry,14,0,PI),col,o);
const Tri=(x,y,w,h,col,o)=>P(poly([[x-w/2,y],[x,y-h],[x+w/2,y]]),col,o);
const Ln=(pts,sw=1.5,col=INK)=>stroke(pts,sw,col);
function thick(pts,w,col){stroke(pts,w+2.2,INK,.6);stroke(pts,w,col,.6)}
function spark4(x,y,s,a=1,col=GOLD){if(a<=0)return;cx.save();cx.globalAlpha=Math.min(1,a);stroke([[x-s,y],[x+s,y]],1.2,col,.2);stroke([[x,y-s],[x,y+s]],1.2,col,.2);cx.restore()}
function sparks(x,y,T,n,seed,a,spread=40,rise=50,col=GOLD){
  for(let k=0;k<n;k++){const age=frac(T*.33+hash(seed,k));const px=x+(hash(k,seed+7)-.5)*spread+sin(age*5+k)*3,py=y-age*rise,al=(1-age)*a;if(al>.03)spark4(px,py,2.5,al,col)}
}
function smoke(x,y,T,n,seed,dir=1,col=TEXT,a=.4){
  for(let k=0;k<n;k++){const age=frac(T*.18+k/n+hash(seed,k)*.07);const px=x+dir*(age*20+sin(age*6+k)*3),py=y-age*42,r=2.5+age*8;
    paint(ell(px,py,r,r*.85,10),{wash:rgba(mix(col,NIGHT,.55),(1-age)*a),ink:null,j:.8})}
}
function fire(x,y,s,T,col=GOLD){glow(x,y-s*.6,s*3,col,.5);const k=jit(.2);P(poly([[x-s*.6,y],[x-s*.3,y-s*.8],[x,y-s*(1.7+k)],[x+s*.35,y-s*.8],[x+s*.6,y]],4),'#ff9b4a',{ink:null});P(poly([[x-s*.3,y],[x,y-s*(1+k)],[x+s*.3,y]],3),col,{ink:null})}
function star5(x,y,r,col,o){const Q=[];for(let k=0;k<10;k++){const a=-PI/2+k*PI/5,rr=k%2?r*.45:r;Q.push([x+cos(a)*rr,y+sin(a)*rr])}P(Q,col,o)}
function heart(x,y,s,col,o){P([[x,y+s],[x-s,y],[x-s*.9,y-s*.6],[x-s*.4,y-s*.75],[x,y-s*.35],[x+s*.4,y-s*.75],[x+s*.9,y-s*.6],[x+s,y]],col,{sw:1,...o})}
function wheel(x,y,r,a,col,sp=6){E(x,y,r,r,null,{sw:1.6});for(let k=0;k<sp;k++){const an=a+k*TAU/sp;Ln([[x,y],[x+cos(an)*r,y+sin(an)*r]],1.1)}dot(x,y,1.8,INK)}
function gear(x,y,r,teeth,a,col,o={}){const Q=[];const n=teeth*4;for(let i=0;i<n;i++){const an=a+i*TAU/n,rr=(i%4<2)?r:r*.8;Q.push([x+cos(an)*rr,y+sin(an)*rr])}paint(Q,{wash:col,sw:o.sw||1.3,j:o.j??.6,ink:o.ink});if(o.hub!==false){E(x,y,r*.28,r*.28,dim(col,.35),{sw:1,j:.4})}}
function note(x,y,col=GOLD){E(x,y,2.2,1.7,col,{sw:.8});Ln([[x+2,y],[x+2,y-8],[x+5,y-6]],1,col)}
function rings(x,y,T,col,n=3,mx=30,a=.6){for(let k=0;k<n;k++){const r=4+frac(T*.6+k/n)*mx;cx.save();cx.globalAlpha=Math.max(0,(1-r/(mx+4))*a);cx.strokeStyle=col;cx.lineWidth=1.4;cx.beginPath();cx.arc(x,y,r,0,TAU);cx.stroke();cx.restore()}}
function beam(x,y,ang,len,w,col,a=.25){if(a<=0)return;cx.save();cx.globalCompositeOperation='lighter';cx.translate(x,y);cx.rotate(ang);const g=cx.createLinearGradient(0,0,0,-len);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));cx.fillStyle=g;cx.beginPath();cx.moveTo(-w*.2,0);cx.lineTo(-w,-len);cx.lineTo(w,-len);cx.lineTo(w*.2,0);cx.fill();cx.restore()}
function snake(pts,w,col){stroke(pts,w+2.2,INK,.5);stroke(pts,w,col,.5)}
function bird(x,y,s,col,T,ph=0){const fl=sin(T*9+ph)*.8;stroke([[x-s,y-s*fl],[x,y],[x+s,y-s*fl]],1.6,col)}
function cloud(x,y,s,col){[[-1,0,.9,.6],[0,-.4,1,.7],[1,0,.8,.55],[.1,.15,1.2,.5]].forEach(([dx,dy,rx,ry])=>E(x+dx*s,y+dy*s,rx*s,ry*s,col,{sw:1.2}))}
function sunDisk(x,y,r,col=GOLD,p=1){glow(x,y,r*3,col,.25+.35*p);E(x,y,r,r,mix(col,TEXT,.15),{ink:null})}
function globe(x,y,r,T,col=WATER){glow(x,y,r*1.8,SKY,.15);E(x,y,r,r,col,{sw:1.2});cx.save();cx.beginPath();cx.arc(x,y,r-1,0,TAU);cx.clip();
  for(let k=0;k<4;k++){const lx=x-r+frac(T*.04+k*.29)*r*2.6-r*.3,ly=y+(hash(k,4)-.5)*r*1.2;E(lx,ly,r*.32,r*.22,GREEN,{ink:null})}cx.restore()}
function moonBall(x,y,r){E(x,y,r,r,'#c8c6d6',{sw:1.2});dot(x-r*.3,y-r*.2,r*.18,'#a19fb4');dot(x+r*.25,y+r*.3,r*.14,'#a19fb4')}
function columnP(x,y,h,col,w=7){R(x-w/2,y-h,w,h,col,{sw:1.1});R(x-w*.8,y-h-3,w*1.6,3,col,{sw:1});R(x-w*.8,y-2,w*1.6,2,col,{sw:.8})}
function scrollP(x,y,w,h,col=pale(SAND,.4)){R(x-w/2,y,w,h,col,{sw:1.1});E(x-w/2,y+h/2,2.5,h/2+1,dim(col,.15),{sw:1});E(x+w/2,y+h/2,2.5,h/2+1,dim(col,.15),{sw:1})}
function lines(x,y,w,n,gap=4,col=rgba(INK,.55)){for(let k=0;k<n;k++)stroke([[x,y+k*gap],[x+w*(.7+hash(k,x|0)*.3),y+k*gap]],.8,col,.3)}
function openBook(x,y,w,n=3){const pg=mix(TEXT,NIGHT,.22);P(poly([[x,y+4],[x-w,y-2],[x-w,y-w*.55],[x,y-w*.5+4]],6),pg,{sw:1.1});P(poly([[x,y+4],[x+w,y-2],[x+w,y-w*.55],[x,y-w*.5+4]],6),pg,{sw:1.1});lines(x-w+4,y-w*.42,w-8,n,4);lines(x+4,y-w*.42,w-8,n,4)}
function jarP(x,y,s,col){P([...ell(x,y-s*.9,s*.75,s*.9,14,PI*.15,PI*.85+PI),[x+s*.3,y-s*1.75],[x+s*.32,y-s*2],[x-s*.32,y-s*2],[x-s*.3,y-s*1.75]],col)}
function crownP(x,y,s,col=GOLD){P(poly([[x-s,y],[x-s,y-s*.9],[x-s*.5,y-s*.4],[x,y-s*1.2],[x+s*.5,y-s*.4],[x+s,y-s*.9],[x+s,y]],5),col,{sw:1.1});dot(x,y-s*.3,s*.15,RED)}
function lyre(x,y,s,T,col=GOLD){stroke([[x-s*.6,y-s*1.6],[x-s*.7,y-s*.6],[x-s*.3,y]],2.4,col,.4);stroke([[x+s*.6,y-s*1.6],[x+s*.7,y-s*.6],[x+s*.3,y]],2.4,col,.4);Ln([[x-s*.7,y-s*1.5],[x+s*.7,y-s*1.5]],2,col);R(x-s*.4,y-2,s*.8,4,col,{sw:1});for(let k=0;k<4;k++){const sx=x-s*.3+k*s*.2;stroke([[sx,y-s*1.5],[sx+sin(T*20+k)*.6,y-s*.75],[sx,y]],.7,TEXT,.1)}}
function flaskP(x,y,s,liq){P(poly([[x-s*.25,y-s*1.4],[x-s*.25,y-s*.8],[x-s*.7,y],[x+s*.7,y],[x+s*.25,y-s*.8],[x+s*.25,y-s*1.4]],5),pale(SKY,.5),{sw:1.1});P(poly([[x-s*.5,y-s*.3],[x-s*.62,y],[x+s*.62,y],[x+s*.5,y-s*.3]],4),liq,{ink:null})}
function hourglass(x,y,h,k,col=BRASS){const w=h*.42;R(x-w*.7,y-h-3,w*1.4,3,col,{sw:1});R(x-w*.7,y,w*1.4,3,col,{sw:1});
  P(poly([[x-w*.55,y-h],[x+w*.55,y-h],[x+2,y-h/2],[x+w*.55,y],[x-w*.55,y],[x-2,y-h/2]],6),rgba(SKY,.25),{sw:1.1});
  const top=1-k;if(top>.02)P(poly([[x-w*.5*top,y-h/2-h*.45*top],[x+w*.5*top,y-h/2-h*.45*top],[x+1.5,y-h/2-1]],4),SAND,{ink:null,j:.3});
  if(k>.02)P(poly([[x-w*.5,y-1],[x+w*.5,y-1],[x,y-1-h*.42*k]],4),SAND,{ink:null,j:.3});
  if(k>0&&k<1)Ln([[x,y-h/2],[x,y-2]],.8,SAND);
}
function quadPts(m,u0,u1,v0,v1){const o=[];for(let k=0;k<=4;k++)o.push(m(u0+(u1-u0)*k/4,v0));for(let k=1;k<=2;k++)o.push(m(u1,v0+(v1-v0)*k/2));for(let k=4;k>=0;k--)o.push(m(u0+(u1-u0)*k/4,v1));o.push(m(u0,v0+(v1-v0)*.5));return o}
function banner(px,py,w,h,cols,T,ph=0,vert=false){
  const m=(u,v)=>[px+u*w,py+v*h+sin(T*5+ph+u*4.4)*1.8*u];const n=cols.length;
  cols.forEach((c,i)=>{const a=i/n,b=(i+1)/n;P(vert?quadPts(m,a,b,0,1):quadPts(m,0,1,a,b),c,{ink:null,j:.4})});
  P(quadPts(m,0,1,0,1),null,{sw:1.1});return m;
}
function flagOn(x,y,h,cols,T,ph=0,vert=false,w=16){Ln([[x,y],[x,y-h]],1.4);return banner(x,y-h,w,w*.6,cols,T,ph,vert)}

/* people: small painted figures, front view */
function fig(x,o={}){
  const h=o.h||30,y=o.y??GY,col=o.col||STONE,hc=o.hc||mix(col,TEXT,.5),f=o.f||1;
  const r=h*.13,hy=y-h+r,sy=hy+r+1.4,sw=h*.15,bw=h*.22,L=h*.36;
  const pose=o.pose||'stand';
  if(pose==='lotus')P(poly([[x-sw,sy],[x+sw,sy],[x+bw*1.8,y],[x-bw*1.8,y]],6),col);
  else if(pose==='sit'){
    P(poly([[x-sw,sy],[x+sw,sy],[x+bw,y-h*.32],[x-bw,y-h*.32]],6),col);
    P(poly([[x-bw,y-h*.36],[x+f*h*.34,y-h*.36],[x+f*h*.34,y-h*.24],[x-bw,y-h*.24]],5),col);
    thick([[x+f*h*.3,y-h*.26],[x+f*h*.32,y]],h*.07,dim(col,.25));
  }else{
    const wk=o.walk||0;
    thick([[x-bw*.4,y-h*.16],[x-bw*.4+sin(wk)*3,y]],h*.07,dim(col,.3));
    thick([[x+bw*.4,y-h*.16],[x+bw*.4-sin(wk)*3,y]],h*.07,dim(col,.3));
    P(poly([[x-sw,sy],[x+sw,sy],[x+bw,y-h*.14],[x-bw,y-h*.14]],6),col);
  }
  const a=o.arms||[.15,.15];
  const lh=[x-sw*.9-sin(a[0])*L,sy+2+cos(a[0])*L],rh=[x+sw*.9+sin(a[1])*L,sy+2+cos(a[1])*L];
  thick([[x-sw*.9,sy+2],lh],h*.075,col);thick([[x+sw*.9,sy+2],rh],h*.075,col);
  if(o.hat==='hood'||o.hat==='veil')E(x,hy+(o.hat==='veil'?r*.6:0),r*1.45,r*(o.hat==='veil'?1.9:1.4),o.hatc||dim(col,.2));
  E(x,hy,r,r*1.05,hc,{sw:1.2});
  const t=o.hat;
  if(t==='crown')P(poly([[x-r,hy-r*.6],[x-r,hy-r*1.7],[x-r*.4,hy-r*1.1],[x,hy-r*2],[x+r*.4,hy-r*1.1],[x+r,hy-r*1.7],[x+r,hy-r*.6]],4),GOLD,{sw:1});
  else if(t==='helmet'){Dome(x,hy-r*.1,r*1.2,r*1.2,o.hatc||'#8a8fa8',{sw:1.1});P(ell(x,hy-r*1.1,r*1.2,r*.5,10,PI,TAU),RED,{sw:1})}
  else if(t==='halo'){glow(x,hy,r*3.4,GOLD,.5);cx.strokeStyle=rgba(GOLD,.9);cx.lineWidth=1.2;cx.beginPath();cx.arc(x,hy,r*1.7,0,TAU);cx.stroke()}
  else if(t==='wreath'){for(let k=0;k<5;k++)dot(x-r+k*r*.5,hy-r*.9+abs(k-2)*.6,1.4,GREEN)}
  else if(t==='beard')P(poly([[x-r*.7,hy+r*.3],[x+r*.7,hy+r*.3],[x,hy+r*2.2]],4),o.hatc||TEXT,{sw:1});
  else if(t==='tophat'){R(x-r*.8,hy-r*2.6,r*1.6,r*1.8,INK,{ink:null});R(x-r*1.3,hy-r*.95,r*2.6,r*.4,INK,{ink:null})}
  if(o.hold)o.hold(rh,lh);
  return {lh,rh,head:[x,hy],r};
}
function crowd(x0,x1,y,n,col,T,seed=1,h=14,raise=0){
  for(let k=0;k<n;k++){const x=lerp(x0,x1,(k+.5)/n)+(hash(seed,k)-.5)*4,b=abs(sin(T*3+k*1.7))*1.5,hh=h*(.85+hash(k,seed)*.3);
    P(poly([[x-hh*.2,y-hh*.55-b],[x+hh*.2,y-hh*.55-b],[x+hh*.26,y],[x-hh*.26,y]],4),mix(col,NIGHT,.2+hash(k,3)*.3),{sw:1});
    if(raise>0&&hash(k,seed+4)<raise+.2){const up=clamp(raise*1.4-hash(k,9)*.4);if(up>0)thick([[x+hh*.16,y-hh*.5-b],[x+hh*.28,y-hh*.5-b-hh*.55*up]],1.4,mix(col,TEXT,.3))}
    E(x,y-hh*.72-b,hh*.16,hh*.17,mix(col,TEXT,.35),{sw:1})}
}
/* animals, side view, f = facing */
function quad(x,o={}){
  const y=o.y??GY,f=o.f||1,L=o.len||30,bh=o.h||13,lg=o.leg||12,col=o.col||WOOD,ph=o.ph||0,sw=o.swing??0;
  const by=y-lg-bh*.4;
  [-.36,-.22,.26,.38].forEach((d,i)=>{const s=sin(ph+(i%2?PI:0)+(i>1?1.6:0))*sw*lg*.4;thick([[x+f*d*L,by+bh*.2],[x+f*d*L+s,y]],o.lw||2.6,i%2?dim(col,.25):col)});
  if(o.tail!==false)stroke([[x-f*L*.48,by-bh*.2],[x-f*L*.62,by+(o.tailUp?-bh:bh*.3)]],o.bushy?4:1.6,o.bushy?col:INK);
  if(o.wool){for(let k=0;k<6;k++)E(x-L*.36+k*L*.145,by-bh*.25+(k%2)*2,bh*.38,bh*.38,col,{sw:1})}
  else E(x,by,L/2,bh/2,col);
  const nk=o.neck??10,nx=x+f*L*.4,ny=by-bh*.15,hx2=nx+f*(o.nf??5),hy=by-nk+(o.headDy||0),hr=o.hr||5;
  if(nk>3)thick([[nx,ny],[hx2,hy+hr*.3]],o.nw||bh*.42,col);
  if(o.mane)E(hx2-f*hr*.6,hy+hr*.5,hr*1.6,hr*1.7,o.mane,{sw:1.1});
  E(hx2+f*hr*.5,hy,hr,hr*(o.hy||.75),col,{sw:1.3});
  if(o.ears)Tri(hx2-f*hr*.1,hy-hr*.4,hr*.7,hr*1.2,col,{sw:1});
  if(o.horns)Ln([[hx2,hy-hr*.5],[hx2-f*hr*.6,hy-hr*1.6],[hx2+f*hr*.4,hy-hr*1.9]],1.6,TEXT);
  if(o.antlers){for(const s of[-1,1]){const bx=hx2+f*hr*.2+s*1.5;Ln([[bx,hy-hr*.6],[bx-f*hr*.6+s*2,hy-hr*2.4],[bx-f*hr*1.3+s*3,hy-hr*3.2]],1.4,pale(WOOD,.4));Ln([[bx-f*hr*.5+s*2,hy-hr*1.9],[bx+f*hr*.4+s*2,hy-hr*2.8]],1.2,pale(WOOD,.4))}}
  dot(hx2+f*hr*.75,hy-hr*.2,1.1,INK);
  return {head:[hx2+f*hr*.5,hy],back:[x,by-bh/2],by};
}
function chain(x0,y0,x1,y1,n,gap=0){for(let k=0;k<n;k++){const t=k/(n-1||1),x=lerp(x0,x1,t)+(k>=n/2?gap:0),y=lerp(y0,y1,t);E(x,y,3.2,2.2,'#9aa0b8',{sw:1})}}
function eagle(x,y,s,col,k){const w=s*(1.2+1.6*k);
  P(poly([[x,y],[x-w,y-s*(.3+.9*k)],[x-w*.6,y+s*.3],[x-s*.3,y+s*.5]],5),col);P(poly([[x,y],[x+w,y-s*(.3+.9*k)],[x+w*.6,y+s*.3],[x+s*.3,y+s*.5]],5),col);
  E(x,y+s*.4,s*.45,s*.8,col);E(x,y-s*.5,s*.35,s*.35,mix(col,TEXT,.5));}
function tree(x,h,col=LEAF,kind='round',y=GY){
  const tw=Math.max(3,h*.09);
  P(poly([[x-tw/2,y],[x-tw*.35,y-h*.55],[x+tw*.35,y-h*.55],[x+tw/2,y]],6),WOOD);
  if(kind==='pine'){for(let k=0;k<3;k++)Tri(x,y-h*.25-k*h*.22,h*(.5-k*.12),h*.36,col)}
  else if(kind==='olive'){[[-.22,-.72],[.2,-.75],[0,-.88]].forEach(([dx,dy])=>E(x+dx*h,y+dy*h,h*.26,h*.14,col))}
  else if(kind==='bare'){Ln([[x,y-h*.5],[x-h*.3,y-h*.85]],1.5);Ln([[x,y-h*.55],[x+h*.25,y-h*.9]],1.5);Ln([[x,y-h*.5],[x+h*.05,y-h]],1.5)}
  else{[[-.2,-.68],[.2,-.7],[0,-.86],[0,-.62]].forEach(([dx,dy])=>E(x+dx*h,y+dy*h,h*.25,h*.2,col))}
}
function hexP(x,y,r,col,o){const Q=[];for(let k=0;k<6;k++){const a=k*PI/3+PI/6;Q.push([x+cos(a)*r,y+sin(a)*r])}P(Q,col,o)}
function eye(x,y,s,open=1,col=TEXT,iris=SKY){const h=s*.55*open;P([[x-s,y],[x-s*.5,y-h],[x,y-h*1.15],[x+s*.5,y-h],[x+s,y],[x+s*.5,y+h],[x,y+h*1.15],[x-s*.5,y+h]],col,{sw:1.2});if(open>.2){E(x,y,s*.42*min(1,open*1.4),s*.42*open,iris,{sw:.9});dot(x,y,s*.18*open,INK);dot(x-s*.12,y-s*.12,s*.07,TEXT)}}
