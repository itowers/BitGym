# BitGym

App de treino para academia em casa, com animações em pixel art 8 bits de cada exercício.
Feito para o equipamento disponível: polia **Uplift MC-1000** (polia dupla), banco ajustável,
halteres de anilha (2 a 24 kg), kettlebell ajustável e elásticos.

## O que tem

- **Catálogo** com 181 exercícios em 10 grupos (peito, costas, ombros, bíceps, tríceps,
  quadríceps, posterior e glúteos, panturrilha, abdômen e antebraço), cada um com animação,
  músculo principal (vermelho) e auxiliar (laranja), séries sugeridas, "como fazer" e dica.
- **Meu treino**: monta o plano semanal (dias → grupos musculares → exercícios), com tempo
  estimado por exercício, por dia e por semana. Base de 3×10, ajustável.
- **Registro de séries** com histórico, volume dos últimos 14 dias e progresso do dia.
- **Polia MC-1000**: cada exercício de cabo indica o furo (1 = mais alto, 9 = mais baixo),
  o lado da torre e o modo — uma polia (2:1) ou duas polias ligadas (1:1). No registro, o
  peso da pilha é convertido para a carga real.
- **Halteres de anilha**: calcula como montar cada halter com as anilhas que você tem.

## Estrutura

```
src/
  core.js         esqueleto, poses, cinemática inversa e modelo voxel dos aparelhos (MC-1000)
  data.js         grupos, equipamentos e os exercícios originais (E0)
  data2.js        catálogo completo (E): reaproveita E0 e define os demais
  rm.js           formas 3D (SDF) do corpo e dos acessórios: halter, kettlebell, elástico, cabos
  vec.js          desenho vetorial 2D e conversão para pixel art (paleta fixa, 100 px)
  ui.js           interface: catálogo, detalhe, plano de treino, registro e armazenamento
  editor_ui.js    editor de personagem (ajuste de proporções e estilo)
  editor_head.html
tools/
  folha_verificacao.py   gera dist/verificacao.html com 4 quadros de cada exercício
build.py          junta tudo em um único HTML
dist/
  index.html      o app
  editor.html     o editor de personagem
```

## Como gerar

```
python3 build.py
```

Abra `dist/index.html` no navegador. O app é um único arquivo HTML, sem dependências
externas (só a fonte "Press Start 2P" do Google Fonts). Os dados ficam no `localStorage`
do navegador; quando publicado como artifact no Claude, sincronizam com a conta.

Para revisar as animações:

```
python3 tools/folha_verificacao.py
```

e abra `dist/verificacao.html#0`, `#40`, `#80`... (40 exercícios por página).

## Como adicionar um exercício

Em `src/data2.js`, use `N(id, nome, grupo, equipamentos, principais, auxiliares, séries, {poses}, como, dica)`.
As poses `A` (início) e `B` (contração) usam:

- `P: [x, z]` posição da pelve; `r` rotação do tronco em graus (0 em pé, 90 deitado de costas, −90 de bruços);
- `h`/`hL`/`hR` mão relativa ao ombro `[frente, para fora, cima]`; `a` mão em coordenada absoluta;
- `f`/`fL`/`fR` pé absoluto; `e`/`k` direção do cotovelo/joelho;
- `db` halteres (`'two'`, `'one'`, `'L'`, `'R'`), `kb` kettlebell, `band` elástico;
- `props` aparelhos: `cab([x,y,z], 'hands'|'handR'|'ankleR', 'bar'|'rope'|'longbar'|'stirrups'|'handle'|'strap')`, `{t:'pullup'}`, `{t:'dips'}`, `{t:'pad'}`, `{t:'legpad'}`.

A câmera de cada exercício é escolhida automaticamente para mostrar melhor o movimento.
