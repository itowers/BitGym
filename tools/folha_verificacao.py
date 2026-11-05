import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(ROOT,'src')
u=open(os.path.join(SRC,'ui.js')).read()
yaw=u[u.index("const YAW={};"):u.index("const FCACHE")]
js=''.join(open(os.path.join(SRC,f)).read()+'\n' for f in ['core.js','data.js','data2.js','rm.js','vec.js'])
cfg="CP=Object.assign({},CP0,{style:'cel',head:0.78,square:0,hairV:0.88,eye:0.75,arm:0.88,leg:0.86,muscle:0.7,shoulder:0.84,waist:0.78,hips:0.72,hand:0.85,foot:0.9,ow:0.9,cel:1.15,pix:4,pitch:28});"
test="""
const from=+(location.hash.slice(1)||0),L=E.slice(from,from+40); /* abra com #0, #40, #80... */document.body.style.cssText='margin:0;background:#111;font:11px sans-serif;color:#ddd';
const wrap=document.createElement('div');wrap.style.cssText='display:grid;grid-template-columns:repeat(8,1fr);gap:2px';document.body.appendChild(wrap);
for(const e of L){const v=defView(e),fr=vframe(e,v,28);[0,1/3,2/3,1].forEach((t,j)=>{const d=document.createElement('div');const c=document.createElement('canvas');c.width=c.height=400;c.style.width='100%';d.appendChild(c);
 const s=document.createElement('div');s.textContent=(j===0?e.id+' '+yawBase(e)+'°':'');d.appendChild(s);wrap.appendChild(d);vrender(c,e,t,t>0?1:0,v,'cel',fr);});}
"""
open(os.path.join(ROOT,'dist','verificacao.html'),'w').write('<html><body><script>'+js+cfg+yaw+test+'</script></body></html>')
