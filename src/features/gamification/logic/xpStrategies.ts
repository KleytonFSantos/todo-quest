import { Priority } from "../../../domain/entities/Task";

/**
 * Strategy pattern: each source of XP (finishing a task, finishing a
 * pomodoro, ...) is its own interchangeable calculation. The gamification
 * store just calls `.calculate(context)` — it doesn't know or care about
 * the formula, so new sources (e.g. "weekly challenge") plug in without
 * touching store logic.
 */
export interface XPStrategy<TContext> {
  calculate(context: TContext): number;
}

const BASE_XP_BY_PRIORITY: Record<Priority, number> = {
  low: 10,
  medium: 20,
  high: 35,
};

export interface TaskCompletionContext {
  priority: Priority;
  currentStreak: number;
}

class TaskCompletionXPStrategy implements XPStrategy<TaskCompletionContext> {
  calculate({ priority, currentStreak }: TaskCompletionContext): number {
    const base = BASE_XP_BY_PRIORITY[priority];
    // +5% XP per day of streak, capped at +100%
    const streakMultiplier = 1 + Math.min(currentStreak * 0.05, 1);
    return Math.round(base * streakMultiplier);
  }
}

export interface PomodoroCompletionContext {
  isLinkedToTask: boolean;
}

class PomodoroCompletionXPStrategy
  implements XPStrategy<PomodoroCompletionContext>
{
  calculate({ isLinkedToTask }: PomodoroCompletionContext): number {
    const base = 15;
    const bonus = isLinkedToTask ? 10 : 0;
    return base + bonus;
  }
}

export const taskCompletionXPStrategy = new TaskCompletionXPStrategy();
export const pomodoroCompletionXPStrategy = new PomodoroCompletionXPStrategy();
