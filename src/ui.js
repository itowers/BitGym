const $=s=>document.querySelector(s);
const EZ=x=>0.5-0.5*Math.cos(Math.PI*x);
const SEQ=[0,0].concat([1,2,3,4,5,6].map(i=>EZ(i/6)),[1,1],[1,2,3,4,5,6].map(i=>EZ(1-i/7)));
const HOT=SEQ.map((_,i)=>i>=2&&i<10?1:0),NF=SEQ.length;
const PH=SEQ.map((_,i)=>i<2?'Início':i<8?'Fase de esforço':i<10?'Topo: contraia':'Volta controlada');
const GN=Object.fromEntries(GROUPS);
const byId=Object.fromEntries(E.map(e=>[e.id,e]));
const MUS={chest:'Peitoral',abs:'Abdômen',back:'Costas',lowback:'Lombar',traps:'Trapézio',glutes:'Glúteos',delts:'Ombros',biceps:'Bíceps',triceps:'Tríceps',forearm:'Antebraço',quads:'Quadríceps',hams:'Posterior de coxa',calves:'Panturrilha',adductors:'Adutores',shins:'Tibial (canela)'};
let state={g:'todos',eq:new Set(),q:''};
let store={log:{},fav:[],plan:null};
let saveFn=null;
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
CP=Object.assign({},CP0,{style:'cel',head:0.78,square:0,hairV:0.88,eye:0.75,arm:0.88,leg:0.86,muscle:0.7,shoulder:0.84,waist:0.78,hips:0.72,hand:0.85,foot:0.9,ow:0.9,cel:1.15,pix:4,pitch:28});
const YAW={};
function yawBase(ex){if(YAW[ex.id]!==undefined)return YAW[ex.id];
 const back=defView(ex)===2,cand=back?[110,135,160,200,225,250]:[20,45,70,290,315,340];
 const ts=[0,0.25,0.5,0.75,1],Ss=ts.map(t=>solve(getPose(ex,t)));
 const J=[['hand','L',2],['hand','R',2],['elb','L',1],['elb','R',1],['ank','L',1],['ank','R',1],['knee','L',1],['knee','R',1]];
 let best=cand[1],bs=-1e9;
 for(const y of cand){const cam=camera(y,CP.pitch),P2=q=>[dot(q,cam.right),dot(q,cam.up)],Dz=q=>dot(q,cam.c);let sc=0;const OC={},MV={};
  for(const [k,s,w] of J){const p0=Ss[0][k][s],p1=Ss[4][k][s];if(vlen(sub(p1,p0))<1.2)continue;MV[k+s]=1;OC[k+s]=OC[k+s]||0;
   for(let i=0;i<5;i++){const q=Ss[i][k][s];if(i){const a=P2(Ss[i-1][k][s]),b=P2(q);sc+=w*Math.hypot(a[0]-b[0],a[1]-b[1]);}
    const S=Ss[i],A=S.P,B=add(S.P,mul(S.Sd,8)),a2=P2(A),b2=P2(B),q2=P2(q),dx=b2[0]-a2[0],dy=b2[1]-a2[1],L2=dx*dx+dy*dy||1;
    const f=Math.max(0,Math.min(1,((q2[0]-a2[0])*dx+(q2[1]-a2[1])*dy)/L2)),px=a2[0]+dx*f,py=a2[1]+dy*f,sp=add(A,mul(sub(B,A),f));
    if(Math.hypot(q2[0]-px,q2[1]-py)<2.8&&Dz(q)<Dz(sp)-0.3)OC[k+s]=(OC[k+s]||0)+w*2.2;}}
  {const pair=(a,b)=>(OC[a]!==undefined||OC[b]!==undefined)?((MV[a]&&MV[b])?Math.min(OC[a]||0,OC[b]||0):(OC[a]||0)+(OC[b]||0)):0;sc-=pair('handL','handR')+pair('elbL','elbR')+pair('ankL','ankR')+pair('kneeL','kneeR');}
  for(const S of Ss){const a=P2(S.P),b=P2(add(S.P,mul(S.Sd,8))),c=P2(S.ank.L),d=P2(S.ank.R);sc+=1.6*Math.hypot(a[0]-b[0],a[1]-b[1])+0.6*(Math.hypot(a[0]-c[0],a[1]-c[1])+Math.hypot(a[0]-d[0],a[1]-d[1]))/2;}
  {const ang=(S,a,b,c)=>{const p=P2(a),q=P2(b),r=P2(c);return Math.atan2(p[1]-q[1],p[0]-q[0])-Math.atan2(r[1]-q[1],r[0]-q[0]);};
   const wrap=x=>Math.abs(((x+3*Math.PI)%(2*Math.PI))-Math.PI);
   const A=Ss[0],B=Ss[4],nk=S=>add(S.P,mul(S.Sd,8));
   for(const s of ['L','R']){
    sc+=7*wrap(ang(B,B.sh[s],B.elb[s],B.hand[s])-ang(A,A.sh[s],A.elb[s],A.hand[s]));
    sc+=5*wrap(ang(B,B.hip[s],B.knee[s],B.ank[s])-ang(A,A.hip[s],A.knee[s],A.ank[s]));
    sc+=5*wrap(ang(B,nk(B),B.P,B.knee[s])-ang(A,nk(A),A.P,A.knee[s]));
    sc+=4*wrap(ang(B,nk(B),B.sh[s],B.hand[s])-ang(A,nk(A),A.sh[s],A.hand[s]));}}
  for(const pr of (ex.props||[])){if(pr.t!=='cable')continue;const a=pr.a,side=Math.abs(a[1])>3,P0=Ss[0].P,behind=!side&&a[0]<P0[0];
   const col=side?[a[0],a[1],14]:[behind?a[0]-2:a[0]+1.5,0,14],tq=P2(col),pq=P2([P0[0],0,14]);
   for(const S of Ss){const hq=P2(S.hand.R),hl=P2(S.hand.L);
    if(Dz(col)>Dz([P0[0],0,14])&&(Math.abs(tq[0]-pq[0])<3.6||Math.abs(tq[0]-hq[0])<2.2||Math.abs(tq[0]-hl[0])<2.2))sc-=9;}}
  const dd=Math.min(...[45,135,225,315].map(a=>Math.abs(((y-a+540)%360)-180)));sc-=dd*0.08;
  if(sc>bs){bs=sc;best=y;}}
 return YAW[ex.id]=best;}
function YAWF(ex,view){return yawBase(ex)+90*((view-defView(ex)+4)%4);}
const FCACHE=new Map();
const VFR={};function vfr(ex,view){const k=ex.id+'|'+view;if(!VFR[k])VFR[k]=vframe(ex,view,CP.pitch);return VFR[k];}
function paintTo(ex,c,t,view,hot){if(c.width!==400){c.width=400;c.height=400;}
 const k=ex.id+'|'+view+'|'+t.toFixed(3)+'|'+hot;let f=FCACHE.get(k);
 if(!f){f=document.createElement('canvas');f.width=f.height=400;vrender(f,ex,t,hot,view,CP.style,vfr(ex,view));if(FCACHE.size>400)FCACHE.clear();FCACHE.set(k,f);}
 c.getContext('2d').drawImage(f,0,0);}
function mkCanvas(){return document.createElement('canvas');}
const TQ=[];let TQrun=false;
function thumb(ex,c){c.width=400;c.height=400;TQ.push([ex,c]);if(!TQrun){TQrun=true;setTimeout(tq,0);}}
function tq(){const j=TQ.shift();if(!j){TQrun=false;return;}if(j[1].isConnected)paintTo(j[0],j[1],1,defView(j[0]),true);setTimeout(tq,0);}
const EQS={halteres:'Halteres',banco:'Banco',polia:'Polia',barra:'Barra',corpo:'Corpo',kettlebell:'Kettlebell',elastico:'Elástico'};
function poliaInfo(ex){const c=(ex.props||[]).find(p=>p.t==='cable');if(!c)return null;const a=c.a,P0=getPose(ex,0).P;
 const h=a[2]>=29?'polia alta (topo)':'furo '+Math.max(1,Math.min(9,Math.round((29-a[2])/3.2)+1));
 const pos=a[1]<-3?'torre à sua esquerda':a[1]>3?'torre à sua direita':a[0]>P0[0]?'de frente para a torre':'de costas para a torre';
 const m=pmodeOf(ex),mt=m==='1:1'?'duas polias ligadas (1:1)':'uma polia (2:1)';
 return {h,pos,m,mt,ratio:m==='1:1'?1:0.5,txt:'Polia: '+h+' · '+pos+' · '+mt};}
const PLATES=[0.5,1,1.25,2,2.5,5];
function plateSplit(kg){const cfg=store.dbcfg||{bar:2,plates:[1,2,2.5,5]};const side=(kg-cfg.bar)/2;if(side<0)return null;
 const ps=cfg.plates.slice().sort((a,b)=>b-a);let rest=Math.round(side*100)/100;const out=[];
 for(const p of ps){while(rest>=p-1e-6&&out.length<12){out.push(p);rest=Math.round((rest-p)*100)/100;}}
 return {bar:cfg.bar,side:out,miss:rest};}
const nf=x=>String(x).replace('.',',');
function renderList(){
 const g=state.g;const root=$('#list');root.innerHTML='';
 let L=E.filter(e=>(g==='todos'||e.g===g)&&(!state.eq.size||[...state.eq].every(q=>e.eq.includes(q)))&&(!state.q||(e.n+' '+e.prim.map(m=>MUS[m]).join(' ')).toLowerCase().includes(state.q)));
 $('#count').textContent=L.length+' exercício'+(L.length===1?'':'s');
 if(!L.length){root.innerHTML='<p class="empty">Nenhum exercício com esses filtros.</p>';return;}
 const frag=document.createDocumentFragment();
 L.forEach(e=>{const a=document.createElement('a');a.className='card';a.href='#ex-'+e.id;
  const c=mkCanvas();thumb(e,c);a.appendChild(c);
  const d=document.createElement('div');d.className='cb';
  d.innerHTML='<b>'+e.n+'</b><span>'+e.prim.map(m=>MUS[m]).join(' · ')+'</span><i>'+e.eq.map(q=>EQS[q]).join(' · ')+'</i>';
  a.appendChild(d);frag.appendChild(a);});
 root.appendChild(frag);}
function chips(){
 $('#gch').innerHTML=[['todos','Todos']].concat(GROUPS).map(([k,v])=>'<button class="chip'+(state.g===k?' on':'')+'" data-g="'+k+'">'+v+'</button>').join('');
 $('#ech').innerHTML=Object.entries(EQ).map(([k,v])=>'<button class="chip sm'+(state.eq.has(k)?' on':'')+'" data-e="'+k+'">'+v+'</button>').join('');}
document.addEventListener('click',ev=>{
 const g=ev.target.closest('[data-g]'),e=ev.target.closest('[data-e]');
 if(g){state.g=g.dataset.g;chips();renderList();}
 if(e){const k=e.dataset.e;state.eq.has(k)?state.eq.delete(k):state.eq.add(k);chips();renderList();}});
$('#q').addEventListener('input',e=>{state.q=e.target.value.trim().toLowerCase();renderList();});
/* ---------- storage */
function normStore(d){const s={log:{},fav:[],plan:null};if(d&&typeof d==='object'){if(d.log&&typeof d.log==='object')s.log=d.log;if(Array.isArray(d.fav))s.fav=d.fav;if(d.plan&&Array.isArray(d.plan.days))s.plan=d.plan;if(d.dbcfg&&typeof d.dbcfg.bar==='number'&&Array.isArray(d.dbcfg.plates))s.dbcfg=d.dbcfg;}return s;}
async function initStore(){
 try{const l=localStorage.getItem('exercicios-v1');if(l)store=normStore(JSON.parse(l));}catch(e){}
 saveFn=()=>{try{localStorage.setItem('exercicios-v1',JSON.stringify(store));}catch(e){}};
 try{
  const db=await claude.use('db'),user=await claude.use('user');
  if(db&&user){const id=await user.id();const ref=db.collection('data/users/'+id).doc('app');
   let snap=null;try{snap=await ref.get();}catch(e){}
   let d=snap&&(typeof snap.data==='function'?snap.data():(snap.data||snap));
   if(d&&(d.log||d.fav||d.plan)){const r=normStore(d);
    for(const k in store.log){if(!r.log[k])r.log[k]=store.log[k];}
    if(!r.plan&&store.plan)r.plan=store.plan;if(!r.dbcfg&&store.dbcfg)r.dbcfg=store.dbcfg;
    store=r;}
   saveFn=()=>{try{localStorage.setItem('exercicios-v1',JSON.stringify(store));}catch(e){}ref.set(store).catch(()=>{});};
   saveFn();$('#sync').textContent='Salvo na sua conta';}
 }catch(e){}
 if(!$('#sync').textContent)$('#sync').textContent='Salvo neste navegador';
 route();}
function save(){if(saveFn)saveFn();}
/* ---------- detail */
let anim=null;
const VIEWS=['v-home','v-detail','v-plano','v-setup','v-dia'];
function show(id){for(const v of VIEWS){const el=document.getElementById(v);if(el)el.hidden=v!==id;}window.scrollTo(0,0);}
function stopAnim(){if(anim){clearInterval(anim.t);anim=null;}}
function lastSession(id){const L=store.log[id]||[];return L.filter(s=>s.d!==today()).slice(-1)[0];}
function openEx(id){
 const e=byId[id];if(!e){location.hash='catalogo';return;}
 stopAnim();show('v-detail');const v=$('#v-detail');
 const last=lastSession(id);
 v.innerHTML='<button class="back" id="bk">← Voltar</button>'+
 '<h2>'+e.n+'</h2><p class="grp">'+GN[e.g]+' · '+e.sets+'</p>'+
 '<canvas id="cv"></canvas>'+
 '<div class="ctl"><button id="pp">❚❚ Pausar</button><button id="rt">↻ Girar</button><button id="sp">Velocidade: normal</button></div>'+
 '<div class="phase" id="ph"></div>'+
 '<div class="leg"><span><i class="sw r"></i>Músculo principal</span><span><i class="sw o"></i>Auxiliar</span></div>'+
 '<div class="tags">'+e.prim.map(m=>'<span class="t r">'+MUS[m]+'</span>').join('')+e.sec.map(m=>'<span class="t o">'+MUS[m]+'</span>').join('')+'</div>'+
 (poliaInfo(e)?'<p class="pol">'+poliaInfo(e).txt+'</p>':'')+(e.space?'<p class="pol sp">Pede espaço livre: faça no sentido do comprimento da sacada.</p>':'')+
 '<div class="tags">'+e.eq.map(q=>'<span class="t">'+EQ[q]+'</span>').join('')+(e.lim?'<span class="t w">Limitado por carga: use tempo lento e unilateral</span>':'')+'</div>'+
 '<h3>Como fazer</h3><p>'+e.c+'</p><h3>Dica</h3><p>'+e.d+'</p>'+
 '<h3>Registrar série</h3><div class="log"><label>'+(poliaInfo(e)?'Peso na pilha (kg)':e.eq.includes('halteres')?'Carga (kg por halter)':'Carga (kg)')+'<input id="kg" type="number" inputmode="decimal" min="0" step="0.5" placeholder="0"></label><label>Repetições<input id="rp" type="number" inputmode="numeric" min="1" step="1" placeholder="10"></label><button id="add" class="pri">+ Adicionar</button></div><p class="err" id="er"></p><p class="muted" id="pl"></p>'+
 '<div id="sets"></div>'+
 (last?'<p class="muted">Último treino ('+fmtD(last.d)+'): '+last.s.map(x=>x.kg+'kg×'+x.r).join(', ')+'</p>':'')+
 '<div id="hist"></div>';
 const cv=$('#cv');let view=defView(e),i=0,playing=true,ms=115;
 const draw=()=>{paintTo(e,cv,SEQ[i],view,HOT[i]);$('#ph').textContent=PH[i];};
 draw();
 const tick=()=>{if(playing){i=(i+1)%NF;draw();}};
 anim={t:setInterval(tick,ms)};
 $('#pp').onclick=ev=>{playing=!playing;ev.currentTarget.innerHTML=playing?'❚❚ Pausar':'▶ Reproduzir';};
 $('#rt').onclick=()=>{view=(view+1)%4;draw();};
 $('#sp').onclick=ev=>{ms=ms===115?260:115;clearInterval(anim.t);anim.t=setInterval(tick,ms);ev.currentTarget.textContent='Velocidade: '+(ms===115?'normal':'lenta');};
 $('#bk').onclick=()=>{history.length>1?history.back():location.hash='catalogo';};
 const kg=$('#kg'),rp=$('#rp');
 const PI=poliaInfo(e),real=k=>PI?Math.round(k*PI.ratio*100)/100:k;
 if(last){const ls=last.s[last.s.length-1];kg.value=ls.st!==undefined?ls.st:ls.kg;}
 {const pl=plannedItem(id);if(pl){rp.value=pl.reps;rp.placeholder=pl.reps;}}
 const sess=()=>{const L=store.log[id]=store.log[id]||[];let s=L.find(x=>x.d===today());return s;};
 const paint=()=>{const s=sess();const box=$('#sets');
  box.innerHTML=s&&s.s.length?'<ul>'+s.s.map((x,n)=>'<li><span>Série '+(n+1)+'</span><b>'+nf(x.kg)+' kg × '+x.r+(x.st!==undefined&&x.st!==x.kg?' <i class="pst">pilha '+nf(x.st)+'</i>':'')+'</b><button data-del="'+n+'" aria-label="Remover série">×</button></li>').join('')+'</ul>':'';
  const all=(store.log[id]||[]);let best=0;all.forEach(x=>x.s.forEach(y=>{if(y.kg>best)best=y.kg;}));
  $('#hist').innerHTML=all.length?'<h3>Histórico</h3><p class="muted">Maior carga: '+best+' kg · '+all.length+' treino'+(all.length>1?'s':'')+'</p><ul class="h">'+all.slice(-5).reverse().map(x=>'<li><span>'+fmtD(x.d)+'</span><b>'+x.s.map(y=>y.kg+'×'+y.r).join('  ')+'</b></li>').join('')+'</ul>':'';};
 paint();
 $('#add').onclick=()=>{const k=parseFloat(String(kg.value).replace(',','.')),r=parseInt(rp.value,10);const er=$('#er');
  if(!(k>=0)||kg.value===''){er.textContent='Informe a carga (use 0 para peso do corpo).';return;}
  if(!(r>=1)){er.textContent='Informe as repetições.';return;}
  er.textContent='';const L=store.log[id]=store.log[id]||[];let s=L.find(x=>x.d===today());if(!s){s={d:today(),s:[]};L.push(s);}
  s.s.push(PI?{kg:real(k),st:k,r:r}:{kg:k,r:r});save();rp.value='';paint();};
 [kg,rp].forEach(x=>x.addEventListener('input',()=>{$('#er').textContent='';}));
 const plUp=()=>{const el=$('#pl');const k=parseFloat(String(kg.value).replace(',','.'));
  if(PI){el.textContent=k>0?'Carga real: '+nf(real(k))+' kg ('+PI.mt+'). É esse valor que fica no histórico.':'Com '+PI.mt+(PI.ratio<1?', cada 2 kg da pilha equivalem a 1 kg.':', o peso da pilha é o peso real.');return;}
  if(!e.eq.includes('halteres')){el.textContent='';return;}
  if(!(k>0)){el.textContent='';return;}const s=plateSplit(k);if(!s){el.textContent='Carga menor que a barra do halter.';return;}
  el.textContent='Montagem de cada halter: barra '+nf(s.bar)+' kg'+(s.side.length?' + '+s.side.map(nf).join(' + ')+' kg de cada lado':' sem anilhas')+(s.miss>0.01?' (faltam '+nf(Math.round(s.miss*200)/100)+' kg com as anilhas que você tem)':'');};
 kg.addEventListener('input',plUp);plUp();
 $('#sets').onclick=ev=>{const b=ev.target.closest('[data-del]');if(!b)return;const s=sess();s.s.splice(+b.dataset.del,1);if(!s.s.length){const L=store.log[id];L.splice(L.indexOf(s),1);}save();paint();};}
function fmtD(d){const p=d.split('-');return p[2]+'/'+p[1];}
/* ---------- plano de treino */
const SPLIT={1:[['peito','costas','quadriceps','ombros']],
 2:[['peito','costas','ombros','biceps','triceps'],['quadriceps','posterior','panturrilha','abdomen']],
 3:[['peito','triceps'],['costas','biceps'],['quadriceps','posterior','ombros']],
 4:[['peito','triceps'],['costas','biceps'],['quadriceps','panturrilha'],['ombros','posterior','abdomen']],
 5:[['peito','triceps'],['costas','biceps'],['quadriceps','panturrilha'],['ombros','abdomen'],['posterior','antebraco']],
 6:[['peito','triceps'],['costas','biceps'],['quadriceps','panturrilha'],['ombros','abdomen'],['posterior','antebraco'],['peito','costas']],
 7:[['peito','triceps'],['costas','biceps'],['quadriceps','panturrilha'],['ombros','abdomen'],['posterior','antebraco'],['peito','costas'],['abdomen']]};
const PICK={peito:['supino-reto','crucifixo-reto'],costas:['puxada-alta','remada-unilateral'],ombros:['desenvolvimento','elevacao-lateral'],
 biceps:['rosca-direta','rosca-martelo'],triceps:['triceps-corda','triceps-frances'],quadriceps:['goblet','bulgaro'],posterior:['stiff','hip-thrust'],
 panturrilha:['panturrilha-pe'],abdomen:['crunch-polia','prancha'],antebraco:['flexao-punho','farmer-carry']};
const DN=i=>'Dia '+String.fromCharCode(65+i);
const clone=o=>JSON.parse(JSON.stringify(o));
let draft=null,dsel=0,openPick=null,setupErr='';
const isUni=e=>/cada (lado|perna|braço)/.test(e.sets||'');
function exTime(it,p){const e=byId[it.id];if(!e)return 0;return it.sets*it.reps*p.repSec*(isUni(e)?2:1)+Math.max(0,it.sets-1)*p.rest+45;}
function dayTime(d,p){return d.items.reduce((s,it)=>s+exTime(it,p),0);}
const fmtMin=s=>{const m=Math.max(1,Math.round(s/60));return m<60?m+' min':Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')+' min';};
const gName=g=>GN[g]||g;
function newDay(i,groups){const d={name:DN(i),groups:groups.slice(),items:[]};for(const g of groups)for(const id of (PICK[g]||[]))if(byId[id])d.items.push({id,g,sets:3,reps:10});return d;}
function plannedItem(id){if(!store.plan)return null;for(const d of store.plan.days)for(const it of d.items)if(it.id===id)return it;return null;}
function startDraft(){draft=store.plan?clone(store.plan):{repSec:3,rest:60,days:SPLIT[3].map((g,i)=>newDay(i,g)),touched:false};dsel=0;openPick=null;setupErr='';}
function setDays(n){const old=draft.days;
 if(!draft.touched)draft.days=SPLIT[n].map((g,i)=>newDay(i,g));
 else{draft.days=[];for(let i=0;i<n;i++)draft.days.push(old[i]||newDay(i,SPLIT[n][i]));}
 dsel=Math.min(dsel,n-1);openPick=null;}
const stp=(act,val,lbl)=>'<span class="stp"><button data-act="'+act+'" data-d="-1" aria-label="Diminuir '+lbl+'">−</button><b>'+val+'</b><button data-act="'+act+'" data-d="1" aria-label="Aumentar '+lbl+'">+</button></span>';
function renderSetup(){
 const v=$('#v-setup'),p=draft,d=p.days[dsel];
 let h='<h2>'+(store.plan?'Editar treino':'Montar treino')+'</h2>'+
 '<h3>1 · Dias de treino por semana</h3><div class="row-scroll">'+[1,2,3,4,5,6,7].map(n=>'<button class="chip'+(p.days.length===n?' on':'')+'" data-act="nd" data-n="'+n+'">'+n+(n===1?' dia':' dias')+'</button>').join('')+'</div>'+
 '<h3>2 · Grupos musculares de cada dia</h3><div class="row-scroll">'+p.days.map((x,i)=>'<button class="chip'+(i===dsel?' on':'')+'" data-act="ds" data-i="'+i+'">'+x.name+' · '+(x.items.length?fmtMin(dayTime(x,p)):'vazio')+'</button>').join('')+'</div>'+
 '<div class="gsel">'+GROUPS.map(([g,n])=>'<button class="chip sm'+(d.groups.includes(g)?' on':'')+'" data-act="dg" data-g2="'+g+'">'+n+'</button>').join('')+'</div>'+
 '<h3>3 · Exercícios do '+d.name+'</h3>'+
 '<div class="cfg"><span>Tempo por repetição</span>'+stp('rs',p.repSec+' s','tempo por repetição')+'<span>Descanso entre séries</span>'+stp('rst',p.rest+' s','descanso')+'</div>';
 if(!d.groups.length)h+='<p class="empty">Escolha pelo menos um grupo muscular para este dia.</p>';
 for(const g of d.groups){
  const its=d.items.map((it,k)=>[it,k]).filter(([it])=>it.g===g);
  h+='<div class="gblk"><div class="gh"><b>'+gName(g)+'</b><span>'+(its.length?fmtMin(its.reduce((s,[it])=>s+exTime(it,p),0)):'')+'</span></div>';
  for(const [it,k] of its){const e=byId[it.id];
   h+='<div class="pi"><div class="pn"><a href="#ex-'+it.id+'">'+e.n+'</a><span>≈ '+fmtMin(exTime(it,p))+(isUni(e)?' · cada lado':'')+'</span></div><button class="rm" data-act="rm" data-k="'+k+'" aria-label="Remover '+e.n+'">×</button>'+
    '<div class="pe"><label>Séries</label>'+stp('se:'+k,it.sets,'séries')+'<label>Repetições</label>'+stp('re:'+k,it.reps,'repetições')+'</div></div>';}
  h+='<button class="addx" data-act="pk" data-g2="'+g+'">'+(openPick===g?'Fechar lista':'+ Adicionar exercício de '+gName(g))+'</button>';
  if(openPick===g){const sel=new Set(d.items.map(x=>x.id));
   h+='<ul class="pick">'+E.filter(e=>e.g===g).map(e=>'<li><button data-act="ad" data-id="'+e.id+'"'+(sel.has(e.id)?' class="on"':'')+'><b>'+e.n+'</b><span>'+e.eq.map(q=>EQS[q]).join(' · ')+'</span><i>'+(sel.has(e.id)?'✓':'+')+'</i></button></li>').join('')+'</ul>';}
  h+='</div>';}
 const tot=p.days.reduce((s,x)=>s+dayTime(x,p),0);
 h+='<p class="muted">Cálculo: séries × repetições × '+p.repSec+' s + descanso de '+p.rest+' s entre séries + 45 s para preparar cada exercício. Exercícios unilaterais contam os dois lados.</p>';
 h+='<div class="cbar"><div><b>'+p.days.length+' dia'+(p.days.length>1?'s':'')+' · '+fmtMin(tot)+' por semana</b><span class="err">'+setupErr+'</span></div><div class="cbtn">'+(store.plan?'<button data-act="cancel">Cancelar</button>':'')+'<button class="pri" data-act="ok">Confirmar treino</button></div></div>';
 v.innerHTML=h;}
function setupAct(b){const a=b.dataset.act,p=draft;if(!p)return;const d=p.days[dsel];setupErr='';
 if(a==='nd'){p.touched=p.touched||false;setDays(+b.dataset.n);}
 else if(a==='ds'){dsel=+b.dataset.i;openPick=null;}
 else if(a==='dg'){const g=b.dataset.g2;p.touched=true;if(d.groups.includes(g)){d.groups=d.groups.filter(x=>x!==g);d.items=d.items.filter(x=>x.g!==g);if(openPick===g)openPick=null;}
  else{d.groups.push(g);d.groups.sort((x,y)=>GROUPS.findIndex(q=>q[0]===x)-GROUPS.findIndex(q=>q[0]===y));for(const id of (PICK[g]||[]))if(byId[id])d.items.push({id,g,sets:3,reps:10});}}
 else if(a==='pk'){openPick=openPick===b.dataset.g2?null:b.dataset.g2;}
 else if(a==='ad'){const id=b.dataset.id;p.touched=true;const k=d.items.findIndex(x=>x.id===id);if(k>=0)d.items.splice(k,1);else d.items.push({id,g:byId[id].g,sets:3,reps:10});}
 else if(a==='rm'){p.touched=true;d.items.splice(+b.dataset.k,1);}
 else if(a==='rs'){p.repSec=Math.min(8,Math.max(1,p.repSec+(+b.dataset.d)));}
 else if(a==='rst'){p.rest=Math.min(300,Math.max(15,p.rest+15*(+b.dataset.d)));}
 else if(a.startsWith('se:')||a.startsWith('re:')){const it=d.items[+a.slice(3)];p.touched=true;
  if(a[0]==='s')it.sets=Math.min(10,Math.max(1,it.sets+(+b.dataset.d)));else it.reps=Math.min(50,Math.max(1,it.reps+(+b.dataset.d)));}
 else if(a==='cancel'){draft=null;location.hash='plano';return;}
 else if(a==='ok'){const bad=p.days.findIndex(x=>!x.items.length);
  if(bad>=0){dsel=bad;setupErr=p.days[bad].name+' está sem exercícios.';renderSetup();return;}
  const pl=clone(p);delete pl.touched;pl.updated=today();store.plan=pl;save();draft=null;location.hash='plano';return;}
 const y=window.scrollY;renderSetup();window.scrollTo(0,y);}
function todayDone(id){const s=(store.log[id]||[]).find(x=>x.d===today());return s?s.s.length:0;}
function renderPlano(){
 const v=$('#v-plano'),p=store.plan;let h='';
 if(!p){h='<h2>Meu treino</h2><div class="intro"><p>Monte seu treino em 3 passos: quantos dias por semana, quais grupos musculares em cada dia e quais exercícios fazer.</p><p class="muted">Começamos com 3 séries de 10 repetições e o tempo estimado de cada exercício. Você pode mudar tudo depois.</p><button class="pri" data-act="start">Montar meu treino</button></div>';}
 else{const tot=p.days.reduce((s,x)=>s+dayTime(x,p),0);
  h='<h2>Meu treino</h2><p class="grp">'+p.days.length+' dia'+(p.days.length>1?'s':'')+' por semana · ≈ '+fmtMin(tot)+' no total</p>';
  h+=p.days.map((d,i)=>{const n=d.items.length,done=d.items.filter(it=>todayDone(it.id)>=it.sets).length;
   return '<a class="dcard" href="#dia-'+i+'"><b>'+d.name+'</b><em>≈ '+fmtMin(dayTime(d,p))+'</em><span>'+d.groups.map(gName).join(' + ')+'</span><span>'+n+' exercício'+(n>1?'s':'')+(done?' · '+done+' concluído'+(done>1?'s':'')+' hoje':'')+'</span></a>';}).join('');
  h+='<button data-act="start" class="edit">Editar treino</button>';}
 {const cfg=store.dbcfg||{bar:2,plates:[1,2,2.5,5]};
  h+='<h3>Halteres de anilha</h3><div class="cfg"><span>Peso da barra do halter</span>'+stp('bar',nf(cfg.bar)+' kg','peso da barra')+'</div><p class="muted">Anilhas que você tem (toque para marcar):</p><div class="gsel">'+PLATES.map(p=>'<button class="chip sm'+(cfg.plates.includes(p)?' on':'')+'" data-act="plt" data-p="'+p+'">'+nf(p)+' kg</button>').join('')+'</div><p class="muted">Ao registrar uma série, o app mostra como montar cada halter.</p>';}
 // histórico
 const t=today();let vol=0,sets=0,exs=0;
 for(const id in store.log){const s=store.log[id].find(x=>x.d===t);if(s&&s.s.length&&byId[id]){exs++;s.s.forEach(x=>{vol+=x.kg*x.r;sets++;});}}
 const days={};for(const id in store.log)store.log[id].forEach(x=>{let sv=0;x.s.forEach(y=>{sv+=y.kg*y.r;});days[x.d]=(days[x.d]||0)+sv;});
 const keys=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);keys.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'));}
 const mx=Math.max(1,...keys.map(k=>days[k]||0));
 h+='<h3>Hoje</h3><div class="stats"><div><b>'+sets+'</b><span>séries</span></div><div><b>'+exs+'</b><span>exercícios</span></div><div><b>'+Math.round(vol).toLocaleString('pt-BR')+'</b><span>kg de volume</span></div></div>'+
 '<h3>Últimos 14 dias</h3><div class="bars">'+keys.map(k=>'<i title="'+fmtD(k)+'" style="height:'+Math.max(4,Math.round((days[k]||0)/mx*100))+'%"'+(days[k]?'':' class="z"')+'></i>').join('')+'</div><p class="muted">Volume = carga × repetições, somado por dia.</p>';
 v.innerHTML=h;}
function renderDia(i){
 const p=store.plan,d=p&&p.days[i];if(!d){location.hash='plano';return;}
 const v=$('#v-dia');
 v.innerHTML='<a class="back" href="#plano">← Meu treino</a><h2>'+d.name+'</h2><p class="grp">'+d.groups.map(gName).join(' + ')+' · ≈ '+fmtMin(dayTime(d,p))+'</p>'+
 '<div id="dl"></div><p class="muted">Toque em um exercício para ver a animação e registrar as séries.</p><button data-act="start" class="edit">Editar treino</button>';
 const L=$('#dl');
 for(const g of d.groups){const its=d.items.filter(x=>x.g===g);if(!its.length)continue;
  const hd=document.createElement('h3');hd.textContent=gName(g);L.appendChild(hd);
  for(const it of its){const e=byId[it.id];if(!e)continue;const done=todayDone(it.id);
   const a=document.createElement('a');a.className='drow'+(done>=it.sets?' ok':'');a.href='#ex-'+it.id;
   const c=mkCanvas();thumb(e,c);a.appendChild(c);
   const t=document.createElement('div');t.innerHTML='<b>'+e.n+'</b><span>'+it.sets+' × '+it.reps+(isUni(e)?' cada lado':'')+' · ≈ '+fmtMin(exTime(it,p))+(poliaInfo(e)?' · '+poliaInfo(e).h:'')+'</span><i>'+(done?(done>=it.sets?'✓ Concluído hoje':done+' de '+it.sets+' séries hoje'):'')+'</i>';
   a.appendChild(t);L.appendChild(a);}}}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;
 const a=b.dataset.act;if(a==='start'){startDraft();location.hash='setup';return;}
 if(b.closest('#v-setup'))setupAct(b);
 if(b.closest('#v-plano')&&(a==='bar'||a==='plt')){const cfg=store.dbcfg=store.dbcfg||{bar:2,plates:[1,2,2.5,5]};
  if(a==='bar')cfg.bar=Math.max(0.5,Math.min(5,Math.round((cfg.bar+0.5*(+b.dataset.d))*2)/2));
  else{const p=+b.dataset.p;cfg.plates=cfg.plates.includes(p)?cfg.plates.filter(x=>x!==p):cfg.plates.concat([p]);}
  save();const y=window.scrollY;renderPlano();window.scrollTo(0,y);}});
/* ---------- route */
let lastTab='plan';
function route(){
 const h=location.hash.slice(1)||'plano';
 let cat=h==='catalogo'||h==='home';if(h.startsWith('ex-'))cat=lastTab==='cat';else lastTab=cat?'cat':'plan';
 document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')===(cat?'#catalogo':'#plano')));
 if(h.startsWith('ex-')){openEx(h.slice(3));return;}
 stopAnim();
 if(cat){show('v-home');return;}
 if(h==='setup'){if(!draft)startDraft();show('v-setup');renderSetup();return;}
 if(h.startsWith('dia-')){show('v-dia');renderDia(+h.slice(4));return;}
 show('v-plano');renderPlano();}
window.addEventListener('hashchange',route);
chips();renderList();route();initStore();
