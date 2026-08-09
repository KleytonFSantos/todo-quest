/**
 * Domain entities for the gamification subsystem.
 */
export interface GamificationState {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  /** yyyy-MM-dd of the last day a task was completed on, used to compute streaks */
  lastCompletionDate: string | null;
  unlockedAchievementIds: string[];
  totalTasksCompleted: number;
  totalPomodorosCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji, keeps the app asset-free
  /** Pure predicate — given the current state, is this achievement unlocked? */
  isUnlocked: (state: GamificationState) => boolean;
}

export interface XPGainEvent {
  amount: number;
  reason: string;
}

export const INITIAL_GAMIFICATION_STATE: GamificationState = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletionDate: null,
  unlockedAchievementIds: [],
  totalTasksCompleted: 0,
  totalPomodorosCompleted: 0,
};
