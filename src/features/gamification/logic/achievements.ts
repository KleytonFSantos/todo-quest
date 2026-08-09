import { Achievement } from "../../../domain/entities/Gamification";

/**
 * Achievement definitions live in one declarative list. Each entry is a
 * pure predicate over gamification state — adding a new achievement never
 * requires touching store/reducer logic, just appending here.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_task",
    title: "Primeiro Passo",
    description: "Complete sua primeira tarefa",
    icon: "🌱",
    isUnlocked: (s) => s.totalTasksCompleted >= 1,
  },
  {
    id: "ten_tasks",
    title: "Produtivo",
    description: "Complete 10 tarefas",
    icon: "📋",
    isUnlocked: (s) => s.totalTasksCompleted >= 10,
  },
  {
    id: "fifty_tasks",
    title: "Máquina de Tarefas",
    description: "Complete 50 tarefas",
    icon: "🏭",
    isUnlocked: (s) => s.totalTasksCompleted >= 50,
  },
  {
    id: "streak_3",
    title: "Constância",
    description: "Mantenha uma sequência de 3 dias",
    icon: "🔥",
    isUnlocked: (s) => s.currentStreak >= 3,
  },
  {
    id: "streak_7",
    title: "Uma Semana Inteira",
    description: "Mantenha uma sequência de 7 dias",
    icon: "🔥",
    isUnlocked: (s) => s.currentStreak >= 7,
  },
  {
    id: "first_pomodoro",
    title: "Foco Total",
    description: "Complete seu primeiro pomodoro",
    icon: "🍅",
    isUnlocked: (s) => s.totalPomodorosCompleted >= 1,
  },
  {
    id: "ten_pomodoros",
    title: "Mestre do Foco",
    description: "Complete 10 pomodoros",
    icon: "⏱️",
    isUnlocked: (s) => s.totalPomodorosCompleted >= 10,
  },
  {
    id: "level_5",
    title: "Veterano",
    description: "Alcance o nível 5",
    icon: "⭐",
    isUnlocked: (s) => s.level >= 5,
  },
];

export function getNewlyUnlocked(
  previouslyUnlockedIds: string[],
  state: Parameters<Achievement["isUnlocked"]>[0]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    (a) => !previouslyUnlockedIds.includes(a.id) && a.isUnlocked(state)
  );
}
