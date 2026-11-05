/* ---------- idea emblems ----------
   One painted emblem per Great Idea, keyed by id. Signature: (x, C, p, e, T, m)
   x: centre on the canvas; GY is the top of the plinth it stands on
   C: colours from the idea's domain {c, base, shade, lit}
   p: 0..1 how close the owl is    e: the arrival event, 0..1 (pure function of scroll, so it reverses)
   T: boil clock in seconds        m: scroll position, for things that turn as you swipe */
function figure8(x,y,w,h,k,col,sw=2){const pts=[];const n=40;for(let i=0;i<=n*k;i++){const t=i/n*TAU;pts.push([x+sin(t)*w,y+sin(2*t)*h])}if(pts.length>1)stroke(pts,sw,col,.3)}
function domino(x,y,w,h,a,col){cx.save();cx.translate(x,y);cx.rotate(a);R(-w/2,-h,w,h,col,{sw:1.1});dot(0,-h*.7,1.2,INK);dot(0,-h*.3,1.2,INK);Ln([[-w/2+1,-h/2],[w/2-1,-h/2]],.6,rgba(INK,.6));cx.restore()}
function die(x,y,s,a,n,col=TEXT){cx.save();cx.translate(x,y);cx.rotate(a);R(-s/2,-s/2,s,s,col,{sw:1.1,j:.4});const D={1:[[0,0]],2:[[-.25,-.25],[.25,.25]],3:[[-.25,-.25],[0,0],[.25,.25]],4:[[-.25,-.25],[.25,-.25],[-.25,.25],[.25,.25]],5:[[-.25,-.25],[.25,-.25],[0,0],[-.25,.25],[.25,.25]],6:[[-.25,-.27],[.25,-.27],[-.25,0],[.25,0],[-.25,.27],[.25,.27]]};(D[n]||D[1]).forEach(([a2,b])=>dot(a2*s,b*s,s*.07,INK));cx.restore()}
function butterfly(x,y,s,fl,col,col2){const w=s*(.35+.65*abs(cos(fl)));P(poly([[x,y],[x-w,y-s*.9],[x-w*1.1,y-s*.2],[x,y+s*.05]],4),col,{sw:.9});P(poly([[x,y],[x+w,y-s*.9],[x+w*1.1,y-s*.2],[x,y+s*.05]],4),col,{sw:.9});P(poly([[x,y],[x-w*.8,y+s*.5],[x-w*.2,y+s*.6]],3),col2,{sw:.8});P(poly([[x,y],[x+w*.8,y+s*.5],[x+w*.2,y+s*.6]],3),col2,{sw:.8});Ln([[x,y-s*.2],[x,y+s*.5]],1.6,INK)}
function bust0(x,y,s,col){P(poly([[x-s*.9,y],[x-s*.7,y-s*.7],[x+s*.7,y-s*.7],[x+s*.9,y]],5),col);E(x,y-s*1.15,s*.5,s*.58,col)}
function laurel(x,y,r,col=GREEN,a0=PI*.15,a1=PI*.85){for(let k=0;k<8;k++){const a=lerp(a0,a1,k/7);for(const s of[-1,1]){const px=x+s*cos(a)*r,py=y-sin(a)*r;cx.save();cx.translate(px,py);cx.rotate(s*(a-PI/2)+(s<0?PI:0));E(0,0,3.2,1.5,col,{sw:.6,j:.3});cx.restore()}}}
function owlStatue(x,y,s,col,eyes){E(x,y-s,s*.7,s,col);Tri(x-s*.4,y-s*1.7,s*.4,s*.5,col,{sw:1});Tri(x+s*.4,y-s*1.7,s*.4,s*.5,col,{sw:1});E(x-s*.28,y-s*1.25,s*.22,s*.22,lamp(eyes,.6),{sw:.8});E(x+s*.28,y-s*1.25,s*.22,s*.22,lamp(eyes,.6),{sw:.8});if(eyes>.1){glow(x-s*.28,y-s*1.25,6+6*eyes,GOLD,.5*eyes);glow(x+s*.28,y-s*1.25,6+6*eyes,GOLD,.5*eyes)}P(poly([[x-1.5,y-s*1.05],[x+1.5,y-s*1.05],[x,y-s*.85]],2),GOLD,{sw:.6})}
function swan(x,y,s,col,f=1){E(x,y-s*.5,s,s*.5,col,{sw:1});stroke([[x+f*s*.7,y-s*.7],[x+f*s*.9,y-s*1.5],[x+f*s*1.2,y-s*1.7]],s*.22+2,INK,.3);stroke([[x+f*s*.7,y-s*.7],[x+f*s*.9,y-s*1.5],[x+f*s*1.2,y-s*1.7]],s*.22,col,.3);P(poly([[x+f*s*1.2,y-s*1.8],[x+f*s*1.55,y-s*1.65],[x+f*s*1.2,y-s*1.6]],2),'#ff9b4a',{sw:.6})}
function ram(x,y,f,col,lunge){const d=lunge*8*f;quad(x+d,{y,f,len:24,h:12,leg:8,neck:3,nf:3,hr:5,wool:1,col,tail:false});const hx2=x+d+f*17;stroke(ell(hx2,y-21,5,5,10,f>0?PI*.6:-PI*.4,f>0?PI*2.2:PI*1.2),2.4,SAND,.3)}
function weathervane(x,y,a){Ln([[x,y],[x,y-46]],1.8);Ln([[x-10,y-30],[x+10,y-30]],1);Ln([[x,y-40],[x,y-20]],1);cx.save();cx.translate(x,y-48);cx.scale(cos(a),1);P(poly([[-16,0],[10,-2],[16,-6],[14,2],[10,2],[-14,3]],4),BRASS,{sw:1});P(poly([[-16,0],[-20,-6],[-22,4]],3),BRASS,{sw:.8});cx.restore();dot(x,y-48,2,INK)}

const EM={
angel:(x,C,p,e,T)=>{const y=GY-36-e*10+sin(T*1.6)*2,w=.3+.7*e;
  glow(x,y-10,24+30*e,GOLD,.15+.4*e);
  for(const s of[-1,1]){const Q=[[x,y-14]];for(let k=0;k<5;k++){const a=-.3-k*.28;Q.push([x+s*(10+28*w)*cos(a*.6)*(1-k*.08),y-14+sin(a)*24*w-k*2])}Q.push([x+s*6,y-2]);P(Q,pale(C.lit,.4),{sw:1.1});for(let k=1;k<4;k++)Ln([[x+s*4,y-10],[x+s*(8+k*7*w),y-12-k*5*w]],.6,rgba(INK,.4))}
  P(poly([[x-7,y-12],[x+7,y-12],[x+11,y+16],[x-11,y+16]],6),pale(TEXT,.1));E(x,y-18,5,5.5,pale(SKIN,.3),{sw:1});
  cx.strokeStyle=rgba(GOLD,.6+.4*e);cx.lineWidth=1.4;cx.beginPath();cx.ellipse(x,y-27,7,2.4,0,0,TAU);cx.stroke();
  if(e>.3)sparks(x,y,T,5,1,e,40,30);},
animal:(x,C,p,e,T,m)=>{tree(x+30,40,dim(LEAF,.2),'round');
  const h=quad(x-6,{f:1,len:34,h:13,leg:16,neck:12+e*6,nf:5,hr:5,col:'#b98a5a',antlers:1,tail:true,headDy:-e*2});
  if(e>.5){const bx=lerp(x+60,h.back[0]+2,clamp((e-.5)*2.2)),by=lerp(GY-80,h.back[1]-3,clamp((e-.5)*2.2));if(e<.95)bird(bx,by,5,INK,T);else{E(bx,by,3,2.4,INK,{sw:.6});dot(bx+3,by-1,1.2,INK)}}},
aristocracy:(x,C,p,e,T)=>{
  for(let k=0;k<3;k++)R(x-36+k*8,GY-6-k*8,72-k*16,6+k*0,C.shade,{sw:1});
  crowd(x-50,x+50,GY,8,dim(C.base,.2),T,3,13);
  [-10,0,10].forEach((dx,k)=>{fig(x+dx,{y:GY-24,h:22,col:C.lit,hat:'wreath'});});
  [-10,0,10].forEach((dx,k)=>{const wy=lerp(GY-90,GY-46,clamp(e*1.3-k*.12));laurel(x+dx,wy+4,5,GREEN)});
  glow(x,GY-40,20+20*e,GOLD,.1+.3*e);},
art:(x,C,p,e,T)=>{
  Ln([[x-20,GY],[x-6,GY-72]],2,WOOD);Ln([[x+20,GY],[x+6,GY-72]],2,WOOD);Ln([[x,GY-60],[x+8,GY]],1.6,WOOD);
  R(x-26,GY-70,52,40,pale(SAND,.55),{sw:1.2});R(x-28,GY-32,56,3,WOOD,{sw:1});
  cx.save();cx.beginPath();cx.rect(x-24,GY-68,48,36);cx.clip();
  const k=e;R(x-24,GY-68,48*clamp(k*2),18,mix(SKY,NIGHT,.2),{ink:null,j:.6});
  if(k>.3)E(x+10,GY-58,5*clamp((k-.3)*3),5*clamp((k-.3)*3),GOLD,{ink:null});
  if(k>.45)P(poly([[x-24,GY-34],[x-14,GY-48],[x-2,GY-40],[x+10,GY-52],[x+24,GY-38],[x+24,GY-32],[x-24,GY-32]],6),mix(GREEN,C.c,.3),{ink:null,j:.6});
  if(k>.7)tree(x-12,14*clamp((k-.7)*3.3),LEAF,'round',GY-36);
  cx.restore();
  const bx=x-24+48*clamp(k*1.1),by=GY-60+sin(k*12)*10;Ln([[bx,by],[bx+12,by+18]],1.6,WOOD);dot(bx,by,2,C.c);
  for(let k2=0;k2<4;k2++)E(x+36+k2*4,GY-4-(k2%2)*3,2.5,2,[RED,GOLD,BLUE,GREEN][k2],{sw:.6});P(ell(x+40,GY-4,10,5,12),pale(WOOD,.3),{sw:1});},
astronomy:(x,C,p,e,T,m)=>{
  const cy=GY-56;sunDisk(x+14,cy,7,GOLD,p);
  [[16,6,.9,SKY],[26,9,.6,'#d6875a'],[36,12,.4,'#c9b07a']].forEach(([r,ry,sp,col],k)=>{cx.save();cx.strokeStyle=rgba(TEXT,.22);cx.lineWidth=1;cx.beginPath();cx.ellipse(x+14,cy,r,ry,0,0,TAU);cx.stroke();cx.restore();const a=m/(30+k*20)*sp*4+k*2+e*PI;E(x+14+cos(a)*r,cy+sin(a)*ry,2.4+k*.6,2.4+k*.6,col,{sw:.7})});
  Ln([[x-30,GY],[x-20,GY-24]],1.4,WOOD);Ln([[x-10,GY],[x-20,GY-24]],1.4,WOOD);Ln([[x-20,GY],[x-20,GY-24]],1.4,WOOD);
  cx.save();cx.translate(x-20,GY-26);cx.rotate(-.55-e*.25);R(-14,-3,36,6,BRASS,{sw:1.1});R(20,-4,6,8,mix(BRASS,NIGHT,.2),{sw:1});cx.restore();},
beauty:(x,C,p,e,T)=>{
  stroke([[x,GY],[x-2,GY-30],[x+1,GY-52]],2,GREEN);E(x-8,GY-26,6,3,LEAF,{sw:.8});E(x+8,GY-36,6,3,LEAF,{sw:.8});
  const y=GY-58,o=.25+.75*e;glow(x,y,10+26*e,ROSE,.15+.4*e);
  for(let r=0;r<3;r++)for(let k=0;k<5;k++){const a=k*TAU/5+r*.6,d=(3+r*4)*o+2;E(x+cos(a)*d,y+sin(a)*d*.8,6-r*1.2+o*2,4.5-r+o,mix(ROSE,RED,r*.3),{sw:.8,j:.4})}
  E(x,y,4,3.4,mix(RED,NIGHT,.2),{sw:.8});
  if(e>.5)for(let k=0;k<3;k++){const a2=frac(T*.25+k/3);cx.save();cx.globalAlpha=(1-a2)*e;E(x+sin(a2*6+k)*10+10,y-6+a2*40,2,1.4,ROSE,{ink:null});cx.restore()}},
being:(x,C,p,e,T)=>{const y=GY-44;
  for(let k=0;k<3;k++){const r=12+k*9+e*6*(k+1);cx.save();cx.globalAlpha=.5-k*.12;cx.strokeStyle=C.lit;cx.lineWidth=1.4;cx.beginPath();cx.arc(x,y,r,0,TAU);cx.stroke();cx.restore()}
  glow(x,y,30+20*e,C.c,.2+.3*e);E(x,y,13,13,mix(C.lit,TEXT,.3*e),{sw:1.3});E(x-4,y-4,4,3,rgba(TEXT,.5),{ink:null});},
cause:(x,C,p,e,T)=>{for(let k=0;k<7;k++){const t=clamp(e*1.5-k*.09);const a=t*1.15;domino(x-40+k*12,GY,6,22,a,k%2?C.lit:pale(C.lit,.2))}
  const bx=x-54+min(1,e*4)*6,by=GY-6;E(bx,by,4,4,RED,{sw:.9});},
chance:(x,C,p,e,T,m)=>{const t=e;
  [[-14,0],[16,1]].forEach(([dx,k])=>{const fall=1-t,tx=x+dx-(1-t)*30*(k?-1:1),ty=GY-10-abs(sin(t*PI*2.5))*(1-t)*40-fall*10;die(tx,ty,18,(1-t)*(6+k*3),t>.98?[5,2][k]:1+Math.floor(hash(Math.floor(T*8),k)*6),pale(TEXT,.05))});
  if(t>.95)spark4(x,GY-30,3,.8);
  Bowl(x+40,GY-2,10,4,C.shade,{sw:1});},
change:(x,C,p,e,T,m)=>{
  const Q=[];for(let k=0;k<=12;k++){const xx=x-56+k*112/12;Q.push([xx,GY-4+sin(k*1.3+m/14)*2])}
  P([...Q,[x+56,GY+2],[x-56,GY+2]],mix(WATER,NIGHT,.2),{ink:null});Ln(Q,1.2,pale(SKY,.3));
  for(let k=0;k<3;k++){const lx=x-50+frac(m/240+k/3)*100;E(lx,GY-4,3,1.6,[GOLD,RED,'#ff9b4a'][k],{sw:.6})}
  E(x-30,GY-6,7,3,STONE,{sw:1});E(x+28,GY-6,8,3,STONE,{sw:1});
  fig(x-30+e*58,{y:GY-8,h:26,col:C.lit,walk:e*12,arms:[.6,.6]});},
citizen:(x,C,p,e,T)=>{
  temple(x+32,34,34,C.shade,GY,4);
  jarP(x-4,GY,10,mix(BRONZE,NIGHT,.2));
  for(let k=0;k<4;k++){const a=frac(T*.35+k/4);if(e>.1&&a<.85){cx.save();cx.globalAlpha=e;const px=x-4+(hash(k,2)-.5)*8,py=GY-50+a*28;E(px,py,2.2,2.2,TEXT,{sw:.6});cx.restore()}}
  crowd(x-50,x-18,GY,3,C.lit,T,7,16,e);},
constitution:(x,C,p,e,T)=>{
  for(let k=0;k<3;k++)columnP(x-24+k*24,GY,36,pale(C.base,.15),6);R(x-32,GY-42,64,5,pale(C.base,.15),{sw:1});Tri(x,GY-42,66,14,pale(C.base,.15));
  const w=8+56*e;R(x-w/2,GY-30,w,16,pale(SAND,.45),{sw:1});E(x-w/2,GY-22,3,9,dim(SAND,.1),{sw:1});E(x+w/2,GY-22,3,9,dim(SAND,.1),{sw:1});
  if(w>20)lines(x-w/2+5,GY-27,w-10,3,4);if(e>.8){E(x+w/2-8,GY-16,4,4,RED,{sw:.8});glow(x+w/2-8,GY-16,8,RED,.4)}},
courage:(x,C,p,e,T)=>{const up=e;
  P(poly([[x-50,GY],[x-36,GY-20],[x+10,GY-24],[x+30,GY]],8),dim(STONE,.3));
  quad(x-6,{y:GY-14-up*4,f:1,len:34,h:13,leg:8+up*6,neck:4+up*4,nf:3,hr:6,mane:'#c9773c',col:SAND,tail:true,tailUp:up>.5});
  if(e>.5){const hx2=x+20,hy=GY-36-up*6;rings(hx2+10,hy,T,GOLD,3,20,.5*(e-.5)*2)}
  glow(x,GY-30,20+20*e,GOLD,.1+.25*e);},
custom:(x,C,p,e,T)=>{const b=e;
  [[-14,1],[14,-1]].forEach(([dx,f])=>{cx.save();cx.translate(x+dx,GY);cx.rotate(f*b*.45);fig(0,{y:0,h:32,col:f>0?C.lit:pale(C.c,.35),f:-f,arms:[f>0?.2:1.4+b*.2,f>0?1.4+b*.2:.2]});cx.restore()});
  if(b>.6)glow(x,GY-20,14,GOLD,.3*(b-.6)*2.5);
  for(let k=0;k<3;k++)tree(x-50+k*50*2,24,dim(LEAF,.3),'round');},
definition:(x,C,p,e,T)=>{const cy=GY-40;
  hexP(x,cy,6,pale(C.lit,.2),{sw:1});glow(x,cy,10,C.c,.3);
  const k=e;cx.save();cx.strokeStyle=C.lit;cx.lineWidth=1.8;cx.beginPath();cx.arc(x,cy,26,-PI/2,-PI/2+TAU*k);cx.stroke();cx.restore();
  for(let i=0;i<8;i++){const a=i*TAU/8+.3,r=36+hash(i,3)*10;dot(x+cos(a)*r,cy+sin(a)*r*.7,1.6,rgba(TEXT,.5))}
  const a=-PI/2+TAU*k;Ln([[x,cy],[x+cos(a)*26,cy+sin(a)*26]],1.4,BRASS);Ln([[x,cy],[x+cos(a+.3)*8-2,cy-30]],1.4,BRASS);dot(x,cy-30,2,BRASS);},
democracy:(x,C,p,e,T)=>{
  temple(x+36,30,30,C.shade,GY,4);
  crowd(x-56,x+18,GY,9,C.lit,T,5,18,e);
  if(e>.6)sparks(x-20,GY-30,T,4,2,e,60,20);},
desire:(x,C,p,e,T)=>{
  Ln([[x+56,GY-80],[x+10,GY-74],[x-10,GY-78]],2.6,WOOD);E(x+30,GY-80,10,6,LEAF,{sw:1});E(x+2,GY-80,8,5,LEAF,{sw:1});
  const ay=GY-64+sin(T*1.6)*1.5;Ln([[x+6,GY-74],[x+6,ay-5]],.8,WOOD);E(x+6,ay,5,5,RED,{sw:1});glow(x+6,ay,10+10*e,RED,.2+.2*e);
  const f=fig(x-26,{h:34,col:C.lit,arms:[.2,1.2+e*1.3]});
  if(e>.4)Ln([[f.rh[0],f.rh[1]],[f.rh[0]+3,f.rh[1]-2]],1.4,mix(C.lit,TEXT,.3));},
dialectic:(x,C,p,e,T)=>{
  fig(x-38,{h:30,col:C.lit,arms:[.2,1.5],f:1});fig(x+38,{h:30,col:pale(ROSE,.2),arms:[1.5,.2],f:-1});
  const k=clamp(e*1.2);const ax=lerp(x-26,x,k),bx=lerp(x+26,x,k),y=GY-26-sin(k*PI)*10;
  Ln([[x-26,GY-26],[ax,y]],1.6,C.lit);Ln([[x+26,GY-26],[bx,y]],1.6,ROSE);
  if(k>.95){glow(x,GY-38,16+16*e,GOLD,.5);spark4(x,GY-38,5,1);const sy=GY-50-(e-.8)*60;if(e>.8){E(x,sy,4,4,GOLD,{sw:.8});glow(x,sy,12,GOLD,.4)}}},
duty:(x,C,p,e,T)=>{
  towerP(x+36,14,56,STONE,'crenel');
  const f=fig(x-6,{h:34,col:C.lit,hat:'helmet',arms:[.2,1.0+e*1.4],hold:(rh)=>{Ln([[rh[0],rh[1]+6],[rh[0],rh[1]-22]],1.4,WOOD);R(rh[0]-3,rh[1]-30,6,8,lamp(.8),{sw:.8});glow(rh[0],rh[1]-26,14+10*e,GOLD,.4)}});
  moonBall(x-40,GY-80,6);},
education:(x,C,p,e,T)=>{
  Ln([[x+4,GY],[x+4,GY-56]],1.6,WOOD);
  const h=8+44*e;stroke([[x,GY],[x-1,GY-h*.5],[x+2,GY-h]],2,GREEN);for(let k=0;k<Math.floor(h/10);k++){const s=k%2?-1:1;E(x+s*6,GY-8-k*9,5,2.6,LEAF,{sw:.7})}
  Ln([[x+4,GY-h*.6],[x+1,GY-h*.6]],.8,TEXT);
  fig(x-30,{h:36,col:C.lit,hat:'beard',hatc:TEXT,arms:[.2,1.3]});fig(x+30,{h:20,col:pale(C.c,.3),arms:[.3,.9]});
  openBook(x+30,GY-30,7,2);},
element:(x,C,p,e,T,m)=>{const cy=GY-40,r=20+10*(1-e),a0=m/60;
  [[0,'fire'],[1,'water'],[2,'earth'],[3,'air']].forEach(([k,kind])=>{const a=a0+k*TAU/4,px=x+cos(a)*r*1.4,py=cy+sin(a)*r*.8;
    if(kind==='fire')fire(px,py+6,4,T);else if(kind==='water')P([[px,py-7],[px+5,py+1],[px+3,py+5],[px-3,py+5],[px-5,py+1]],SKY,{sw:.9});
    else if(kind==='earth')R(px-5,py-5,10,10,mix(WOOD,GREEN,.3),{sw:.9});else stroke(ell(px,py,5,4,10,0,PI*1.7),1.4,pale(SKY,.5),.2)});
  glow(x,cy,12+14*e,C.c,.2+.3*e);E(x,cy,5,5,pale(C.lit,.3),{sw:.8});},
emotion:(x,C,p,e,T)=>{const beat=1+.08*abs(sin(T*(3+e*5)));const col=mix(C.c,ROSE,.5+.5*sin(T*.7));
  cx.save();cx.translate(x,GY-40);cx.scale(beat,beat);heart(0,0,16,col);cx.restore();glow(x,GY-42,20+16*e,col,.2+.3*e);
  for(let k=0;k<3;k++){const a=frac(T*.5+k/3);cx.save();cx.globalAlpha=(1-a)*(.3+.6*e);cx.strokeStyle=col;cx.lineWidth=1.4;cx.beginPath();cx.arc(x,GY-40,20+a*24,PI*1.15,PI*1.85);cx.stroke();cx.beginPath();cx.arc(x,GY-40,20+a*24,PI*.15,PI*.85);cx.stroke();cx.restore()}},
eternity:(x,C,p,e,T,m)=>{const cy=GY-42,r=24,a0=m/50;
  const pts=[];for(let k=0;k<=28;k++){const a=a0+k/28*TAU*.93;pts.push([x+cos(a)*r,cy+sin(a)*r*.82])}
  snake(pts,5,mix(GREEN,C.c,.4));const ha=a0+TAU*.93;E(x+cos(ha)*r,cy+sin(ha)*r*.82,5.5,4.5,mix(GREEN,C.c,.4),{sw:1});dot(x+cos(ha)*r+1,cy+sin(ha)*r*.82-2,1.2,GOLD);
  glow(x,cy,20+10*e,C.c,.15+.3*e);for(let k=0;k<5;k++){const a=a0*-.5+k*TAU/5;spark4(x+cos(a)*10,cy+sin(a)*8,1.6,.3+.5*e)}},
evolution:(x,C,p,e,T)=>{const k=e;
  Ln([[x,GY],[x,GY-26]],3,WOOD);
  const br=[[x,GY-26,x-22,GY-50,0],[x,GY-26,x+20,GY-48,.1],[x-22,GY-50,x-34,GY-70,.3],[x-22,GY-50,x-12,GY-74,.35],[x+20,GY-48,x+10,GY-72,.4],[x+20,GY-48,x+36,GY-66,.45],[x+36,GY-66,x+44,GY-82,.6],[x-12,GY-74,x-4,GY-90,.65]];
  br.forEach(([a,b,c,d,t0])=>{const t=clamp((k-t0)*2.2);if(t>0){Ln([[a,b],[lerp(a,c,t),lerp(b,d,t)]],2-t0*1.5,WOOD);if(t>.98)E(c,d,4,4,[GREEN,LEAF,C.lit,GOLD][Math.floor(t0*6)%4],{sw:.8})}});
  quad(x+40,{len:12,h:5,leg:3,neck:2,nf:2,hr:3,col:'#8a8a7a',tail:true});},
experience:(x,C,p,e,T)=>{
  for(let k=0;k<6;k++){const t=clamp(e*1.4-k*.12);if(t>0){cx.save();cx.globalAlpha=t;const fx=x-50+k*13,fy=GY-2-(k%2)*4;E(fx,fy,3,1.6,rgba(TEXT,.7),{ink:null});cx.restore()}}
  const lx=x+34;Ln([[lx,GY],[lx,GY-40]],1.6);R(lx-5,GY-52,10,12,lamp(e,.5),{sw:1});Tri(lx,GY-52,14,6,dim(BRASS,.1),{sw:.8});glow(lx,GY-46,10+22*e,GOLD,.15+.45*e);
  fig(x-2+e*14,{h:28,col:C.lit,walk:e*10,arms:[.3,1.1]});},
family:(x,C,p,e,T)=>{
  R(x-30,GY-34,60,34,mix(SAND,NIGHT,.4));P(poly([[x-36,GY-34],[x,GY-58],[x+36,GY-34]],6),dim(C.c,.3));R(x-6,GY-18,12,18,INK,{ink:null});
  R(x-24,GY-28,9,8,lamp(e,.5),{ink:null});R(x+15,GY-28,9,8,lamp(e,.5),{ink:null});glow(x,GY-24,10+20*e,GOLD,.1+.3*e);
  const d=(1-e)*16;fig(x-42+d*.2-0,{h:30,col:C.lit});fig(x+42-d*.2,{h:28,col:pale(ROSE,.2),hat:'veil',hatc:pale(ROSE,.35)});fig(x+lerp(56,30,e),{h:16,col:pale(SKY,.3)});
  if(e>.7)heart(x,GY-66,4,ROSE);},
fate:(x,C,p,e,T,m)=>{
  [[-36,'#8a8fa8'],[0,pale(C.c,.2)],[36,'#5a5468']].forEach(([dx,col],k)=>fig(x+dx,{h:30,col,hat:'veil',hatc:dim(col,.3),arms:[k===2?1.2:.4,k===0?1.4:1.0]}));
  const sx=x-30,sy=GY-26;Ln([[sx,sy],[sx,sy+14]],1.4,WOOD);E(sx,sy+10,3,5,mix(SAND,TEXT,.3),{sw:.8});
  const len=e*60;const pts=[];for(let k=0;k<=10;k++){const t=k/10;pts.push([sx+t*len,sy-6+sin(t*8+m/20)*3])}if(len>2)stroke(pts,.9,GOLD,.2);
  const cut=e>.85,scx=x+30,scy=GY-24;const o=cut?.05:.4;Ln([[scx-6,scy-cos(o)*6],[scx+6,scy+cos(o)*6]],1.6,'#aab0c8');Ln([[scx-6,scy+cos(o)*6],[scx+6,scy-cos(o)*6]],1.6,'#aab0c8');if(cut)spark4(scx-6,scy,3,.8);},
form:(x,C,p,e,T)=>{const iy=GY-74;
  glow(x,iy,14+24*e,GOLD,.25+.4*e);cx.strokeStyle=GOLD;cx.lineWidth=2;cx.beginPath();cx.arc(x,iy,10,0,TAU);cx.stroke();
  for(let k=0;k<4;k++){const bx=x-36+k*24,t=clamp(e*1.3-k*.08),by=lerp(GY-10,GY-30,t);const Q=[];for(let i=0;i<12;i++){const a=i*TAU/12,r=8+(1-t)*(hash(k,i)-.5)*8;Q.push([bx+cos(a)*r,by+sin(a)*r])}P(Q,mix(STONE,GOLD,t*.3),{sw:1,j:.6});
    cx.save();cx.globalAlpha=.25*t;Ln([[bx,by-8],[x,iy+10]],1,GOLD);cx.restore()}},
god:(x,C,p,e,T)=>{const cy=GY-60;
  for(let k=0;k<12;k++){const a=-PI+k*PI/11,len=20+40*e;beam(x,cy,a+PI/2,len,6,GOLD,.12+.2*e)}
  glow(x,cy,26+30*e,GOLD,.35+.4*e);E(x,cy,10,10,mix(GOLD,TEXT,.5),{ink:null});
  cloud(x-28,cy+22,9,pale(C.lit,.4));cloud(x+28,cy+20,10,pale(C.lit,.4));},
good:(x,C,p,e,T)=>{
  P(poly([[x-4,GY],[x-56,GY-14],[x-56,GY-6]],5),mix(SAND,NIGHT,.2+.5*(1-e)),{sw:1});P(poly([[x+4,GY],[x+56,GY-14],[x+56,GY-6]],5),dim(STONE,.6),{sw:1});
  sunDisk(x-46,GY-60,7,GOLD,e);glow(x-36,GY-30,20+30*e,GOLD,.1+.3*e);
  cloud(x+42,GY-56,9,dim(STONE,.4));for(let k=0;k<3;k++){const a=frac(T*.8+k/3);dot(x+36+k*6,GY-50+a*30,1,SKY)}
  fig(x,{h:30,col:C.lit,arms:[.3+e*.8,.3]});},
government:(x,C,p,e,T,m)=>{
  const Q=[];for(let k=0;k<=12;k++){const xx=x-56+k*112/12;Q.push([xx,GY-2+sin(k*1.3+T*2.4)*1.8])}P([...Q,[x+56,GY+2],[x-56,GY+2]],dim(WATER,.3),{ink:null});Ln(Q,1.2,pale(SKY,.3));
  cx.save();cx.translate(x,GY-6+sin(T*1.8)*1.5);cx.rotate(sin(T*1.3)*.04*(1-e));
  Ln([[0,-10],[0,-58]],1.6);P(poly([[2,-56],[24,-40],[24,-16],[2,-16]],6),pale(C.lit,.3));P(poly([[-2,-50],[-18,-34],[-18,-18],[-2,-18]],6),pale(C.lit,.2));
  P(poly([[-40,-14],[38,-14],[28,0],[-30,0]],8),WOOD);wheel(-26,-22,6,m/20,BRASS,8);fig(-26,{y:-14,h:14,col:C.c});cx.restore();},
habit:(x,C,p,e,T,m)=>{const cy=GY-10;
  cx.save();cx.strokeStyle=rgba(SAND,.25+.5*e);cx.lineWidth=4+4*e;cx.beginPath();cx.ellipse(x,cy,42,10,0,0,TAU);cx.stroke();cx.restore();
  for(let k=0;k<10;k++){const a=k*TAU/10;Ln([[x+cos(a)*52,cy+sin(a)*13],[x+cos(a)*53,cy+sin(a)*13-6]],1,GREEN)}
  const a=m/26,fx=x+cos(a)*42,fy=cy+sin(a)*10;fig(fx,{y:fy,h:22+sin(a)*3,col:C.lit,walk:m/4,arms:[.3,.3]});},
happiness:(x,C,p,e,T)=>{
  sunDisk(x+36,GY-78,8,GOLD,p);
  const turn=e;stroke([[x,GY],[x+2,GY-30],[x+4+turn*4,GY-56]],2.4,GREEN);E(x-8,GY-24,7,3,LEAF,{sw:.8});E(x+10,GY-34,7,3,LEAF,{sw:.8});
  const hx2=x+4+turn*6,hy=GY-62-turn*2;glow(hx2,hy,12+18*e,GOLD,.2+.3*e);
  for(let k=0;k<12;k++){const a=k*TAU/12,o=.4+.6*e;E(hx2+cos(a)*9*o+cos(a)*3,hy+sin(a)*9*o+sin(a)*3,4*o+1,2,GOLD,{sw:.6,j:.3})}E(hx2,hy,6,6,'#6a4a2a',{sw:.8});
  fig(x-34,{h:26,col:C.lit,arms:[2.4+sin(T*4)*.2*e,2.4-sin(T*4)*.2*e]});},
history:(x,C,p,e,T)=>{const w=10+80*e;
  R(x-w/2,GY-38,w,26,pale(SAND,.45),{sw:1.1});E(x-w/2,GY-25,4,14,dim(SAND,.1),{sw:1});E(x+w/2,GY-25,4,14,dim(SAND,.1),{sw:1});
  cx.save();cx.beginPath();cx.rect(x-w/2+3,GY-36,w-6,22);cx.clip();
  Tri(x-28,GY-16,14,12,SAND,{sw:.8});columnP(x-12,GY-16,12,STONE,3);columnP(x-6,GY-16,12,STONE,3);R(x+2,GY-30,8,14,STONE,{sw:.8});Tri(x+6,GY-30,10,6,RED,{sw:.6});R(x+18,GY-34,4,18,'#6a6a7a',{sw:.6});R(x+26,GY-28,5,12,'#6a6a7a',{sw:.6});
  cx.restore();hourglass(x,GY-44,20,e,BRASS);},
honor:(x,C,p,e,T)=>{
  columnP(x,GY,20,pale(STONE,.2),18);bust0(x,GY-20,16,MARBLE);
  const wy=lerp(GY-96,GY-46,e);laurel(x,wy+4,9,GREEN);if(e>.95)glow(x,GY-40,24,GOLD,.4);
  for(let k=0;k<2;k++)flagOn(x+(k?40:-40),GY,46,[C.c],T,k,false,12);},
hypothesis:(x,C,p,e,T)=>{
  P(poly([[x-56,GY],[x-56,GY-30],[x-24,GY-30],[x-18,GY]],6),dim(STONE,.2));P(poly([[x+56,GY],[x+56,GY-30],[x+24,GY-30],[x+18,GY]],6),dim(STONE,.2));
  const len=e*48;if(len>2)R(x-24,GY-33,len,4,WOOD,{sw:1});
  const fx=e>.95?x+10:x-34;fig(fx,{y:GY-30,h:20,col:C.lit,arms:[.3,1.2],walk:e*8});
  if(e<.95){cx.save();cx.globalAlpha=.6;Ln([[x-16,GY-50],[x-16,GY-60]],1.2,GOLD);dot(x-16,GY-46,1.2,GOLD);cx.restore()}else glow(x+10,GY-46,14,GOLD,.4);},
idea:(x,C,p,e,T,m)=>{
  thick([[x-30,GY],[x-16,GY-14]],4,SKIN);P(poly([[x-20,GY-14],[x+8,GY-20],[x+14,GY-16],[x-4,GY-10],[x-16,GY-8]],5),SKIN,{sw:1.1});
  const cy=GY-52-e*6,s=8+8*e,a=m/40+e*1.2;glow(x+2,cy,14+28*e,GOLD,.25+.45*e);
  const Q=[];for(let k=0;k<6;k++){const an=a+k*TAU/6;Q.push([x+2+cos(an)*s,cy+sin(an)*s*.9])}
  P(Q,mix(GOLD,TEXT,.3*e),{sw:1.2,ink:mix(GOLD,TEXT,.5)});for(let k=0;k<3;k++)Ln([Q[k],Q[k+3]],.8,rgba(INK,.4));
  for(let k=0;k<3;k++)beam(x+2,cy,a*2+k*TAU/3,10+20*e,4,GOLD,.1+.15*e);
  if(e>.3)sparks(x+2,cy,T,6,9,e,40,30);},
immortality:(x,C,p,e,T)=>{
  for(let k=0;k<4;k++)fire(x-12+k*8,GY,4+3*(1-e),T,'#ff7a3a');
  const py=GY-14-e*50,fl=sin(T*7)*.7;
  glow(x,py,16+20*e,'#ff9b4a',.3+.3*e);
  for(const s of[-1,1])P(poly([[x,py],[x+s*30,py-12-fl*10],[x+s*24,py-2],[x+s*36,py+4],[x+s*8,py+6]],6),mix('#ff9b4a',GOLD,.4),{sw:1});
  E(x,py+2,5,8,'#ff7a3a',{sw:1});E(x,py-8,3.6,3.6,'#ff9b4a',{sw:.8});
  stroke([[x,py+8],[x-6,py+20],[x+2,py+28]],3,'#ff7a3a',.4);stroke([[x,py+8],[x+6,py+22]],2,GOLD,.4);},
induction:(x,C,p,e,T)=>{
  sea(x,120,GY-4,C.c,T);
  for(let k=0;k<5;k++){const t=clamp(e*1.5-k*.12);if(t>0){cx.save();cx.globalAlpha=t;swan(x-44+k*20,GY-4+sin(T*1.5+k)*1,6,k===4?'#2a2a3a':pale(TEXT,.05));cx.restore()}}},
infinity:(x,C,p,e,T,m)=>{const cy=GY-44;
  for(let k=7;k>=0;k--){const s=frac(k/8+m/400),sc=lerp(1.2,.08,s);cx.save();cx.globalAlpha=1-s*.7;R(x-30*sc,cy-36*sc,60*sc,72*sc,null,{sw:1.4,ink:mix(C.lit,GOLD,s)});cx.restore()}
  figure8(x,GY-8,22,6,.15+.85*e,GOLD,1.8);glow(x,cy,12,GOLD,.3+.3*e);},
judgment:(x,C,p,e,T)=>{
  R(x-30,GY-14,60,14,WOOD,{sw:1.2});R(x-12,GY-20,24,6,mix(WOOD,NIGHT,.2),{sw:1});
  const a=-.9+clamp(e*1.3)*.9;cx.save();cx.translate(x+34,GY-30);cx.rotate(-a);Ln([[0,0],[-34,0]],3.4,WOOD);R(-46,-9,18,18,mix(WOOD,NIGHT,.05),{sw:1.2});R(-50,-9,4,18,BRASS,{sw:.8});cx.restore();
  if(e>.75){rings(x-4,GY-12,T,GOLD,3,26,.6*(e-.75)*4);glow(x-4,GY-12,10,GOLD,.4)}
  openBook(x-30,GY-12,10,2);},
justice:(x,C,p,e,T)=>{const tilt=(1-e)*.4;
  Ln([[x,GY],[x,GY-62]],2,BRASS);R(x-10,GY-3,20,3,BRASS,{sw:1});
  const w=26,lx=x-cos(tilt)*w,ly=GY-62+sin(tilt)*w,rx=x+cos(tilt)*w,ry=GY-62-sin(tilt)*w;Ln([[lx,ly],[rx,ry]],1.8);
  [[lx,ly],[rx,ry]].forEach(([px,py],k)=>{Ln([[px,py],[px-8,py+16]],.8);Ln([[px,py],[px+8,py+16]],.8);Bowl(px,py+16,9,4,BRASS,{sw:1});if(k)E(px,py+12,3,3,GOLD,{sw:.6});else heart(px,py+10,3,RED)});
  dot(x,GY-62,2.2,GOLD);if(e>.9)glow(x,GY-62,16,GOLD,.4);},
knowledge:(x,C,p,e,T)=>{
  openBook(x,GY-4,30,4);
  const lx=x,ly=GY-40;P(poly([[lx-14,ly],[lx+12,ly],[lx+20,ly-4],[lx+12,ly-8],[lx-10,ly-8]],5),BRASS,{sw:1});Ln([[lx-14,ly-4],[lx-20,ly-8]],1.4,BRASS);
  fire(lx+20,ly-4,2+4*e,T);glow(lx+20,ly-10,14+30*e,GOLD,.2+.4*e);
  for(let k=0;k<5;k++)beam(x,GY-14,-.8+k*.4,30+30*e,5,GOLD,.05+.1*e);},
labor:(x,C,p,e,T)=>{
  R(x+2,GY-14,30,8,'#4a4a5a',{sw:1});R(x+10,GY-6,14,6,'#3a3a4a',{sw:1});P(poly([[x+32,GY-14],[x+42,GY-12],[x+32,GY-10]],3),'#4a4a5a',{sw:.8});
  R(x+8,GY-17,18,3,mix('#ff7a3a',GOLD,.4),{ink:null});glow(x+17,GY-16,10,'#ff7a3a',.4);
  const hit=abs(sin(T*3))*(.3+.7*e);const a=-1.4+hit*1.3;
  const f=fig(x-18,{h:34,col:C.lit,arms:[.3,PI/2+a*.9]});cx.save();cx.translate(f.rh[0],f.rh[1]);cx.rotate(-a);Ln([[0,0],[18,0]],2,WOOD);R(16,-5,8,10,'#6a6a7a',{sw:.9});cx.restore();
  if(hit>.9)sparks(x+17,GY-18,T*4,6,3,1,20,16,'#ff9b4a');},
language:(x,C,p,e,T)=>{
  fig(x-38,{h:30,col:C.lit,f:1,arms:[.2,1.1]});fig(x+38,{h:30,col:pale(ROSE,.2),f:-1,arms:[1.1,.2]});
  for(let k=0;k<4;k++){const a=frac(T*.4+k/4),rev=k%2;if(e<.1)continue;const px=rev?lerp(x+28,x-28,a):lerp(x-28,x+28,a),py=GY-30-sin(a*PI)*24;cx.save();cx.globalAlpha=e*(1-abs(a-.5)*1.2);
    [()=>star5(px,py,4,GOLD,{sw:.6}),()=>Tri(px,py+3,7,7,SKY,{sw:.6}),()=>stroke(ell(px,py,4,4,8,0,PI*1.6),1.4,ROSE,.2),()=>R(px-3,py-3,6,6,C.lit,{sw:.6})][k]();cx.restore()}},
law:(x,C,p,e,T)=>{
  [[-17,0],[17,1]].forEach(([dx,k])=>{P([...ell(x+dx,GY-54,15,10,10,PI,TAU),[x+dx+15,GY],[x+dx-15,GY]],mix(STONE,NIGHT,.1),{sw:1.3});
    const n=Math.floor(e*5);for(let r=0;r<5;r++){const on=r<n;Ln([[x+dx-9,GY-48+r*9],[x+dx+9,GY-48+r*9]],1.2,on?GOLD:rgba(TEXT,.15))}});
  glow(x,GY-30,30,GOLD,.08+.25*e);},
liberty:(x,C,p,e,T)=>{
  const cx2=x-14;Ln([[cx2,GY-70],[cx2,GY-62]],1.2,BRASS);P([...ell(cx2,GY-40,18,22,12,PI,TAU),[cx2+18,GY-14],[cx2-18,GY-14]],null,{sw:1.4,ink:BRASS});for(let k=-2;k<=2;k++)Ln([[cx2+k*7,GY-58+abs(k)*3],[cx2+k*7,GY-14]],1,BRASS);R(cx2-20,GY-14,40,4,BRASS,{sw:1});
  const d=e*1.4;cx.save();cx.translate(cx2+18,GY-20);cx.rotate(-min(1.4,d));R(0,-22,2,22,BRASS,{ink:null});for(let k=0;k<3;k++)R(0,-20+k*7,10,1.4,BRASS,{ink:null});cx.restore();
  const t=e,bx=lerp(cx2,x+48,t),by=lerp(GY-30,GY-84,t);if(t<.2){E(bx,by,4,3.4,SKY,{sw:.8});dot(bx+3,by-1,1,INK)}else bird(bx,by,6,SKY,T);if(t>.2)sparks(bx,by,T,3,4,t,20,10,SKY);},
life:(x,C,p,e,T)=>{
  const h=30-e*12;R(x-30,GY-h,10,h,pale(TEXT,.1),{sw:1});fire(x-25,GY-h,3.4,T);glow(x-25,GY-h-4,16,GOLD,.3);
  for(let k=0;k<3;k++){const a=frac(T*.12+k/3);cx.save();cx.globalAlpha=1-a;E(x+10+sin(a*8+k)*8,GY-70+a*66,3,1.8,['#c98b4a',GOLD,RED][k],{ink:null});cx.restore()}
  const g=e;stroke([[x+28,GY],[x+28,GY-4-g*26]],1.6,GREEN);if(g>.2){E(x+24,GY-10-g*16,4*g+1,2,LEAF,{sw:.6});E(x+32,GY-14-g*18,4*g+1,2,LEAF,{sw:.6})}if(g>.8){lotus_(x+28,GY-32,5*g)}E(x+28,GY,5,2,WOOD,{sw:.8});},
logic:(x,C,p,e,T)=>{const cy=GY-40,d=(1-e)*16+12;
  const P3=[[x-d,cy+6],[x+d,cy+6],[x,cy-d*.9]];
  if(e>.6){cx.save();cx.beginPath();cx.arc(...P3[0],18,0,TAU);cx.clip();cx.beginPath();cx.arc(...P3[1],18,0,TAU);cx.clip();cx.beginPath();cx.arc(...P3[2],18,0,TAU);cx.clip();cx.fillStyle=rgba(GOLD,.5*(e-.6)*2.5);cx.fillRect(x-40,cy-40,80,80);cx.restore();glow(x,cy,10,GOLD,.4*(e-.6)*2.5)}
  P3.forEach((pt,k)=>{cx.save();cx.strokeStyle=[C.lit,ROSE,SKY][k];cx.lineWidth=2;cx.beginPath();cx.arc(pt[0]+jit(.4),pt[1]+jit(.4),18,0,TAU);cx.stroke();cx.restore()});},
love:(x,C,p,e,T)=>{
  Ln([[x-56,GY-40],[x+40,GY-46]],2.4,WOOD);E(x+40,GY-48,10,6,LEAF,{sw:1});
  const d=(1-e)*16;[[-1,'#ff8aa8'],[1,SKY]].forEach(([s,col])=>{const bx=x+s*(6+d),by=GY-50;E(bx,by,7,5,col,{sw:1});E(bx+s*-5,by-5,4,4,col,{sw:1});P(poly([[bx-s*8,by-5],[bx-s*12,by-4],[bx-s*8,by-3]],2),GOLD,{sw:.5});dot(bx-s*5,by-6,1,INK);Ln([[bx,by+5],[bx,by+9]],.8)});
  if(e>.7){heart(x,GY-70-sin(T*2)*2,5,ROSE);glow(x,GY-68,14,ROSE,.4)}},
man:(x,C,p,e,T)=>{const cy=GY-44;
  cx.save();cx.strokeStyle=rgba(C.lit,.8);cx.lineWidth=1.6;cx.beginPath();cx.arc(x,cy,34,0,TAU*e);cx.stroke();cx.restore();
  R(x-27,cy-27,54,54,null,{sw:1.4,ink:rgba(GOLD,.8)});
  const s=e;const sh=[x,cy-14];E(x,cy-22,5,5.5,pale(SKIN,.2),{sw:1});Ln([[x,cy-16],[x,cy+8]],2.6,pale(SKIN,.2));
  for(const k of[-1,1]){Ln([[x,cy-12],[x+k*lerp(12,30,s),cy-12-lerp(-14,8,s)]],2,pale(SKIN,.2));Ln([[x,cy+8],[x+k*lerp(4,20,s),cy+lerp(26,24,s)]],2,pale(SKIN,.2))}},
mathematics:(x,C,p,e,T)=>{
  const A=[x-12,GY-30],B=[x+12,GY-30],Cc=[x-12,GY-48];
  const sq=(a,b,n,col,t)=>{if(t<=0)return;cx.save();cx.globalAlpha=t;P(poly([a,b,[b[0]+n[0]*t,b[1]+n[1]*t],[a[0]+n[0]*t,a[1]+n[1]*t]],5),rgba(col,.3),{sw:1.2,ink:col,j:.4});cx.restore()};
  sq(A,B,[0,24],GOLD,clamp(e*1.4));sq(A,Cc,[-18,0],SKY,clamp(e*1.4-.2));sq(B,Cc,[18,-24],ROSE,clamp(e*1.4-.4));
  P(poly([A,B,Cc],5),pale(C.lit,.2),{sw:1.5,j:.4});dot(A[0]+3,A[1]-3,1.2,INK);
  Ln([[x+40,GY],[x+48,GY-40]],1.4,BRASS);Ln([[x+56,GY],[x+48,GY-40]],1.4,BRASS);dot(x+48,GY-40,2,BRASS);},
matter:(x,C,p,e,T)=>{const cy=GY-38;
  for(let k=0;k<16;k++){const gx=(k%4-1.5)*14,gy=(Math.floor(k/4)-1.5)*12;const a=hash(k,1)*TAU,r=24+hash(k,2)*14;
    const px=lerp(x+cos(a)*r*1.3,x+gx,e)+sin(T*(5+k)+k)*(2.5*(1-e)+.6),py=lerp(cy+sin(a)*r*.8,cy+gy,e)+cos(T*(4+k)+k)*(2*(1-e)+.5);
    if(e>.6&&k%4<3){cx.save();cx.globalAlpha=(e-.6)*1.5;Ln([[px,py],[px+14,py]],.8,rgba(TEXT,.5));cx.restore()}
    if(e>.6&&k<12){cx.save();cx.globalAlpha=(e-.6)*1.5;Ln([[px,py],[px,py+12]],.8,rgba(TEXT,.5));cx.restore()}
    E(px,py,3.6,3.6,[C.lit,STONE,SKY,pale(C.c,.4)][k%4],{sw:.8})}
  if(e>.8)glow(x,cy,26,C.c,.25*(e-.8)*5);},
mechanics:(x,C,p,e,T)=>{
  Tri(x-6,GY,14,14,BRASS,{sw:1});const a=lerp(.22,-.22,e);cx.save();cx.translate(x-6,GY-14);cx.rotate(a);R(-48,-2.5,96,5,WOOD,{sw:1.1});cx.restore();
  const lx=x-6+cos(a)*42,ly=GY-14+sin(a)*42;globe(lx,ly-11,10,T);
  const rx=x-6-cos(a)*42,ry=GY-14-sin(a)*42;fig(rx,{y:ry,h:22,col:C.lit,arms:[2.2,2.2]});},
medicine:(x,C,p,e,T)=>{
  Ln([[x-8,GY],[x-8,GY-72]],2.6,WOOD);
  const n=Math.floor(4+e*10);const pts=[];for(let k=0;k<=n;k++){const t=k/14;pts.push([x-8+sin(t*TAU*2.2)*8,GY-4-t*66])}snake(pts,3.4,mix(GREEN,C.c,.3));const hd=pts[pts.length-1];E(hd[0],hd[1],4,3,mix(GREEN,C.c,.3),{sw:.9});dot(hd[0]+1,hd[1]-1,1,GOLD);
  Bowl(x+28,GY-6,12,8,STONE,{sw:1.1});Ln([[x+28,GY-10],[x+38,GY-26]],2.4,STONE);for(let k=0;k<3;k++)E(x+20+k*8,GY-14,3,1.6,LEAF,{sw:.5});glow(x+28,GY-12,10+12*e,GREEN,.2+.3*e);},
memory:(x,C,p,e,T)=>{
  R(x-48,GY-34,40,34,C.shade);for(let r=0;r<2;r++)for(let c=0;c<3;c++)R(x-44+c*12,GY-30+r*14,8,10,lamp(clamp(e*2-(r*3+c)*.15),.55),{ink:null,j:.3});Tri(x-28,GY-34,44,14,C.base);
  const k=e;if(k>.05){cx.save();cx.globalAlpha=k;cloud(x+26,GY-58,12,pale(SKY,.35));cx.restore();for(let i=0;i<3;i++)E(x+4-i*6,GY-36+i*6,2.5-i*.5,2.5-i*.5,pale(SKY,.35),{sw:.8})}
  if(k>.4){const s=clamp((k-.4)*1.7);cx.save();cx.globalAlpha=s;quad(x+26,{y:GY-52,len:18,h:7,leg:5,neck:6,nf:3,hr:3.4,col:TEXT,mane:pale(SKY,.4),tail:true});eagle(x+24,GY-66,3,pale(SKY,.5),.6+sin(T*6)*.3);cx.restore()}},
metaphysics:(x,C,p,e,T)=>{
  const h=20+70*e;Ln([[x-8,GY],[x-6,GY-h]],1.8,WOOD);Ln([[x+8,GY],[x+6,GY-h]],1.8,WOOD);for(let k=0;k<h/9;k++)Ln([[x-7,GY-6-k*9],[x+7,GY-6-k*9]],1.2,WOOD);
  for(let k=0;k<6;k++){const a=k*TAU/6+T*.1;spark4(x+cos(a)*24,GY-h-6+sin(a)*10,1.6,.4+.6*e,k%2?TEXT:GOLD)}
  glow(x,GY-h,14+20*e,C.c,.2+.3*e);fig(x-24,{h:24,col:C.lit,arms:[.2,2.4]});},
mind:(x,C,p,e,T)=>{const hx2=x,hy=GY-46;
  P([[hx2-20,GY],[hx2-22,hy+10],[hx2-26,hy-4],[hx2-20,hy-22],[hx2-4,hy-30],[hx2+14,hy-26],[hx2+24,hy-12],[hx2+22,hy+2],[hx2+28,hy+10],[hx2+20,hy+14],[hx2+18,GY]],dim(C.base,.3),{sw:1.3});
  const N=[[-10,-14],[0,-20],[10,-12],[-4,-4],[8,0],[-14,0],[2,8],[14,-22]].map(([a,b])=>[hx2+a,hy+b]);
  const ed=[[0,1],[1,2],[0,3],[3,4],[2,4],[3,5],[4,6],[1,7],[5,6]];
  ed.forEach(([a,b],k)=>{if(e>k/10){cx.save();cx.globalAlpha=.8;Ln([N[a],N[b]],.9,SKY);cx.restore()}});
  N.forEach((n,k)=>{const on=e>k/9;dot(n[0],n[1],on?2.2:1.2,on?SKY:rgba(TEXT,.3));if(on)glow(n[0],n[1],6,SKY,.4)});
  const d=frac(T*.7);if(e>.5){const [a,b]=ed[Math.floor(T*1.3)%ed.length];dot(lerp(N[a][0],N[b][0],d),lerp(N[a][1],N[b][1],d),1.6,GOLD)}},
monarchy:(x,C,p,e,T)=>{
  R(x-18,GY-46,36,46,mix(RED,NIGHT,.35));P(poly([[x-18,GY-46],[x-14,GY-60],[x+14,GY-60],[x+18,GY-46]],5),mix(RED,NIGHT,.35));R(x-22,GY-24,44,6,mix(GOLD,NIGHT,.3),{sw:1});R(x-14,GY-40,28,16,mix(RED,NIGHT,.2),{ink:null});
  const cy=lerp(GY-96,GY-62,e);crownP(x,cy,9);glow(x,cy-4,12+14*e,GOLD,.25+.35*e);
  for(let k=0;k<2;k++)flagOn(x+(k?44:-44),GY,52,[C.c,GOLD],T,k,true,12);},
nature:(x,C,p,e,T,m)=>{
  sunDisk(x+40,GY-60-e*20,8,GOLD,e);
  P(poly([[x-56,GY],[x-30,GY-56],[x-14,GY-40],[x+4,GY-66],[x+30,GY-30],[x+56,GY]],10),dim(GREEN,.35));P(poly([[x+4,GY-66],[x-4,GY-56],[x+12,GY-56]],4),SNOW,{sw:.8});
  stroke([[x+4,GY-56],[x-4,GY-30],[x+10,GY-14],[x-6,GY]],3,SKY,.4);for(let k=0;k<3;k++){const t=frac(m/80+k/3);dot(lerp(x+4,x-6,t)+sin(t*8)*6,lerp(GY-56,GY,t),1.4,pale(SKY,.6))}
  tree(x-40,30,LEAF,'pine');tree(x+34,26,LEAF,'round');},
necessity:(x,C,p,e,T)=>{
  R(x-56,GY-70,22,5,WOOD,{sw:1});Ln([[x-52,GY-66],[x-52,GY]],2.4,WOOD);chain(x-40,GY-62,x-40,GY-16,7);E(x-40,GY-10,7,6,'#6a6a7a',{sw:1});
  const t=e,cy=GY-12-sin(t*PI)*46,cs=abs(cos(t*PI*5));cx.save();cx.translate(x+24,cy);cx.scale(Math.max(.1,cs),1);E(0,0,10,10,GOLD,{sw:1.2});dot(0,0,3,dim(GOLD,.3));cx.restore();
  if(t>.98)glow(x+24,cy,14,GOLD,.4);fig(x+46,{h:24,col:C.lit,arms:[.2,1.6]});},
oligarchy:(x,C,p,e,T)=>{
  const h=10+30*e;for(let r=0;r<Math.ceil(h/6);r++)for(let k=0;k<6-r;k++)E(x-15+k*6+r*3,GY-3-r*5,3.4,2,GOLD,{sw:.6,j:.3});glow(x,GY-h,14+14*e,GOLD,.2+.2*e);
  for(let k=0;k<3;k++)fig(x-6+k*6,{y:GY-h,h:16,col:mix(C.c,GOLD,.3),hat:k===1?'crown':null});
  crowd(x-56,x-24,GY,3,dim(C.base,.2),T,4,12);crowd(x+24,x+56,GY,3,dim(C.base,.2),T,8,12);},
one:(x,C,p,e,T,m)=>{const cy=GY-40,k=e;
  for(let i=0;i<9;i++){const a=i*TAU/9+m/80,r=lerp(32,0,k),s=lerp(6,0,k);if(s>.5)E(x+cos(a)*r,cy+sin(a)*r*.8,s,s,[C.lit,ROSE,SKY,GOLD][i%4],{sw:.8})}
  const s2=lerp(4,16,k);E(x,cy,s2,s2,mix(C.lit,GOLD,k),{sw:1.2});glow(x,cy,s2*2,GOLD,.15+.3*k);},
opinion:(x,C,p,e,T)=>{
  const a=T*(1+e*3)+sin(T*.7)*2;weathervane(x,GY,a);
  for(let k=0;k<4;k++){const t=frac(T*.5+k/4);cx.save();cx.globalAlpha=(1-t)*.6;stroke([[x-50+t*100,GY-60+k*8],[x-40+t*100,GY-62+k*8],[x-30+t*100,GY-60+k*8]],1,pale(SKY,.4),.3);cx.restore()}
  crowd(x-50,x-20,GY,3,C.lit,T,2,13);crowd(x+22,x+52,GY,3,pale(ROSE,.2),T,6,13);},
opposition:(x,C,p,e,T)=>{const l=abs(sin(e*PI*2))*(e<.98?1:0)+(e>.98?1:0)*.0;
  ram(x-24,GY,1,pale(TEXT,.1),e);ram(x+24,GY,-1,mix(STONE,NIGHT,.1),e);
  if(e>.9)spark4(x,GY-22,5,1);if(e>.9)glow(x,GY-22,10,GOLD,.5);},
philosophy:(x,C,p,e,T)=>{
  R(x-56,GY-60,112,5,C.base,{sw:1});for(let k=0;k<5;k++)columnP(x-50+k*25,GY,55,pale(C.base,.15),6);
  fig(x-10,{h:34,col:pale(ROSE,.2),hat:'beard',hatc:TEXT,arms:[.3,PI*.5+e*.9],f:1});fig(x+12,{h:34,col:pale(SKY,.2),hat:'beard',hatc:'#8a7a6a',arms:[.3+e*1.1,.3],f:-1});
  if(e>.6){beam(x-10+sin(PI*.5+e*.9)*12,GY-32,0,30,6,GOLD,.2)}},
physics:(x,C,p,e,T,m)=>{
  R(x-34,GY-62,68,4,BRASS,{sw:1});Ln([[x-30,GY-58],[x-30,GY]],1.6,BRASS);Ln([[x+30,GY-58],[x+30,GY]],1.6,BRASS);
  const sw=sin(T*3.2)*(.2+.6*e);
  for(let k=0;k<5;k++){const bx=x-16+k*8;let a=0;if(k===0&&sw<0)a=sw;if(k===4&&sw>0)a=sw;const px=bx+sin(a)*34,py=GY-58+cos(a)*34;Ln([[bx-3,GY-58],[px,py]],.6,rgba(TEXT,.6));Ln([[bx+3,GY-58],[px,py]],.6,rgba(TEXT,.6));E(px,py,4,4,'#c9ccd8',{sw:.9})}},
pleasure:(x,C,p,e,T)=>{
  Ln([[x-30,GY-70],[x-30,GY-50]],1,WOOD);for(let k=0;k<9;k++){const r=Math.floor(k/3),c=k%3;E(x-36+c*6+r*1,GY-46+r*6,3.6,3.6,mix('#9b5bd6',ROSE,.2),{sw:.7,j:.3})}glow(x-30,GY-40,10+14*e,'#c08aff',.2+.3*e);
  stroke([[x+10,GY],[x+20,GY-30],[x+34,GY-56]],2,WOOD);for(let k=0;k<5;k++){const t=k/5,px=lerp(x+10,x+34,t)+5,py=lerp(GY,GY-56,t);P(poly([[px-1,py],[px+5,py-2],[px-1,py-3]],2),dim(WOOD,.2),{sw:.6})}
  fig(x,{h:26,col:C.lit,arms:[1.2+e*.5,.8+e*.4]});if(e>.7){spark4(x-30,GY-44,3,1);spark4(x+18,GY-24,3,1,RED)}},
poetry:(x,C,p,e,T)=>{
  lyre(x,GY-4,24,T*(.3+e));glow(x,GY-30,20+20*e,GOLD,.1+.3*e);
  for(let k=0;k<4;k++){const a=frac(T*.3+k/4);if(e>.05){cx.save();cx.globalAlpha=(1-a)*e;note(x+(k-1.5)*14+sin(a*6+k)*4,GY-50-a*40);cx.restore()}}
  laurel(x,GY-6,30,dim(GREEN,.1),PI*.05,PI*.4);},
principle:(x,C,p,e,T)=>{
  R(x-16,GY-14,32,14,mix(GOLD,STONE,.5),{sw:1.3});glow(x,GY-8,14,GOLD,.3);
  const h=e*60;for(let r=0;r<h/10;r++){const w=60-r*6;R(x-w/2,GY-24-r*10,w,10,mix(STONE,NIGHT,.1+r*.04),{sw:1})}
  if(e>.9){Tri(x,GY-24-h,30,14,C.base);flagOn(x,GY-38-h,10,[C.c],T,0,false,10)}},
progress:(x,C,p,e,T)=>{
  for(let k=0;k<6;k++)R(x-48+k*16,GY-8-k*10,18,8+k*10,mix(STONE,C.c,.15+k*.06),{sw:1});
  const st=Math.min(5,Math.floor(e*6)),fp=e*6-st;const fx=x-40+st*16+fp*16,fy=GY-8-st*10-(fp>.5?10:0);
  fig(fx,{y:fy,h:22,col:C.lit,walk:e*20,arms:[.4,1.4]});
  sunDisk(x+50,GY-80,7,GOLD,e);beam(x+50,GY-80,PI*1.2,40,10,GOLD,.15*e);},
prophecy:(x,C,p,e,T,m)=>{
  Ln([[x-16,GY],[x-4,GY-28]],1.6,BRONZE);Ln([[x+16,GY],[x+4,GY-28]],1.6,BRONZE);Ln([[x,GY],[x,GY-28]],1.6,BRONZE);Bowl(x,GY-28,14,6,BRONZE,{sw:1.1});
  for(let k=0;k<6;k++){const a=frac(T*.15+k/6);cx.save();cx.globalAlpha=(1-a)*.5;E(x+sin(a*5+k)*8*a,GY-34-a*50,4+a*10,3+a*6,rgba(pale(C.c,.4),.6),{ink:null});cx.restore()}
  if(e>.4){const s=clamp((e-.4)*1.7);cx.save();cx.globalAlpha=s;eye(x,GY-74,10,s,TEXT,C.c);cx.restore();glow(x,GY-74,20*s,C.c,.4*s)}
  fig(x+38,{h:30,pose:'sit',col:pale(C.c,.2),hat:'veil',hatc:pale(C.c,.35),f:-1});},
prudence:(x,C,p,e,T)=>{
  R(x-22,GY-72,6,72,WOOD);P(poly([[x-16,GY-66],[x+18,GY-62],[x+24,GY-56],[x+18,GY-50],[x-16,GY-54]],4),WOOD,{sw:1});P(poly([[x-22,GY-40],[x-54,GY-36],[x-58,GY-30],[x-54,GY-24],[x-22,GY-28]],4),WOOD,{sw:1});
  const f=fig(x+20,{h:32,col:C.lit,arms:[.3,1.3],hold:(rh)=>{Ln([rh,[rh[0],rh[1]+6]],1);R(rh[0]-3,rh[1]+6,6,7,lamp(.7),{sw:.8})}});glow(f.rh[0],f.rh[1]+9,14+10*e,GOLD,.3+.2*e);
  if(e>.5)beam(x+30,GY-18,PI*.42,50*(e-.5)*2,10,GOLD,.15);},
punishment:(x,C,p,e,T)=>{
  R(x-30,GY-60,60,60,mix(STONE,NIGHT,.3));R(x-16,GY-52,32,40,'#1a1830',{ink:null});
  const k=e;for(let i=0;i<5;i++){const bx=x-14+i*7;Ln([[bx,GY-52],[bx,GY-52+40*k]],2,'#8a8fa8')}R(x-18,GY-54,36,3,'#6a6a7a',{sw:.8});
  fig(x,{y:GY-12,h:24,col:pale(C.c,.3),arms:[.2,.2]});
  moonBall(x+42,GY-80,6);},
quality:(x,C,p,e,T)=>{
  P(poly([[x-14,GY-10],[x+14,GY-10],[x,GY-44]],3),rgba(SKY,.35),{sw:1.4,ink:pale(SKY,.5)});
  beam(x-6,GY-27,PI/2+.15,-50,3,TEXT,.2+.3*e);
  if(e>.1)[RED,'#ff9b4a',GOLD,GREEN,BLUE,VIOLET].forEach((c,k)=>{const len=50*clamp(e*1.2);Ln([[x+7,GY-27],[x+7+len,GY-40+k*5*e]],2,c)});},
quantity:(x,C,p,e,T,m)=>{
  R(x-36,GY-62,72,4,WOOD,{sw:1});R(x-36,GY-4,72,4,WOOD,{sw:1});Ln([[x-34,GY-58],[x-34,GY-4]],2,WOOD);Ln([[x+34,GY-58],[x+34,GY-4]],2,WOOD);
  for(let r=0;r<5;r++){Ln([[x-32,GY-50+r*10],[x+32,GY-50+r*10]],.8,rgba(TEXT,.5));const n=Math.floor(hash(r,Math.floor(m/24))*6*e+r*e);for(let b=0;b<8;b++){const left=b<n;const bx=left?x-28+b*6:x+30-(8-b)*6;E(bx,GY-50+r*10,3,3.6,[C.lit,GOLD,ROSE,SKY,GREEN][r],{sw:.6,j:.3})}}},
reasoning:(x,C,p,e,T)=>{
  const Q=[];for(let k=0;k<=12;k++){const xx=x-56+k*112/12;Q.push([xx,GY-3+sin(k*1.3+T*2.4)*1.6])}P([...Q,[x+56,GY+2],[x-56,GY+2]],dim(WATER,.25),{ink:null});Ln(Q,1.2,pale(SKY,.3));
  const n=Math.floor(e*6);for(let k=0;k<6;k++){if(k<n)E(x-40+k*16,GY-4,6,3,mix(STONE,GOLD,k/6*.4),{sw:1})}
  const st=Math.max(0,n-1);fig(x-40+st*16,{y:GY-6,h:24,col:C.lit,walk:e*20});
  if(e>.95)glow(x+44,GY-10,16,GOLD,.5);},
relation:(x,C,p,e,T,m)=>{const cy=GY-42,d=lerp(22,10,e);
  [[0,-1],[-.87,.5],[.87,.5]].forEach(([a,b],k)=>{cx.save();cx.strokeStyle=[C.lit,GOLD,ROSE][k];cx.lineWidth=3;cx.beginPath();cx.arc(x+a*d+jit(.3),cy+b*d+jit(.3),16,0,TAU);cx.stroke();cx.restore()});
  if(e>.8)glow(x,cy,12,GOLD,.4);},
religion:(x,C,p,e,T)=>{
  R(x-24,GY-36,48,36,C.base);Dome(x,GY-36,20,18,C.shade);archDoor(x,GY,12,22,lamp(e,.5));glow(x,GY-10,12+18*e,GOLD,.15+.35*e);
  for(let k=0;k<5;k++){const a=frac(T*.15+k/5);cx.save();cx.globalAlpha=(1-a)*.5*(.4+.6*e);E(x+34+sin(a*5+k)*5,GY-16-a*50,2+a*5,2+a*3,rgba(TEXT,.6),{ink:null});cx.restore()}
  Ln([[x+34,GY],[x+34,GY-12]],1.4,BRASS);Bowl(x+34,GY-12,5,3,BRASS,{sw:.8});
  fig(x-40,{h:20,pose:'sit',col:pale(C.c,.3),f:1});},
revolution:(x,C,p,e,T,m)=>{
  sunDisk(x+40,GY-14-e*40,9,'#ffb84a',e);
  wheel(x-30,GY-18,18,m/18,C.lit,8);
  R(x-4,GY-10,22,10,STONE,{sw:1});
  const a=e*1.25;cx.save();cx.translate(x+18,GY-10);cx.rotate(a);bust0(-11,0,10,MARBLE);crownP(-11,-20,5,mix(GOLD,NIGHT,.2*e));cx.restore();
  if(e>.5){const h=(e-.5)*90;Ln([[x+2,GY-10],[x+2,GY-10-h]],1.4);if(h>14)banner(x+2,GY-10-h,18,11,[RED],T)}
  if(e>.85)crowd(x-56,x-40,GY,2,C.lit,T,5,12,1);},
rhetoric:(x,C,p,e,T)=>{
  R(x-48,GY-22,24,22,STONE);fig(x-36,{y:GY-22,h:28,col:pale(TEXT,.1),arms:[.3,2.2+sin(T*3)*.2]});
  for(let k=0;k<3;k++){const a=frac(T*.6+k/3);cx.save();cx.globalAlpha=(1-a)*(.3+.6*e);cx.strokeStyle=GOLD;cx.lineWidth=1.6;cx.beginPath();cx.arc(x-30,GY-44,8+a*44,-.5,.5);cx.stroke();cx.restore()}
  crowd(x-4,x+56,GY,6,C.lit,T,4,15,e*.6);},
same:(x,C,p,e,T)=>{
  P(poly([[x-56,GY-2],[x+56,GY-2],[x+56,GY+2],[x-56,GY+2]],6),dim(WATER,.2),{ink:null});
  fig(x,{y:GY-2,h:30,col:C.lit,arms:[.3,1.4]});
  cx.save();cx.translate(0,2*(GY-2));cx.scale(1,-1);cx.globalAlpha=.5;fig(x+e*6,{y:GY-2,h:30,col:mix(C.lit,ROSE,e),arms:[1.4*e+.3*(1-e),1.4*(1-e)+.3*e]});cx.restore();
  for(let k=0;k<3;k++){const wy=GY+6+k*6;Ln([[x-20+sin(T*2+k)*4,wy],[x+20+sin(T*2+k)*4,wy]],.8,rgba(SKY,.3))}},
science:(x,C,p,e,T)=>{
  R(x-48,GY-4,96,4,WOOD,{sw:1});
  const liq=mix(GREEN,VIOLET,e);flaskP(x-14,GY-4,26,liq);for(let k=0;k<4;k++){const a=frac(T*.8+k/4);E(x-14+sin(a*7+k)*5,GY-14-a*30,1.6+a,1.6+a,rgba(pale(liq,.4),.8*(1-a)),{ink:null})}glow(x-14,GY-14,10+16*e,liq,.3);
  Ln([[x+28,GY-4],[x+28,GY-40]],1.6,'#6a6a7a');E(x+28,GY-44,6,6,'#8a8fa8',{sw:1});for(let k=0;k<3;k++){cx.save();cx.strokeStyle=rgba(SKY,.6);cx.lineWidth=1;cx.beginPath();cx.ellipse(x+28,GY-44,12,4,k*PI/3+T*.5,0,TAU);cx.stroke();cx.restore()}dot(x+28,GY-44,2,GOLD);},
sense:(x,C,p,e,T)=>{
  eye(x-14,GY-46,20,.15+.85*e,TEXT,C.c);glow(x-14,GY-46,14+14*e,C.c,.2*e);
  stroke(ell(x+30,GY-44,10,14,12,-PI*.5,PI*.5),3,SKIN,.3);stroke(ell(x+30,GY-44,5,8,10,-PI*.4,PI*.4),1.4,dim(SKIN,.3),.3);
  if(e>.3)rings(x+44,GY-44,T,GOLD,2,18,.5*e);
  thick([[x-40,GY],[x-34,GY-16]],3,SKIN);for(let k=0;k<4;k++)Ln([[x-34+k*2,GY-16],[x-30+k*3,GY-24+k]],1.6,SKIN);},
sign:(x,C,p,e,T)=>{
  P([...ell(x-14,GY-56,18,12,10,PI,TAU),[x+4,GY],[x-32,GY]],mix(STONE,NIGHT,.15),{sw:1.3});
  const glyph=[k=>stroke(ell(x-14,GY-50,5,5,10,0,PI*1.7),1.6,k,.2),k=>eye_(x-14,GY-34,5,k),k=>star5(x-14,GY-18,4,k,{sw:.6})];
  glyph.forEach((g,k)=>{const on=e>k/3+.05;g(on?GOLD:rgba(TEXT,.25));if(on)glow(x-14,GY-50+k*16,8,GOLD,.25)});
  fire(x+32,GY,4,T);for(let k=0;k<3;k++){const a=frac(T*.25+k/3);if(e>.2){cx.save();cx.globalAlpha=(1-a)*e;E(x+32,GY-20-a*60,6-a*2,4,rgba(TEXT,.6),{sw:.8});cx.restore()}}},
sin:(x,C,p,e,T)=>{
  tree(x+10,70,dim(LEAF,.2),'round');
  const ay=lerp(GY-52,GY-6,e*e);E(x+18,ay,5,5,RED,{sw:1});if(e>.5)P(ell(x+22,ay-1,2,3,8,-PI/2,PI/2),pale(SAND,.4),{ink:null});
  const pts=[[x+12,GY],[x+6,GY-14],[x+14,GY-28],[x+6,GY-42],[x+16,GY-50]];snake(pts,3,mix(GREEN,NIGHT,.2));E(x+18,GY-52,4,3,mix(GREEN,NIGHT,.2),{sw:.9});dot(x+19,GY-53,1,GOLD);
  fig(x-30,{h:30,col:pale(SKIN,.1),hc:SKIN,arms:[.3,1.1+e*.4]});},
slavery:(x,C,p,e,T)=>{
  const g=e*18;chain(x-50-g,GY-40,x-8-g,GY-40,6);chain(x+8+g,GY-40,x+50+g,GY-40,6);if(e>.3){glow(x,GY-40,20*e,GOLD,.4*e);spark4(x,GY-40,4,e)}
  sunDisk(x,GY-6-30*e,10,'#ffb84a',e);
  if(e>.5){const by=GY-60-(e-.5)*40;bird(x+10,by,7,TEXT,T)}},
soul:(x,C,p,e,T)=>{
  fig(x-10,{h:16,pose:'lotus',col:dim(C.lit,.3)});
  const by=lerp(GY-24,GY-82,e)+sin(T*2)*3;glow(x+4,by,14+16*e,C.c,.3+.3*e);butterfly(x+4+sin(T*.8)*6*e,by,12,T*6,pale(C.c,.3),pale(SKY,.4));
  for(let k=0;k<4;k++){const a=frac(T*.3+k/4);cx.save();cx.globalAlpha=(1-a)*e*.7;dot(x-6+sin(a*6+k)*8,GY-20-a*50,1.2,TEXT);cx.restore()}},
space:(x,C,p,e,T,m)=>{
  R(x-40,GY-86,80,80,'#0a0c1e',{sw:1.6,ink:BRASS});
  cx.save();cx.beginPath();cx.rect(x-38,GY-84,76,76);cx.clip();
  for(let k=0;k<18;k++)dot(x-38+hash(k,1)*76,GY-84+hash(k,2)*76,hash(k,3)<.8?.8:1.4,rgba(TEXT,.7));
  const L=34*e,ox=x-14,oy=GY-30;Ln([[ox,oy],[ox+L,oy]],1.6,ROSE);Ln([[ox,oy],[ox,oy-L]],1.6,GREEN);Ln([[ox,oy],[ox-L*.5,oy+L*.4]],1.6,SKY);
  E(x+18+sin(m/40)*4,GY-62,6,6,'#d6875a',{sw:.8});E(x-24,GY-66,3,3,SKY,{sw:.6});cx.restore();},
state:(x,C,p,e,T)=>{
  P(poly([[x-56,GY],[x-40,GY-14],[x+40,GY-14],[x+56,GY]],8),dim(GREEN,.4));
  for(let k=0;k<5;k++){R(x-40+k*16,GY-22,12,8,mix(STONE,NIGHT,.2),{sw:.7})}
  const k=e,cx0=x,cy0=GY-60;
  const pts=[];for(let i=0;i<46;i++){const a=hash(i,1),b=hash(i,2);let tx,ty;if(i<10){const an=i/10*TAU;tx=cx0+cos(an)*7;ty=cy0-22+sin(an)*8}else if(i<34){tx=cx0+(a-.5)*28*(1-(b*.3));ty=cy0-10+b*34}else{const s=i<40?-1:1;tx=cx0+s*(16+b*16);ty=cy0-6+b*10-a*4}pts.push([lerp(x+(a-.5)*110,tx,k),lerp(GY-2-b*10,ty,k)])}
  pts.forEach((q,i)=>dot(q[0],q[1],1.8,mix(C.lit,TEXT,hash(i,5)*.4)));
  if(k>.9){crownP(cx0,cy0-30,6);glow(cx0,cy0-30,10,GOLD,.4)}},
temperance:(x,C,p,e,T)=>{
  const a=e*.8;cx.save();cx.translate(x-14,GY-46);cx.rotate(a);jarP(0,12,8,mix(BRONZE,NIGHT,.1));cx.restore();
  jarP(x+18,GY-2,10,mix(SKY,NIGHT,.3));
  if(e>.3){const sx=x-14+sin(a)*16+4,sy=GY-46+cos(a)*4-12;stroke([[sx,sy],[sx+10,sy+10],[x+18,GY-26]],2,rgba('#9b5bd6',.8),.3)}
  fig(x-42,{h:30,col:C.lit,hat:'veil',hatc:pale(C.c,.3),arms:[.3,2.1]});},
theology:(x,C,p,e,T)=>{const cy=GY-50;
  R(x-34,GY-26,68,26,C.shade);P([...ell(x,cy,30,30,16,PI,TAU),[x+30,GY-26],[x-30,GY-26]],C.base);
  for(let k=0;k<8;k++){const a=PI+k*PI/8+PI/16,on=e>k/9;P([[x,cy],[x+cos(a-.18)*24,cy+sin(a-.18)*24],[x+cos(a+.18)*24,cy+sin(a+.18)*24]],on?[RED,GOLD,BLUE,GREEN][k%4]:dim(C.base,.3),{sw:.8,j:.3})}
  E(x,cy,6,6,on2(e),{sw:.8});glow(x,cy-6,14+24*e,GOLD,.1+.35*e);archDoor(x,GY,10,16,lamp(e,.5));},
time:(x,C,p,e,T,m)=>{
  const flip=e>.5;const k=flip?(e-.5)*2:1-e*2;const a=clamp((e-.45)*10)*PI;cx.save();cx.translate(x,GY-36);cx.rotate(a);hourglass(0,32,64,flip?clamp(frac(m/200)+.2):clamp(1-k),BRASS);cx.restore();
  for(let k2=0;k2<12;k2++){const an=k2*TAU/12;dot(x+cos(an)*44,GY-36+sin(an)*36,1.4,rgba(TEXT,.5))}
  const ha=m/60;Ln([[x,GY-36],[x+cos(ha)*30,GY-36+sin(ha)*26]],1.2,rgba(GOLD,.7));},
truth:(x,C,p,e,T)=>{
  E(x,GY-4,24,6,STONE,{sw:1.2});R(x-24,GY-20,48,16,STONE,{sw:1.2});E(x,GY-20,24,6,'#0c0b18',{sw:1.2});Ln([[x-20,GY-20],[x-20,GY-56]],1.6,WOOD);Ln([[x+20,GY-20],[x+20,GY-56]],1.6,WOOD);Ln([[x-24,GY-56],[x+24,GY-56]],2,WOOD);
  const fy=GY-20-e*34;cx.save();cx.beginPath();cx.rect(x-30,0,60,GY-20);cx.clip();glow(x,fy-14,14+24*e,TEXT,.3+.4*e);fig(x,{y:fy+16,h:30,col:pale(TEXT,.1),hc:pale(GOLD,.4),arms:[2.2*e,2.2*e]});cx.restore();
  if(e>.5){cx.save();cx.globalAlpha=(e-.5)*2;R(x+4,fy-24,6,8,pale(SKY,.5),{sw:.8});cx.restore()}},
tyranny:(x,C,p,e,T)=>{
  R(x+16,GY-90,16,90,'#2a2a3a');R(x+12,GY-96,24,8,'#3a3a4a',{sw:1});
  const a=PI*.75+sin(T*.6)*.35*e;beam(x+24,GY-90,a,90,18,RED,.12+.25*e);E(x+24,GY-90,4,4,RED,{sw:.8});glow(x+24,GY-90,10+10*e,RED,.4);
  crowd(x-56,x+6,GY,6,dim(C.base,.15),T,9,12);},
universal:(x,C,p,e,T)=>{const iy=GY-74;
  glow(x,iy,12+16*e,GOLD,.3+.3*e);P([[x,iy-12],[x+7,iy-4],[x+6,iy+6],[x,iy+12],[x-6,iy+6],[x-7,iy-4]],mix(GOLD,LEAF,.3),{sw:1});Ln([[x,iy-10],[x,iy+12]],.8,dim(GOLD,.3));
  for(let k=0;k<6;k++){const t=clamp(e*1.3-k*.08),bx=lerp(x-50+k*20,x-25+k*10,t),by=lerp(GY-8,GY-36,t),s=6+hash(k,1)*4,rot=(hash(k,2)-.5)*1.4*(1-t);cx.save();cx.translate(bx,by);cx.rotate(rot);P([[0,-s],[s*.6,-s*.3],[s*.5,s*.5],[0,s],[-s*.5,s*.5],[-s*.6,-s*.3]],[LEAF,GREEN,'#8fd16a',mix(LEAF,GOLD,.4)][k%4],{sw:.8});cx.restore();if(t>.5){cx.save();cx.globalAlpha=.25*t;Ln([[bx,by-6],[x,iy+12]],.8,GOLD);cx.restore()}}},
virtue:(x,C,p,e,T)=>{
  R(x-56,GY-64,6,64,WOOD);R(x+50,GY-64,6,64,WOOD);Ln([[x-50,GY-60],[x+50,GY-60]],1.2,TEXT);
  P(poly([[x-56,GY],[x-56,GY-14],[x-40,GY-10],[x-40,GY]],4),dim(RED,.2),{sw:1});P(poly([[x+56,GY],[x+56,GY-14],[x+40,GY-10],[x+40,GY]],4),dim(SKY,.4),{sw:1});
  const fx=lerp(x-40,x,e),bal=sin(T*2.4)*.15*(1-e);cx.save();cx.translate(fx,GY-60);cx.rotate(bal);fig(0,{y:0,h:24,col:C.lit,arms:[1.5,1.5]});Ln([[-22,-16],[22,-16]],1.4,WOOD);cx.restore();
  if(e>.95)glow(x,GY-72,14,GOLD,.4);},
war:(x,C,p,e,T)=>{
  const s=1-e;cx.save();cx.globalAlpha=.3+.7*s;Ln([[x-24,GY],[x+20,GY-44]],2.4,'#aab0c8');Ln([[x+24,GY],[x-20,GY-44]],2.4,'#aab0c8');R(x-12,GY-18,8,3,BRASS,{ink:null});R(x+4,GY-18,8,3,BRASS,{ink:null});cx.restore();
  if(e>.05){const t=e,bx=lerp(x+60,x,t),by=lerp(GY-90,GY-60,t);eagle(bx,by,4.5,TEXT,.5+sin(T*7)*.4*(1-t));stroke([[bx+4,by+2],[bx+12,by+4]],1.2,GREEN);E(bx+12,by+4,2.4,1.4,LEAF,{sw:.5});glow(bx,by,14*t,TEXT,.3*t)}
  for(let k=0;k<4;k++){const g=e*16;Ln([[x-40+k*26,GY],[x-40+k*26,GY-g*(1+hash(k,2))]],1.2,GREEN)}},
wealth:(x,C,p,e,T)=>{
  P(poly([[x-40,GY-50],[x-34,GY-60],[x-20,GY-56],[x-6,GY-40],[x+4,GY-22],[x-8,GY-18],[x-22,GY-36]],6),mix(BRONZE,GOLD,.4),{sw:1.2});E(x-2,GY-22,8,6,mix(BRONZE,NIGHT,.2),{sw:1});
  const n=Math.floor(e*12);for(let k=0;k<n;k++){const t=clamp(e*12-k),px=lerp(x,x+8+hash(k,1)*40,t),py=lerp(GY-22,GY-3-hash(k,2)*6,t)-sin(t*PI)*10;E(px,py,3.4,2,GOLD,{sw:.6,j:.3})}
  E(x+6,GY-20,4,4,RED,{sw:.6});E(x+2,GY-26,3,3,'#9b5bd6',{sw:.6});glow(x+20,GY-10,14+18*e,GOLD,.15+.3*e);},
will:(x,C,p,e,T)=>{
  for(let r=0;r<3;r++){cx.save();cx.strokeStyle=[RED,TEXT,RED][r];cx.lineWidth=3;cx.beginPath();cx.arc(x+42,GY-40,14-r*5,0,TAU);cx.stroke();cx.restore()}Ln([[x+42,GY-26],[x+40,GY]],1.6,WOOD);
  const f=fig(x-40,{h:32,col:C.lit,arms:[PI*.5,PI*.52]});bowW(x-24,GY-26,12,(1-e)*.3);
  const t=e,ax=lerp(x-24,x+40,t),ay=GY-26-sin(t*PI)*8;Ln([[ax-14,ay],[ax,ay]],1.4,WOOD);P(poly([[ax,ay-2],[ax+4,ay],[ax,ay+2]],2),TEXT,{sw:.6});if(t>.98)spark4(x+42,GY-40,4,1);},
wisdom:(x,C,p,e,T)=>{
  tree(x-30,62,'#8aa070','olive');columnP(x+18,GY,22,pale(STONE,.2),20);owlStatue(x+18,GY-24,14,mix(BRONZE,GOLD,.3),e);
  for(let k=0;k<6;k++){const a=-PI*.9+k*.32;const on=e>k/7;dot(x+18+cos(a)*40,GY-66+sin(a)*16,on?1.8:1,on?GOLD:rgba(TEXT,.4));if(on&&k>0){cx.save();cx.globalAlpha=.5;const a2=-PI*.9+(k-1)*.32;Ln([[x+18+cos(a2)*40,GY-66+sin(a2)*16],[x+18+cos(a)*40,GY-66+sin(a)*16]],.8,GOLD);cx.restore()}}},
world:(x,C,p,e,T,m)=>{
  Ln([[x,GY],[x,GY-18]],2,BRASS);R(x-14,GY-3,28,3,BRASS,{sw:1});stroke(ell(x,GY-48,32,32,16,PI*.65,PI*1.7),1.6,BRASS,.3);
  globe(x,GY-48,26,m/8);
  const a=m/50+e*PI,sx=x+cos(a)*40,sy=GY-48+sin(a)*12;if(sin(a)>-.2){E(sx,sy,4,2,WOOD,{sw:.7});Ln([[sx,sy-1],[sx,sy-7]],.7);Tri(sx+2,sy-2,4,5,TEXT,{sw:.4})}},
};
/* helpers used by a few emblems */
function eye_(x,y,s,col){P([[x-s,y],[x,y-s*.6],[x+s,y],[x,y+s*.6]],null,{sw:1.4,ink:col});dot(x,y,s*.3,col)}
function lotus_(x,y,s){for(let k=-2;k<=2;k++){const a=-PI/2+k*.4;P(poly([[x,y],[x+cos(a-.25)*s*.55,y+sin(a-.25)*s*.55],[x+cos(a)*s,y+sin(a)*s],[x+cos(a+.25)*s*.55,y+sin(a+.25)*s*.55]],3),ROSE,{sw:.7})}}
function on2(e){return mix(GOLD,NIGHT,.6-.5*e)}
function temple(x,w,h,col,y=GY,n=5){R(x-w/2-4,y-6,w+8,6,dim(col,.2));for(let k=0;k<n;k++)columnP(x-w/2+5+k*(w-10)/(n-1),y-6,h-18,col,5);R(x-w/2,y-h+6,w,6,col);Tri(x,y-h+6,w+4,12,col)}
function towerP(x,w,h,col,top='crenel',y=GY){R(x-w/2,y-h,w,h,col);if(top==='crenel')for(let k=0;k<3;k++)R(x-w/2+k*w*.38,y-h-5,w*.24,5,col,{sw:1})}
function archDoor(x,y,w,h,col=INK){P(poly([[x-w/2,y],[x-w/2,y-h*.6],[x,y-h],[x+w/2,y-h*.6],[x+w/2,y]],5),col,{ink:null})}
function sea(x,w,y,col,T,ph=0,depth=8){const Q=[];for(let k=0;k<=12;k++)Q.push([x-w/2+k*w/12,y+sin(k*1.3+T*2.4+ph)*1.8]);P([...Q,[x+w/2,y+depth],[x-w/2,y+depth]],dim(col,.45),{ink:null});Ln(Q,1.2,pale(col,.3))}
function bowW(x,y,s,a,col=WOOD){cx.save();cx.translate(x,y);cx.rotate(a);stroke(ell(0,0,s*.45,s,10,-PI/2,PI/2),2,col,.4);Ln([[0,-s],[0,s]],.8,TEXT);cx.restore()}
