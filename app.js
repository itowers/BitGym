// BitGym — lógica do app. Estado salvo no localStorage.
const $ = (s, el = document) => el.querySelector(s);
const LS = 'bitgym.v1';
const PADRAO = () => ({ genero: 'homem', equip: Object.keys(EQUIPAMENTOS), hist: [], sessao: null, treinos: [] });

let state = carregar();
function carregar() {
  try { return { ...PADRAO(), ...JSON.parse(localStorage.getItem(LS) || '{}') }; } catch (e) { return PADRAO(); }
}
function salvar() { try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) { /* ignora */ } }

const pad = (n) => String(n).padStart(2, '0');
const hoje = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmt = (n) => (Math.round(n * 10) / 10).toString().replace('.', ',');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- desenhos ----------

// destaque: { idMusculo: 'p' | 's' | número 0..1 }
function corpoSVG(vista, destaque = {}) {
  const f = state.genero === 'mulher';
  const sw = f ? 18 : 21, hw = f ? 15 : 12, ww = f ? 10 : 13, braco = f ? 7 : 9;
  const L = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${w}"/>`;
  const sil =
    `<circle cx="50" cy="16" r="8"/>` +
    `<polygon points="${50 - sw},38 ${50 + sw},38 ${50 + ww},84 ${50 + hw},102 ${50 - hw},102 ${50 - ww},84"/>` +
    L(50 - sw + 1, 44, 50 - sw - 4, 88, braco) + L(50 + sw - 1, 44, 50 + sw + 4, 88, braco) +
    L(41, 102, 41, 185, 17) + L(59, 102, 59, 185, 17);
  let mus = '';
  for (const [id, mu] of Object.entries(MUSC)) {
    if (mu.v !== vista) continue;
    const d = destaque[id];
    let estilo = '';
    if (d === 'p') estilo = 'fill:var(--acc);stroke:none';
    else if (d === 's') estilo = 'fill:var(--acc2);stroke:none';
    else if (typeof d === 'number' && d > 0) estilo = `fill:var(--acc);fill-opacity:${0.25 + 0.75 * d};stroke:none`;
    for (const x of [mu.cx, 100 - mu.cx]) {
      mus += `<ellipse class="mz" style="${estilo}" cx="${x}" cy="${mu.cy}" rx="${mu.rx}" ry="${mu.ry}"><title>${esc(mu.n)}</title></ellipse>`;
    }
  }
  const esc94 = f ? ' transform="translate(50 0) scale(.94 1) translate(-50 0)"' : '';
  return `<svg viewBox="0 0 100 190" aria-label="${vista === 'f' ? 'Frente' : 'Costas'}"><g class="sil">${sil}</g><g${esc94}>${mus}</g></svg>`;
}

function corposHTML(destaque) {
  return `<div class="bodies"><figure>${corpoSVG('f', destaque)}<figcaption>Frente</figcaption></figure>` +
    `<figure>${corpoSVG('b', destaque)}<figcaption>Costas</figcaption></figure></div>`;
}

// Desenho da mão para cada pegada (mão direita, vista de cima).
function gripSVG(tipo) {
  const dedos = [14, 22.5, 31, 39.5].map((x) => `<rect class="hand" x="${x}" y="10" width="7.5" height="22" rx="3.5"/>`).join('');
  const palma = '<rect class="hand" x="14" y="28" width="33" height="24" rx="8"/>';
  if (tipo === 'pronada') {
    const nos = [17.7, 26.2, 34.7, 43.2].map((x) => `<circle class="hl" cx="${x}" cy="31" r="1.6"/>`).join('');
    return `<svg viewBox="0 0 64 64">${dedos}${palma}${nos}<rect class="hand" x="3" y="36" width="16" height="8" rx="4" transform="rotate(-25 11 40)"/></svg>`;
  }
  if (tipo === 'supinada') {
    return `<svg viewBox="0 0 64 64">${dedos}<rect class="hand palm" x="14" y="28" width="33" height="24" rx="8"/>` +
      `<path class="hl" d="M20 36 q10 6 22 0 M20 43 q10 5 22 0"/><rect class="hand palm" x="43" y="36" width="16" height="8" rx="4" transform="rotate(25 51 40)"/></svg>`;
  }
  // neutra: vista lateral, polegar para cima
  const curl = [24, 32, 40].map((y) => `<rect class="hand" x="8" y="${y}" width="22" height="7" rx="3.5"/>`).join('');
  return `<svg viewBox="0 0 64 64"><rect class="hand" x="26" y="20" width="22" height="34" rx="8"/>${curl}<rect class="hand" x="30" y="4" width="9" height="24" rx="4.5"/></svg>`;
}

// ---------- lógica de treino ----------

const feitosHoje = () => state.hist.filter((h) => h.d === hoje());
const disponiveis = () => EXERCICIOS.filter((e) => e.eq.every((q) => state.equip.includes(q)));

function pontuacaoHoje() {
  const sc = {};
  for (const h of feitosHoje()) {
    const ex = EX[h.ex], n = h.sets.length;
    sc[ex.prim] = (sc[ex.prim] || 0) + n;
    for (const s of ex.sec) sc[s] = (sc[s] || 0) + n * 0.5;
  }
  return sc;
}

// Sugere o próximo exercício priorizando músculos ainda pouco trabalhados.
function sugestoes(sc) {
  const feitos = feitosHoje();
  if (!feitos.length) return null;
  const ult = feitos[feitos.length - 1];
  const grupo = MUSC[EX[ult.ex].prim].g;
  const falta = (id) => Math.max(0, ALVO - (sc[id] || 0));
  const pont = (e) => falta(e.prim) + 0.3 * e.sec.reduce((a, id) => a + falta(id), 0);
  const livres = disponiveis().filter((e) => !feitos.some((h) => h.ex === e.id));
  const ordenar = (lista) => lista.filter((e) => falta(e.prim) > 0).sort((a, b) => pont(b) - pont(a)).slice(0, 3);

  let lista = ordenar(livres.filter((e) => MUSC[e.prim].g === grupo));
  if (lista.length) return { grupo, trocar: false, lista };

  // grupo atual completo: indica o grupo com mais falta
  let melhor = null, nota = 0;
  for (const g of GRUPOS) {
    if (g === grupo) continue;
    const l = ordenar(livres.filter((e) => MUSC[e.prim].g === g));
    const n = l.reduce((a, e) => a + falta(e.prim), 0);
    if (n > nota) { nota = n; melhor = { grupo: g, lista: l }; }
  }
  return melhor ? { grupo: melhor.grupo, trocar: true, de: grupo, lista: melhor.lista } : { grupo, trocar: false, lista: [] };
}

const ultimoPeso = (id) => {
  for (let i = state.hist.length - 1; i >= 0; i--) if (state.hist[i].ex === id) return state.hist[i].sets.at(-1)?.kg;
  return '';
};

// ---------- cronômetro: treino, exercício e descanso ----------
// state.sessao = { ini, ativo: { id, ini, desc } | null, descIni: timestamp | null }
// Fluxo: iniciar treino → ▶ iniciar exercício → ■ parei (marcar como feito) → descanso corre → ▶ próximo exercício.

const mmss = (s) => {
  s = Math.max(0, Math.round(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return `${h ? h + ':' + pad(m) : m}:${pad(s % 60)}`;
};
const seg = (t) => (Date.now() - t) / 1000;

function iniciarTreino() {
  if (!state.sessao) { state.sessao = { ini: Date.now(), ativo: null, descIni: null }; salvar(); }
}
function iniciarExercicio(id) {
  iniciarTreino();
  const s = state.sessao;
  if (s.ativo?.id === id) return;
  s.ativo = { id, ini: Date.now(), desc: s.descIni ? Math.round(seg(s.descIni)) : null };
  s.descIni = null;
  salvar();
}
function finalizarTreino() {
  const s = state.sessao;
  if (!s) return;
  state.treinos.push({ d: hoje(), ini: s.ini, fim: Date.now() });
  state.sessao = null;
  salvar();
}

function tick() {
  const s = state.sessao;
  if (!s) return;
  const set = (k, v) => document.querySelectorAll(`[data-t="${k}"]`).forEach((el) => { el.textContent = v; });
  set('total', mmss(seg(s.ini)));
  if (s.ativo) set('ativo', mmss(seg(s.ativo.ini)));
  if (s.descIni) set('desc', mmss(seg(s.descIni)));
}

function cartaoSessao() {
  const s = state.sessao;
  if (!s) {
    return `<div class="card row sp"><div><b>Treino</b><div class="mut">Cronometra exercícios e descansos.</div></div><button class="btn" data-act="iniciar-treino">▶ Iniciar treino</button></div>`;
  }
  let estado;
  if (s.ativo) {
    estado = `<div>Fazendo: <b>${esc(EX[s.ativo.id].nome)}</b></div><div class="big" data-t="ativo">0:00</div>` +
      `<button class="btn sm" data-act="abrir" data-id="${s.ativo.id}">Abrir exercício</button>`;
  } else if (s.descIni) {
    estado = `<div>Descansando</div><div class="big" data-t="desc">0:00</div><div class="mut">Escolha o próximo exercício e dê ▶ Iniciar.</div>`;
  } else {
    estado = `<div class="mut">Escolha um exercício e dê ▶ Iniciar.</div>`;
  }
  return `<div class="card"><div class="row sp"><span class="mut">Tempo de treino</span><b data-t="total">0:00</b></div>${estado}` +
    `<button class="btn ghost sm" data-act="fim-treino" style="margin-top:8px">Finalizar treino</button></div>`;
}

function timerExercicio(id) {
  const s = state.sessao;
  if (s?.ativo?.id === id) return `<span>Em andamento</span><b class="big" data-t="ativo">0:00</b>`;
  return `<span class="mut">${s?.descIni ? 'Descansando <b data-t="desc">0:00</b>' : 'Cronômetro parado'}</span><button class="btn" data-act="play">▶ Iniciar exercício</button>`;
}
const rotuloFeito = (id) => (state.sessao?.ativo?.id === id ? '■ Parei — marcar como feito' : 'Marcar como feito');

// ---------- telas ----------

function chipsMusculos(e) {
  return `<div class="chips"><span class="chip p">${esc(MUSC[e.prim].n)}</span>` +
    e.sec.map((id) => `<span class="chip s">${esc(MUSC[id].n)}</span>`).join('') + '</div>';
}

function cartaoExercicio(e, extra = '') {
  return `<div class="card ex" data-act="abrir" data-id="${e.id}">
    <div class="row sp"><b>${esc(e.nome)}</b><span class="mut">${esc(CARGA[e.carga].n)}${e.grip ? ' · ' + GRIPS[e.grip].n : ''}</span></div>
    ${chipsMusculos(e)}${extra}</div>`;
}

function renderHoje() {
  const sc = pontuacaoHoje();
  const destaque = {};
  for (const [id, v] of Object.entries(sc)) destaque[id] = Math.min(1, v / ALVO);
  const feitos = feitosHoje();
  let h = cartaoSessao();
  h += `<div class="card">${corposHTML(destaque)}<p class="mut" style="text-align:center;margin:6px 0 0">Músculos trabalhados hoje (cor mais forte = mais séries)</p></div>`;

  const sug = sugestoes(sc);
  if (!sug) {
    h += `<div class="card mut">Marque um exercício como feito para ver o que fazer em seguida.</div>`;
  } else {
    const grupoBarras = sug.trocar ? sug.de : sug.grupo;
    h += `<h2>${esc(grupoBarras)}: séries por músculo</h2><div class="card">` +
      Object.entries(MUSC).filter(([, mu]) => mu.g === grupoBarras).map(([id, mu]) => {
        const v = sc[id] || 0;
        return `<div style="margin-bottom:8px"><div class="row sp"><span>${esc(mu.n)}</span><span class="mut">${fmt(v)}/${ALVO}</span></div>` +
          `<div class="bar"><i style="width:${Math.min(100, (v / ALVO) * 100)}%"></i></div></div>`;
      }).join('') + '</div>';
    h += `<h2>Próximo sugerido${sug.trocar ? ` — ${esc(sug.de)} completo, vá para ${esc(sug.grupo)}` : ''}</h2>`;
    h += sug.lista.length
      ? sug.lista.map((e) => cartaoExercicio(e, `<div class="mut" style="margin-top:6px">Foca ${esc(MUSC[e.prim].n)} (${fmt(sc[e.prim] || 0)}/${ALVO} séries hoje)</div>`)).join('')
      : `<div class="card mut">Nenhum exercício livre com seus equipamentos.</div>`;
  }

  h += `<h2>Feitos hoje</h2>`;
  h += feitos.length
    ? feitos.map((x) => {
      const tempos = [x.dur != null ? `duração ${mmss(x.dur)}` : '', x.desc != null ? `descanso antes ${mmss(x.desc)}` : ''].filter(Boolean).join(' · ');
      return `<div class="card"><b>${esc(EX[x.ex].nome)}</b><div class="mut">${x.sets.map((s) => `${fmt(s.kg)}kg × ${s.reps}`).join(' · ')}</div>${tempos ? `<div class="mut">${tempos}</div>` : ''}</div>`;
    }).join('')
    : `<div class="card mut">Nada ainda. Escolha um exercício na aba Exercícios.</div>`;
  for (const t of state.treinos.filter((t) => t.d === hoje())) {
    h += `<div class="card mut">Treino finalizado: ${mmss((t.fim - t.ini) / 1000)} no total</div>`;
  }
  $('#hoje').innerHTML = h;
  tick();
}

let filtroGrupo = '';
function renderExercicios() {
  const lista = disponiveis().filter((e) => !filtroGrupo || MUSC[e.prim].g === filtroGrupo);
  $('#exercicios').innerHTML =
    `<select data-act="filtro"><option value="">Todos os grupos</option>${GRUPOS.map((g) => `<option${g === filtroGrupo ? ' selected' : ''}>${g}</option>`).join('')}</select><div style="height:10px"></div>` +
    (lista.map((e) => cartaoExercicio(e)).join('') || '<div class="card mut">Nenhum exercício para os equipamentos marcados.</div>');
}

function renderAjustes() {
  $('#ajustes').innerHTML = `
    <h2>Corpo</h2>
    <div class="seg">
      <label><input type="radio" name="gen" value="homem" ${state.genero === 'homem' ? 'checked' : ''}><span>Homem</span></label>
      <label><input type="radio" name="gen" value="mulher" ${state.genero === 'mulher' ? 'checked' : ''}><span>Mulher</span></label>
    </div>
    <h2>Meus equipamentos</h2>
    <div class="card">${Object.entries(EQUIPAMENTOS).map(([k, n]) =>
      `<label class="opt"><input type="checkbox" data-eq="${k}" ${state.equip.includes(k) ? 'checked' : ''}> ${esc(n)}</label>`).join('')}</div>
    <h2>Dados</h2>
    <button class="btn ghost" data-act="limpar-hoje">Apagar treino de hoje</button>`;
}

function renderTudo() { renderHoje(); renderExercicios(); renderAjustes(); }

// ---------- diálogo do exercício ----------

function linhaSet(i, kg = '', reps = '', carga) {
  return `<div class="set"><span class="n">${i}</span>
    <label>${esc(CARGA[carga].label)}<input type="number" inputmode="decimal" min="0" step="${CARGA[carga].step}" class="kg" value="${kg}"></label>
    <label>Reps<input type="number" inputmode="numeric" min="0" step="1" class="reps" value="${reps}"></label>
    <button class="x" data-act="rm-set" aria-label="Remover série">×</button></div>`;
}

function abrirExercicio(id) {
  const e = EX[id];
  const kg = ultimoPeso(id);
  const d = $('#dlg');
  d.dataset.id = id;
  d.innerHTML = `
    <div class="row sp"><h2 style="margin:0">${esc(e.nome)}</h2><button class="btn ghost sm" data-act="fechar">Fechar</button></div>
    ${chipsMusculos(e)}
    ${corposHTML({ ...Object.fromEntries(e.sec.map((s) => [s, 's'])), [e.prim]: 'p' })}
    <div id="dtimer" class="card row sp">${timerExercicio(id)}</div>
    ${e.grip ? `<div class="card grip">${gripSVG(e.grip)}<div><b>Pegada ${GRIPS[e.grip].n.toLowerCase()}</b><div class="mut">${esc(GRIPS[e.grip].d)}</div></div></div>` : ''}
    <h2>Séries</h2>
    <div id="sets">${[1, 2, 3].map((i) => linhaSet(i, kg, '', e.carga)).join('')}</div>
    <div class="row" style="margin-top:10px"><button class="btn ghost" data-act="add-set">+ Série</button><button id="bfeito" class="btn" data-act="feito" style="flex:1">${rotuloFeito(id)}</button></div>
    <p id="erro" class="mut" hidden>Preencha as repetições de pelo menos uma série.</p>`;
  d.showModal();
  tick();
}

function marcarFeito() {
  const d = $('#dlg'), e = EX[d.dataset.id];
  const sets = [...d.querySelectorAll('.set')].map((r) => ({
    kg: parseFloat($('.kg', r).value.replace(',', '.')) || 0,
    reps: parseInt($('.reps', r).value, 10) || 0,
  })).filter((s) => s.reps > 0);
  if (!sets.length) { $('#erro', d).hidden = false; return; }
  const s = state.sessao, a = s?.ativo?.id === e.id ? s.ativo : null;
  state.hist.push({ d: hoje(), t: Date.now(), ex: e.id, sets, dur: a ? Math.round(seg(a.ini)) : null, desc: a ? a.desc : null });
  // parou: se há treino em andamento (e nenhum outro exercício ativo), começa a contar o descanso
  if (s && (a || !s.ativo)) { s.ativo = null; s.descIni = Date.now(); }
  salvar();
  d.close();
  mostrarAba('hoje');
  renderTudo();
  const aux = e.sec.map((id) => MUSC[id].n).join(', ');
  toast(`Trabalhou: ${MUSC[e.prim].n} (principal)${aux ? ' · ' + aux + ' (auxiliares)' : ''}`);
}

// ---------- eventos ----------

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 5000);
}

function mostrarAba(nome) {
  for (const s of document.querySelectorAll('main > section')) s.hidden = s.id !== nome;
  for (const b of document.querySelectorAll('nav button')) b.classList.toggle('on', b.dataset.tab === nome);
}

document.addEventListener('click', (ev) => {
  const tab = ev.target.closest('[data-tab]');
  if (tab) return mostrarAba(tab.dataset.tab);
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const d = $('#dlg');
  switch (el.dataset.act) {
    case 'abrir': return abrirExercicio(el.dataset.id);
    case 'fechar': return d.close();
    case 'add-set': {
      const n = d.querySelectorAll('.set').length + 1, e = EX[d.dataset.id];
      const ult = [...d.querySelectorAll('.kg')].at(-1)?.value ?? '';
      return $('#sets', d).insertAdjacentHTML('beforeend', linhaSet(n, ult, '', e.carga));
    }
    case 'rm-set': {
      el.closest('.set').remove();
      return d.querySelectorAll('.set .n').forEach((n, i) => { n.textContent = i + 1; });
    }
    case 'feito': return marcarFeito();
    case 'play':
      iniciarExercicio(d.dataset.id);
      $('#dtimer', d).innerHTML = timerExercicio(d.dataset.id);
      $('#bfeito', d).textContent = rotuloFeito(d.dataset.id);
      renderHoje();
      return;
    case 'iniciar-treino': iniciarTreino(); return renderHoje();
    case 'fim-treino':
      if (confirm('Finalizar o treino?')) { finalizarTreino(); renderHoje(); }
      return;
    case 'limpar-hoje':
      if (confirm('Apagar os exercícios marcados hoje?')) { state.hist = state.hist.filter((h) => h.d !== hoje()); salvar(); renderTudo(); }
  }
});

document.addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.name === 'gen') { state.genero = t.value; salvar(); renderTudo(); }
  else if (t.dataset.eq) {
    state.equip = [...document.querySelectorAll('[data-eq]')].filter((c) => c.checked).map((c) => c.dataset.eq);
    salvar(); renderHoje(); renderExercicios();
  } else if (t.dataset.act === 'filtro') { filtroGrupo = t.value; renderExercicios(); }
});

renderTudo();
setInterval(tick, 1000);
