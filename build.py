import os
ROOT=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(ROOT,'src')
DIST=os.path.join(ROOT,'dist')
css="""
*{box-sizing:border-box}[hidden]{display:none!important}
body{margin:0;background:#f7f8fa;color:#1c1f26;font:15px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;padding-bottom:84px}
header{padding:18px 16px 10px;border-bottom:3px solid #e8eaef;background:#ffffff}
h1{font:700 17px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;margin:0 0 6px;color:#0b8a83;letter-spacing:.5px}
header p{margin:0;color:#6b7280;font-size:13px}
main{max-width:760px;margin:0 auto;padding:14px 14px 24px}
h2{font:700 16px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;margin:6px 0 4px;color:#1c1f26}
h3{font:700 14px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#b7791f;margin:22px 0 8px}
p{margin:6px 0}.muted{color:#6b7280;font-size:13px}.grp{color:#6b7280;margin:0 0 10px;font-size:14px}
#q{width:100%;padding:11px 12px;background:#ffffff;border:1px solid #dfe2e8;color:#1c1f26;font:inherit;margin-bottom:10px}
#q:focus,input:focus{outline:none;border-color:#0b8a83}
.row-scroll{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:4px;scrollbar-width:thin}
.chip{flex:none;background:#ffffff;color:#4b5160;border:1px solid #dfe2e8;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}
.chip.sm{font-size:12px;padding:5px 10px}.chip.on{background:#3fd0c9;border-color:#0b8a83;color:#10241f;font-weight:600}
#count{color:#6b7280;font-size:13px;margin:6px 0 10px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
@media(min-width:620px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.card{display:block;background:#ffffff;border:1px solid #dfe2e8;text-decoration:none;color:inherit;overflow:hidden}
.card:active,.card:hover{border-color:#0b8a83}
.card canvas{display:block;width:100%;aspect-ratio:1/1;object-fit:contain;background:#2a2c31;image-rendering:pixelated}
.cb{padding:8px 10px 10px}.cb b{display:block;font-size:13px;line-height:1.3;margin-bottom:3px}
.cb span{display:block;color:#d6382b;font-size:12px}.cb i{display:block;color:#6b7280;font-size:11px;font-style:normal;margin-top:3px}
.empty{color:#6b7280;text-align:center;padding:24px 8px}
#cv{display:block;width:100%;height:auto;image-rendering:pixelated;border:3px solid #dfe2e8;margin:8px 0}
button{font:inherit;color:#1c1f26;background:#ffffff;border:1px solid #dfe2e8;padding:9px 12px;cursor:pointer}
button:active{background:#eef0f4}button.pri{background:#3fd0c9;border-color:#0b8a83;color:#10241f;font-weight:600}
.back{margin-bottom:6px;font-size:13px;padding:6px 10px}
.ctl{display:flex;gap:8px;flex-wrap:wrap}.ctl button{font-size:13px;padding:8px 10px}
.phase{font:700 13px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#b7791f;margin:10px 0 8px;min-height:14px}
.leg{display:flex;gap:14px;font-size:12px;color:#6b7280;margin-bottom:8px;flex-wrap:wrap}.sw{display:inline-block;width:10px;height:10px;margin-right:6px;vertical-align:-1px}
.sw.r{background:#ff4a40}.sw.o{background:#ff9a2e}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.t{font-size:12px;padding:3px 9px;border:1px solid #dfe2e8;color:#4b5160}
.t.r{border-color:#ff4a40;color:#d6382b}.t.o{border-color:#ff9a2e;color:#b95e00}.t.w{border-color:#b7791f;color:#b7791f}
.log{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:end}.log label{font-size:12px;color:#6b7280;display:block}
input{width:100%;margin-top:4px;padding:10px;background:#ffffff;border:1px solid #dfe2e8;color:#1c1f26;font:inherit;font-size:16px}
.log .pri{grid-column:1/3}.err{color:#d6382b;font-size:13px;min-height:18px;margin:4px 0}
#sets ul,.h{list-style:none;margin:8px 0;padding:0}#sets li,.h li,.row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px;background:#ffffff;border:1px solid #e8eaef;margin-bottom:6px}
#sets li button{padding:2px 9px;font-size:16px;line-height:1}.h li span{color:#6b7280}
.row{text-decoration:none;color:inherit;flex-wrap:wrap}
a.back{display:inline-block;color:#1c1f26;text-decoration:none;border:1px solid #dfe2e8;background:#ffffff}
.intro{background:#ffffff;border:1px solid #dfe2e8;padding:16px;margin-top:10px}.intro p{margin:0 0 10px}.intro .pri{width:100%;padding:13px}
.dcard{display:grid;grid-template-columns:1fr auto;gap:4px 10px;background:#ffffff;border:1px solid #dfe2e8;padding:14px;margin:0 0 10px;text-decoration:none;color:inherit}
.dcard:active,.dcard:hover{border-color:#0b8a83}.dcard b{font:700 15px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1c1f26}.dcard em{font-style:normal;color:#b7791f;font-size:13px;font-weight:600}
.dcard span{grid-column:1/3;color:#4b5160;font-size:14px}.dcard span+span{color:#6b7280;font-size:13px}
button.edit{width:100%;margin:4px 0 6px}
.gsel{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 6px}
.cfg{display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center;background:#ffffff;border:1px solid #e8eaef;padding:10px;margin-bottom:12px;font-size:14px}
.stp{display:inline-flex;align-items:center;gap:6px}.stp button{padding:4px 12px;font-size:17px;line-height:1.2}.stp b{min-width:40px;text-align:center;font-variant-numeric:tabular-nums}
.gblk{margin:0 0 16px}.gh{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 6px}.gh b{font:700 13px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#b7791f}.gh span{color:#6b7280;font-size:13px}
.pi{display:grid;grid-template-columns:1fr auto;gap:8px;background:#ffffff;border:1px solid #e8eaef;padding:10px;margin-bottom:6px}
.pn a{color:#1c1f26;text-decoration:none;font-weight:600;font-size:14px;display:block}.pn span{color:#6b7280;font-size:12px}
.pi .rm{padding:2px 10px;font-size:18px;align-self:start}.pe .stp{gap:2px}.pe .stp button{padding:3px 9px}.pe .stp b{min-width:24px}.pe{grid-column:1/3;display:grid;grid-template-columns:auto auto auto auto;justify-content:space-between;gap:6px;align-items:center;font-size:12px;color:#6b7280}
.addx{width:100%;font-size:13px;border-style:dashed;color:#0b8a83}
.pick{list-style:none;margin:6px 0 0;padding:0;max-height:340px;overflow:auto;border:1px solid #e8eaef}
.pick button{width:100%;display:grid;grid-template-columns:1fr auto;text-align:left;border:0;border-bottom:1px solid #e8eaef;padding:9px 10px;gap:0 10px}
.pick b{font-size:14px;font-weight:500}.pick span{grid-row:2;color:#6b7280;font-size:12px}.pick i{grid-row:1/3;grid-column:2;align-self:center;font-style:normal;color:#0b8a83;font-size:18px}
.pick button.on{background:#e6f7f6}
.cbar{position:sticky;bottom:60px;display:flex;justify-content:space-between;align-items:center;gap:10px;background:#ffffff;border:1px solid #3fd0c9;padding:10px 12px;margin-top:12px;flex-wrap:wrap}
.cbar b{font-size:13px}.cbar .err{display:block;margin:2px 0 0;min-height:0}.cbtn{display:flex;gap:8px}
.drow{display:grid;grid-template-columns:72px 1fr;gap:10px;align-items:center;background:#ffffff;border:1px solid #e8eaef;padding:6px;margin-bottom:6px;text-decoration:none;color:inherit}
.drow canvas{width:72px;height:72px;image-rendering:pixelated;background:#2a2c31}.drow b{display:block;font-size:14px}.drow span{display:block;color:#6b7280;font-size:13px}.drow i{display:block;font-style:normal;color:#0b8a83;font-size:12px}
.drow.ok{border-color:#2f7d74}
.pol{background:#fff8e1;border-left:3px solid #ffd45a;padding:6px 10px;font-size:14px;color:#7a5a00;margin:8px 0}.pol.sp{border-color:#0b8a83;color:#0b6b66}.pst{font-style:normal;color:#6b7280;font-weight:400;font-size:12px;margin-left:6px}
.row span{color:#6b7280;font-size:13px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 16px}.stats div{background:#ffffff;border:1px solid #dfe2e8;padding:10px;text-align:center}
.stats b{display:block;font:700 16px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0b8a83;margin-bottom:6px}.stats span{font-size:12px;color:#6b7280}
.bars{display:flex;align-items:flex-end;gap:4px;height:90px;border-bottom:1px solid #dfe2e8;padding-bottom:2px}.bars i{flex:1;background:#3fd0c9;min-height:4px}.bars i.z{background:#e8eaef}
.cvw{position:relative}.hbadge{position:absolute;left:8px;bottom:16px;display:flex;gap:8px;align-items:center;background:rgba(255,255,255,.94);border:1px solid #dfe2e8;padding:4px 10px 4px 4px}
.hbadge canvas{width:52px;height:52px;image-rendering:pixelated;background:#2a2c31}.hbadge b{display:block;font-size:12px;color:#1c1f26}.hbadge span{display:block;font-size:11px;color:#6b7280}
.tc{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#ffffff;border:1px solid #dfe2e8;padding:10px 12px;margin:0 0 10px}
.tc .big{font:700 16px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#b7791f;margin-left:6px}
.tbar{position:fixed;left:0;right:0;bottom:calc(50px + env(safe-area-inset-bottom));z-index:9;display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fff4f0;border-top:1px solid #3fd0c9;padding:8px 12px;font-size:13px}
.tbar .hot{color:#b7791f;font-variant-numeric:tabular-nums}.tbar button{padding:6px 12px;font-size:13px;flex:none}body.hasbar{padding-bottom:140px}
.fb{margin:8px 0 4px}.fr{margin-bottom:8px}.row2{display:flex;justify-content:space-between;font-size:13px;color:#4b5160}.row2 .hi{color:#b7791f;font-weight:600}
.fbar{height:8px;background:#e8eaef}.fbar i{display:block;height:100%;background:#3fd0c9}
footer{text-align:center;color:#9aa1ae;font-size:12px;padding:8px}
.nav{position:fixed;left:0;right:0;bottom:0;display:flex;background:#ffffff;border-top:3px solid #e8eaef;padding-bottom:env(safe-area-inset-bottom)}
.nav a{flex:1;text-align:center;padding:16px 8px;color:#6b7280;text-decoration:none;font:700 13px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}.nav a.on{color:#0b8a83;background:#fff4f0}

.card,.dcard,.intro,.cfg,.pi,.drow,.stats div,.tc,.cbar,#sets li,.h li,.row,.pick,.t,.chip,button,input,#q,.hbadge,a.back,.pol{border-radius:10px}
.card,.dcard,.drow,.pi,.cfg,.stats div,.tc,.intro{box-shadow:0 1px 2px rgba(20,24,32,.05)}
.card canvas,.drow canvas,#cv{border-radius:8px}
header{background:#fff}.nav,.tbar,.cbar{box-shadow:0 -2px 10px rgba(20,24,32,.06)}
h1{letter-spacing:0}.chip.on,button.pri{color:#fff;background:#0fa59d;border-color:#0fa59d}
"""
html="""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Academia em casa</title>
<style>"""+css+"""</style></head><body>
<header><h1>ACADEMIA EM CASA</h1><p>Polia, banco ajustável e halteres de 2 a 24 kg</p></header>
<main>
<section id="v-home" hidden><input id="q" type="search" placeholder="Buscar exercício ou músculo" aria-label="Buscar"><div id="gch" class="row-scroll"></div><div id="ech" class="row-scroll"></div><p id="count"></p><div id="list" class="grid"></div></section>
<section id="v-detail" hidden></section><section id="v-plano" hidden></section><section id="v-setup" hidden></section><section id="v-dia" hidden></section>
</main>
<footer id="sync"></footer>
<div id="tbar" class="tbar" hidden></div>
<nav class="nav"><a href="#plano">Meu treino</a><a href="#catalogo">Catálogo</a></nav>
<script>
"""+open(os.path.join(SRC,'core.js')).read()+"\n"+open(os.path.join(SRC,'data.js')).read()+"\n"+open(os.path.join(SRC,'data2.js')).read()+"\n"+open(os.path.join(SRC,'rm.js')).read()+"\n"+open(os.path.join(SRC,'vec.js')).read()+"\n"+open(os.path.join(SRC,'extras.js')).read()+"\n"+open(os.path.join(SRC,'ui.js')).read()+"""
</script></body></html>"""
os.makedirs(DIST,exist_ok=True)
open(os.path.join(DIST,'index.html'),'w').write(html)
# editor de personagem
head=open(os.path.join(SRC,'editor_head.html')).read()
js=''.join(open(os.path.join(SRC,f)).read()+'\n' for f in ['core.js','data.js','data2.js','rm.js','vec.js','editor_ui.js'])
open(os.path.join(DIST,'editor.html'),'w').write(head+'<script>'+js+'</script></body></html>')
print('ok: dist/index.html e dist/editor.html')
print(len(html))
