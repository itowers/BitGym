const CTRL=[
 ['Cabeça',[['head','Tamanho da cabeça',0.6,1.8,0.02],['square','Forma: redonda → quadrada',0,1,0.02],['hairV','Volume do cabelo',0.7,1.3,0.02],['eye','Tamanho dos olhos',0,2,0.05]]],
 ['Corpo',[['shoulder','Largura dos ombros',0.7,1.5,0.02],['waist','Largura da cintura',0.7,1.4,0.02],['hips','Largura do quadril',0.7,1.4,0.02],['muscle','Musculatura',0.7,1.6,0.02]]],
 ['Braços e pernas',[['arm','Grossura dos braços',0.6,1.6,0.02],['leg','Grossura das pernas',0.6,1.6,0.02],['hand','Tamanho das mãos',0.5,1.8,0.05],['foot','Tamanho dos pés',0.5,1.8,0.05]]],
 ['Desenho',[['ow','Espessura do contorno',0,3,0.05],['cel','Intensidade da sombra',0,2,0.05],['pix','Pixelização (0 = liso)',0,10,1],['pitch','Ângulo da câmera',10,60,1]]]];
const COLS=[['cSkin','Pele'],['cHair','Cabelo'],['cShorts','Short'],['cBg','Fundo']];
const EXS=['rosca-direta','elevacao-lateral','supino-reto','remada-curvada','puxada-alta','goblet','agachamento-halteres','triceps-corda'];
const byId=Object.fromEntries(E.map(e=>[e.id,e]));let cur=0,view=0,FR={},t0=performance.now(),paused=false,tP=0;
try{const s=JSON.parse(localStorage.getItem('char_cfg')||'null');if(s)CP=Object.assign({},CP0,s);}catch(e){}
const save=()=>{try{localStorage.setItem('char_cfg',JSON.stringify(CP));}catch(e){}};
const fmt=(k,v)=>k==='pitch'?v+'°':k==='pix'?(v<2?'liso':v+' px'):(+v).toFixed(2);
function build(){
 document.querySelector('#chips').innerHTML=EXS.map((id,i)=>'<button class="chip'+(i===cur?' on':'')+'" data-i="'+i+'">'+byId[id].n+'</button>').join('');
 document.querySelector('#sty').innerHTML=Object.keys(VST).map(k=>'<button class="chip'+(CP.style===k?' on':'')+'" data-s="'+k+'">'+VST[k].n+'</button>').join('');
 let h='';for(const [g,items] of CTRL){h+='<h3>'+g+'</h3>';for(const [k,l,a,b,st] of items)h+='<label class="sl"><span>'+l+'<em id="v_'+k+'">'+fmt(k,CP[k])+'</em></span><input type="range" min="'+a+'" max="'+b+'" step="'+st+'" value="'+CP[k]+'" data-k="'+k+'"></label>';}
 h+='<h3>Cores</h3><div class="cols">';const sc=styleOf(CP.style);
 for(const [k,l] of COLS){const v=CP[k]||(k==='cBg'?sc.bg:sc.c[{cSkin:'skin',cHair:'hair',cShorts:'shorts'}[k]][0]);h+='<label class="col"><input type="color" value="'+v+'" data-c="'+k+'"><span>'+l+'</span></label>';}
 document.querySelector('#ctl').innerHTML=h+'</div>';}
function frameOf(ex){const v=(view+defView(ex))%4,k=ex.id+'|'+v+'|'+JSON.stringify(CP);if(!FR[k]){FR={};FR[k]=vframe(ex,v,CP.pitch);}return FR[k];}
function loop(now){const ex=byId[EXS[cur]],T=1700;if(!paused)tP=((now-t0)%T)/T;const ph=tP;let t,hot;
 if(ph<0.12){t=0;hot=0;}else if(ph<0.45){const u=(ph-0.12)/0.33;t=0.5-0.5*Math.cos(Math.PI*u);hot=1;}else if(ph<0.57){t=1;hot=1;}else{const u=(ph-0.57)/0.43;t=0.5+0.5*Math.cos(Math.PI*u);hot=0;}
 vrender(document.getElementById('cv'),ex,t,hot,(view+defView(ex))%4,CP.style,frameOf(ex));requestAnimationFrame(loop);}
document.addEventListener('input',e=>{const k=e.target.dataset.k,c=e.target.dataset.c;
 if(k){CP[k]=+e.target.value;document.getElementById('v_'+k).textContent=fmt(k,CP[k]);save();}
 if(c){CP[c]=e.target.value;save();}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b){cur=+b.dataset.i;build();}
 const s=e.target.closest('[data-s]');if(s){CP.style=s.dataset.s;CP.cSkin=CP.cHair=CP.cShorts=CP.cBg='';save();build();}
 if(e.target.closest('#rot'))view=(view+1)%4;
 if(e.target.closest('#pp')){paused=!paused;e.target.closest('#pp').textContent=paused?'▶ Tocar':'❚❚ Pausar';if(!paused)t0=performance.now()-tP*1700;}
 if(e.target.closest('#rst')){CP=Object.assign({},CP0,{style:CP.style});save();build();}
 if(e.target.closest('#cp')){const txt=JSON.stringify(CP);const o=document.getElementById('out');o.value=txt;o.hidden=false;o.select();
  try{navigator.clipboard.writeText(txt).then(()=>{document.getElementById('msg').textContent='Ajustes copiados. Cole aqui no chat quando quiser aplicar no app.';},()=>{document.getElementById('msg').textContent='Copie o texto acima e cole no chat.';});}catch(err){document.getElementById('msg').textContent='Copie o texto acima e cole no chat.';}}});
build();requestAnimationFrame(loop);
