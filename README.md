# BitGym

App para treinar com os equipamentos que você tem em casa (halteres, banco, polia/crossover e barra de dip).

## Como usar

Abra `index.html` no navegador (sem build, sem dependências). Os dados ficam no `localStorage`.

## Funcionalidades

- **Homem / Mulher**: em Ajustes; muda a silhueta usada nos desenhos de músculos.
- **Carga por equipamento**: halter registra *kg por halter*; polia/barra registra *kg total*; exercícios de peso do corpo registram *kg extra*.
- **Pegada da mão**: cada exercício mostra o desenho da mão (pronada, supinada ou neutra) com a descrição.
- **Próximo exercício**: ao marcar um exercício como feito, o app mostra os músculos trabalhados (principal e auxiliares), as séries por músculo dentro do grupo e sugere o próximo exercício que foca o músculo menos trabalhado. Quando o grupo fecha a meta do dia (`ALVO` séries por músculo), sugere outro grupo.

- **Cronômetro**: em Hoje, "Iniciar treino" conta o tempo total. Dentro de um exercício, ▶ Iniciar exercício cronometra a execução; "Parei — marcar como feito" salva a duração e já começa a contar o descanso; ao dar ▶ no próximo exercício, o descanso é registrado. "Finalizar treino" fecha o tempo total.

## Estrutura

- `data.js`: equipamentos, músculos, pegadas, tipos de carga e a lista de exercícios.
- `app.js`: telas, registro de séries, sugestões.
- `style.css`, `index.html`.

Para adicionar um exercício, inclua uma linha `E(...)` em `data.js`.
