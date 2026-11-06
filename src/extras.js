/* ---------- extras: corpo (homem/mulher), pegada da mão, foco muscular, próximo exercício e cronômetro */
const ALVO=6; // séries por foco muscular, por dia, até sugerir outro foco/grupo

/* ---- corpo do personagem */
const CP_M={style:'cel',head:0.78,square:0,hairV:0.88,eye:0.75,arm:0.88,leg:0.86,muscle:0.7,shoulder:0.84,waist:0.78,hips:0.72,hand:0.85,foot:0.9,ow:0.9,cel:1.15,pix:4,pitch:28};
const CP_F=Object.assign({},CP_M,{head:0.76,hairV:1.25,arm:0.8,leg:0.88,muscle:0.5,shoulder:0.72,waist:0.7,hips:0.86});
function applyGender(){
 CP=Object.assign({},CP0,store.gender==='mulher'?CP_F:CP_M);
 FCACHE.clear();for(const k in VFR)delete VFR[k];}
function corpoHTML(){const g=store.gender==='mulher'?'mulher':'homem';
 return '<h3>Corpo do personagem</h3><div class="gsel">'+[['homem','Homem'],['mulher','Mulher']].map(([k,n])=>'<button class="chip'+(g===k?' on':'')+'" data-act="gen" data-gen="'+k+'">'+n+'</button>').join('')+'</div><p class="muted">Muda o corpo do personagem nas animações.</p>';}

/* ---- pegada da mão */
const GRIP_NONE=new Set(['superman','nadador','cossack','ponte-uni','frog-pumps','elevacao-lateral-perna','fire-hydrant','coice-quatro-apoios','panturrilha-corpo','tibialis-raise','crunch-chao','sit-up','abdominal-reverso','abdominal-bicicleta','leg-raise-chao','prancha','prancha-lateral','dead-bug','bird-dog','hollow-body','monster-walk','ponte-band','agachamento-band','ytw','kickback-polia','abducao-polia','aducao-polia','extensao-quadril','flexao-perna-polia']);
const GRIP_SUP=new Set(['puxada-fechada','chin-up','rosca-polia','rosca-uni-polia','rosca-polia-alta','rosca-bayesian','rosca-concentrada-polia','rosca-direta','rosca-alternada','rosca-concentrada','rosca-zottman','rosca-inclinada','rosca-scott','triceps-supinada','flexao-punho','flexao-punho-polia','arnold','rosca-elastico']);
const GRIP_PRO=new Set(['supino-uni-pe','supino-bi-pe','supino-uni-sentado','supino-reto','supino-uni-halter','floor-press','supino-inclinado','supino-declinado','flexao','flexao-aberta','flexao-fechada','flexao-inclinada','flexao-declinada','flexao-diamante','puxada-alta','pulldown-reto','remada-alta','barra-fixa','elevacao-escapular','dead-hang','elevacao-joelhos-barra','elevacao-pernas-barra','remada-curvada','remada-aberta','remada-peito-apoiado','desenvolvimento-pe','desenvolvimento','desenvolvimento-uni','desenvolvimento-polia','kb-press','elevacao-lateral','elevacao-frontal','elevacao-lateral-polia','elevacao-frontal-polia','scaption','crucifixo-inverso','crucifixo-inverso-polia','crucifixo-inverso-apoiado','elevacao-y-inclinado','encolhimento-polia','rosca-inversa-polia','rosca-inversa-halteres','rosca-inversa-polia-ab','triceps-barra','extensao-punho','extensao-punho-polia','mergulho-banco','stiff-polia','stiff','terra-romeno','terra-romeno-uni','stiff-uni-polia','terra-polia','kb-terra','band-pull-apart','escalador']);
const GRIPS={
 pronada:{n:'Pronada',s:'palma para baixo',d:'Palma para baixo; costas da mão para cima, polegares se aproximam.'},
 supinada:{n:'Supinada',s:'palma para cima',d:'Palma para cima; polegares apontam para fora.'},
 neutra:{n:'Neutra',s:'palmas frente a frente',d:'Palmas frente a frente, polegar para cima (pegada de martelo, cabo ou paralelas).'}};
function gripOf(e){
 if(GRIP_NONE.has(e.id))return null;
 if(GRIP_SUP.has(e.id))return 'supinada';
 if(GRIP_PRO.has(e.id))return 'pronada';
 return e.eq.some(q=>q!=='corpo'&&q!=='banco')?'neutra':null;}
// sprite 16x16 da mão direita em pixel art
function handGrid(kind){
 const N=16,g=Array.from({length:N},()=>Array(N).fill(0));
 const R=(x,y,w,h,v)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=v;};
 if(kind==='neutra'){R(6,5,6,9,1);R(8,1,3,5,1);R(2,6,5,2,1);R(2,9,5,2,1);R(3,12,4,2,1);R(7,14,4,2,1);R(11,6,1,7,2);}
 else{const v=kind==='supinada'?3:1;
  R(3,3,2,5,v);R(6,1,2,7,v);R(9,2,2,6,v);R(12,4,2,4,v);R(3,8,11,5,v);R(5,13,6,3,v);
  if(kind==='pronada'){R(0,9,3,3,1);for(const x of [4,7,10,13])g[8][x]=2;}
  else{R(13,9,3,3,3);R(5,10,6,1,2);R(4,12,4,1,2);}}
 const o=g.map(r=>r.slice());
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!g[y][x]){
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=g[y+dy]&&g[y+dy][x+dx];if(a){o[y][x]=9;break;}}}
 return o;}
const HAND_COL={1:'#e8b890',2:'#c98f66',3:'#f3d3b3',9:'#6b4429'};
function drawHand(c,kind){
 const g=handGrid(kind),k=c.width/16,x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 g.forEach((r,y)=>r.forEach((v,i)=>{if(v){x.fillStyle=HAND_COL[v];x.fillRect(i*k,y*k,k,k);}}));}
function gripBadge(e){const k=gripOf(e);if(!k)return '';
 return '<div class="hbadge" title="'+GRIPS[k].d+'"><canvas id="hc" width="128" height="128"></canvas><div><b>Pegada '+GRIPS[k].n.toLowerCase()+'</b><span>'+GRIPS[k].s+'</span></div></div>';}

/* ---- foco muscular dentro do grupo */
const FOCO_DEF={peito:'Peitoral médio',costas:'Meio das costas (espessura)',ombros:'Deltoide anterior',biceps:'Bíceps (geral)',triceps:'Tríceps (lateral/medial)',quadriceps:'Quadríceps',posterior:'Glúteo',panturrilha:'Gastrocnêmio (em pé)',abdomen:'Abdômen reto',antebraco:'Flexores do antebraço'};
const FOCO_REG={
 peito:[[/inclinad|declinada|crucifixo-uni-baixo/,'Peitoral superior'],[/supino-declinado|^mergulho$|^crossover$|flexao-inclinada/,'Peitoral inferior']],
 costas:[[/puxada|barra-fixa|chin-up|barra-neutra|pulldown/,'Dorsais (largura)'],[/superman|nadador|bird/,'Lombar'],[/escapular/,'Trapézio']],
 ombros:[[/lateral|^remada-alta$/,'Deltoide lateral'],[/inverso|face-pull|pull-apart|elevacao-y/,'Deltoide posterior'],[/encolhimento/,'Trapézio'],[/rotacao/,'Manguito rotador']],
 biceps:[[/inclinada|bayesian|polia-alta/,'Bíceps (cabeça longa)'],[/scott|concentrada/,'Bíceps (cabeça curta)'],[/martelo|inversa/,'Braquial / braquiorradial']],
 triceps:[[/frances|extensao-cruzada|testa/,'Tríceps (cabeça longa)']],
 quadriceps:[],
 posterior:[[/stiff|terra|flexao-perna|swing|clean|pull-through/,'Posterior de coxa'],[/abducao|fire-hydrant|monster|elevacao-lateral-perna/,'Abdutores'],[/aducao/,'Adutores']],
 panturrilha:[[/sentado/,'Sóleo (sentado)'],[/tibialis/,'Tibial anterior']],
 abdomen:[[/woodchopper|rotacao|lateral|bicicleta|russian|pallof/,'Oblíquos / rotação'],[/prancha|dead-bug|bird|escalador|get-up/,'Core estabilizador']],
 antebraco:[[/extensao-punho/,'Extensores do antebraço'],[/inversa/,'Braquiorradial'],[/farmer|suitcase|dead-hang|rotacao/,'Pegada e estabilidade']]};
const _FC={};
function focoOf(e){if(_FC[e.id])return _FC[e.id];
 let n=FOCO_DEF[e.g];for(const [re,l] of (FOCO_REG[e.g]||[]))if(re.test(e.id)){n=l;break;}
 return _FC[e.id]={k:e.g+':'+n,n};}
function focosDoGrupo(g){const seen=new Set(),out=[];for(const e of E)if(e.g===g){const f=focoOf(e);if(!seen.has(f.k)){seen.add(f.k);out.push(f);}}return out;}
function focoChip(e){return '<div class="tags"><span class="t w">Foco no grupo: '+focoOf(e).n+'</span></div>';}
const setsHoje=id=>{const s=(store.log[id]||[]).find(x=>x.d===today());return s?s.s.length:0;};
function focoHoje(){const sc={};for(const id in store.log){const e=byId[id],n=setsHoje(id);if(!e||!n)continue;const k=focoOf(e).k;sc[k]=(sc[k]||0)+n;}return sc;}

/* ---- próximo exercício sugerido */
function sugerir(e){
 const sc=focoHoje(),need=k=>Math.max(0,ALVO-(sc[k]||0));
 const plano=new Set(store.plan?store.plan.days.flatMap(d=>d.items.map(i=>i.id)):[]);
 const rank=g=>E.filter(x=>x.g===g&&!setsHoje(x.id)&&need(focoOf(x).k)>0).map(x=>({x,s:need(focoOf(x).k)+(plano.has(x.id)?0.5:0)})).sort((a,b)=>b.s-a.s);
 const pick=g=>{const out=[],seen=new Set(),r=rank(g);
  for(const q of r){const k=focoOf(q.x).k;if(seen.has(k))continue;seen.add(k);out.push(q.x);if(out.length===3)break;}
  for(const q of r){if(out.length===3)break;if(!out.includes(q.x))out.push(q.x);}return out;};
 const l=pick(e.g);if(l.length)return {g:e.g,trocar:false,l,sc};
 let best=null,bn=0;
 for(const [g] of GROUPS){if(g===e.g)continue;const n=focosDoGrupo(g).reduce((a,x)=>a+need(x.k),0);if(n>bn){bn=n;best=g;}}
 return best?{g:best,de:e.g,trocar:true,l:pick(best),sc}:{g:e.g,trocar:false,l:[],sc};}
let curEx=null;
function tempoHoje(id){const L=(store.tempos||[]).filter(t=>t.d===today()&&t.id===id);return L.length?L[L.length-1]:null;}
function paintNext(){
 const box=document.getElementById('nx');if(!box||!curEx)return;const e=curEx;
 if(!setsHoje(e.id)){box.innerHTML='';return;}
 const sug=sugerir(e),sc=sug.sc,f=focoOf(e),tp=tempoHoje(e.id);
 let h='<h3>Músculo trabalhado</h3><div class="tags">'+e.prim.map(m=>'<span class="t r">'+MUS[m]+'</span>').join('')+e.sec.map(m=>'<span class="t o">'+MUS[m]+'</span>').join('')+'<span class="t w">Foco: '+f.n+'</span></div>';
 if(tp)h+='<p class="muted">Duração '+mmss(tp.dur)+(tp.desc!=null?' · descanso antes '+mmss(tp.desc):'')+'</p>';
 h+='<div class="fb">'+focosDoGrupo(e.g).map(x=>{const v=sc[x.k]||0;return '<div class="fr"><div class="row2"><span'+(x.k===f.k?' class="hi"':'')+'>'+x.n+'</span><span>'+v+'/'+ALVO+'</span></div><div class="fbar"><i style="width:'+Math.min(100,v/ALVO*100)+'%"></i></div></div>';}).join('')+'</div>';
 h+='<h3>Próximo sugerido</h3>';
 if(sug.trocar)h+='<p class="muted">'+GN[sug.de]+' completo por hoje. Que tal '+GN[sug.g]+'?</p>';
 h+=sug.l.length?sug.l.map(x=>'<a class="drow" href="#ex-'+x.id+'"><canvas data-th="'+x.id+'"></canvas><div><b>'+x.n+'</b><span>Foco: '+focoOf(x).n+' ('+(sc[focoOf(x).k]||0)+'/'+ALVO+' séries hoje)</span></div></a>').join(''):'<p class="muted">Nenhum exercício livre. Bom treino!</p>';
 box.innerHTML=h;
 box.querySelectorAll('[data-th]').forEach(c=>thumb(byId[c.dataset.th],c));}

/* ---- cronômetro: treino, exercício e descanso */
const mmss=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(s%60).padStart(2,'0');};
const seg=t=>(Date.now()-t)/1000;
function iniciarTreino(){if(!store.sessao){store.sessao={ini:Date.now(),ativo:null,descIni:null};save();}}
function iniciarExercicio(id){iniciarTreino();const s=store.sessao;if(s.ativo&&s.ativo.id===id)return;
 s.ativo={id,ini:Date.now(),desc:s.descIni?Math.round(seg(s.descIni)):null};s.descIni=null;save();}
function pararExercicio(){const s=store.sessao;if(!s||!s.ativo)return;
 const a=s.ativo;store.tempos=store.tempos||[];store.tempos.push({d:today(),id:a.id,dur:Math.round(seg(a.ini)),desc:a.desc});
 if(store.tempos.length>400)store.tempos=store.tempos.slice(-400);
 s.ativo=null;s.descIni=Date.now();save();}
function finalizarTreino(){const s=store.sessao;if(!s)return;
 store.treinos=store.treinos||[];store.treinos.push({d:today(),ini:s.ini,fim:Date.now()});
 store.sessao=null;save();}
function tick(){const s=store.sessao;if(!s)return;
 const set=(k,v)=>document.querySelectorAll('[data-t="'+k+'"]').forEach(el=>{el.textContent=v;});
 set('total',mmss(seg(s.ini)));if(s.ativo)set('ativo',mmss(seg(s.ativo.ini)));if(s.descIni)set('desc',mmss(seg(s.descIni)));}
function renderBar(){
 const bar=document.getElementById('tbar'),s=store.sessao;if(!bar)return;
 document.body.classList.toggle('hasbar',!!s);
 if(!s){bar.hidden=true;bar.innerHTML='';return;}
 bar.hidden=false;
 bar.innerHTML=s.ativo
  ?'<span>Treino <b data-t="total">0:00</b> · Fazendo <b>'+byId[s.ativo.id].n+'</b> <b class="hot" data-t="ativo">0:00</b></span><button class="pri" data-act="tstop">■ Parei</button>'
  :s.descIni
  ?'<span>Treino <b data-t="total">0:00</b> · Descanso <b class="hot" data-t="desc">0:00</b></span><button data-act="tfim">Finalizar</button>'
  :'<span>Treino <b data-t="total">0:00</b> · escolha um exercício</span><button data-act="tfim">Finalizar</button>';
 tick();}
function timerCard(e){const s=store.sessao;
 if(s&&s.ativo&&s.ativo.id===e.id)return '<span>Em andamento <b class="big" data-t="ativo">0:00</b></span><button class="pri" data-act="tstop">■ Parei</button>';
 return '<span class="muted">'+(s&&s.descIni?'Descansando <b data-t="desc">0:00</b>':'Cronômetro parado')+'</span><button class="pri" data-act="tplay" data-id="'+e.id+'">▶ Iniciar exercício</button>';}
function sessionCardHTML(){const s=store.sessao;
 const fins=(store.treinos||[]).filter(t=>t.d===today()).map(t=>'<p class="muted">Treino finalizado hoje: '+mmss((t.fim-t.ini)/1000)+' no total.</p>').join('');
 return '<div class="tc">'+(s?'<div><b>Treino em andamento</b><br><span class="muted">Tempo <b data-t="total">0:00</b></span></div><button data-act="tfim">Finalizar treino</button>'
  :'<div><b>Treino de hoje</b><br><span class="muted">Cronometra exercícios e descansos.</span></div><button class="pri" data-act="tstart">▶ Iniciar treino</button>')+'</div>'+fins;}

/* ---- ganchos usados pelo ui.js */
function cargaLabel(e,PI){
 if(PI)return 'Peso na pilha da polia (kg)';
 if(e.eq.includes('kettlebell'))return 'Carga (kg do kettlebell)';
 if(e.eq.includes('halteres'))return 'Carga (kg por halter)';
 if(e.eq.includes('elastico'))return 'Elástico (kg de tensão)';
 if(e.eq.includes('corpo')||e.eq.includes('barra'))return 'Carga extra (kg, 0 = só o corpo)';
 return 'Carga (kg)';}
function exOpened(e){
 curEx=e;
 const g=gripOf(e);if(g){const c=document.getElementById('hc');if(c)drawHand(c,g);}
 const t=document.getElementById('dtimer');if(t)t.innerHTML=timerCard(e);
 paintNext();tick();}
function onSave(){if(document.getElementById('nx')&&curEx&&!document.getElementById('v-detail').hidden)paintNext();}
function refreshTimerUI(){renderBar();const t=document.getElementById('dtimer');if(t&&curEx&&!document.getElementById('v-detail').hidden)t.innerHTML=timerCard(curEx);paintNext();
 if(!document.getElementById('v-plano').hidden){const y=window.scrollY;renderPlano();window.scrollTo(0,y);}tick();}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='gen'){store.gender=b.dataset.gen;applyGender();save();renderPlano();renderList();return;}
 if(a==='tstart'){iniciarTreino();refreshTimerUI();return;}
 if(a==='tplay'){iniciarExercicio(b.dataset.id);refreshTimerUI();return;}
 if(a==='tstop'){pararExercicio();refreshTimerUI();return;}
 if(a==='tfim'){if(confirm('Finalizar o treino?')){finalizarTreino();refreshTimerUI();}return;}});
setInterval(tick,1000);
