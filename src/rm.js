const PI=Math.PI;
function hexRGB(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
COL.eyeW=['#f4f4f4','#dcdcdc','#bdbdbd'];COL.ink=['#18121c','#18121c','#18121c'];
const RGB={};for(const k in COL)RGB[k]=COL[k].map(hexRGB);
function capsule(a,b,r,o){const d=sub(b,a);return Object.assign({t:0,ax:a[0],ay:a[1],az:a[2],bx:d[0],by:d[1],bz:d[2],bb:Math.max(1e-6,dot(d,d)),r},o);}
function sphere(c,r,o){return Object.assign({t:1,cx:c[0],cy:c[1],cz:c[2],r},o);}
function rbox(c,F,Sd,h,rr,o){return Object.assign({t:2,cx:c[0],cy:c[1],cz:c[2],fx:F[0],fz:F[2],sx:Sd[0],sz:Sd[2],hx:h[0],hy:h[1],hz:h[2],rr},o);}
function cyl(c,ax,h,r,rr,o){return Object.assign({t:3,cx:c[0],cy:c[1],cz:c[2],ux:ax[0],uy:ax[1],uz:ax[2],h,r,rr},o);}
function limbS(a,b,r0,r1,uF,extra,opt){
 const base=capsule(a,b,(r0+r1)/2,extra);if(!opt.box)return base;
 const d=sub(b,a),L=vlen(d),n=nrm(d);let u=sub(uF,mul(n,dot(uF,n)));if(vlen(u)<0.3){u=sub([1,0,0],mul(n,n[0]));if(vlen(u)<0.3)u=sub([0,0,1],mul(n,n[2]));}u=nrm(u);
 return Object.assign(base,{t:4,L,n,u,w:crs(n,u),hw0:r0,hw1:r1,hd0:r0*0.92,hd1:r1*0.92,rr:opt.lr||0.4});}
function addDetail(sh,S,opt){const {F,Sd,P}=S,at=s=>add(P,mul(Sd,s));
 const bx=(c,h,rr,tag,k)=>sh.push(rbox(c,F,Sd,h,rr,{id:'fix',k:k||'skin',tag}));
 for(const sg of [-1,1]){
  bx(add(add(at(6.6),mul(F,1.5)),[0,sg*1.6,0]),[1.55,0.8,1.15],0.45,'chest');
  for(const s of [2.6,3.8,5.0])bx(add(add(at(s),mul(F,1.45)),[0,sg*0.95,0]),[0.8,0.55,0.5],0.3,'abs');
  bx(add(add(at(6.0),mul(F,-1.4)),[0,sg*2.3,0]),[1.0,0.8,1.9],0.4,'back');
  bx(add(add(at(0.9),mul(F,-1.5)),[0,sg*1.4,0]),[1.2,0.9,1.2],0.45,'glutes','shorts');}
 bx(add(at(7.8),mul(F,-1.2)),[1.5,0.9,0.9],0.4,'traps');
 for(const s of ['L','R']){const Sh=S.sh[s],El=S.elb[s],Ha=S.hand[s],Hp=S.hip[s],Kn=S.knee[s],An=S.ank[s];
  const dU=nrm(sub(El,Sh)),dF=sub(Ha,El);let uF=sub(dF,mul(dU,dot(dF,dU)));if(vlen(uF)<0.8)uF=F;uF=nrm(uF);
  const mu=add(Sh,mul(sub(El,Sh),0.5));
  sh.push(sphere(add(mu,mul(uF,0.6)),1.25,{id:'fix',k:'skin',tag:'biceps'}));sh.push(sphere(add(mu,mul(uF,-0.6)),1.15,{id:'fix',k:'skin',tag:'triceps'}));
  sh.push(sphere(add(add(El,mul(sub(Ha,El),0.25)),mul(uF,0.1)),1.15,{id:'fix',k:'skin',tag:'forearm'}));
  const sh2=sub(An,Kn),dk=nrm(sub(Kn,Hp));let bend=sub(sh2,mul(dk,dot(sh2,dk)));const uL=vlen(bend)>0.8?nrm(mul(bend,-1)):F;
  const tm=add(Hp,mul(sub(Kn,Hp),0.55));
  sh.push(sphere(add(tm,mul(uL,0.7)),1.8,{id:'fix',k:'skin',tag:'quads'}));sh.push(sphere(add(tm,mul(uL,-0.7)),1.7,{id:'fix',k:'skin',tag:'hams'}));
  sh.push(sphere(add(add(Kn,mul(sub(An,Kn),0.3)),mul(uL,-0.7)),1.4,{id:'fix',k:'skin',tag:'calves'}));}}

function aabb(x0,x1,y0,y1,z0,z1,k){return {t:5,cx:(x0+x1)/2,cy:(y0+y1)/2,cz:(z0+z1)/2,hx:(x1-x0)/2,hy:(y1-y0)/2,hz:(z1-z0)/2,hr:Math.hypot(x1-x0,y1-y0,z1-z0)/2,id:'fix',k,prop:1};}
function vox2boxes(V,out){const m=V.m,used=new Set();const ks=[...m.keys()].sort();
 for(const key of ks){if(used.has(key))continue;const v=m.get(key),k=v.k,ok=(x,y,z)=>{const q=x+','+y+','+z,c=m.get(q);return c&&c.k===k&&!used.has(q);};
  let x1=v.x;while(ok(x1+1,v.y,v.z))x1++;
  let y1=v.y;for(;;){let f=true;for(let x=v.x;x<=x1;x++)if(!ok(x,y1+1,v.z)){f=false;break;}if(!f)break;y1++;}
  let z1=v.z;for(;;){let f=true;for(let x=v.x;x<=x1&&f;x++)for(let y=v.y;y<=y1;y++)if(!ok(x,y,z1+1)){f=false;break;}if(!f)break;z1++;}
  for(let x=v.x;x<=x1;x++)for(let y=v.y;y<=y1;y++)for(let z=v.z;z<=z1;z++)used.add(x+','+y+','+z);
  out.push(aabb(v.x,x1+1,v.y,y1+1,v.z,z1+1,k));}}
function pmodeOf(ex){const c=(ex.props||[]).find(p=>p.t==='cable');if(!c)return null;if(ex.pmode)return ex.pmode;return c.to==='hands'?'1:1':'2:1';}
function propShapes(ex,S,sh){
 const V=mk(),pA=getPose(ex,0);
 if(ex.bench==='back'){const phi=pA.r*D2R,F=[Math.cos(phi),0,Math.sin(phi)],Sd=[-Math.sin(phi),0,Math.cos(phi)],P=[pA.P[0],0,pA.P[1]];
  sh.push(rbox(add(add(P,mul(Sd,7.4)),mul(F,-2.7)),F,Sd,[2,0.65,5.9],0.3,{id:'fix',k:'pad',prop:1}));
  const sz=Math.floor(pA.P[1]-2.2);seatBox(V,Math.floor(pA.P[0]-1.5),Math.floor(pA.P[0]+(ex.seatLen||5)),sz);
  if(pA.r>20){const q=add(add(P,mul(Sd,4)),mul(F,-3.4));for(const y of [-2,1])sh.push(capsule([Math.floor(pA.P[0])-0.5,y+1,sz-0.5],[q[0],y+1,q[2]],0.4,{id:'fix',k:'frame',prop:1}));}}
 else if(ex.bench==='seat')seatBox(V,Math.floor(pA.P[0]-3),Math.floor(pA.P[0]+3),Math.floor(pA.P[1]-2.2));
 for(const pr of (ex.props||[])){
  if(pr.t==='legpad'){const pA=solve(getPose(ex,0)),kn=mul(add(pA.knee.L,pA.knee.R),0.5),c=add(kn,[-0.6,0,1.9]);
   sh.push(capsule(add(c,[0,-3.2,0]),add(c,[0,3.2,0]),0.95,{id:'fix',k:'pad',prop:1}));
   const col=[pr.x,0,c[2]];sh.push(capsule([c[0],0,c[2]],col,0.4,{id:'fix',k:'frame',prop:1}));continue;}
  if(pr.t==='pad'){const th=pr.ang*D2R,Sd2=[Math.cos(th),0,Math.sin(th)],F2=[-Math.sin(th),0,Math.cos(th)],c=[pr.x,0,pr.z],L=pr.len||6;
   sh.push(rbox(c,F2,Sd2,[pr.w||2.3,0.6,L],0.3,{id:'fix',k:'pad',prop:1}));
   const lo=add(c,mul(Sd2,-L*0.7*Math.sign(Math.sin(th)||1)));for(const y of [-1.6,1.6]){sh.push(capsule([c[0],y,c[2]-0.8],[c[0],y,0.3],0.35,{id:'fix',k:'frame',prop:1}));sh.push(capsule([lo[0],y,Math.max(0.3,lo[2]-0.8)],[lo[0],y,0.3],0.35,{id:'fix',k:'frame',prop:1}));}
   continue;}
  if(pr.t!=='cable'){propFn(V,pr,S);continue;}
  const a=pr.a;machine(V,a[0],a[1],a[2],S.P[0]);const cab=(p,q,k,r)=>sh.push(capsule(p,q,r||0.22,{id:'fix',k:k||'cable',prop:1}));
  const hl=S.hand.L,hr=S.hand.R;
  const two=pmodeOf(ex)==='1:1',a2=add(a,[0,a[1]<-3||a[1]>3?0:0.9,0]);
  if(pr.to==='hands'){const m=mul(add(hl,hr),0.5);
   if(pr.att==='stirrups'){cab(a,hl);cab(a2,hr);sh.push(sphere(hl,0.55,{id:'fix',k:'gold',prop:1}));sh.push(sphere(hr,0.55,{id:'fix',k:'gold',prop:1}));}
   else{cab(a,two?add(m,[0,-0.4,0]):m);if(two)cab(a2,add(m,[0,0.4,0]));
    if(pr.att==='rope'){cab(m,hl);cab(m,hr);sh.push(sphere(m,0.6,{id:'fix',k:'gold',prop:1}));}
    else if(pr.att==='longbar'){const d=nrm(sub(hr,hl)),e1=add(hl,mul(d,-2.4)),e2=add(hr,mul(d,2.4));cab(e1,e2,'bar',0.4);cab(e1,add(e1,[0.2,0,-1.2]),'bar',0.4);cab(e2,add(e2,[0.2,0,-1.2]),'bar',0.4);}
    else cab(hl,hr,'bar',0.4);}}
  else if(pr.to==='handR'||pr.to==='handL'){const h=S.hand[pr.to.slice(-1)];cab(a,h);sh.push(sphere(h,0.55,{id:'fix',k:'gold',prop:1}));}
  else{const an=S.ank[pr.to.slice(-1)];cab(a,an);sh.push(sphere(an,0.9,{id:'fix',k:'gold',prop:1}));}}
 vox2boxes(V,sh);}
function shapesFor(ex,t,opt){opt=opt||{};
 const p=getPose(ex,t),S=solve(p),{F,Sd,P}=S,sh=[];
 const at=s=>add(P,mul(Sd,s));
 const rr=opt.rr||1.0,vt=opt.vt;
 sh.push(rbox(at(6.1),F,Sd,vt?[3.4,1.9,1.9]:[3.1,1.9,1.9],rr,{id:'torso'}));
 sh.push(rbox(at(3.3),F,Sd,vt?[2.0,1.6,1.9]:[2.2,1.7,1.9],rr*0.9,{id:'torso'}));
 sh.push(rbox(at(0.4),F,Sd,vt?[2.5,1.8,2.0]:[2.7,1.9,2.0],rr,{id:'torso'}));
 sh.push(capsule(at(7.4),at(9.4),1.15,{id:'fix',k:'skin',tag:'traps'}));
 if(opt.chibi){S.head=add(S.head,mul(Sd,1.15));}
 sh.push(opt.chibi?sphere(S.head,3.3,{id:'head'}):opt.box?rbox(S.head,F,Sd,[2.0,2.1,2.2],0.8,{id:'head'}):sphere(S.head,2.3,{id:'head'}));
 for(const s of ['L','R']){
  const Sh=S.sh[s],El=S.elb[s],Ha=S.hand[s],Hp=S.hip[s],Kn=S.knee[s],An=S.ank[s];
  sh.push(sphere(Sh,opt.vt?2.2:1.95,{id:'fix',k:'skin',tag:'delts'}));
  const dU=nrm(sub(El,Sh)),dF=sub(Ha,El);let uF=sub(dF,mul(dU,dot(dF,dU)));if(vlen(uF)<0.8)uF=F;uF=nrm(uF);
  sh.push(limbS(Sh,El,opt.vt?1.5:1.3,opt.vt?1.1:1.3,uF,{id:'limb',uF,tF:'biceps',tB:'triceps',k:'skin'},opt));
  sh.push(limbS(El,Ha,opt.vt?1.25:1.1,opt.vt?0.85:1.1,uF,{id:'limb',uF,tF:'forearm',tB:'forearm',k:'skin'},opt));
  sh.push(sphere(Ha,opt.chibi?1.55:1.2,{id:'fix',k:'skin'}));
  const sh2=sub(An,Kn),dk=nrm(sub(Kn,Hp));let bend=sub(sh2,mul(dk,dot(sh2,dk)));const uL=vlen(bend)>0.8?nrm(mul(bend,-1)):F;
  sh.push(limbS(Hp,Kn,opt.vt?2.0:1.75,opt.vt?1.4:1.75,uL,{id:'limb',uF:uL,tF:'quads',tB:'hams',k:'skin',short:0.4},opt));
  sh.push(limbS(Kn,An,opt.vt?1.5:1.3,opt.vt?0.95:1.3,uL,{id:'limb',uF:uL,tF:null,tB:'calves',k:'skin'},opt));
  const fw=p.tx||1,high=An[2]>4.5,toe=high?add(An,[2.6*fw,0,-1]):[An[0]+3.2*fw,An[1],0.8];
  sh.push(capsule(add(An,[0,0,-0.2]),toe,opt.chibi?1.3:1.0,{id:'fix',k:'shoe'}));
  if(s==='L'&&ex.db==='two'||s==='R'&&ex.db==='two'||ex.db===s){const ax=[{x:[1,0,0],y:[0,1,0],z:[0,0,1]}[ex.da||'y']][0];
   sh.push(capsule(sub(Ha,mul(ax,1.7)),add(Ha,mul(ax,1.7)),0.4,{id:'fix',k:'bar',prop:1,db:s}));
   for(const sg of [-1,1])sh.push(cyl(add(Ha,mul(ax,sg*2.1)),ax,0.5,1.7,0.35,{id:'fix',k:'plate',prop:1,db:s}));}
 }
 if(ex.db==='one'){const c=mul(add(S.hand.L,S.hand.R),0.5),ax={x:[1,0,0],y:[0,1,0],z:[0,0,1]}[ex.da||'y'];
  sh.push(capsule(sub(c,mul(ax,1.7)),add(c,mul(ax,1.7)),0.4,{id:'fix',k:'bar',prop:1,db:'LR'}));
  for(const sg of [-1,1])sh.push(cyl(add(c,mul(ax,sg*2.3)),ax,0.6,2.0,0.4,{id:'fix',k:'plate',prop:1,db:'LR'}));}
 if(ex.kb){const tags=ex.kb==='one'?['LR']:ex.kb==='two'?['L','R']:[ex.kb];
  for(const tg of tags){const H=tg==='LR'?mul(add(S.hand.L,S.hand.R),0.5):S.hand[tg];
   sh.push(capsule(sub(H,[0,0.95,0]),add(H,[0,0.95,0]),0.3,{id:'fix',k:'kb',prop:1,db:tg}));
   let off=ex.kbOff||[0,0,-1.75];if(off==='arm'){const sd=tg==='LR'?'R':tg,dd=nrm(sub(S.hand[sd],S.elb[sd]));off=add(mul(dd,1.5),[0,0,-0.5]);}const c=add(H,off);for(const sg of [-1,1])sh.push(capsule(add(H,[0,sg*0.95,0]),add(c,[0,sg*0.9,0]),0.3,{id:'fix',k:'kb',prop:1,db:tg}));
   sh.push(sphere(c,1.45,{id:'fix',k:'kb',prop:1,db:tg}));}}
 if(ex.band){const B=(a,b)=>sh.push(capsule(a,b,0.22,{id:'fix',k:'band',prop:1}));
  if(ex.band==='knees'){const q=s=>add(S.knee[s],mul(sub(S.hip[s],S.knee[s]),0.22));B(q('L'),q('R'));}
  else if(ex.band==='hands')B(S.hand.L,S.hand.R);
  else if(ex.band==='feet-hands'){for(const s of ['L','R'])B(add(S.ank[s],[0.8,0,-0.6]),S.hand[s]);}
  else if(ex.band==='footR-handR')B(add(S.ank.R,[0.8,0,-0.6]),S.hand.R);}
 if(opt.detail)addDetail(sh,S,opt);
 if(opt.props)propShapes(ex,S,sh);
 return {sh,S,ctr:mul(add(add(S.P,S.head),add(S.hand.L,S.hand.R)),0.25)};}
function sd(s,x,y,z){
 switch(s.t){
 case 0:{const px=x-s.ax,py=y-s.ay,pz=z-s.az;let h=(px*s.bx+py*s.by+pz*s.bz)/s.bb;h=h<0?0:h>1?1:h;const dx=px-s.bx*h,dy=py-s.by*h,dz=pz-s.bz*h;return Math.sqrt(dx*dx+dy*dy+dz*dz)-s.r;}
 case 1:{const dx=x-s.cx,dy=y-s.cy,dz=z-s.cz;return Math.sqrt(dx*dx+dy*dy+dz*dz)-s.r;}
 case 2:{const rx=x-s.cx,rz=z-s.cz,u=y-s.cy,v=rx*s.fx+rz*s.fz,w=rx*s.sx+rz*s.sz;
  const qx=Math.abs(u)-s.hx+s.rr,qy=Math.abs(v)-s.hy+s.rr,qz=Math.abs(w)-s.hz+s.rr;
  const ox=qx>0?qx:0,oy=qy>0?qy:0,oz=qz>0?qz:0;return Math.sqrt(ox*ox+oy*oy+oz*oz)+Math.min(Math.max(qx,qy,qz),0)-s.rr;}
 case 4:{const rx=x-s.ax,ry=y-s.ay,rz=z-s.az,a=rx*s.n[0]+ry*s.n[1]+rz*s.n[2],qu=rx*s.u[0]+ry*s.u[1]+rz*s.u[2],qw=rx*s.w[0]+ry*s.w[1]+rz*s.w[2];
  const f=Math.min(1,Math.max(0,a/s.L)),hw=s.hw0+(s.hw1-s.hw0)*f,hd=s.hd0+(s.hd1-s.hd0)*f,rr=s.rr;
  const q1=Math.abs(qw)-hw+rr,q2=Math.abs(qu)-hd+rr,q3=Math.abs(a-s.L/2)-s.L/2+rr;
  const o1=q1>0?q1:0,o2=q2>0?q2:0,o3=q3>0?q3:0;return Math.sqrt(o1*o1+o2*o2+o3*o3)+Math.min(Math.max(q1,q2,q3),0)-rr;}
 case 5:{const qx=Math.abs(x-s.cx)-s.hx,qy=Math.abs(y-s.cy)-s.hy,qz=Math.abs(z-s.cz)-s.hz;const ox=qx>0?qx:0,oy=qy>0?qy:0,oz=qz>0?qz:0;return Math.sqrt(ox*ox+oy*oy+oz*oz)+Math.min(Math.max(qx,qy,qz),0);}
 default:{const rx=x-s.cx,ry=y-s.cy,rz=z-s.cz,a=rx*s.ux+ry*s.uy+rz*s.uz;const ex_=rx-a*s.ux,ey=ry-a*s.uy,ez=rz-a*s.uz;
  const rad=Math.sqrt(ex_*ex_+ey*ey+ez*ez);const q1=rad-s.r+s.rr,q2=Math.abs(a)-s.h+s.rr;
  return Math.sqrt((q1>0?q1*q1:0)+(q2>0?q2*q2:0))+Math.min(Math.max(q1,q2),0)-s.rr;}}}
let SMK=0.9;
function dist(sh,x,y,z){let db=1e9,dp=1e9;
 for(let i=0;i<sh.length;i++){const s=sh[i],d=sd(s,x,y,z);
  if(s.prop){if(d<dp)dp=d;}else{if(db>1e8)db=d;else if(SMK<0.01)db=Math.min(db,d);else{const k=SMK,h=Math.max(k-Math.abs(db-d),0)/k;db=Math.min(db,d)-h*h*k*0.25;}}}
 return db<dp?db:dp;}
function bsph(s){switch(s.t){case 0:return [[s.ax+s.bx/2,s.ay+s.by/2,s.az+s.bz/2],Math.sqrt(s.bb)/2+s.r];
 case 4:return [[s.ax+s.bx/2,s.ay+s.by/2,s.az+s.bz/2],Math.sqrt(s.bb)/2+Math.max(s.hw0,s.hw1)*1.5];
 case 1:return [[s.cx,s.cy,s.cz],s.r];case 2:return [[s.cx,s.cy,s.cz],Math.hypot(s.hx,s.hy,s.hz)];
 case 3:return [[s.cx,s.cy,s.cz],Math.hypot(s.h,s.r)];case 5:return [[s.cx,s.cy,s.cz],s.hr];}}
function nearFloor(sh,BS,fx,fy){for(let j=0;j<sh.length;j++){const B=BS[j],dx=B[0][0]-fx,dy=B[0][1]-fy,dz=B[0][2]-0.9,rb=B[1]+0.7;if(dx*dx+dy*dy+dz*dz<rb*rb&&sd(sh[j],fx,fy,0.9)<0.7)return true;}return false;}
function nearest(sh,x,y,z){let bd=1e9,bi=0;for(let i=0;i<sh.length;i++){const d=sd(sh[i],x,y,z);if(d<bd){bd=d;bi=i;}}return bi;}
function colorKey(sc,i,x,y,z,ex,hot){
 const s=sc.sh[i],S=sc.S;let k=s.k,tag=s.tag||null;
 if(s.id==='torso'){const rx=x-S.P[0],rz=z-S.P[2],w=rx*S.Sd[0]+rz*S.Sd[2],v=rx*S.F[0]+rz*S.F[2],u=y;const fr=v>0;k='skin';
  if(w<2.2){k='shorts';tag=fr?(w>1?'abs':null):'glutes';}
  else if(w<5)tag=fr?'abs':'lowback';
  else tag=(fr||(Math.abs(u)>2.2&&v>-0.9))?'chest':(w>=6.8&&Math.abs(u)<=1.7?'traps':'back');}
 else if(s.id==='head'){const f=(s.r||2.3)/2.3,rx=(x-S.head[0])/f,ry=(y-S.head[1])/f,rz=(z-S.head[2])/f,fo=rx*S.F[0]+rz*S.F[2],so=rx*S.Sd[0]+rz*S.Sd[2];
  k='skin';if(so>0.75||fo<-0.9||(so>0.35&&fo<0.6))k='hair';else if(fo>1.2&&so<0.55&&so>-0.75&&Math.abs(ry)>0.35&&Math.abs(ry)<1.65)k=(f>1.2&&Math.abs(ry)>1.15)?'eyeW':'eye';}
 else if(s.id==='limb'){const px=x-s.ax,py=y-s.ay,pz=z-s.az;let h=(px*s.bx+py*s.by+pz*s.bz)/s.bb;h=h<0?0:h>1?1:h;
  const d=(px-s.bx*h)*s.uF[0]+(py-s.by*h)*s.uF[1]+(pz-s.bz*h)*s.uF[2];tag=d>0?s.tF:s.tB;k=(s.short&&h<s.short)?'shorts':'skin';}
 const pr=ex.prim||[],se=ex.sec||[];
 if(tag&&pr.includes(tag))return hot?'redH':'red';if(tag&&se.includes(tag))return hot?'orH':'or';return k;}
function camera(yaw,pitch){const y=yaw*PI/180,p=pitch*PI/180;
 const c=[Math.cos(p)*Math.cos(y),Math.cos(p)*Math.sin(y),Math.sin(p)];
 const right=[-Math.sin(y),Math.cos(y),0],up=[-Math.sin(p)*Math.cos(y),-Math.sin(p)*Math.sin(y),Math.cos(p)];return {c,right,up};}
const QD=[];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++)if(i||j||k){const l=Math.hypot(i,j,k);QD.push([i/l,j/l,k/l]);}
const BANDS={spr:[0.7,0.9,1.0,1.12],toon3:[0.62,0.84,1.06],toon4:[0.55,0.72,0.9,1.08],smooth:null};
const FLC=[88,88,94],FLL=[80,80,86],FLS=[58,58,64];let SHC=[0,0,-1];
function renderRM(ex,t,hot,o){
 SMK=(o.k===undefined?0.9:o.k);const sc=shapesFor(ex,t,o),sh=sc.sh;
 if(o.slim)for(const s of sh){if(s.id==='limb'&&s.t===0)s.r*=0.8;else if(s.id==='head'&&s.t===1)s.r*=1.12;else if(s.id==='torso'&&s.t===2){s.hy*=0.85;s.hz*=0.85;s.rr=Math.min(s.rr,0.7);}else if(s.tag==='delts'&&s.t===1)s.r*=0.82;}
 {const A=sc.S.ank,cx=(A.L[0]+A.R[0])/2,cy=(A.L[1]+A.R[1])/2,stand=sc.S.P[2]>6&&Math.min(A.L[2],A.R[2])<2.5;SHC=stand?[cx,cy,24]:[0,0,-1];}
 const W=o.W,H=o.H,sx_=o.scale,cam=camera(o.yaw,o.pitch),ctr=o.ctr||sc.ctr;
 let R=0;for(const s of sh){const q=(s.t===0||s.t===4)?[s.ax+s.bx/2,s.ay+s.by/2,s.az+s.bz/2]:[s.cx,s.cy,s.cz];R=Math.max(R,vlen(sub(q,ctr))+3+(s.hr||0)+(s.t===2?Math.max(s.hx,s.hy,s.hz):0));}
 const BS=sh.map(bsph);const CI=new Float64Array(W*H).fill(NaN);const img=new ImageData(W,H),D=new Float32Array(W*H).fill(1e9),dd=[-cam.c[0],-cam.c[1],-cam.c[2]];
 const L=nrm(add(mul(cam.c,0.55),[-0.45,0.55,0.75])),fl0=RGB.fa[0],fl1=RGB.fb[0],bg=hexRGB('#1b1830');
 const mid=[ctr[0],ctr[1],ctr[2]];
 const eps=0.1;
 for(let py=0;py<H;py++)for(let px=0;px<W;px++){
  const u=(px+0.5-W/2)/sx_,v=(H/2-py-0.5)/sx_+(o.cy||0);
  const ox=mid[0]+cam.right[0]*u+cam.up[0]*v+cam.c[0]*60,oy=mid[1]+cam.right[1]*u+cam.up[1]*v+cam.c[1]*60,oz=mid[2]+cam.right[2]*u+cam.up[2]*v+cam.c[2]*60;
  let r,g,b;let hit=false,tt=0;
  const mx=mid[0]-ox,my=mid[1]-oy,mz=mid[2]-oz,pr=mx*dd[0]+my*dd[1]+mz*dd[2];
  const cx=mx-pr*dd[0],cy=my-pr*dd[1],cz=mz-pr*dd[2];
  let cs=null;
  if(cx*cx+cy*cy+cz*cz<R*R){cs=[];for(let j=0;j<sh.length;j++){const B=BS[j],ex2=B[0][0]-ox,ey2=B[0][1]-oy,ez2=B[0][2]-oz,pj=ex2*dd[0]+ey2*dd[1]+ez2*dd[2],qx=ex2-pj*dd[0],qy=ey2-pj*dd[1],qz=ez2-pj*dd[2],rb=B[1]+1.2;if(qx*qx+qy*qy+qz*qz<rb*rb)cs.push(sh[j]);}}
  if(cs&&cs.length){
   tt=pr-R;let n=0;
   while(n++<64){const x=ox+dd[0]*tt,y=oy+dd[1]*tt,z=oz+dd[2]*tt,d=dist(cs,x,y,z);
    if(d<0.025){hit=true;break;}tt+=Math.max(d*0.9,0.03);if(tt>pr+R)break;}
  }
  if(hit){
   const x=ox+dd[0]*tt,y=oy+dd[1]*tt,z=oz+dd[2]*tt;
   const nx=dist(cs,x+eps,y,z)-dist(cs,x-eps,y,z),ny=dist(cs,x,y+eps,z)-dist(cs,x,y-eps,z),nz=dist(cs,x,y,z+eps)-dist(cs,x,y,z-eps);
   const nl=Math.hypot(nx,ny,nz)||1;let N=[nx/nl,ny/nl,nz/nl];
   if(o.quant){let bd2=-2,bn=N;for(const q of QD){const dd2=q[0]*N[0]+q[1]*N[1]+q[2]*N[2];if(dd2>bd2){bd2=dd2;bn=q;}}N=bn;}
   const lam=Math.max(0,N[0]*L[0]+N[1]*L[1]+N[2]*L[2]);
   const i=sh.indexOf(cs[nearest(cs,x,y,z)]),k=colorKey(sc,i,x,y,z,ex,hot),base=RGB[k][0];
   let m;const bd=BANDS[o.shade];
   if(o.shade==='flat'){m=lam<0.36?0.76:lam<0.93?1.0:1.1;}
   else if(bd){const bi=Math.min(bd.length-1,Math.floor(lam*bd.length));m=bd[bi];}
   else{const spec=Math.pow(Math.max(0,N[0]*(L[0]+cam.c[0])+N[1]*(L[1]+cam.c[1])+N[2]*(L[2]+cam.c[2]))/Math.hypot(L[0]+cam.c[0],L[1]+cam.c[1],L[2]+cam.c[2]),24);m=0.5+0.62*lam+spec*0.25;}
   r=Math.min(255,base[0]*m);g=Math.min(255,base[1]*m);b=Math.min(255,base[2]*m);D[py*W+px]=tt;
  }else{
   r=bg[0];g=bg[1];b=bg[2];
   if(o.sprite&&cam.c[2]>0.02){const tf=oz/cam.c[2],fx=ox+dd[0]*tf,fy=oy+dd[1]*tf;
    CI[py*W+px]=Math.floor(fx/7)*1000+Math.floor(fy/7);const sx2=(fx-SHC[0])*0.8,sy2=fy-SHC[1];
    const c=(sx2*sx2+sy2*sy2<SHC[2]||nearFloor(sh,BS,fx,fy))?FLS:FLC;r=c[0];g=c[1];b=c[2];}
   else if(cam.c[2]>0.02){const tf=oz/cam.c[2],fx=ox+dd[0]*tf,fy=oy+dd[1]*tf;
    if(fx>-2&&fx<30&&fy>-10&&fy<10){const ck=((Math.floor(fx/2)+Math.floor(fy/2))&1)?fl0:fl1;
     const ds=dist(sh,fx,fy,1.2),f=Math.min(1,Math.max(0,ds/4));const sf=0.55+0.45*f;r=ck[0]*sf;g=ck[1]*sf;b=ck[2]*sf;}}
  }
  const q=(py*W+px)*4;img.data[q]=r;img.data[q+1]=g;img.data[q+2]=b;img.data[q+3]=255;}
 if(o.sprite){for(let y=0;y<H-1;y++)for(let x=0;x<W-1;x++){const i=y*W+x,c=CI[i];if(c!==c)continue;const a=CI[i+1],b=CI[i+W];
   if((a===a&&a!==c)||(b===b&&b!==c)){const q=i*4;for(let k=0;k<3;k++)img.data[q+k]-=8;}}}
 if(o.clean){const dt=img.data,pk=i=>(dt[i*4]<<16)|(dt[i*4+1]<<8)|dt[i*4+2];
  for(let it=0;it<2;it++){const P=new Int32Array(W*H);for(let i=0;i<W*H;i++)P[i]=pk(i);
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;if(D[i]>1e8)continue;const ns=[i-1,i+1,i-W,i+W].filter(n=>D[n]<1e8&&Math.abs(D[n]-D[i])<1.6);
    if(ns.length<3)continue;const c=P[i];if(ns.some(n=>P[n]===c))continue;const cnt={};let best=null,bc=0;for(const n of ns){cnt[P[n]]=(cnt[P[n]]||0)+1;if(cnt[P[n]]>bc){bc=cnt[P[n]];best=n;}}
    if(bc>=2){dt[i*4]=dt[best*4];dt[i*4+1]=dt[best*4+1];dt[i*4+2]=dt[best*4+2];}}}}
 if(o.sprite&&o.ink){const cp=new Uint8ClampedArray(img.data),INK=[24,18,28];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,d=D[i];
   const ns=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b])=>a>=0&&b>=0&&a<W&&b<H).map(([a,b])=>b*W+a);
   let e=false;if(d>1e8){for(const n of ns)if(D[n]<1e8){e=true;break;}}else{for(const n of ns)if(D[n]<d-1.6){e=true;break;}}
   if(e){const q=i*4;cp[q]=INK[0];cp[q+1]=INK[1];cp[q+2]=INK[2];}}
  img.data.set(cp);}
 else if(o.sprite){const cp=new Uint8ClampedArray(img.data),src=img.data;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,d=D[i];
   const ns=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b])=>a>=0&&b>=0&&a<W&&b<H).map(([a,b])=>b*W+a);
   if(d>1e8){let best=-1,bd=1e9;for(const n of ns)if(D[n]<bd){bd=D[n];best=n;}
    if(best>=0){const q=i*4,s=best*4;cp[q]=src[s]*0.32;cp[q+1]=src[s+1]*0.22;cp[q+2]=src[s+2]*0.24;}}
   else{for(const n of ns)if(D[n]<d-1.6){const q=i*4;cp[q]=src[q]*0.5;cp[q+1]=src[q+1]*0.38;cp[q+2]=src[q+2]*0.4;break;}}}
  img.data.set(cp);}
 else if(o.outline){const oc=[24,16,34],cp=new Uint8ClampedArray(img.data);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,d=D[i];
   const nb=[x>0?D[i-1]:1e9,x<W-1?D[i+1]:1e9,y>0?D[i-W]:1e9,y<H-1?D[i+W]:1e9];
   let edge=false;
   if(d<1e8){for(const n of nb)if(n>1e8||Math.abs(n-d)>1.6){edge=true;break;}}
   if(edge){const q=i*4;cp[q]=oc[0];cp[q+1]=oc[1];cp[q+2]=oc[2];}}
  img.data.set(cp);}
 {let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(D[y*W+x]<1e8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}img.bb=[x0,y0,x1,y1];}
 return img;}
/* ---- voxels finos */
function renderFine(ex,t,hot,view){
 const sc=shapesFor(ex,t),sh=sc.sh,h=0.5,vox=[];
 let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,z0=-1,z1=-1e9;
 const pts=[sc.S.P,sc.S.head,sc.S.hand.L,sc.S.hand.R,sc.S.ank.L,sc.S.ank.R,sc.S.knee.L,sc.S.knee.R,sc.S.elb.L,sc.S.elb.R];
 for(const q of pts){x0=Math.min(x0,q[0]-5);x1=Math.max(x1,q[0]+5);y0=Math.min(y0,q[1]-5);y1=Math.max(y1,q[1]+5);z0=Math.min(z0,q[2]-4);z1=Math.max(z1,q[2]+5);}
 z0=Math.max(0,z0);
 for(let i=Math.floor(x0/h);i<=Math.ceil(x1/h);i++)for(let j=Math.floor(y0/h);j<=Math.ceil(y1/h);j++)for(let k=Math.floor(z0/h);k<=Math.ceil(z1/h);k++){
  const x=(i+0.5)*h,y=(j+0.5)*h,z=(k+0.5)*h;if(dist(sh,x,y,z)<0){const id=nearest(sh,x,y,z);vox.push({x:i,y:j,z:k,c:RGB===null?0:COL[colorKey(sc,id,x,y,z,ex,hot)]});}}
 const W=200,H=200,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
 g.fillStyle='#1b1830';g.fillRect(0,0,W,H);
 const rot=(i,j)=>{for(let n=0;n<view;n++){const a=27-j,b=i-28;i=a;j=b;}return [i,j];};
 const items=[];
 for(let i=12;i<=46;i++)for(let j=-10;j<=9;j++){const [rx,ry]=rot(i,j);items.push({sx:(rx-ry)*2+44,sy:(rx+ry)+112,d:rx+ry-500,c:COL[((Math.floor(i/2)+Math.floor(j/2))&1)?'fa':'fb']});}
 for(const v of vox){const [rx,ry]=rot(v.x,v.y);items.push({sx:(rx-ry)*2+44,sy:(rx+ry)-(v.z+1)*2+112,d:rx+ry+v.z,c:v.c});}
 items.sort((a,b)=>a.d-b.d);
 for(const q of items){const c=q.c;g.fillStyle=c[0];g.fillRect(q.sx-1,q.sy,2,1);g.fillRect(q.sx-2,q.sy+1,4,1);g.fillStyle=c[1];g.fillRect(q.sx-2,q.sy+2,2,2);g.fillStyle=c[2];g.fillRect(q.sx,q.sy+2,2,2);}
 return cv;}
