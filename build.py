import os
ROOT=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(ROOT,'src')
DIST=os.path.join(ROOT,'dist')
css="""
*{box-sizing:border-box}[hidden]{display:none!important}
body{margin:0;background:#14121f;color:#e8e6ff;font:15px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;padding-bottom:84px}
header{padding:18px 16px 10px;border-bottom:3px solid #2c2748;background:#1a1730}
h1{font:14px/1.3 'Press Start 2P',monospace;margin:0 0 6px;color:#3fd0c9;letter-spacing:.5px}
header p{margin:0;color:#9a96c0;font-size:13px}
main{max-width:760px;margin:0 auto;padding:14px 14px 24px}
h2{font:13px/1.5 'Press Start 2P',monospace;margin:6px 0 4px;color:#fff}
h3{font:11px/1.4 'Press Start 2P',monospace;color:#ffd45a;margin:22px 0 8px}
p{margin:6px 0}.muted{color:#9a96c0;font-size:13px}.grp{color:#9a96c0;margin:0 0 10px;font-size:14px}
#q{width:100%;padding:11px 12px;background:#1d1a30;border:2px solid #3b3560;color:#fff;font:inherit;margin-bottom:10px}
#q:focus,input:focus{outline:none;border-color:#3fd0c9}
.row-scroll{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:4px;scrollbar-width:thin}
.chip{flex:none;background:#1d1a30;color:#cfcbf5;border:2px solid #3b3560;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}
.chip.sm{font-size:12px;padding:5px 10px}.chip.on{background:#3fd0c9;border-color:#3fd0c9;color:#10241f;font-weight:600}
#count{color:#9a96c0;font-size:13px;margin:6px 0 10px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
@media(min-width:620px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.card{display:block;background:#1d1a30;border:2px solid #3b3560;text-decoration:none;color:inherit;overflow:hidden}
.card:active,.card:hover{border-color:#3fd0c9}
.card canvas{display:block;width:100%;aspect-ratio:1/1;object-fit:contain;background:#2a2c31;image-rendering:pixelated}
.cb{padding:8px 10px 10px}.cb b{display:block;font-size:13px;line-height:1.3;margin-bottom:3px}
.cb span{display:block;color:#ff8a7c;font-size:12px}.cb i{display:block;color:#9a96c0;font-size:11px;font-style:normal;margin-top:3px}
.empty{color:#9a96c0;text-align:center;padding:24px 8px}
#cv{display:block;width:100%;height:auto;image-rendering:pixelated;border:3px solid #3b3560;margin:8px 0}
button{font:inherit;color:#e8e6ff;background:#1d1a30;border:2px solid #3b3560;padding:9px 12px;cursor:pointer}
button:active{background:#2a2548}button.pri{background:#3fd0c9;border-color:#3fd0c9;color:#10241f;font-weight:600}
.back{margin-bottom:6px;font-size:13px;padding:6px 10px}
.ctl{display:flex;gap:8px;flex-wrap:wrap}.ctl button{font-size:13px;padding:8px 10px}
.phase{font:10px/1.4 'Press Start 2P',monospace;color:#ffd45a;margin:10px 0 8px;min-height:14px}
.leg{display:flex;gap:14px;font-size:12px;color:#9a96c0;margin-bottom:8px;flex-wrap:wrap}.sw{display:inline-block;width:10px;height:10px;margin-right:6px;vertical-align:-1px}
.sw.r{background:#ff4a40}.sw.o{background:#ff9a2e}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.t{font-size:12px;padding:3px 9px;border:2px solid #3b3560;color:#cfcbf5}
.t.r{border-color:#ff4a40;color:#ff9b90}.t.o{border-color:#ff9a2e;color:#ffc97a}.t.w{border-color:#ffd45a;color:#ffd45a}
.log{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:end}.log label{font-size:12px;color:#9a96c0;display:block}
input{width:100%;margin-top:4px;padding:10px;background:#1d1a30;border:2px solid #3b3560;color:#fff;font:inherit;font-size:16px}
.log .pri{grid-column:1/3}.err{color:#ff8a7c;font-size:13px;min-height:18px;margin:4px 0}
#sets ul,.h{list-style:none;margin:8px 0;padding:0}#sets li,.h li,.row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px;background:#1d1a30;border:2px solid #2c2748;margin-bottom:6px}
#sets li button{padding:2px 9px;font-size:16px;line-height:1}.h li span{color:#9a96c0}
.row{text-decoration:none;color:inherit;flex-wrap:wrap}
a.back{display:inline-block;color:#e8e6ff;text-decoration:none;border:2px solid #3b3560;background:#1d1a30}
.intro{background:#1d1a30;border:2px solid #3b3560;padding:16px;margin-top:10px}.intro p{margin:0 0 10px}.intro .pri{width:100%;padding:13px}
.dcard{display:grid;grid-template-columns:1fr auto;gap:4px 10px;background:#1d1a30;border:2px solid #3b3560;padding:14px;margin:0 0 10px;text-decoration:none;color:inherit}
.dcard:active,.dcard:hover{border-color:#3fd0c9}.dcard b{font:12px/1.4 'Press Start 2P',monospace;color:#fff}.dcard em{font-style:normal;color:#ffd45a;font-size:13px;font-weight:600}
.dcard span{grid-column:1/3;color:#cfcbf5;font-size:14px}.dcard span+span{color:#9a96c0;font-size:13px}
button.edit{width:100%;margin:4px 0 6px}
.gsel{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 6px}
.cfg{display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center;background:#1d1a30;border:2px solid #2c2748;padding:10px;margin-bottom:12px;font-size:14px}
.stp{display:inline-flex;align-items:center;gap:6px}.stp button{padding:4px 12px;font-size:17px;line-height:1.2}.stp b{min-width:40px;text-align:center;font-variant-numeric:tabular-nums}
.gblk{margin:0 0 16px}.gh{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 6px}.gh b{font:10px 'Press Start 2P',monospace;color:#ffd45a}.gh span{color:#9a96c0;font-size:13px}
.pi{display:grid;grid-template-columns:1fr auto;gap:8px;background:#1d1a30;border:2px solid #2c2748;padding:10px;margin-bottom:6px}
.pn a{color:#fff;text-decoration:none;font-weight:600;font-size:14px;display:block}.pn span{color:#9a96c0;font-size:12px}
.pi .rm{padding:2px 10px;font-size:18px;align-self:start}.pe .stp{gap:2px}.pe .stp button{padding:3px 9px}.pe .stp b{min-width:24px}.pe{grid-column:1/3;display:grid;grid-template-columns:auto auto auto auto;justify-content:space-between;gap:6px;align-items:center;font-size:12px;color:#9a96c0}
.addx{width:100%;font-size:13px;border-style:dashed;color:#3fd0c9}
.pick{list-style:none;margin:6px 0 0;padding:0;max-height:340px;overflow:auto;border:2px solid #2c2748}
.pick button{width:100%;display:grid;grid-template-columns:1fr auto;text-align:left;border:0;border-bottom:1px solid #2c2748;padding:9px 10px;gap:0 10px}
.pick b{font-size:14px;font-weight:500}.pick span{grid-row:2;color:#9a96c0;font-size:12px}.pick i{grid-row:1/3;grid-column:2;align-self:center;font-style:normal;color:#3fd0c9;font-size:18px}
.pick button.on{background:#203a3a}
.cbar{position:sticky;bottom:60px;display:flex;justify-content:space-between;align-items:center;gap:10px;background:#1a1730;border:2px solid #3fd0c9;padding:10px 12px;margin-top:12px;flex-wrap:wrap}
.cbar b{font-size:13px}.cbar .err{display:block;margin:2px 0 0;min-height:0}.cbtn{display:flex;gap:8px}
.drow{display:grid;grid-template-columns:72px 1fr;gap:10px;align-items:center;background:#1d1a30;border:2px solid #2c2748;padding:6px;margin-bottom:6px;text-decoration:none;color:inherit}
.drow canvas{width:72px;height:72px;image-rendering:pixelated;background:#2a2c31}.drow b{display:block;font-size:14px}.drow span{display:block;color:#9a96c0;font-size:13px}.drow i{display:block;font-style:normal;color:#3fd0c9;font-size:12px}
.drow.ok{border-color:#2f7d74}
.pol{background:#1d1a30;border-left:3px solid #ffd45a;padding:6px 10px;font-size:14px;color:#ffe9a8;margin:8px 0}.pol.sp{border-color:#3fd0c9;color:#bff3ef}.pst{font-style:normal;color:#9a96c0;font-weight:400;font-size:12px;margin-left:6px}
.row span{color:#9a96c0;font-size:13px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 16px}.stats div{background:#1d1a30;border:2px solid #3b3560;padding:10px;text-align:center}
.stats b{display:block;font:13px 'Press Start 2P',monospace;color:#3fd0c9;margin-bottom:6px}.stats span{font-size:12px;color:#9a96c0}
.bars{display:flex;align-items:flex-end;gap:4px;height:90px;border-bottom:2px solid #3b3560;padding-bottom:2px}.bars i{flex:1;background:#3fd0c9;min-height:4px}.bars i.z{background:#2c2748}
footer{text-align:center;color:#6f6a96;font-size:12px;padding:8px}
.nav{position:fixed;left:0;right:0;bottom:0;display:flex;background:#1a1730;border-top:3px solid #2c2748;padding-bottom:env(safe-area-inset-bottom)}
.nav a{flex:1;text-align:center;padding:16px 8px;color:#9a96c0;text-decoration:none;font:10px 'Press Start 2P',monospace}.nav a.on{color:#3fd0c9;background:#221e3a}
"""
html="""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Academia em casa</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<style>"""+css+"""</style></head><body>
<header><h1>ACADEMIA EM CASA</h1><p>Polia, banco ajustável e halteres de 2 a 24 kg</p></header>
<main>
<section id="v-home" hidden><input id="q" type="search" placeholder="Buscar exercício ou músculo" aria-label="Buscar"><div id="gch" class="row-scroll"></div><div id="ech" class="row-scroll"></div><p id="count"></p><div id="list" class="grid"></div></section>
<section id="v-detail" hidden></section><section id="v-plano" hidden></section><section id="v-setup" hidden></section><section id="v-dia" hidden></section>
</main>
<footer id="sync"></footer>
<nav class="nav"><a href="#plano">Meu treino</a><a href="#catalogo">Catálogo</a></nav>
<script>
"""+open(os.path.join(SRC,'core.js')).read()+"\n"+open(os.path.join(SRC,'data.js')).read()+"\n"+open(os.path.join(SRC,'data2.js')).read()+"\n"+open(os.path.join(SRC,'rm.js')).read()+"\n"+open(os.path.join(SRC,'vec.js')).read()+"\n"+open(os.path.join(SRC,'ui.js')).read()+"""
</script></body></html>"""
os.makedirs(DIST,exist_ok=True)
open(os.path.join(DIST,'index.html'),'w').write(html)
# editor de personagem
head=open(os.path.join(SRC,'editor_head.html')).read()
js=''.join(open(os.path.join(SRC,f)).read()+'\n' for f in ['core.js','data.js','data2.js','rm.js','vec.js','editor_ui.js'])
open(os.path.join(DIST,'editor.html'),'w').write(head+'<script>'+js+'</script></body></html>')
print('ok: dist/index.html e dist/editor.html')
print(len(html))
