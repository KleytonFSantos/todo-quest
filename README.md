# TodoQuest — Todo list + Gamificação + Pomodoro (React Native / Expo)

App de lista de tarefas para iPhone com sistema de XP/níveis/streaks/conquistas
e um timer Pomodoro integrado, construído em React Native + TypeScript via
Expo (SDK 54, React Native 0.81, React 19 — trilho LTS/estável atual do
ecossistema Expo/RN, compatível com a versão atual do app Expo Go).

## Por que Expo (e não React Native puro)?

Você está no Windows. Compilar e assinar um app iOS nativamente exige Xcode,
que só roda em macOS. Com Expo:

- **Expo Go** no seu iPhone permite rodar o app agora mesmo, sem Mac, sem
  Xcode — só escaneando um QR code.
- Quando quiser gerar um `.ipa` para a App Store, isso é feito na nuvem via
  **EAS Build** (`eas build --platform ios`), também sem precisar de um Mac.

## Como rodar

1. Instale o Node.js LTS (não estava instalado nesta máquina):
   - via instalador oficial: https://nodejs.org (escolha a versão **LTS**), ou
   - via winget: `winget install OpenJS.NodeJS.LTS`
2. Nesta pasta, instale as dependências:
   ```bash
   npm install
   npx expo install --fix
   ```
   (o `expo install --fix` ajusta as versões das libs nativas para a combinação
   exata suportada pela versão do Expo SDK instalada)
3. Instale o app **Expo Go** no seu iPhone (App Store).
4. Rode:
   ```bash
   npx expo start
   ```
   e escaneie o QR code com a câmera do iPhone (abre direto no Expo Go).

## Arquitetura e padrões usados

```
src/
  domain/         Entidades e tipos puros (Task, Pomodoro, Gamification) —
                   zero dependência de React ou de storage.
  data/
    storage/       StorageAdapter — Singleton que encapsula o AsyncStorage.
    repositories/   Repository pattern (TaskRepository, GamificationRepository,
                   SettingsRepository) — a única camada que sabe como os dados
                   são persistidos. Trocar AsyncStorage por SQLite/uma API
                   no futuro só muda estes 3 arquivos.
  state/           Zustand stores — orquestram repositórios + regras de
                   negócio (ex.: completar tarefa dispara XP). Funcionam como
                   um Facade sobre os repositórios; a UI nunca importa
                   repositório diretamente.
  features/
    tasks/          hooks/useTasks (facade de seleção/derivação),
                   components/ (apresentacionais, sem lógica de estado),
                   screens/ (compõe hooks + componentes).
    pomodoro/       pomodoroMachine.ts — state machine pura (reducer) com os
                   estados idle/running/paused e as fases work/shortBreak/
                   longBreak. hooks/usePomodoroTimer conecta a máquina a
                   efeitos colaterais reais (setInterval, notificações, XP).
    gamification/   logic/xpStrategies.ts — Strategy pattern: cada fonte de
                   XP (tarefa concluída, pomodoro concluído) é uma estratégia
                   intercambiável. logic/achievements.ts — lista declarativa
                   de conquistas, cada uma um predicado puro sobre o estado.
                   logic/levelCurve.ts — fórmula de XP→nível.
    categories/     categorias 100% cadastradas pelo usuário (nome + cor) —
                   hooks/useCategories (facade), components/CategorySelector
                   (escolher categoria ao criar/editar tarefa),
                   components/CategoryFilterBar (filtrar a lista de tarefas),
                   screens/CategoriesScreen (CRUD, acessível por Ajustes).
    reports/        dashboard de atividades realizadas — logic/reportAggregation.ts
                   (funções puras de agregação por dia/semana e por categoria,
                   fáceis de testar isoladamente), hooks/useActivityReport
                   (facade que guarda o filtro de período/categoria e deriva
                   tudo com useMemo), components/ (gráfico de barras, resumo,
                   breakdown por categoria — sem lib de gráficos, só View +
                   flexbox), screens/ReportScreen.
    settings/       tela de configuração dos tempos do Pomodoro, notificações
                   e acesso ao gerenciador de categorias.
  services/        NotificationService — Service layer/Singleton em cima do
                   expo-notifications; nenhuma tela importa a lib diretamente.
  theme/           useTheme() — hook único de cores, com suporte automático a
                   light/dark mode do iOS.
  app/             App.tsx (composition root: hidrata todas as stores no
                   boot) + navigation/ (React Navigation, bottom tabs).
```

Princípios aplicados:

- **Separação em camadas** (domain → data → state → features/UI), cada uma só
  conhece a de baixo.
- **Repository pattern** para isolar persistência.
- **Strategy pattern** para regras de XP.
- **State machine (reducer puro)** para o Pomodoro — fácil de testar sem
  precisar de temporizadores reais.
- **Custom hooks como fachada**: telas nunca leem Zustand/store bruto nem
  chamam repositório — sempre passam por `useTasks`, `usePomodoroTimer`,
  `useGamification`.
- **Componentes apresentacionais puros** (`TaskItem`, `XPBar`, `TimerDisplay`)
  sem acesso a estado global, só props.
- **Singleton** para o adapter de storage e o serviço de notificações.

## Sistema de gamificação

- **XP por tarefa**: 10/20/35 XP (baixa/média/alta prioridade) com bônus de
  até +100% conforme a sequência (streak) de dias ativos.
- **XP por pomodoro**: 15 XP, +10 XP se a sessão estiver vinculada a uma
  tarefa específica.
- **Níveis**: curva triangular (cada nível pede mais XP que o anterior).
- **Streak**: incrementa a cada dia com pelo menos 1 tarefa concluída; zera
  se um dia é pulado.
- **Conquistas**: 8 conquistas iniciais (primeira tarefa, 10/50 tarefas,
  streak de 3/7 dias, primeiro pomodoro, 10 pomodoros, nível 5) — fácil de
  estender em `src/features/gamification/logic/achievements.ts`.

## Categorias

- Totalmente cadastradas pelo usuário — o app não vem com nenhuma categoria
  pré-definida. Crie em **Ajustes → Gerenciar categorias** (nome + cor).
- Ao criar/editar uma tarefa, só é possível escolher entre as categorias já
  cadastradas (sem digitação livre), garantindo consistência.
- A tela de Tarefas ganha uma barra de filtro por categoria assim que existe
  pelo menos uma cadastrada.
- Excluir uma categoria remove a referência das tarefas que a usavam (elas
  voltam a ficar "sem categoria"), sem apagar as tarefas.

## Relatório / Dashboard de atividades

- Nova aba **Relatório** (📊) com visualização das tarefas concluídas.
- Filtro de **período**: Diário (últimos 7 dias, um dia por barra) ou Semanal
  (últimas 8 semanas, uma semana por barra).
- Filtro de **categoria**: mesma barra de filtro usada na tela de Tarefas.
- Cartões de resumo: total concluído no período, média por dia/semana e
  pomodoros investidos nas tarefas concluídas.
- Gráfico de barras da atividade ao longo do tempo e um breakdown por
  categoria (contagem + barra proporcional).
- Toda a agregação vive em `logic/reportAggregation.ts` como funções puras
  (sem estado, sem React) — dá pra testar com Jest sem montar componente.

## Timer Pomodoro

- Padrão 25 min de foco / 5 min de pausa curta / 15 min de pausa longa a
  cada 4 ciclos — tudo configurável na aba Ajustes.
- Pode ser vinculado a uma tarefa específica; ao concluir um ciclo de foco,
  incrementa o contador de pomodoros da tarefa e dá XP bônus.
- Dispara uma notificação local ao fim de cada fase (pode ser desativado nos
  Ajustes).

## Próximos passos sugeridos

- Testes unitários para `pomodoroReducer` e `xpStrategies` (são funções
  puras, ideais para Jest).
- Migrar persistência para `react-native-mmkv` se a base de tarefas crescer
  muito (troca isolada em `StorageAdapter`).
- `EAS Build` + `EAS Submit` para publicar na App Store quando o app estiver
  pronto.
