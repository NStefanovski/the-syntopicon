/* ---------- thinker busts ----------
   Every thinker is a sculpted bust on the engine floor that warms from marble into
   colour as the owl arrives, beside a signature prop with its own small event.
   Look: era sets the default costume; a few per-person tweaks; one prop each. */
const ERA_STYLE={
  'Pre-Socratic Hellenic':'greek','Classical Hellenic':'greek','Hellenistic':'greek',
  'Hellenistic & Roman':'roman','Roman Republic':'roman','Roman Republic & Empire':'roman','Roman Empire':'roman',
  'Early Christianity':'faith','Late Antiquity':'faith','Medieval':'faith',
  'Renaissance':'ren','Scientific Revolution':'sci','Early Modern':'sci','Enlightenment':'enl','Modern':'mod','Contemporary':'mod'};
/* b: beard (0 none, 1 short, 2 long), hair colour, hat, glasses, bald, prop, group */
const LOOK={
 'Heraclitus':{b:2,prop:'river'},'Parmenides':{b:2,prop:'sphere'},'Anaxagoras':{b:2,prop:'nous'},'Empedocles':{b:2,hat:'laurel',prop:'elements'},
 'Protagoras':{b:1,prop:'measure'},'Socrates':{b:2,bald:1,prop:'hemlock'},'Hippocrates':{b:2,bald:1,prop:'staff'},'Thucydides':{b:1,prop:'trireme'},
 'Democritus':{b:1,prop:'atoms'},'Thrasymachus':{b:1,prop:'fist'},'The Sophists':{group:1,prop:'coins'},'The tragedians':{group:1,prop:'masks'},
 'Plato':{b:2,prop:'cave'},'Aristotle':{b:1,prop:'lyceum'},'Epicurus':{b:2,prop:'garden'},'The Stoics':{group:1,prop:'stoa'},'Euclid':{b:2,prop:'compass'},
 'Archimedes':{b:2,prop:'lever'},'Polybius':{b:1,prop:'cycle'},'The Romans':{group:1,prop:'tablets'},'Cicero':{prop:'orator'},'Lucretius':{prop:'atoms2'},
 'Horace':{hat:'laurel',prop:'lyre'},'Quintilian':{prop:'orator'},'The Gospels':{group:1,prop:'gospels'},'Ptolemy':{b:1,hat:'cap',prop:'geo'},'Galen':{b:1,prop:'staff'},
 'Plotinus':{b:2,prop:'one'},'Augustine':{b:1,hat:'mitre',prop:'flameheart'},'Pelagius':{hat:'tonsure',prop:'path'},'Boethius':{prop:'fortune'},'Pseudo-Dionysius':{b:2,hat:'hood',prop:'hierarchy'},
 'Anselm':{hat:'mitre',prop:'greatest'},'Maimonides':{b:2,hat:'turban',prop:'guide'},'Aquinas':{hat:'tonsure',prop:'summa'},'Scotus':{hat:'hood',prop:'knot'},'Ockham':{hat:'hood',prop:'razor'},
 'Pico della Mirandola':{hair:'#c9a24a',hat:'beret',prop:'ladder'},'Machiavelli':{hat:'cap',prop:'prince'},'Copernicus':{hair:'#4a3a2e',prop:'helio'},'Montaigne':{b:1,hat:'ruff',prop:'essays'},
 'Sidney':{b:1,hat:'ruff',prop:'quill'},'Bacon':{b:1,hat:'ruff',prop:'torch'},'Galileo':{b:2,hair:'#8a7a6a',prop:'telescope'},'Kepler':{b:1,hat:'ruff',prop:'ellipse'},
 'Hobbes':{b:1,hair:'#d9d4c6',prop:'leviathan'},'Descartes':{b:1,hair:'#2a2420',prop:'candle'},'Milton':{hair:'#6a4a3a',prop:'paradise'},'Pascal':{hair:'#4a3a2e',prop:'wager'},
 'Locke':{hair:'#d9d4c6',prop:'slate'},'Spinoza':{hair:'#2a2420',prop:'lens'},'Newton':{hair:'#e8e2d2',prop:'apple'},'Leibniz':{hair:'#2a2420',prop:'binary'},'Modern liberalism':{group:1,prop:'torchlib'},
 'Vico':{prop:'spiral'},'Berkeley':{prop:'perceive'},'Montesquieu':{prop:'powers'},'Hume':{prop:'billiards'},'Rousseau':{prop:'chains'},'Adam Smith':{prop:'pins'},
 'Kant':{prop:'starry'},'Burke':{prop:'oak'},'Beccaria':{prop:'scales'},'Condorcet':{prop:'stairs'},'Jefferson':{hair:'#c98b4a',prop:'declaration'},'Lavoisier':{prop:'flask'},
 'Lamarck':{prop:'giraffe'},'Bentham':{prop:'panopticon'},'Laplace':{prop:'clockwork'},'The utilitarians':{group:1,prop:'felicific'},'Hegel':{hair:'#8a7a6a',prop:'dusk'},
 'The Federalist':{group:1,prop:'quills'},'Schopenhauer':{hair:'#e8e2d2',b:0,prop:'will'},'Austin':{prop:'gavel'},'Comte':{bald:1,prop:'stages'},'Tocqueville':{hair:'#3a2e2a',prop:'america'},
 'Mill':{bald:1,prop:'harm'},'Darwin':{b:2,bald:1,hair:'#e8e2d2',prop:'finch'},'Claude Bernard':{prop:'milieu'},'Marx':{b:2,hair:'#d9d4c6',prop:'factory'},'Tolstoy':{b:2,hair:'#e8e2d2',prop:'plough'},
 'William James':{b:1,hair:'#6a5a4a',prop:'stream'},'Cantor':{b:1,prop:'aleph'},'Bradley':{b:1,prop:'absolute'},'Frege and Russell':{group:1,prop:'logic'},'Freud':{b:1,g:1,hair:'#d9d4c6',prop:'iceberg'},
 'Dewey':{g:1,hair:'#d9d4c6',prop:'school'},'Russell':{hair:'#e8e2d2',prop:'teapot'},'Michels':{b:1,prop:'iron'},'Carnap':{g:1,prop:'verify'},'Rawls':{g:1,prop:'veil'},
 'The modern synthesis':{group:1,prop:'helix'},'Later methodologists':{group:1,prop:'swan'},
};
const MARBLE_T='#dcd6c8';
function bustFig(x,y,s,st,lk,k,col){ /* k: 0 marble .. 1 painted */
  const mar=MARBLE_T, skin=mix(mar,SKIN,k), cloth=mix(mar,col,k), hair=mix(mar,lk.hair||'#5a4a3e',k), beardC=mix(mar,lk.hair||'#6a5a4e',k);
  const robe = st==='enl'||st==='mod' ? mix(mar,'#2a2e4a',k) : cloth;
  // shoulders & drape
  P(poly([[x-s*1.15,y],[x-s*1.0,y-s*.62],[x-s*.36,y-s*.9],[x+s*.36,y-s*.9],[x+s*1.0,y-s*.62],[x+s*1.15,y]],6),robe,{sw:1.3});
  if(st==='greek'||st==='roman'){stroke([[x-s*.9,y-s*.55],[x+s*.1,y-s*.1],[x+s*.6,y]],1.2,rgba(INK,.5),.4);stroke([[x-s*.5,y-s*.8],[x+s*.3,y-s*.4]],1,rgba(INK,.4),.4)}
  if(st==='mod'){P(poly([[x-s*.36,y-s*.9],[x,y-s*.45],[x+s*.36,y-s*.9]],3),mix(mar,TEXT,k*.6),{sw:.8});P(poly([[x-s*.07,y-s*.75],[x+s*.07,y-s*.75],[x+s*.05,y-s*.35],[x-s*.05,y-s*.35]],3),mix(mar,RED,k),{sw:.6})}
  if(st==='enl'){P(poly([[x-s*.2,y-s*.9],[x+s*.2,y-s*.9],[x+s*.12,y-s*.55],[x-s*.12,y-s*.55]],3),mix(mar,TEXT,k*.6),{sw:.8})}
  if(st==='faith'&&lk.hat!=='mitre'){P(poly([[x-s*.55,y-s*.88],[x,y-s*.5],[x+s*.55,y-s*.88],[x+s*.5,y-s*1.0],[x-s*.5,y-s*1.0]],4),dim(cloth,.2),{sw:1})}
  // neck + head
  R(x-s*.17,y-s*1.12,s*.34,s*.3,skin,{sw:1});
  const hy=y-s*1.42,hr=s*.38;
  if(lk.hat==='hood')E(x,hy+s*.04,hr*1.35,hr*1.35,dim(cloth,.25));
  if(st==='enl'&&!lk.hair){for(const sx of[-1,1])for(let r=0;r<2;r++)E(x+sx*hr*.95,hy+r*hr*.6,hr*.34,hr*.3,mix(mar,'#efe9dc',k),{sw:.8})}
  E(x,hy,hr,hr*1.12,skin,{sw:1.2});
  // hair
  if(!lk.bald&&lk.hat!=='hood'&&lk.hat!=='turban'&&lk.hat!=='mitre'){
    if(st==='greek'){for(let i=0;i<7;i++){const a=PI*1.05+i*PI*.15;E(x+cos(a)*hr*.95,hy+sin(a)*hr*.9,hr*.24,hr*.22,hair,{sw:.7,j:.4})}}
    else if(st==='sci'||(st==='ren'&&!lk.hat)){P([...ell(x,hy-hr*.1,hr*1.05,hr*1.02,12,PI,TAU),[x+hr*1.15,hy+hr*.9],[x+hr*.8,hy+hr*.9],[x+hr*.75,hy],[x-hr*.75,hy],[x-hr*.8,hy+hr*.9],[x-hr*1.15,hy+hr*.9]],hair,{sw:.9})}
    else if(st==='enl'){P(ell(x,hy-hr*.18,hr*1.02,hr*.95,12,PI,TAU),lk.hair?hair:mix(mar,'#efe9dc',k),{sw:.9})}
    else P(ell(x,hy-hr*.2,hr*1.0,hr*.9,12,PI*1.02,TAU-.04),hair,{sw:.9});
  }else if(lk.bald){for(const sx of[-1,1])E(x+sx*hr*.92,hy+hr*.05,hr*.2,hr*.35,hair,{sw:.6})}
  if(lk.hat==='tonsure'){stroke(ell(x,hy-hr*.4,hr*.95,hr*.6,12,PI*1.05,TAU-.05),3,hair,.3)}
  // beard
  if(lk.b){const L=lk.b===2?1.25:.75;P([[x-hr*.92,hy+hr*.1],[x-hr*.75,hy+hr*(.5+L*.5)],[x,hy+hr*(.7+L*.7)],[x+hr*.75,hy+hr*(.5+L*.5)],[x+hr*.92,hy+hr*.1],[x+hr*.4,hy+hr*.5],[x-hr*.4,hy+hr*.5]],beardC,{sw:.9})}
  // face
  const ey=hy-hr*.05;if(k>.35){dot(x-hr*.36,ey,s*.05,INK);dot(x+hr*.36,ey,s*.05,INK)}else{stroke([[x-hr*.5,ey],[x-hr*.22,ey]],.8,rgba(INK,.5),.2);stroke([[x+hr*.22,ey],[x+hr*.5,ey]],.8,rgba(INK,.5),.2)}
  stroke([[x,ey+hr*.05],[x+hr*.08,ey+hr*.32],[x-hr*.04,ey+hr*.36]],.8,rgba(INK,.55),.2);
  if(lk.g){stroke(ell(x-hr*.36,ey,hr*.24,hr*.2,10),1,INK,.2);stroke(ell(x+hr*.36,ey,hr*.24,hr*.2,10),1,INK,.2);Ln([[x-hr*.12,ey],[x+hr*.12,ey]],.8)}
  // hats
  const t=lk.hat;
  if(t==='laurel')laurel(x,hy-hr*.2,hr*.95,mix(mar,GREEN,k),PI*.05,PI*.6);
  else if(t==='mitre')P(poly([[x-hr*.8,hy-hr*.55],[x-hr*.6,hy-hr*1.8],[x,hy-hr*2.3],[x+hr*.6,hy-hr*1.8],[x+hr*.8,hy-hr*.55]],5),mix(mar,GOLD,k),{sw:1});
  else if(t==='turban')E(x,hy-hr*.7,hr*1.1,hr*.62,mix(mar,TEXT,k*.7),{sw:1});
  else if(t==='beret')P(ell(x+hr*.1,hy-hr*.75,hr*1.15,hr*.45,12),mix(mar,RED,k),{sw:1});
  else if(t==='cap')P(ell(x,hy-hr*.65,hr*.95,hr*.5,12,PI,TAU),mix(mar,RED,k),{sw:1});
  else if(t==='ruff'){for(let i=0;i<7;i++)E(x-hr*.9+i*hr*.3,y-s*1.0,hr*.22,hr*.18,mix(mar,TEXT,k*.6),{sw:.6,j:.3})}
}
function bustGroup(x,y,s,st,col,k){[[-s*.75,.7],[s*.75,.7],[0,.85]].forEach(([dx,sc])=>bustFig(x+dx,y,s*sc,st,{b:st==='greek'?1:0},k,col))}

/* signature props: (x, y, e, T, m, C) with y = floor of the plinth */
const PROP={
 river:(x,y,e,T,m)=>{stroke([[x-12,y-2],[x-4,y-8],[x+4,y-4],[x+14,y-10]],3,SKY,.4);for(let k=0;k<3;k++){const t=frac(m/60+k/3);dot(lerp(x-12,x+14,t),lerp(y-2,y-10,t)+sin(t*9)*2,1.3,pale(SKY,.6))}fire(x+2,y-18,3+3*e,T)},
 sphere:(x,y,e,T)=>{glow(x,y-20,14+10*e,GOLD,.3*e+.1);E(x,y-20,10,10,mix(MARBLE_T,GOLD,e*.5),{sw:1.1});for(let k=0;k<2;k++){cx.save();cx.globalAlpha=.4;cx.strokeStyle=GOLD;cx.beginPath();cx.arc(x,y-20,13+k*4+e*4,0,TAU);cx.stroke();cx.restore()}},
 nous:(x,y,e,T)=>{sunDisk(x,y-30,6+3*e,'#ff9b4a',e);E(x,y-8,7,5,STONE,{sw:1})},
 elements:(x,y,e,T,m)=>mini(x,y,.55,()=>EM.element(x,{c:SKY,base:STONE,shade:STONE,lit:SKY},1,e,T,m)),
 measure:(x,y,e,T)=>{R(x-2,y-40,4,40,WOOD,{sw:1});for(let k=0;k<7;k++)Ln([[x-2,y-6-k*5],[x+2,y-6-k*5]],.6,TEXT);fig(x+12,{y,h:12+12*e,col:SKY})},
 hemlock:(x,y,e,T)=>{const a=e*.6;cx.save();cx.translate(x,y-14);cx.rotate(-a);Bowl(0,0,8,6,BRONZE,{sw:1});R(-1.5,6,3,6,BRONZE,{sw:.7});R(-5,11,10,2,BRONZE,{sw:.6});cx.restore();if(e>.4)for(let k=0;k<3;k++){const t=frac(T*.4+k/3);cx.save();cx.globalAlpha=(1-t)*e*.6;dot(x+sin(t*6+k)*3,y-20-t*20,1.6,GREEN);cx.restore()}},
 staff:(x,y,e,T)=>{const pts=[];for(let k=0;k<=10;k++){const t=k/10*e;pts.push([x+sin(t*TAU*2)*5,y-2-t*40])}Ln([[x,y],[x,y-44]],2.2,WOOD);if(pts.length>1)snake(pts,2.4,GREEN)},
 trireme:(x,y,e,T)=>{sea(x,40,y-4,WATER,T,0,4);cx.save();cx.translate(x-10+e*16,y-6);P(poly([[-16,-6],[16,-6],[20,-10],[12,0],[-12,0]],5),WOOD,{sw:1});Ln([[0,-6],[0,-26]],1.2);P(rect(-7,-25,14,12),TEXT,{sw:.8});for(let k=0;k<5;k++)Ln([[-12+k*6,-2],[-14+k*6,5]],.7);cx.restore()},
 atoms:(x,y,e,T)=>{for(let k=0;k<8;k++){const a=hash(k,1)*TAU,r=6+hash(k,2)*10*(1-e*.5),j2=sin(T*8+k)*1.5;E(x+cos(a)*r+j2,y-22+sin(a)*r,2.6,2.6,[SKY,GOLD,ROSE,STONE][k%4],{sw:.6})}},
 atoms2:(x,y,e,T)=>{for(let k=0;k<10;k++){const t=frac(T*.2+hash(k,1)),px=x-10+hash(k,2)*22,py=y-44+t*40;dot(px+sin(t*5+k)*2,py,1.6,[SKY,GOLD,ROSE][k%3])}openBook(x,y-2,9,2)},
 fist:(x,y,e,T)=>{crownP(x,y-8-e*14,6);thick([[x-8,y],[x-2,y-16-e*10]],3,SKIN);E(x-2,y-18-e*10,4,4,SKIN,{sw:.8})},
 coins:(x,y,e,T)=>{for(let k=0;k<5;k++)E(x-6+k*3,y-3-k*3*e,4,2,GOLD,{sw:.6});rings(x+6,y-24,T,GOLD,2,14,.4*e)},
 masks:(x,y,e,T)=>{[[-6,0],[7,1]].forEach(([dx,k])=>{cx.save();cx.translate(x+dx,y-24);cx.rotate((k?.2:-.2)*e);E(0,0,7,9,k?pale(SKY,.4):pale(GOLD,.3),{sw:1});dot(-2.5,-2,1.2,INK);dot(2.5,-2,1.2,INK);stroke(ell(0,4,3,2,8,k?PI:0,k?TAU:PI),1,INK,.2);cx.restore()})},
 cave:(x,y,e,T)=>{P([...ell(x,y,18,30,12,PI,TAU)],dim(STONE,.45));fire(x-8,y,3,T);cx.save();cx.globalAlpha=.5+.4*e;fig(x+8,{y:y-2,h:14,col:'#1a1830',hc:'#1a1830'});cx.restore();if(e>.5)beam(x,y-24,0,26*(e-.5)*2,6,GOLD,.25)},
 lyceum:(x,y,e,T)=>{scrollP(x,y-24,8+18*e,10);if(e>.4)lines(x-6,y-21,12*e,2,3);columnP(x+12,y,26,MARBLE_T,4)},
 garden:(x,y,e,T)=>{for(let k=0;k<3;k++){const h=6+18*e*(.7+hash(k,1)*.5),fx=x-8+k*8;Ln([[fx,y],[fx,y-h]],1,GREEN);lotus_(fx,y-h,4+2*e)}},
 stoa:(x,y,e,T)=>{columnP(x-6,y,34,MARBLE_T,5);columnP(x+8,y,34,MARBLE_T,5);R(x-12,y-38,26,4,MARBLE_T,{sw:.9});cloud(x+2,y-56+sin(T)*2,4,dim(STONE,.3));if(e>.5)glow(x+2,y-20,12,TEXT,.2)},
 compass:(x,y,e,T)=>{const a=e*TAU*.9;cx.save();cx.strokeStyle=GOLD;cx.lineWidth=1.4;cx.beginPath();cx.arc(x,y-16,10,-PI/2,-PI/2+a);cx.stroke();cx.restore();Ln([[x,y-16],[x+cos(-PI/2+a)*10,y-16+sin(-PI/2+a)*10]],1.2,BRASS);Ln([[x,y-16],[x+2,y-34]],1.2,BRASS);dot(x+2,y-34,1.6,BRASS);P([[x-8,y],[x+8,y],[x,y-12]],null,{sw:1,ink:SKY})},
 lever:(x,y,e,T)=>{Tri(x,y,8,8,BRASS,{sw:.8});const a=lerp(.25,-.25,e);cx.save();cx.translate(x,y-8);cx.rotate(a);R(-22,-1.5,44,3,WOOD,{sw:.8});cx.restore();globe(x+cos(a)*20,y-8+sin(a)*20-6,6,T)},
 cycle:(x,y,e,T,m)=>{const a=m/40;for(let k=0;k<6;k++){const an=a+k*TAU/6;E(x+cos(an)*12,y-22+sin(an)*12,3,3,[GOLD,RED,SKY,GREEN,VIOLET,ROSE][k],{sw:.6})}stroke(ell(x,y-22,12,12,14),1,rgba(TEXT,.4),.3)},
 tablets:(x,y,e,T)=>{[[-6,0],[6,1]].forEach(([dx,k])=>{P([...ell(x+dx,y-28,6,4,8,PI,TAU),[x+dx+6,y],[x+dx-6,y]],STONE,{sw:1});const n=Math.floor(e*4);for(let r=0;r<4;r++)Ln([[x+dx-3,y-24+r*5],[x+dx+3,y-24+r*5]],.8,r<n?GOLD:rgba(TEXT,.2))})},
 orator:(x,y,e,T)=>{for(let k=0;k<3;k++){const a=frac(T*.6+k/3);cx.save();cx.globalAlpha=(1-a)*(.3+.6*e);cx.strokeStyle=GOLD;cx.lineWidth=1.4;cx.beginPath();cx.arc(x-10,y-30,6+a*24,-.6,.6);cx.stroke();cx.restore()}},
 lyre:(x,y,e,T)=>{lyre(x,y-2,10,T*(.3+e));if(e>.2){cx.save();cx.globalAlpha=e;note(x+8,y-30-sin(T*2)*3);cx.restore()}},
 gospels:(x,y,e,T)=>{for(let k=0;k<4;k++){const bx=x-10+k*7;R(bx-3,y-14-e*(k%2)*3,6,14,[RED,BLUE,GOLD,GREEN][k],{sw:.8})}glow(x,y-20,10+14*e,GOLD,.3*e)},
 geo:(x,y,e,T,m)=>{globe(x,y-24,6,T);for(let k=0;k<3;k++){cx.save();cx.strokeStyle=rgba(TEXT,.3);cx.beginPath();cx.ellipse(x,y-24,10+k*5,4+k*2,0,0,TAU);cx.stroke();cx.restore();const a=m/(20+k*10)+k;E(x+cos(a)*(10+k*5),y-24+sin(a)*(4+k*2),2,2,[GOLD,'#d6875a',SKY][k],{sw:.5})}},
 one:(x,y,e,T)=>{glow(x,y-26,14+20*e,GOLD,.4);E(x,y-26,5,5,TEXT,{ink:null});for(let k=0;k<3;k++){cx.save();cx.globalAlpha=.6-k*.15;cx.strokeStyle=GOLD;cx.beginPath();cx.arc(x,y-26,9+k*6*(.5+e*.5),0,TAU);cx.stroke();cx.restore()}},
 flameheart:(x,y,e,T)=>{heart(x,y-16,7,RED);fire(x,y-22,2+3*e,T)},
 path:(x,y,e,T)=>{for(let k=0;k<4;k++)E(x-10+k*7,y-2-k*2,3,1.4,rgba(TEXT,.5),{ink:null});fig(x-10+e*20,{y:y-e*6,h:16,col:pale(SKY,.3),walk:e*10})},
 fortune:(x,y,e,T,m)=>{wheel(x,y-18,14,m/20,GOLD,8);fig(x+cos(m/20)*14,{y:y-18+sin(m/20)*14,h:8,col:SKY})},
 hierarchy:(x,y,e,T)=>{for(let k=0;k<3;k++){cx.save();cx.globalAlpha=.3+.5*(e>k/3);cx.strokeStyle=[GOLD,SKY,VIOLET][k];cx.lineWidth=1.4;cx.beginPath();cx.arc(x,y-28,6+k*6,0,TAU);cx.stroke();cx.restore()}glow(x,y-28,8+12*e,GOLD,.5)},
 greatest:(x,y,e,T)=>{for(let k=0;k<4;k++)R(x-8+k*2,y-6-k*8,16-k*4,8,mix(STONE,GOLD,k*.25),{sw:.8});star5(x,y-46,3+3*e,GOLD,{ink:null});glow(x,y-46,10+10*e,GOLD,.5*e+.1)},
 guide:(x,y,e,T)=>{openBook(x,y-2,10,2);star5(x+4,y-34,3,GOLD,{ink:null});glow(x+4,y-34,8+10*e,GOLD,.4);beam(x+4,y-34,PI,24*e,4,GOLD,.2)},
 summa:(x,y,e,T)=>{R(x-8,y-24,16,22,mix(WOOD,RED,.3),{sw:1});sunDisk(x,y-14,3+2*e,GOLD,e);glow(x,y-14,10+10*e,GOLD,.3*e)},
 knot:(x,y,e,T)=>{const k=e;stroke(ell(x-4,y-20,7,7,12),1.6,GOLD,.3);stroke(ell(x+4*k+2*(1-k),y-20,7,7,12),1.6,SKY,.3)},
 razor:(x,y,e,T)=>{for(let k=0;k<4;k++){const t=clamp(e*1.5-k*.15);if(t<1)E(x-6+k*5,y-6,2.5,2.5,mix(STONE,NIGHT,t),{sw:.6})}cx.save();cx.translate(x+8-e*16,y-14);cx.rotate(-.3);R(-2,-12,4,10,WOOD,{sw:.6});R(-2,-2,16,3,'#c9ccd8',{sw:.7});cx.restore()},
 ladder:(x,y,e,T)=>{const h=10+36*e;Ln([[x-5,y],[x-4,y-h]],1.2,WOOD);Ln([[x+5,y],[x+4,y-h]],1.2,WOOD);for(let k=0;k<h/7;k++)Ln([[x-4.5,y-4-k*7],[x+4.5,y-4-k*7]],.8,WOOD);star5(x,y-h-6,3,GOLD,{ink:null})},
 prince:(x,y,e,T)=>{crownP(x,y-30,6);quad(x-6,{y,len:12,h:6,leg:5,neck:4,nf:2,hr:3,col:'#c96a3a',ears:1,bushy:1});quad(x+8,{y,f:-1,len:12,h:7,leg:5,neck:3,nf:2,hr:3.4,col:SAND,mane:'#b9773c'})},
 helio:(x,y,e,T,m)=>{sunDisk(x,y-26,5,GOLD,1);for(let k=0;k<3;k++){const a=m/(18+k*12)+k*2+e*2;E(x+cos(a)*(9+k*5),y-26+sin(a)*(5+k*3),2,2,[SKY,'#d6875a',GREEN][k],{sw:.5})}},
 essays:(x,y,e,T)=>{const t=sin(T*1.5)*.3*(1-e*.5);Ln([[x,y],[x,y-26]],1.4,BRASS);Ln([[x-12*cos(t),y-26+12*sin(t)],[x+12*cos(t),y-26-12*sin(t)]],1.2,BRASS);Bowl(x-12*cos(t),y-22+12*sin(t),5,3,BRASS,{sw:.8});Bowl(x+12*cos(t),y-22-12*sin(t),5,3,BRASS,{sw:.8})},
 quill:(x,y,e,T)=>{scrollP(x,y-14,18,10);lines(x-7,y-11,14*e,2,3);cx.save();cx.translate(x-8+16*e,y-16);cx.rotate(-.6);P(poly([[0,0],[4,-16],[2,-18],[-1,-2]],3),TEXT,{sw:.7});cx.restore()},
 torch:(x,y,e,T)=>{Ln([[x,y],[x,y-26]],2.2,WOOD);fire(x,y-26,3+3*e,T);beam(x,y-26,PI*.6,30*e,8,GOLD,.15)},
 telescope:(x,y,e,T)=>{Ln([[x-6,y],[x,y-14]],1.2,WOOD);Ln([[x+6,y],[x,y-14]],1.2,WOOD);cx.save();cx.translate(x,y-16);cx.rotate(-.3-e*.6);R(-6,-2.5,22,5,BRASS,{sw:.9});cx.restore();if(e>.5){const jx=x+14,jy=y-44;E(jx,jy,4,4,'#d6b07a',{sw:.6});for(let k=0;k<4;k++)dot(jx+(k<2?-1:1)*(6+k%2*4),jy,1,TEXT)}},
 ellipse:(x,y,e,T,m)=>{cx.save();cx.strokeStyle=rgba(TEXT,.4);cx.beginPath();cx.ellipse(x,y-24,16,8,0,0,TAU);cx.stroke();cx.restore();sunDisk(x-7,y-24,3,GOLD,1);const a=m/24+e*PI;E(x+cos(a)*16,y-24+sin(a)*8,2.4,2.4,SKY,{sw:.5})},
 leviathan:(x,y,e,T)=>mini(x,y,.5,()=>EM.state(x,{c:SKY,base:STONE,shade:STONE,lit:pale(SKY,.3)},1,e,T,0)),
 candle:(x,y,e,T)=>{const h=14+8*(1-e);R(x-3,y-h,6,h,pale(TEXT,.1),{sw:.8});fire(x,y-h,2.4,T);E(x+12,y-4,6,3,mix(GOLD,TEXT,.5-e*.3),{sw:.8});glow(x,y-h-4,14,GOLD,.3)},
 paradise:(x,y,e,T)=>{E(x,y-14,6,6,RED,{sw:1});Ln([[x,y-20],[x+2,y-24]],.8,WOOD);const pts=[[x-12,y],[x-8,y-12],[x-14,y-22]];snake(pts,2,GREEN);fall_(x,y,e)},
 wager:(x,y,e,T)=>{const cs=abs(cos(T*3*(1-e)+e*PI));cx.save();cx.translate(x,y-18-sin(e*PI)*10);cx.scale(Math.max(.1,cs),1);E(0,0,7,7,GOLD,{sw:1});cx.restore();R(x-10,y-4,20,4,'#6a6a7a',{sw:.8})},
 slate:(x,y,e,T)=>{R(x-10,y-28,20,24,'#2a2e3a',{sw:1.1});R(x-12,y-30,24,28,null,{sw:1.6,ink:WOOD});lines(x-6,y-24,12,Math.floor(e*4),5,rgba(TEXT,.7))},
 lens:(x,y,e,T)=>{E(x,y-20,7,9,rgba(SKY,.4),{sw:1.2});beam(x,y-20,PI/2,-26,3,TEXT,.2+.3*e);if(e>.5)spark4(x+18,y-20,3,e)},
 apple:(x,y,e,T)=>{tree(x+4,46,LEAF,'round',y);const ay=lerp(y-36,y-4,e*e);E(x+6,ay,3.4,3.4,RED,{sw:.8});if(e>.95)spark4(x+6,y-10,3,.8)},
 binary:(x,y,e,T)=>{for(let r=0;r<3;r++)for(let c=0;c<4;c++){const on=hash(r*4+c,Math.floor(T*2))>.5&&e>.2;dot(x-9+c*6,y-30+r*7,on?2:1.2,on?GOLD:rgba(TEXT,.4))}R(x-12,y-8,24,8,BRASS,{sw:.9})},
 torchlib:(x,y,e,T)=>{thick([[x,y],[x,y-30]],2,'#6aa08a');Bowl(x,y-30,5,3,'#6aa08a',{sw:.8});fire(x,y-32,2+4*e,T)},
 spiral:(x,y,e,T,m)=>{const pts=[];for(let k=0;k<30;k++){const a=k*.45+m/50,r=k*.6;pts.push([x+cos(a)*r,y-24+sin(a)*r*.7-k*.3])}stroke(pts.slice(0,Math.max(2,Math.floor(30*(.3+.7*e)))),1.4,GOLD,.3)},
 perceive:(x,y,e,T)=>{tree(x,30,LEAF,'round',y);cx.save();cx.globalAlpha=e;eye(x+10,y-44,7,e,TEXT,SKY);cx.restore()},
 powers:(x,y,e,T)=>{[-8,0,8].forEach((dx,k)=>{columnP(x+dx,y,16+k%2*4,[RED,GOLD,SKY][k],4)});const t=sin(T*1.4)*.1*(1-e);Ln([[x-12,y-24+t*10],[x+12,y-24-t*10]],1.2,BRASS)},
 billiards:(x,y,e,T)=>{R(x-16,y-4,32,4,'#2a7a4a',{sw:1});const a=clamp(e*2),b=clamp(e*2-1);E(x-14+a*12,y-8,3,3,TEXT,{sw:.6});E(x+b*12,y-8,3,3,RED,{sw:.6});if(a>=1&&b<.1)spark4(x-1,y-8,2,.8)},
 chains:(x,y,e,T)=>{const g=e*8;chain(x-14-g,y-24,x-2-g,y-24,3);chain(x+2+g,y-24,x+14+g,y-24,3);if(e>.5)bird(x,y-40-e*10,5,TEXT,T)},
 pins:(x,y,e,T)=>{for(let k=0;k<6;k++){const t=clamp(e*1.6-k*.12);Ln([[x-12+k*5,y-2],[x-12+k*5,y-2-12*t]],1,'#c9ccd8');if(t>.95)dot(x-12+k*5,y-14,1.2,'#c9ccd8')}for(let k=0;k<3;k++)E(x-6+k*6,y-28-sin(T*2+k)*2,3,2,GOLD,{sw:.6})},
 starry:(x,y,e,T)=>{for(let k=0;k<7;k++){const on=e>k/8;dot(x-14+hash(k,1)*28,y-46+hash(k,2)*20,on?1.6:1,on?TEXT:rgba(TEXT,.3));if(on)glow(x-14+hash(k,1)*28,y-46+hash(k,2)*20,4,TEXT,.3)}heart(x,y-12,5,mix(RED,GOLD,.3))},
 oak:(x,y,e,T)=>tree(x,20+24*e,dim(LEAF,.1),'round',y),
 scales:(x,y,e,T)=>{const t=(1-e)*.3;Ln([[x,y],[x,y-30]],1.4,BRASS);Ln([[x-12*cos(t),y-30+12*sin(t)],[x+12*cos(t),y-30-12*sin(t)]],1.2,BRASS);Bowl(x-12*cos(t),y-26+12*sin(t),5,3,BRASS,{sw:.8});Bowl(x+12*cos(t),y-26-12*sin(t),5,3,BRASS,{sw:.8})},
 stairs:(x,y,e,T)=>{for(let k=0;k<4;k++)R(x-14+k*7,y-4-k*6,8,4+k*6,mix(STONE,GOLD,k*.2),{sw:.8});const st=Math.min(3,Math.floor(e*4));fig(x-11+st*7,{y:y-4-st*6,h:12,col:SKY})},
 declaration:(x,y,e,T)=>{scrollP(x,y-30,10+14*e,20);lines(x-8,y-26,16*e,4,4);if(e>.9){E(x+8,y-12,2.4,2.4,RED,{sw:.6})}},
 flask:(x,y,e,T)=>{flaskP(x,y,16,mix(SKY,RED,e));for(let k=0;k<3;k++){const a=frac(T*.8+k/3);dot(x+sin(a*7)*3,y-10-a*20,1.2+a,rgba(TEXT,.6*(1-a)))}},
 giraffe:(x,y,e,T)=>{quad(x,{y,len:14,h:7,leg:12,neck:8+18*e,nf:3,hr:3,ears:1,col:'#d9a54a',tail:true});tree(x+14,40,LEAF,'round',y)},
 panopticon:(x,y,e,T)=>{R(x-5,y-34,10,34,STONE,{sw:1});for(let k=0;k<4;k++)R(x-16+k*9,y-10,6,10,dim(STONE,.2),{sw:.7});const a=T*1.2;beam(x,y-30,PI/2+a,30,6,GOLD,.15+.2*e)},
 clockwork:(x,y,e,T,m)=>{gear(x-6,y-18,8,8,m/16,BRASS);gear(x+7,y-28,6,6,-m/12,mix(BRASS,NIGHT,.2));sunDisk(x+10,y-42,3,GOLD,e)},
 felicific:(x,y,e,T)=>{PROP.scales(x,y,e,T);heart(x-12,y-36,3,ROSE);E(x+12,y-36,3,3,GOLD,{sw:.6})},
 dusk:(x,y,e,T)=>{sunDisk(x,y-6-e*0,6,'#ff7a3a',1);owlStatue(x+2,y-10-e*20,6,mix(BRONZE,GOLD,.3),e)},
 quills:(x,y,e,T)=>{for(let k=0;k<3;k++){cx.save();cx.translate(x-6+k*6,y-4);cx.rotate(-.3+k*.3);P(poly([[0,0],[3,-18-e*4],[1,-20-e*4],[-1,-2]],3),TEXT,{sw:.6});cx.restore()}},
 will:(x,y,e,T)=>{fire(x,y-4,4+6*e,T,'#ff6a3a');glow(x,y-16,14+10*e,'#ff6a3a',.4)},
 gavel:(x,y,e,T)=>mini(x,y,.5,()=>EM.judgment(x,{c:GOLD,base:WOOD,shade:WOOD,lit:GOLD},1,e,T,0)),
 stages:(x,y,e,T)=>{[[0,VIOLET],[1,GOLD],[2,SKY]].forEach(([k,c])=>{const on=e>k/3;R(x-14+k*10,y-6-k*8,10,6+k*8,on?c:dim(c,.6),{sw:.8})})},
 america:(x,y,e,T)=>{sea(x,40,y-4,WATER,T,0,4);cx.save();cx.translate(x-12+e*20,y-6);P(poly([[-12,-4],[12,-4],[8,0],[-8,0]],4),WOOD,{sw:.8});R(-3,-14,3,10,INK,{ink:null});smoke(0,-16,T,3,7,-1);cx.restore()},
 harm:(x,y,e,T)=>{openBook(x,y-2,10,2);P(poly([[x-8,y-34],[x+8,y-34],[x+8,y-24],[x,y-16],[x-8,y-24]],4),mix(SKY,NIGHT,.2),{sw:1});if(e>.5)glow(x,y-26,10,SKY,.3)},
 finch:(x,y,e,T)=>{Ln([[x-14,y-24],[x+14,y-28]],1.6,WOOD);[[-8,2],[2,4],[10,2.6]].forEach(([dx,bk],k)=>{const on=e>k/3;cx.save();cx.globalAlpha=on?1:.25;E(x+dx,y-31,3.6,2.8,[SAND,'#8a6a4a',GOLD][k],{sw:.6});P(poly([[x+dx+3,y-32],[x+dx+3+bk,y-31],[x+dx+3,y-30]],2),INK,{ink:null});cx.restore()})},
 milieu:(x,y,e,T)=>{flaskP(x,y,14,mix(GREEN,SKY,.4));R(x-1,y-24,2,6,TEXT,{sw:.4});rings(x,y-8,T,SKY,2,10,.4*e)},
 factory:(x,y,e,T)=>{R(x-14,y-16,24,16,mix(RED,NIGHT,.4),{sw:1});P(poly([[x-14,y-16],[x-8,y-22],[x-2,y-16],[x+4,y-22],[x+10,y-16]],3),mix(RED,NIGHT,.4),{sw:1});R(x+8,y-32,5,16,dim(STONE,.3),{sw:.8});smoke(x+10,y-34,T,4,3,-1);const g=e*6;chain(x-14-g,y-40,x-6-g,y-40,2);chain(x-2+g,y-40,x+6+g,y-40,2)},
 plough:(x,y,e,T)=>{P(poly([[x-14,y-4],[x+4,y-4],[x+12,y],[x-14,y]],3),WOOD,{sw:.9});Ln([[x-10,y-4],[x-16,y-18]],1.4,WOOD);for(let k=0;k<Math.floor(e*4);k++)Ln([[x+6+k*3,y],[x+6+k*3,y-4-k]],1,GREEN)},
 stream:(x,y,e,T,m)=>{for(let r=0;r<3;r++){const pts=[];for(let k=0;k<=10;k++)pts.push([x-16+k*3.2,y-12-r*8+sin(k*.9+m/16+r)*3*(.4+e)]);stroke(pts,1.2,[SKY,GOLD,ROSE][r],.2)}},
 aleph:(x,y,e,T,m)=>{for(let k=0;k<5;k++){const s=frac(k/5+m/300),sc=lerp(1,.15,s);cx.save();cx.globalAlpha=1-s;stroke(ell(x,y-22,10*sc,10*sc,12),1.2,GOLD,.2);cx.restore()}figure8(x,y-4,8,2.4,e,SKY,1.2)},
 absolute:(x,y,e,T)=>{glow(x,y-24,12+12*e,TEXT,.3);E(x,y-24,9,9,mix(STONE,TEXT,e),{sw:1});for(let k=0;k<5;k++){const a=k*TAU/5;dot(x+cos(a)*14*(1-e),y-24+sin(a)*14*(1-e),1.6,GOLD)}},
 logic:(x,y,e,T)=>mini(x,y,.55,()=>EM.logic(x,{c:GOLD,base:STONE,shade:STONE,lit:SKY},1,e,T,0)),
 iceberg:(x,y,e,T)=>{P(poly([[x-16,y-8],[x+16,y-8],[x+16,y],[x-16,y]],4),dim(WATER,.2),{ink:null});P(poly([[x-5,y-8],[x,y-18],[x+5,y-8]],3),SNOW,{sw:.8});cx.save();cx.globalAlpha=.3+.6*e;P(poly([[x-5,y-8],[x+5,y-8],[x+12,y],[x-12,y]],3),pale(SKY,.3),{sw:.6});cx.restore()},
 school:(x,y,e,T)=>{R(x-12,y-14,24,14,mix(RED,NIGHT,.3),{sw:.9});Tri(x,y-14,28,10,dim(STONE,.2),{sw:.8});fig(x+16,{y,h:12,col:SKY,arms:[.3,1.3+e]});R(x+20,y-14,4,4,GOLD,{sw:.5})},
 teapot:(x,y,e,T,m)=>{const a=m/30,tx=x+cos(a)*14,ty=y-30+sin(a)*6;E(tx,ty,4,3,TEXT,{sw:.7});Ln([[tx+4,ty],[tx+7,ty-2]],1,TEXT);sunDisk(x,y-30,3,GOLD,1);cx.save();cx.strokeStyle=rgba(TEXT,.25);cx.beginPath();cx.ellipse(x,y-30,14,6,0,0,TAU);cx.stroke();cx.restore()},
 iron:(x,y,e,T)=>{for(let k=0;k<3;k++)crowd(x-12+k*2,x+12-k*2,y-k*8,4-k,STONE,T,k,8)},
 verify:(x,y,e,T)=>{Ln([[x,y],[x,y-16]],1.2,WOOD);Ln([[x,y-16],[x-10,y-28]],1.2,WOOD);Ln([[x,y-16],[x+10,y-28]],1.2,WOOD);dot(x-10,y-28,2,e>.5?GREEN:STONE);dot(x+10,y-28,2,e>.5?RED:STONE)},
 veil:(x,y,e,T)=>{crowd(x-14,x+14,y,4,STONE,T,3,12);const h=(1-e)*30;cx.save();cx.globalAlpha=.6;R(x-16,y-34,32,30*e+4,pale(SKY,.4),{sw:.8,j:.6});cx.restore()},
 helix:(x,y,e,T,m)=>{for(let k=0;k<8;k++){const yy=y-4-k*4.5,a=m/22+k*.6,x1=x+sin(a)*7,x2=x-sin(a)*7;Ln([[x1,yy],[x2,yy]],1,[RED,GOLD,GREEN,BLUE][k%4]);dot(x1,yy,1.6,SKY);dot(x2,yy,1.6,ROSE)}},
 swan:(x,y,e,T)=>{swan(x-6,y,5,pale(TEXT,.05));if(e>.4){cx.save();cx.globalAlpha=(e-.4)*1.7;swan(x+10,y,5,'#2a2a3a');cx.restore()}},
};
function fall_(x,y,e){}
function mini(x,y,s,fn){cx.save();cx.translate(x,y);cx.scale(s,s);cx.translate(-x,-y);fn();cx.restore()}
function drawBust(x,name,person,e,T,m,C){
  const lk=LOOK[name]||{}, st=ERA_STYLE[person.era]||'mod';
  const k=.15+.85*e;
  glow(x-12,GY-30,16+20*e,C.c,.08+.25*e);
  if(lk.group)bustGroup(x-14,GY,19,st,C.c,k);else bustFig(x-14,GY,23,st,lk,k,C.c);
  (PROP[lk.prop]||PROP.quill)(x+28,GY,e,T,m,C);
}
