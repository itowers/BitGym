const D2R=Math.PI/180;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],vlen=a=>Math.hypot(a[0],a[1],a[2]);
const nrm=a=>{const l=vlen(a)||1;return [a[0]/l,a[1]/l,a[2]/l];};
const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const COL={
skin:['#f6c590','#dba26a','#b98050'],hair:['#ffe27a','#e8c24a','#c29f2c'],shorts:['#5b6cf0','#4553c8','#34409a'],
shoe:['#f4f4f4','#cfcfcf','#a5a5a5'],eye:['#1a1a3a','#12122b','#0b0b1d'],bar:['#d8d8d8','#b0b0b0','#8a8a8a'],
plate:['#6a6a6a','#4a4a4a','#333333'],frame:['#aab3c4','#848da0','#646c7d'],pad:['#5d5d86','#484869','#37374f'],
gold:['#ffd45a','#e0b13a','#b78a20'],hole:['#15141a','#15141a','#15141a'],stack:['#4a505d','#373c47','#2a2e37'],kb:['#5e6575','#454b58','#33373f'],band:['#3fcf7d','#2ea862','#1f7e48'],cable:['#f5f5f5','#d6d6d6','#b8b8b8'],
red:['#e0453f','#b83530','#8e2724'],redH:['#ff8676','#ff4a40','#d1302b'],
or:['#f0993a','#cc7a24','#a35f18'],orH:['#ffc860','#ff9a2e','#d37a18'],
fa:['#3a3560','#2d2950','#231f3f'],fb:['#322e55','#27234a','#1e1b3a'],fs:['#241f40','#1c1832','#151226']};
function mk(){const m=new Map();return {m,set(x,y,z,k,tag){x=Math.floor(x);y=Math.floor(y);z=Math.floor(z);m.set(x+','+y+','+z,{x,y,z,k,tag:tag||null});},has(x,y,z){return m.has(Math.floor(x)+','+Math.floor(y)+','+Math.floor(z));}};}
function box(V,x0,x1,y0,y1,z0,z1,k,tag){for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)V.set(x,y,z,k,tag);}
function line(V,a,b,k,tag){const d=sub(b,a),L=vlen(d),n=Math.max(1,Math.ceil(L/0.3));for(let i=0;i<=n;i++){const q=add(a,mul(d,i/n));V.set(q[0],q[1],q[2],k,tag);}}
function limb(V,A,B,uF,k,tF,tB,cf){
 const d=sub(B,A),L=vlen(d);if(L<0.01)return;const ax=nrm(d);
 let u=sub(uF,mul(ax,dot(uF,ax)));
 if(vlen(u)<0.3){u=sub([1,0,0],mul(ax,ax[0]));if(vlen(u)<0.3)u=sub([0,0,1],mul(ax,ax[2]));}
 u=nrm(u);const w=crs(ax,u);const n=Math.max(1,Math.ceil(L/0.4));
 for(let i=0;i<=n;i++){const fr=i/n,p=add(A,mul(d,fr)),kk=cf?cf(fr):k;
  for(const su of [-1,1])for(const sw of [-1,1]){const q=add(add(p,mul(u,0.5*su)),mul(w,0.5*sw));V.set(q[0],q[1],q[2],kk,su>0?tF:tB);}}}
const BASE={P:[14,11.5],r:0,sh:0,h:[0,0,-8.6],e:[-0.5,0.5,-1],f:[14,2.2,1.2],k:[1,0.2,0.2]};
const SYM=['h','e','f','k','a'];
function expand(q){const o={};
 for(const k of SYM)if(q[k]){o[k+'L']=q[k];o[k+'R']=q[k];}
 for(const k of SYM)for(const s of ['L','R'])if(q[k+s])o[k+s]=q[k+s];
 for(const s of ['L','R'])if(o['h'+s]&&!o['a'+s])o['a'+s]=null;
 for(const k in q)if(!SYM.includes(k)&&!/^[hefka][LR]$/.test(k))o[k]=q[k];
 return o;}
function merged(ex){if(ex._m)return ex._m;const b=Object.assign({},expand(BASE),expand(ex.base||{}));
 ex._m=[Object.assign({},b,expand(ex.A)),Object.assign({},b,expand(ex.B))];return ex._m;}
function getPose(ex,t){const [A,B]=merged(ex);const o={};
 for(const k in Object.assign({},A,B)){const a=A[k],b=B[k];
  if(Array.isArray(a)&&Array.isArray(b))o[k]=a.map((v,i)=>v+(b[i]-v)*t);
  else if(typeof a==='number'&&typeof b==='number')o[k]=a+(b-a)*t;
  else o[k]=(t<0.5?(a!==undefined?a:b):(b!==undefined?b:a));}
 return o;}
function ik(S,T,L1,L2,pole){let d=sub(T,S),D=vlen(d);const mx=L1+L2-0.05,mn=Math.abs(L1-L2)+0.4;
 if(D>mx){d=mul(d,mx/D);D=mx;}if(D<mn){d=D<1e-6?[0,0,-mn]:mul(d,mn/D);D=mn;}
 const u=nrm(d),a=(L1*L1-L2*L2+D*D)/(2*D),h=Math.sqrt(Math.max(0,L1*L1-a*a));
 let n=sub(pole,mul(u,dot(pole,u)));if(vlen(n)<1e-3){n=sub([0,0,1],mul(u,u[2]));if(vlen(n)<1e-3)n=[1,0,0];}
 n=nrm(n);return {m:add(add(S,mul(u,a)),mul(n,h)),e:add(S,d)};}
function solve(p){
 const phi=p.r*D2R,F=[Math.cos(phi),0,Math.sin(phi)],Sd=[-Math.sin(phi),0,Math.cos(phi)];
 const P=[p.P[0],0,p.P[1]],shc=add(add(P,mul(Sd,7.5)),[0,0,p.sh||0]),head=add(P,mul(Sd,10.6));
 const S={p,F,Sd,P,head,sh:{},hip:{},hand:{},elb:{},knee:{},ank:{}};
 for(const [s,sg] of [['L',-1],['R',1]]){
  const Sh=add(shc,[0,sg*3.6,0]);S.sh[s]=Sh;let T;
  if(p.hh)T=add(add(head,mul(F,-1.0)),[0,sg*2.4,0]);
  else if(p['a'+s]){const a=p['a'+s];T=[a[0],sg*a[1],a[2]];}
  else{const h=p['h'+s];T=add(Sh,[h[0],sg*h[1],h[2]]);}
  const e=p['e'+s],r=ik(Sh,T,4.5,4.5,[e[0],sg*e[1],e[2]]);S.elb[s]=r.m;S.hand[s]=r.e;
  const Hp=add(P,[0,sg*1.7,0]);S.hip[s]=Hp;
  const f=p['f'+s],k=p['k'+s],rk=ik(Hp,[f[0],sg*f[1],f[2]],5.3,5.2,[k[0],sg*k[1],k[2]]);S.knee[s]=rk.m;S.ank[s]=rk.e;}
 return S;}
function dumbbell(V,c,ax){const cx=Math.floor(c[0]),cy=Math.floor(c[1]),cz=Math.floor(c[2]);
 for(let t=-2;t<=2;t++){const at=Math.abs(t);
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){
   if(at<2&&(i||j))continue;const o=[0,0,0];const idx=[0,1,2].filter(x=>x!==ax);o[ax]=t;o[idx[0]]=i;o[idx[1]]=j;
   V.set(cx+o[0],cy+o[1],cz+o[2],at<2?'bar':'plate');}}}
function body(V,S){
 const {p,F,Sd,P}=S;
 for(let s=-1.6;s<=7.9;s+=0.4){
  const waist=s>=2.2&&s<5;const as=waist?[-1.5,-0.5,0.5,1.5]:[-2.5,-1.5,-0.5,0.5,1.5,2.5];
  for(const a of as)for(const b of [-1.5,-0.5,0.5,1.5]){
   const q=add(add(add(P,mul(Sd,s)),[0,a,0]),mul(F,b));const fr=b>0;let k='skin',tag=null;
   if(s<2.2){k='shorts';tag=fr?(s>1?'abs':null):'glutes';}
   else if(s<5)tag=fr?'abs':'lowback';
   else tag=(fr||(Math.abs(a)>2&&b>-1))?'chest':(s>=6.8&&Math.abs(a)<=1.6?'traps':'back');
   V.set(q[0],q[1],q[2],k,tag);}}
 for(const sg of ['L','R']){const Sh=S.sh[sg];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let l=-1;l<=1;l++)if(i*i+j*j+l*l<=2)V.set(Math.floor(Sh[0])+i,Math.floor(Sh[1])+j,Math.floor(Sh[2])+l,'skin','delts');}
 limb(V,add(P,mul(Sd,7.6)),add(P,mul(Sd,9.2)),F,'skin','traps','traps');
 const hc=S.head.map(Math.floor);
 const fa=Math.abs(F[0])>=Math.abs(F[2])?0:2,sa=fa===0?2:0,fs=Math.sign(F[fa])||1,ss=Math.sign(Sd[sa])||1;
 for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let l=-1;l<=1;l++){
  const o=[i,j,l],fo=o[fa]*fs,so=o[sa]*ss;let k='skin';
  if(so===1||fo===-1)k='hair';else if(fo===1&&so===0&&j!==0)k='eye';
  V.set(hc[0]+i,hc[1]+j,hc[2]+l,k);}
 const fwdsign=(p.tx||1);
 for(const [s,sg] of [['L',-1],['R',1]]){
  const Sh=S.sh[s],El=S.elb[s],Ha=S.hand[s];
  const dU=nrm(sub(El,Sh)),dF=sub(Ha,El);let uF=sub(dF,mul(dU,dot(dF,dU)));if(vlen(uF)<0.8)uF=F;
  limb(V,Sh,El,uF,'skin','biceps','triceps');limb(V,El,Ha,uF,'skin','forearm','forearm');
  box(V,Math.floor(Ha[0]-0.5),Math.floor(Ha[0]+0.5),Math.floor(Ha[1]-0.5),Math.floor(Ha[1]+0.5),Math.floor(Ha[2]-0.5),Math.floor(Ha[2]+0.5),'skin');
  const Hp=S.hip[s],Kn=S.knee[s],An=S.ank[s];
  const sh2=sub(An,Kn);let bend=sub(sh2,mul(nrm(sub(Kn,Hp)),dot(sh2,nrm(sub(Kn,Hp)))));
  let uL=vlen(bend)>0.8?mul(bend,-1):F;
  limb(V,Hp,Kn,uL,'skin','quads','hams',fr=>fr<0.4?'shorts':'skin');
  limb(V,Kn,An,uL,'skin',null,'calves');
  const high=An[2]>4.5;const toe=high?add(An,[2.6*fwdsign,0,-1]):[An[0]+3*fwdsign,An[1],0.3];
  const d=sub(toe,An),n=Math.ceil(vlen(d)/0.3);
  for(let i=0;i<=n;i++){const q=add(An,mul(d,i/n));for(const o of [-0.5,0.5])V.set(q[0],q[1]+o,q[2]-0.3,'shoe');}
  V.set(An[0]-0.5,An[1]-0.5,An[2]-0.3,'shoe');V.set(An[0]-0.5,An[1]+0.5,An[2]-0.3,'shoe');
 }}
function benchBack(V,Pp,r,seatLen){
 const phi=r*D2R,F=[Math.cos(phi),0,Math.sin(phi)],Sd=[-Math.sin(phi),0,Math.cos(phi)];const P=[Pp[0],0,Pp[1]];
 for(let s=1.5;s<=13;s+=0.35)for(const b of [-2.6,-3.2])for(let y=-2;y<=1;y++){const q=add(add(P,mul(Sd,s)),mul(F,b));V.set(q[0],y,q[2],'pad');}
 const sz=Math.floor(Pp[1]-2.2);
 seatBox(V,Math.floor(Pp[0]-1.5),Math.floor(Pp[0]+(seatLen||5)),sz);
 if(r>20){const q=add(add(P,mul(Sd,4)),mul(F,-3.4));for(const y of [-2,1])line(V,[Math.floor(Pp[0])-1,y+0.5,sz-1],[q[0],y+0.5,q[2]],'frame');}}
function seatBox(V,x0,x1,sz){box(V,x0,x1,-2,1,sz,sz,'pad');
 for(const x of [x0+1,x1-1])for(const y of [-2,1])box(V,x,x,y,y,0,sz-1,'frame');
 for(const y of [-2,1])box(V,x0+1,x1-1,y,y,0,0,'frame');}
function flatBench(V,x0,x1,zt){seatBox(V,x0,x1,zt-1);}
function mc1000(V,cx,cy,fx,fy,carZ,o){o=o||{};const vx=-fy,vy=fx;
 const P=(u,v,z,k)=>V.set(cx+fx*u+vx*v,cy+fy*u+vy*v,z,k);
 const B=(u0,u1,v0,v1,z0,z1,k)=>{for(let u=u0;u<=u1;u++)for(let v=v0;v<=v1;v++)for(let z=z0;z<=z1;z++)P(u,v,z,k);};
 B(0,1,0,1,1,30,'frame');                                   // coluna da polia
 for(let n=1;n<=9;n++)P(1,0,Math.round(29-(n-1)*3.2),'hole');   // furos 1..9
 B(-4,-3,7,8,1,31,'frame');                                  // poste traseiro
 B(-3,-2,3,6,1,15,'stack');                                  // pilha de pesos
 for(let z=16;z<=29;z++){P(-3,3,z,'bar');P(-3,6,z,'bar');}   // hastes guia
 B(-4,1,0,1,31,31,'frame');B(-4,-3,0,8,31,31,'frame');B(-4,1,7,8,31,31,'frame');
 B(0,2,0,1,32,32,'gold');                                     // polia alta
 const hz=o.hz||31,hu=o.hu||3;B(1,hu,0,1,hz,hz,'frame');B(hu,hu,-7,8,hz,hz,'bar'); // pegadores da barra fixa
 for(let u=0;u<=5;u++){P(u,-Math.round(u*0.8),0,'frame');P(u,1+Math.round(u*0.8),0,'frame');} // base em V
 B(-5,-2,-1,9,0,0,'frame');
 if(carZ!==null&&carZ<29)B(1,2,-1,2,Math.round(carZ)-1,Math.round(carZ)+1,'gold');   // carrinho da polia
}
function machine(V,ax,ay,az,pers){
 const side=Math.abs(ay)>3,behind=!side&&ax<pers;
 if(side){const s=Math.sign(ay);mc1000(V,Math.floor(ax),Math.round(ay)+(s>0?1:-1),0,-s,az);}
 else if(behind)mc1000(V,Math.floor(ax)-1,0,1,0,az);
 else mc1000(V,Math.floor(ax)+1,0,-1,0,az);}
function cable(V,S,c,pers){
 const a=c.a;machine(V,a[0],a[1],a[2],pers);
 const hl=S.hand.L,hr=S.hand.R,tgt={};
 if(c.to==='hands'){
  const m=mul(add(hl,hr),0.5);
  if(c.att==='rope'){line(V,a,m,'cable');line(V,m,hl,'cable');line(V,m,hr,'cable');box(V,Math.floor(m[0]),Math.floor(m[0]),Math.floor(m[1])-1,Math.floor(m[1]),Math.floor(m[2]),Math.floor(m[2]),'gold');}
  else{line(V,a,m,'cable');line(V,hl,hr,'bar');}}
 else if(c.to==='handR'||c.to==='handL'){const h=S.hand[c.to.slice(-1)];line(V,a,h,'cable');V.set(h[0],h[1],h[2],'gold');}
 else{const an=S.ank[c.to.slice(-1)];line(V,a,an,'cable');box(V,Math.floor(an[0]-0.5),Math.floor(an[0]+0.5),Math.floor(an[1]-0.5),Math.floor(an[1]+0.5),Math.floor(an[2]-0.5),Math.floor(an[2]+0.5),'gold');}}
function propFn(V,pr,S){
 if(pr.t==='flat')flatBench(V,pr.x0,pr.x1,pr.z);
 else if(pr.t==='pullup'){mc1000(V,Math.round(pr.x)+5,0,-1,0,null,{hz:Math.round(pr.z),hu:5});}
 else if(pr.t==='dips'){const xc=pr.x1+2;for(const y of [-5,4])box(V,pr.x0+3,pr.x1+1,y,y,pr.z,pr.z,'bar');box(V,pr.x1+1,pr.x1+1,-5,4,pr.z,pr.z,'frame');mc1000(V,xc,0,-1,0,null);}
 else if(pr.t==='rail'){for(const y of [-6,5])box(V,pr.x,pr.x,y,y,0,pr.z,'frame');box(V,pr.x,pr.x,-6,5,pr.z,pr.z,'bar');}
 else if(pr.t==='cable')cable(V,S,pr,S.P[0]);}
function buildScene(ex,t){
 const V=mk(),pA=getPose(ex,0),p=getPose(ex,t),S=solve(p);
 if(ex.bench==='back')benchBack(V,pA.P,pA.r,ex.seatLen);
 else if(ex.bench==='seat')seatBox(V,Math.floor(pA.P[0]-3),Math.floor(pA.P[0]+3),Math.floor(pA.P[1]-2.2));
 for(const pr of (ex.props||[]))if(pr.t!=='cable')propFn(V,pr,S);
 body(V,S);
 for(const pr of (ex.props||[]))if(pr.t==='cable')propFn(V,pr,S);
 const d=ex.db;
 if(d==='two'){for(const s of ['L','R'])dumbbell(V,S.hand[s],{x:0,y:1,z:2}[ex.da||'y']);}
 else if(d==='R'||d==='L')dumbbell(V,S.hand[d],{x:0,y:1,z:2}[ex.da||'y']);
 else if(d==='one')dumbbell(V,mul(add(S.hand.L,S.hand.R),0.5),{x:0,y:1,z:2}[ex.da||'y']);
 const sh=new Set();for(const v of V.m.values())if(v.z>=0)sh.add(v.x+','+v.y);
 return {vox:[...V.m.values()],shadow:sh};}
const VW=200,VH=170,OX=72,OY=100;
function rotc(x,y,k){for(let i=0;i<k;i++){const nx=13-y,ny=x-14;x=nx;y=ny;}return [x,y];}
function sceneItems(sc,view,ex,hot,fb){
 const items=[];
 for(let x=fb[0];x<=fb[1];x++)for(let y=fb[2];y<=fb[3];y++){const [rx,ry]=rotc(x,y,view);items.push({sx:(rx-ry)*2+OX,sy:(rx+ry)+OY,d:rx+ry-100,c:COL[sc.shadow.has(x+','+y)?'fs':((x+y)&1?'fa':'fb')]});}
 const pr=ex.prim||[],sc2=ex.sec||[];
 for(const v of sc.vox){const [rx,ry]=rotc(v.x,v.y,view);let k=v.k;
  if(v.tag&&pr.includes(v.tag))k=hot?'redH':'red';else if(v.tag&&sc2.includes(v.tag))k=hot?'orH':'or';
  items.push({sx:(rx-ry)*2+OX,sy:(rx+ry)-(v.z+1)*2+OY,d:rx+ry+v.z,c:COL[k]});}
 return items;}
function viewInfo(ex){
 if(ex._vi)return ex._vi;
 let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const ss=[0,0.5,1].map(t=>buildScene(ex,t));
 for(const s of ss)for(const v of s.vox){if(v.x<x0)x0=v.x;if(v.x>x1)x1=v.x;if(v.y<y0)y0=v.y;if(v.y>y1)y1=v.y;}
 const fb=[x0-3,x1+3,y0-3,y1+3];let a=1e9,b=1e9,c=-1e9,d=-1e9;
 for(let view=0;view<4;view++)for(const s of ss)for(const q of sceneItems(s,view,ex,false,fb)){
  if(q.sx-2<a)a=q.sx-2;if(q.sx+2>c)c=q.sx+2;if(q.sy<b)b=q.sy;if(q.sy+4>d)d=q.sy+4;}
 a=Math.max(0,a-4);b=Math.max(0,b-4);c=Math.min(VW,c+4);d=Math.min(VH,d+4);
 return ex._vi={fb,box:[a,b,c-a,d-b]};}
function drawScene(g,sc,view,ex,hot){
 g.fillStyle='#1b1830';g.fillRect(0,0,VW,VH);
 const items=sceneItems(sc,view,ex,hot,viewInfo(ex).fb);
 items.sort((a,b)=>a.d-b.d);
 for(const q of items){const c=q.c;g.fillStyle=c[0];g.fillRect(q.sx-1,q.sy,2,1);g.fillRect(q.sx-2,q.sy+1,4,1);g.fillStyle=c[1];g.fillRect(q.sx-2,q.sy+2,2,2);g.fillStyle=c[2];g.fillRect(q.sx,q.sy+2,2,2);}
}
if(typeof module!=='undefined')module.exports={buildScene,drawScene,VW,VH,getPose,viewInfo};
function defView(ex){const b=['back','lowback','traps','hams','calves','triceps'],p=ex.prim||[];return (p[0]==='glutes'||p.some(t=>b.includes(t)))?2:0;}
if(typeof module!=='undefined')module.exports.defView=defView;
