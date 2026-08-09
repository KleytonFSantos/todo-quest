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

## Instalar no iPhone sem pagar Apple Developer Program (build não assinado + Sideloadly)

Existe um workflow do GitHub Actions em
[`.github/workflows/ios-unsigned-build.yml`](.github/workflows/ios-unsigned-build.yml)
que compila um `.ipa` **sem assinatura** numa máquina macOS gratuita do
GitHub, para você assinar depois com seu **Apple ID grátis** usando o
[Sideloadly](https://sideloadly.io) direto do Windows. Nenhum Mac e nenhum
pagamento à Apple são necessários.

⚠️ Isso é uma técnica de comunidade (não é o caminho oficial da Expo/Apple).
Eu não tenho como testar num Mac/iPhone real antes de te entregar, então é
possível que o build falhe na primeira tentativa — se acontecer, me manda o
log do passo que falhou (aba Actions → clique no run → abre o step
vermelho) que eu ajusto.

### Passo a passo

1. **Crie um repositório no GitHub** (pode ser público — assim os minutos de
   build em macOS são ilimitados e grátis; se for privado, você tem uma cota
   mensal gratuita menor, mas geralmente suficiente para uso ocasional).
2. Conecte este projeto local ao repositório e envie o código:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```
   (o Git vai pedir para você autenticar com sua conta do GitHub na primeira
   vez — normalmente abre uma janela do navegador para login)
3. No GitHub, abra a aba **Actions** do repositório, selecione o workflow
   **"iOS unsigned build (for Sideloadly)"** e clique em **"Run workflow"**.
4. Aguarde a build terminar (leva uns 10–20 minutos). Ao final, baixe o
   artifact **`TodoQuest-unsigned-ipa`** (é um `.zip` contendo o `.ipa` —
   extraia para pegar o arquivo `.ipa`).
5. No Windows, instale o **[Sideloadly](https://sideloadly.io)** e conecte
   seu iPhone por cabo USB (pode pedir para instalar o driver da Apple, o
   próprio instalador do Sideloadly cuida disso).
6. Abra o Sideloadly, arraste o `.ipa` para dentro, informe seu **Apple ID**
   (uma conta grátis normal — não precisa ser desenvolvedor) e clique em
   **Start**. Se sua conta Apple tem verificação em duas etapas, use uma
   ["senha de app"](https://support.apple.com/pt-br/102654) gerada em
   appleid.apple.com em vez da sua senha normal.
7. No iPhone, vá em **Ajustes → Geral → VPN e Gerenciamento de Dispositivo**
   e toque em "Confiar" no perfil do seu Apple ID.
8. Abra o app na tela inicial.

**Limitação do Apple ID gratuito:** o app expira em 7 dias — depois disso,
repita os passos 5–7 (não precisa gerar um `.ipa` novo, o mesmo arquivo
serve, a menos que você tenha mudado o código). O Sideloadly também tem uma
opção de auto-renovação via Wi-Fi enquanto o programa fica aberto no PC.

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
