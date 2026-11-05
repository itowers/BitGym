const CP0={style:'cel',head:1,square:0,hairV:1,eye:1,arm:1,leg:1,muscle:1,shoulder:1,waist:1,hips:1,hand:1,foot:1,ow:1,cel:1,pix:0,pitch:30,cSkin:'',cHair:'',cShorts:'',cBg:''};
let CP=Object.assign({},CP0);
/* ---- desenho vetorial 2D a partir do esqueleto */
const VST={
 cel:{n:'A · Cartoon',d:'Contorno preto e sombra em duas cores, estilo desenho animado.',bg:'#2a2c31',grid:'#36393f',shadow:'rgba(0,0,0,.28)',ink:'#16141c',ow:0.32,cel:0.45,shade:'rgba(120,30,40,.28)',
  c:{skin:['#f6c49a','#d9906a'],hair:['#ffd75e','#d9a52e'],shorts:['#2f3b5c','#202942'],eye:['#16141c','#16141c'],red:['#ef4438','#b8231c'],redH:['#ff6b55','#d93a2c'],or:['#ff9e3d','#d4741f'],orH:['#ffbe6a','#ea8f35'],
   bar:['#d5d9e2','#9aa0ad'],plate:['#98a2b6','#68718a'],frame:['#666d7c','#4a505e'],pad:['#5a5f8f','#3e4270'],gold:['#ffd45a','#d9a52e'],cable:['#f2f2f2','#c8c8c8']}},
 line:{n:'B · Traço',d:'Desenho de linha fino, corpo claro e músculos em cor, como ilustração de manual.',bg:'#f4f1ea',grid:'#e6e1d6',shadow:'rgba(60,40,20,.12)',ink:'#2a2622',ow:0.2,cel:0,
  c:{skin:['#fffaf2','#fffaf2'],hair:['#f3d36b','#f3d36b'],shorts:['#3a4152','#3a4152'],eye:['#2a2622','#2a2622'],red:['#e8473b','#e8473b'],redH:['#ff6a55','#ff6a55'],or:['#f6a04a','#f6a04a'],orH:['#ffbd73','#ffbd73'],
   bar:['#ffffff','#ffffff'],plate:['#c9c4ba','#c9c4ba'],frame:['#ffffff','#ffffff'],pad:['#d9d4ca','#d9d4ca'],gold:['#f3d36b','#f3d36b'],cable:['#2a2622','#2a2622']}},
 flat:{n:'C · Vetor flat',d:'Formas lisas sem contorno, sombras suaves. Estilo ilustração de app.',bg:'#dfe8f1',grid:'#d3dde8',shadow:'rgba(30,50,80,.16)',ink:'rgba(20,30,50,.18)',ow:0.12,cel:0.35,shade:'rgba(20,40,90,.16)',
  c:{skin:['#f2b98f','#de9a70'],hair:['#f7c948','#e2ad2a'],shorts:['#3d5a80','#30496a'],eye:['#22303f','#22303f'],red:['#f0544f','#d13f3a'],redH:['#ff7468','#e8524a'],or:['#ffa94d','#ec8f32'],orH:['#ffc177','#f5a250'],
   bar:['#b7c2cf','#97a3b2'],plate:['#7d8aa1','#5f6b82'],frame:['#a9b6c6','#8796a8'],pad:['#7d8fb3','#677a9e'],gold:['#f7c948','#e2ad2a'],cable:['#7d8a9b','#7d8a9b']}},
 sil:{n:'D · Silhueta',d:'Corpo cinza neutro e só os músculos coloridos, como apps de academia.',bg:'#ffffff',grid:'#f0f2f5',shadow:'rgba(0,0,0,.07)',ink:'#ffffff',ow:0.22,cel:0,
  c:{skin:['#b9c0cc','#b9c0cc'],hair:['#9aa2b0','#9aa2b0'],shorts:['#9aa2b0','#9aa2b0'],eye:['#b9c0cc','#b9c0cc'],red:['#ec3b33','#ec3b33'],redH:['#ff5a48','#ff5a48'],or:['#ff9a3c','#ff9a3c'],orH:['#ffb664','#ffb664'],
   bar:['#6d7482','#6d7482'],plate:['#4c525e','#4c525e'],frame:['#d4d8df','#d4d8df'],pad:['#c7ccd5','#c7ccd5'],gold:['#9aa2b0','#9aa2b0'],cable:['#6d7482','#6d7482']}}};
for(const k in VST){const c=VST[k].c;c.hole=c.hole||['#15141a','#15141a'];c.stack=c.stack||['#4a505d','#353a45'];c.kb=c.kb||['#7d8597','#596072'];c.band=c.band||['#3fcf7d','#2ea862'];}
function vscene(ex,t,hot,yaw,pitch){
 const cam=camera(yaw,pitch),sc=shapesFor(ex,t,{props:true}),S=sc.S,pz=getPose(ex,t),{F,Sd}=S,Lat=nrm(sub(S.sh.R,S.sh.L));
 const P2=q=>[dot(q,cam.right),-dot(q,cam.up)];
 const cxy=nrm([cam.c[0],cam.c[1],0]),DP=q=>q[0]*cxy[0]+q[1]*cxy[1]+0.35*q[2];
 const pr=ex.prim||[],se=ex.sec||[];
 const tk=(tag,base)=>{if(tag&&pr.includes(tag))return hot?'redH':'red';if(tag&&se.includes(tag))return hot?'orH':'or';return base;};
 const pick=(a,b)=>pr.includes(a)?a:pr.includes(b)?b:se.includes(a)?a:se.includes(b)?b:null;
 const items=[],at=w=>add(S.P,mul(Sd,w)),front=dot(F,cam.c)>0;
 // tronco
 {const a2=P2(add(S.P,mul(Sd,-0.7))),b2=P2(at(8.2)),pts3=[];
  for(const [w,hw,hd] of [[-0.7,2.15*CP.hips,1.5],[1.2,2.3*CP.hips,1.6],[3.6,1.95*CP.waist,1.45],[6.4,2.55*CP.shoulder,1.7*CP.muscle],[7.9,2.35*CP.shoulder,1.45]])for(const a of [-1,1])for(const b of [-1,1])pts3.push(P2(add(add(at(w),mul(Lat,a*hw)),mul(F,b*hd))));
  const hull=(P)=>{P=P.slice().sort((p,q)=>p[0]-q[0]||p[1]-q[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
   for(const p of P){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
   for(let i=P.length-1;i>=0;i--){const p=P[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}return lo.slice(0,-1).concat(up.slice(0,-1));};
  const regs=[[0,0.2,tk(front?null:'glutes','shorts')],[0.2,0.52,tk(front?'abs':'lowback','skin')],[0.52,0.86,tk(front?'chest':'back','skin')],[0.86,1.2,tk(front?'chest':'traps','skin')]];
  items.push({d:DP(at(4)),prims:[{t:'torso',pts:hull(pts3),a:a2,b:b2,regs},
   {t:'seg',a:P2(at(7.6)),b:P2(S.head),r0:0.8,r1:0.75,k:tk('traps','skin')}]});}
 // cabeça
 {const R=2.45*CP.head,hc=add(S.head,mul(Sd,(R-2.45)*0.75)),c=P2(hc),fd=P2(F),sd=P2(Sd),ld=P2(Lat),fz=dot(F,cam.c);
  const eyes=[];for(const sg of [-1,1]){const n=nrm(add(mul(F,0.85),mul(Lat,sg*0.45)));if(dot(n,cam.c)>0.15){const q=add(add(hc,mul(F,R*0.82)),add(mul(Lat,sg*R*0.42),mul(Sd,-R*0.05)));eyes.push(P2(q));}}
  items.push({d:DP(at(4))+0.6,prims:[{t:'head',c,R,hv:CP.hairV,hair:[c[0]+sd[0]*R*0.42-fd[0]*R*0.32,c[1]+sd[1]*R*0.42-fd[1]*R*0.32],eyes,fz}]});}
 const fw=pz.tx||1,ua=pick('biceps','triceps'),th=pick('quads','hams')||pick('adductors','adductors'),cv=pick('calves','shins')||'calves';
 for(const s of ['L','R']){
  const Sh=S.sh[s],El=S.elb[s],Ha=S.hand[s],Hp=S.hip[s],Kn=S.knee[s],An=S.ank[s];
  items.push({d:(DP(Sh)+DP(El)+DP(Ha))/3,prims:[
   {t:'seg',a:P2(Sh),b:P2(El),r0:1.05*CP.arm*CP.muscle,r1:0.85*CP.arm,k:tk(ua,'skin')},{t:'seg',a:P2(El),b:P2(Ha),r0:0.85*CP.arm*Math.sqrt(CP.muscle),r1:0.7*CP.arm,k:tk('forearm','skin')},
   {t:'disc',c:P2(Ha),r:0.78*CP.hand,k:'skin'},{t:'disc',c:P2(Sh),r:1.12*CP.arm*CP.muscle,k:tk('delts','skin')}]});
  const high=An[2]>4.5,toe=high?add(An,[2.4*fw,0,-0.9]):[An[0]+2.6*fw,An[1],0.7],mid=add(Hp,mul(sub(Kn,Hp),0.32));
  items.push({d:(DP(Hp)+DP(Kn)+DP(An))/3-0.01,prims:[
   {t:'seg',a:P2(mid),b:P2(Kn),r0:1.4*CP.leg*CP.muscle,r1:1.1*CP.leg,k:tk(th,'skin')},{t:'seg',a:P2(Hp),b:P2(mid),r0:1.55*CP.leg*CP.hips,r1:1.45*CP.leg*CP.muscle,k:tk(front?null:'glutes','shorts')},
   {t:'seg',a:P2(Kn),b:P2(An),r0:1.05*CP.leg*CP.muscle,r1:0.75*CP.leg,k:tk(cv,'skin')},{t:'seg',a:P2(An),b:P2(toe),r0:0.7*CP.foot,r1:0.65*CP.foot,k:'skin'}]});}
 // equipamentos
 for(const sh of sc.sh){if(!sh.prop)continue;const k=sh.k;
  if(sh.db){const hs=sh.db==='LR'?['L','R']:[sh.db],hd=Math.max(...hs.map(q=>DP(S.hand[q])))+0.3;
   if(sh.t===0){const a=[sh.ax,sh.ay,sh.az],b=[sh.ax+sh.bx,sh.ay+sh.by,sh.az+sh.bz];items.push({d:hd,prims:[{t:'seg',a:P2(a),b:P2(b),r0:0.32,r1:0.32,k}]});}
   else if(sh.t===1){const c=[sh.cx,sh.cy,sh.cz];items.push({d:hd+0.02,prims:[{t:'disc',c:P2(c),r:sh.r,k}]});}
   else{const c=[sh.cx,sh.cy,sh.cz],ax=[sh.ux,sh.uy,sh.uz],u=P2(add(c,mul(ax,sh.h))),w=P2(add(c,mul(ax,-sh.h))),side=Math.hypot(u[0]-w[0],u[1]-w[1]);
    items.push({d:hd+0.01+(dot(c,cam.c)>dot(S.hand[hs[0]],cam.c)?0.02:-0.02),prims:[{t:'seg',a:u,b:w,r0:sh.r*0.78,r1:sh.r*0.78,k}]});}
   continue;}
  if(sh.t===0){const a=[sh.ax,sh.ay,sh.az],b=[sh.ax+sh.bx,sh.ay+sh.by,sh.az+sh.bz];items.push({d:Math.min(DP(a),DP(b))+(k==='bar'?0.2:-0.05),prims:[{t:'seg',a:P2(a),b:P2(b),r0:Math.max(0.18,sh.r),r1:Math.max(0.18,sh.r),k}],thin:k==='cable'});}
  else if(sh.t===1||sh.t===3){const c=[sh.cx,sh.cy,sh.cz];items.push({d:DP(c)+0.25,prims:[{t:'disc',c:P2(c),r:sh.r*0.75,k}]});}
  else{let c=[sh.cx,sh.cy,sh.cz],ax;
   if(sh.t===5)ax=[[sh.hx,0,0],[0,sh.hy,0],[0,0,sh.hz]];else{const Fb=[sh.fx,0,sh.fz],Sb=[sh.sx,0,sh.sz];ax=[mul(Fb,sh.hy),[0,sh.hx,0],mul(Sb,sh.hz)];}
   const zmin=c[2]-Math.abs(ax[0][2])-Math.abs(ax[1][2])-Math.abs(ax[2][2]),prims=[];
   for(let i=0;i<3;i++)for(const sg of [-1,1]){const n=mul(ax[i],sg),nl=nrm(n);if(dot(nl,cam.c)<=0.02)continue;
    const j=(i+1)%3,l=(i+2)%3,fc=add(c,n);prims.push({t:'poly',pts:[[1,1],[1,-1],[-1,-1],[-1,1]].map(([u,v])=>P2(add(add(fc,mul(ax[j],u)),mul(ax[l],v)))),k,tone:nl[2]>0.5?0:(dot(nl,cam.right)<0?0:1)});}
   items.push({d:c[0]*cxy[0]+c[1]*cxy[1]+0.35*zmin,prims,box:true});}}
 {const hk=ex.db||ex.kb,hs=hk==='two'||hk==='one'?['L','R']:(hk==='L'||hk==='R')?[hk]:[];
  for(const q of hs){const hd=DP(S.hand[q])+0.3+0.05;items.push({d:hd,prims:[{t:'disc',c:P2(S.hand[q]),r:0.78*CP.hand*0.9,k:'skin'}]});}}
 items.sort((a,b)=>a.d-b.d);
 const A=S.ank,onF=Math.min(A.L[2],A.R[2])<2.5,g=onF?[(A.L[0]+A.R[0])/2,(A.L[1]+A.R[1])/2,0]:[S.P[0],S.P[1],0];
 return {items,shadow:P2(g),cam,P2,ctr:sc.ctr};}
function sqPts(c,R){return [[c[0]-R,c[1]-R],[c[0]+R,c[1]-R],[c[0]+R,c[1]+R],[c[0]-R,c[1]+R]];}
function rpoly(pts,rad,ox,oy){ox=ox||0;oy=oy||0;const g=new Path2D(),n=pts.length,R=Array.isArray(rad)?rad:pts.map(()=>rad);
 const P=pts.map(q=>[q[0]+ox,q[1]+oy]);const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const st=m(P[n-1],P[0]);g.moveTo(st[0],st[1]);
 for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],pv=P[(i+n-1)%n];const lim=Math.min(Math.hypot(a[0]-b[0],a[1]-b[1]),Math.hypot(a[0]-pv[0],a[1]-pv[1]))/2;g.arcTo(a[0],a[1],b[0],b[1],Math.max(0,Math.min(R[i],lim)));}
 g.closePath();return g;}
function vpath(p,ox,oy){ox=ox||0;oy=oy||0;const k=1-CP.square*0.85;
 if(p.t==='disc'||p.t==='head'){const r=p.r||p.R;return rpoly(sqPts(p.c,r),r*k,ox,oy);}
 if(p.t==='poly')return rpoly(p.pts,0.05,ox,oy);
 if(p.t==='torso')return rpoly(p.pts,1.3*k+0.15,ox,oy);
 const a=p.a,b=p.b,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1e-3,ux=dx/L,uy=dy/L,nx=-uy,ny=ux,r0=p.r0,r1=p.r1;
 const pts=[[a[0]-ux*r0+nx*r0,a[1]-uy*r0+ny*r0],[b[0]+ux*r1+nx*r1,b[1]+uy*r1+ny*r1],[b[0]+ux*r1-nx*r1,b[1]+uy*r1-ny*r1],[a[0]-ux*r0-nx*r0,a[1]-uy*r0-ny*r0]];
 return rpoly(pts,[r0*k,r1*k,r1*k,r0*k],ox,oy);}
function celShade(g,path,p,st,k){if(!st.cel||st.cel<0.01)return;const sh=new Path2D();sh.rect(-999,-999,1998,1998);sh.addPath(vpath(p,-st.cel,-st.cel*0.8));
 g.save();g.clip(path,'nonzero');g.fillStyle=st.shade;g.fill(sh,'evenodd');g.restore();}
function vdraw(g,sc,st){const C=st.c,col=(k,i)=>(C[k]||C.skin)[i||0];st=Object.assign({},st,{ow:st.ow*CP.ow,cel:st.cel*CP.cel});
 for(const it of sc.items){
  if(st.ow>0){g.strokeStyle=st.ink;g.lineJoin='round';g.lineWidth=(it.thin?0.6:1)*st.ow*2;for(const p of it.prims)g.stroke(vpath(p));}
  for(const p of it.prims){const path=vpath(p);
   if(p.t==='poly'){g.fillStyle=col(p.k,p.tone);g.fill(path);continue;}
   if(p.t==='torso'){g.save();g.clip(path,'nonzero');const a=p.a,b=p.b,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=-uy*30,ny=ux*30;
     for(const [w0,w1,k] of p.regs){const e0=w0===0?12:0,e1=w1>1?12:0,p0=[a[0]+dx*w0-ux*e0,a[1]+dy*w0-uy*e0],p1=[a[0]+dx*w1+ux*e1,a[1]+dy*w1+uy*e1];
      g.beginPath();g.moveTo(p0[0]+nx,p0[1]+ny);g.lineTo(p1[0]+nx,p1[1]+ny);g.lineTo(p1[0]-nx,p1[1]-ny);g.lineTo(p0[0]-nx,p0[1]-ny);g.closePath();g.fillStyle=col(k,0);g.fill();}
     g.restore();celShade(g,path,p,st);continue;}
   if(p.t==='head'){g.fillStyle=col('skin',0);g.fill(path);
     const hr=p.R*(p.fz<-0.3?1.12:0.98)*p.hv,hp=rpoly(sqPts(p.hair,hr),hr*(1-CP.square*0.85));
     g.save();g.clip(path);g.fillStyle=col('hair',0);g.fill(hp);if(st.ow>0&&st.c.hair[0]!==st.c.skin[0]){g.lineWidth=st.ow*1.4;g.strokeStyle=st.ink;g.stroke(hp);}g.restore();
     celShade(g,path,p,st);
     for(const e of p.eyes){g.beginPath();g.ellipse(e[0],e[1],0.26*CP.eye*CP.head,0.4*CP.eye*CP.head,0,0,Math.PI*2);g.fillStyle=col('eye',0);g.fill();}
     continue;}
   g.fillStyle=col(p.k,0);g.fill(path);if(!it.thin)celShade(g,path,p,st);}}}
function vframe(ex,view,pitch){const pts=[];
 for(const t of [0,0.5,1]){const sc=vscene(ex,t,0,(typeof YAWF==='function'?YAWF(ex,view):45+90*view),pitch);for(const it of sc.items)for(const p of it.prims){
  if(p.t==='disc')pts.push([p.c[0]-p.r,p.c[1]-p.r],[p.c[0]+p.r,p.c[1]+p.r]);else if(p.t==='head')pts.push([p.c[0]-p.R,p.c[1]-p.R],[p.c[0]+p.R,p.c[1]+p.R]);
  else if(p.t==='seg'){for(const q of [p.a,p.b])pts.push([q[0]-p.r0,q[1]-p.r0],[q[0]+p.r0,q[1]+p.r0]);}else if(p.pts)for(const q of p.pts)pts.push(q);}
  pts.push([sc.shadow[0]-4,sc.shadow[1]],[sc.shadow[0]+4,sc.shadow[1]+2]);}
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const q of pts){x0=Math.min(x0,q[0]);y0=Math.min(y0,q[1]);x1=Math.max(x1,q[0]);y1=Math.max(y1,q[1]);}
 return [x0,y0,x1,y1];}
function shadeHex(h,f){const n=parseInt(h.slice(1),16);return '#'+[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*f))).toString(16).padStart(2,'0')).join('');}
function styleOf(key){const s=VST[key],c=Object.assign({},s.c);
 if(CP.cSkin){c.skin=[CP.cSkin,shadeHex(CP.cSkin,0.82)];if(key!=='sil'&&key!=='line')c.eye=c.eye;}
 if(CP.cHair)c.hair=[CP.cHair,shadeHex(CP.cHair,0.82)];if(CP.cShorts)c.shorts=[CP.cShorts,shadeHex(CP.cShorts,0.78)];
 return Object.assign({},s,{c,bg:CP.cBg||s.bg});}
let PXC=null;const PALC=new Map();
function rgbOf(s){if(s[0]==='#'){const n=parseInt(s.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255,1];}const m=s.match(/[\d.]+/g).map(Number);return [m[0],m[1],m[2],m.length>3?m[3]:1];}
function paletteOf(st){const key=JSON.stringify([st.c,st.bg,st.ink,st.grid,st.shadow,st.shade]);if(PALC.has(key))return PALC.get(key);
 const bg=rgbOf(st.bg),out=[],over=(a,b)=>[a[0]*(1-b[3])+b[0]*b[3],a[1]*(1-b[3])+b[1]*b[3],a[2]*(1-b[3])+b[2]*b[3]];
 const add=c=>out.push([Math.round(c[0]),Math.round(c[1]),Math.round(c[2])]);
 add(bg);add(over(bg,rgbOf(st.grid)));const sh=over(bg,rgbOf(st.shadow));add(sh);add(over(over(bg,rgbOf(st.grid)),rgbOf(st.shadow)));
 const ink=rgbOf(st.ink);add(ink[3]<1?over(bg,ink):ink);
 for(const k in st.c)for(const h of st.c[k]){const c=rgbOf(h);add(c);if(st.shade&&st.cel)add(over(c,rgbOf(st.shade)));}
 PALC.set(key,out);return out;}
function quantize(cv,st){const g=cv.getContext('2d'),im=g.getImageData(0,0,cv.width,cv.height),d=im.data,P=paletteOf(st),memo=new Map();
 for(let i=0;i<d.length;i+=4){const k=(d[i]<<16)|(d[i+1]<<8)|d[i+2];let m=memo.get(k);
  if(m===undefined){let bd=1e9;for(let j=0;j<P.length;j++){const p=P[j],dr=p[0]-d[i],dg=p[1]-d[i+1],db=p[2]-d[i+2],dd=dr*dr*0.3+dg*dg*0.59+db*db*0.11;if(dd<bd){bd=dd;m=j;}}memo.set(k,m);}
  const p=P[m];d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;}
 g.putImageData(im,0,0);}
function vrender(cv,ex,t,hot,view,stKey,fr){const st=styleOf(stKey),W=cv.width,H=cv.height,pitch=CP.pitch;
 const px=CP.pix>1?Math.round(CP.pix):1,SS=px>1?4:1,L=Math.round(W/px),LH=Math.round(H/px);let tgt=cv;
 if(px>1){if(!PXC)PXC=document.createElement('canvas');if(PXC.width!==L*SS||PXC.height!==LH*SS){PXC.width=L*SS;PXC.height=LH*SS;}tgt=PXC;}
 const g=tgt.getContext('2d'),w=tgt.width,h=tgt.height;
 const [x0,y0,x1,y1]=fr,span=Math.max(x1-x0,(y1-y0))*1.12+2,s=Math.min(w,h)/Math.max(span,26),ox=w/2-(x0+x1)/2*s,oy=h/2-(y0+y1)/2*s;
 g.setTransform(1,0,0,1,0,0);g.fillStyle=st.bg;g.fillRect(0,0,w,h);
 const sc=vscene(ex,t,hot,(typeof YAWF==='function'?YAWF(ex,view):45+90*view),pitch);g.setTransform(s,0,0,s,ox,oy);
 g.strokeStyle=st.grid;g.lineWidth=(px>1?SS*1.0:1.8)/s;
 for(let i=-40;i<=40;i+=6){g.beginPath();let a=sc.P2([14+i,-40,0]),b=sc.P2([14+i,40,0]);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();g.beginPath();a=sc.P2([-26,i,0]);b=sc.P2([54,i,0]);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
 g.beginPath();g.ellipse(sc.shadow[0],sc.shadow[1],4.2,4.2*Math.sin(pitch*Math.PI/180),0,0,7);g.fillStyle=st.shadow;g.fill();
 vdraw(g,sc,st);g.setTransform(1,0,0,1,0,0);
 if(px>1){const P=paletteOf(st),im=g.getImageData(0,0,w,h).data,idx=new Uint8Array(w*h),memo=new Map();
  for(let i=0,q=0;q<idx.length;i+=4,q++){const k=(im[i]<<16)|(im[i+1]<<8)|im[i+2];let m=memo.get(k);
   if(m===undefined){let bd=1e9;m=0;for(let j=0;j<P.length;j++){const p=P[j],dr=p[0]-im[i],dg=p[1]-im[i+1],db=p[2]-im[i+2],dd=dr*dr*0.3+dg*dg*0.59+db*db*0.11;if(dd<bd){bd=dd;m=j;}}memo.set(k,m);}idx[q]=m;}
  const c2=cv.getContext('2d'),out=c2.createImageData(W,H),o=out.data,cnt=new Uint16Array(P.length),INKI=4,LI=new Uint8Array(L*LH),LO=new Uint8Array(L*LH);
  for(let y=0;y<LH;y++)for(let x=0;x<L;x++){cnt.fill(0);for(let yy=0;yy<SS;yy++)for(let xx=0;xx<SS;xx++)cnt[idx[(y*SS+yy)*w+x*SS+xx]]++;
   let b=0;for(let j=1;j<P.length;j++)if(cnt[j]>cnt[b])b=j;if(cnt[INKI]>=SS*SS*0.3&&b!==INKI&&b<4)b=INKI;
   LI[y*L+x]=b;}
  for(let y=0;y<LH;y++)for(let x=0;x<L;x++){const i=y*L+x;if(LI[i]>=4)continue;
   for(const n of [x>0?i-1:-1,x<L-1?i+1:-1,y>0?i-L:-1,y<LH-1?i+L:-1])if(n>=0&&LI[n]>4){LO[i]=1;break;}}
  for(let y=0;y<LH;y++)for(let x=0;x<L;x++){const i=y*L+x,b=LO[i]?INKI:LI[i];
   const p=P[b];for(let yy=0;yy<px;yy++){const Y=y*px+yy;if(Y>=H)break;for(let xx=0;xx<px;xx++){const X=x*px+xx;if(X>=W)break;const q=(Y*W+X)*4;o[q]=p[0];o[q+1]=p[1];o[q+2]=p[2];o[q+3]=255;}}}
  c2.putImageData(out,0,0);}}
