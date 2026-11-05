// Dados do BitGym: equipamentos, músculos, pegadas, tipos de carga e exercícios.

const EQUIPAMENTOS = {
  halteres: 'Halteres',
  banco: 'Banco',
  polia: 'Polia / crossover',
  paralelas: 'Barra de dip',
};

// Séries/dia consideradas "suficientes" para um músculo (usado nas sugestões).
const ALVO = 6;

// v: 'f' frente, 'b' costas. Posição (cx, cy, rx, ry) do lado esquerdo; o direito é espelhado.
const m = (n, g, v, cx, cy, rx, ry) => ({ n, g, v, cx, cy, rx, ry });
const MUSC = {
  peito_sup: m('Peitoral superior', 'Peito', 'f', 41, 50, 8, 3.5),
  peito_med: m('Peitoral médio', 'Peito', 'f', 41, 57, 8.5, 3.5),
  peito_inf: m('Peitoral inferior', 'Peito', 'f', 41, 64, 8, 3.2),
  delt_ant: m('Deltoide anterior', 'Ombro', 'f', 29, 47, 4, 5.5),
  delt_lat: m('Deltoide lateral', 'Ombro', 'f', 24, 49, 3, 5.5),
  delt_post: m('Deltoide posterior', 'Ombro', 'b', 27, 47, 4.5, 5.5),
  trapezio: m('Trapézio', 'Costas', 'b', 44, 42, 6, 6),
  romboides: m('Romboides', 'Costas', 'b', 43, 54, 5, 5),
  dorsal: m('Dorsal', 'Costas', 'b', 37, 68, 8, 9),
  biceps: m('Bíceps', 'Bíceps', 'f', 24, 65, 3.5, 8),
  braquial: m('Braquial / braquiorradial', 'Bíceps', 'f', 23, 77, 3, 4.5),
  triceps_longa: m('Tríceps (cabeça longa)', 'Tríceps', 'b', 24, 62, 3.5, 8),
  triceps_lat: m('Tríceps (lateral/medial)', 'Tríceps', 'b', 21, 70, 2.8, 6),
  quadriceps: m('Quadríceps', 'Pernas', 'f', 41, 125, 7, 19),
  gluteo: m('Glúteo', 'Pernas', 'b', 41, 100, 8, 6.5),
  posterior: m('Posterior de coxa', 'Pernas', 'b', 41, 128, 7, 16),
  panturrilha: m('Panturrilha', 'Pernas', 'b', 40, 160, 4.5, 10),
};

const GRUPOS = ['Peito', 'Ombro', 'Tríceps', 'Costas', 'Bíceps', 'Pernas'];

// Pegada (posição da mão). Desenhadas em app.js (gripSVG).
const GRIPS = {
  pronada: { n: 'Pronada', d: 'Palma para baixo; costas da mão para cima, polegares se aproximam.' },
  supinada: { n: 'Supinada', d: 'Palma para cima; polegares apontam para fora.' },
  neutra: { n: 'Neutra', d: 'Palmas frente a frente, polegar para cima (pegada de martelo).' },
};

// Como o peso é marcado, conforme o equipamento.
const CARGA = {
  halter: { n: 'Halter', label: 'kg por halter', step: 1 },
  polia: { n: 'Polia / barra', label: 'kg total (polia ou barra)', step: 2.5 },
  corpo: { n: 'Peso do corpo', label: 'kg extra (0 = só o corpo)', step: 1 },
};

// id, nome, equipamentos exigidos, músculo principal, músculos secundários, pegada, tipo de carga
const E = (id, nome, eq, prim, sec, grip, carga) => ({ id, nome, eq, prim, sec, grip, carga });
const EXERCICIOS = [
  // Peito
  E('supino_reto', 'Supino reto com halteres', ['halteres', 'banco'], 'peito_med', ['delt_ant', 'triceps_lat'], 'pronada', 'halter'),
  E('supino_inc', 'Supino inclinado com halteres', ['halteres', 'banco'], 'peito_sup', ['delt_ant', 'triceps_lat'], 'pronada', 'halter'),
  E('cruc_reto', 'Crucifixo reto com halteres', ['halteres', 'banco'], 'peito_med', ['delt_ant'], 'neutra', 'halter'),
  E('cruc_inc', 'Crucifixo inclinado com halteres', ['halteres', 'banco'], 'peito_sup', ['delt_ant'], 'neutra', 'halter'),
  E('cross_alto', 'Crossover na polia alta', ['polia'], 'peito_inf', ['delt_ant'], 'neutra', 'polia'),
  E('cross_medio', 'Crossover na polia média', ['polia'], 'peito_med', ['delt_ant'], 'neutra', 'polia'),
  E('cross_baixo', 'Crossover na polia baixa', ['polia'], 'peito_sup', ['delt_ant'], 'neutra', 'polia'),
  E('mergulho_peito', 'Mergulho nas paralelas (peito)', ['paralelas'], 'peito_inf', ['triceps_lat', 'delt_ant'], 'neutra', 'corpo'),
  // Ombro
  E('desenv', 'Desenvolvimento com halteres', ['halteres', 'banco'], 'delt_ant', ['delt_lat', 'triceps_lat'], 'pronada', 'halter'),
  E('elev_lat', 'Elevação lateral com halteres', ['halteres'], 'delt_lat', ['trapezio'], 'pronada', 'halter'),
  E('elev_lat_pol', 'Elevação lateral na polia', ['polia'], 'delt_lat', [], 'neutra', 'polia'),
  E('elev_front', 'Elevação frontal com halteres', ['halteres'], 'delt_ant', ['peito_sup'], 'pronada', 'halter'),
  E('cruc_inv', 'Crucifixo inverso com halteres', ['halteres'], 'delt_post', ['romboides'], 'pronada', 'halter'),
  E('face_pull', 'Face pull na polia', ['polia'], 'delt_post', ['romboides', 'trapezio'], 'neutra', 'polia'),
  E('encolhimento', 'Encolhimento com halteres', ['halteres'], 'trapezio', [], 'neutra', 'halter'),
  // Tríceps
  E('tri_corda', 'Tríceps na polia (corda)', ['polia'], 'triceps_lat', ['triceps_longa'], 'neutra', 'polia'),
  E('tri_barra', 'Tríceps na polia (barra reta)', ['polia'], 'triceps_lat', ['triceps_longa'], 'pronada', 'polia'),
  E('tri_testa', 'Tríceps testa com halteres', ['halteres', 'banco'], 'triceps_longa', ['triceps_lat'], 'neutra', 'halter'),
  E('tri_frances', 'Tríceps francês com halter', ['halteres'], 'triceps_longa', ['triceps_lat'], 'neutra', 'halter'),
  E('tri_acima', 'Tríceps corda acima da cabeça', ['polia'], 'triceps_longa', ['triceps_lat'], 'neutra', 'polia'),
  E('tri_coice', 'Tríceps coice com halter', ['halteres'], 'triceps_lat', ['triceps_longa'], 'neutra', 'halter'),
  E('mergulho_banco', 'Mergulho no banco', ['banco'], 'triceps_lat', ['triceps_longa', 'delt_ant'], 'pronada', 'corpo'),
  E('mergulho_tri', 'Mergulho nas paralelas (tríceps)', ['paralelas'], 'triceps_lat', ['triceps_longa', 'peito_inf'], 'neutra', 'corpo'),
  // Costas
  E('remada_curv', 'Remada curvada com halteres', ['halteres'], 'dorsal', ['romboides', 'biceps', 'delt_post'], 'neutra', 'halter'),
  E('remada_uni', 'Remada unilateral com halter (apoio no banco)', ['halteres', 'banco'], 'dorsal', ['romboides', 'biceps'], 'neutra', 'halter'),
  E('puxada_alta', 'Puxada alta na polia', ['polia'], 'dorsal', ['biceps', 'romboides'], 'pronada', 'polia'),
  E('puxada_sup', 'Puxada supinada na polia', ['polia'], 'dorsal', ['biceps'], 'supinada', 'polia'),
  E('puxada_tri', 'Puxada com triângulo', ['polia'], 'dorsal', ['biceps', 'braquial'], 'neutra', 'polia'),
  E('remada_baixa', 'Remada baixa na polia (triângulo)', ['polia'], 'romboides', ['dorsal', 'biceps', 'delt_post'], 'neutra', 'polia'),
  E('pullover_pol', 'Pullover na polia alta', ['polia'], 'dorsal', ['triceps_longa'], 'pronada', 'polia'),
  E('pullover_hal', 'Pullover com halter', ['halteres', 'banco'], 'dorsal', ['peito_inf', 'triceps_longa'], 'neutra', 'halter'),
  // Bíceps
  E('rosca_dir', 'Rosca direta com halteres', ['halteres'], 'biceps', ['braquial'], 'supinada', 'halter'),
  E('rosca_inc', 'Rosca inclinada no banco', ['halteres', 'banco'], 'biceps', ['braquial'], 'supinada', 'halter'),
  E('rosca_conc', 'Rosca concentrada', ['halteres', 'banco'], 'biceps', ['braquial'], 'supinada', 'halter'),
  E('rosca_martelo', 'Rosca martelo', ['halteres'], 'braquial', ['biceps'], 'neutra', 'halter'),
  E('rosca_pol', 'Rosca na polia baixa (barra)', ['polia'], 'biceps', ['braquial'], 'supinada', 'polia'),
  E('rosca_inversa', 'Rosca inversa', ['halteres'], 'braquial', ['biceps'], 'pronada', 'halter'),
  // Pernas
  E('goblet', 'Agachamento goblet', ['halteres'], 'quadriceps', ['gluteo'], 'neutra', 'halter'),
  E('afundo', 'Afundo com halteres', ['halteres'], 'quadriceps', ['gluteo', 'posterior'], 'neutra', 'halter'),
  E('bulgaro', 'Agachamento búlgaro', ['halteres', 'banco'], 'quadriceps', ['gluteo'], 'neutra', 'halter'),
  E('stiff', 'Stiff com halteres', ['halteres'], 'posterior', ['gluteo'], 'pronada', 'halter'),
  E('pelvica', 'Elevação pélvica com halter', ['halteres', 'banco'], 'gluteo', ['posterior'], null, 'halter'),
  E('panturrilha', 'Panturrilha em pé com halteres', ['halteres'], 'panturrilha', [], 'neutra', 'halter'),
  E('flexora_pol', 'Flexora em pé na polia', ['polia'], 'posterior', [], null, 'polia'),
  E('coice_gluteo', 'Coice de glúteo na polia', ['polia'], 'gluteo', ['posterior'], null, 'polia'),
];

const EX = Object.fromEntries(EXERCICIOS.map((e) => [e.id, e]));
