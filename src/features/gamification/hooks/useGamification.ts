import { useGamificationStore } from "../../../state/useGamificationStore";
import { ACHIEVEMENTS } from "../logic/achievements";

/** Facade hook: screens read gamification state/achievements through here. */
export function useGamification() {
  const xp = useGamificationStore((s) => s.xp);
  const level = useGamificationStore((s) => s.level);
  const currentStreak = useGamificationStore((s) => s.currentStreak);
  const longestStreak = useGamificationStore((s) => s.longestStreak);
  const totalTasksCompleted = useGamificationStore((s) => s.totalTasksCompleted);
  const totalPomodorosCompleted = useGamificationStore((s) => s.totalPomodorosCompleted);
  const unlockedAchievementIds = useGamificationStore((s) => s.unlockedAchievementIds);
  const pendingLevelUp = useGamificationStore((s) => s.pendingLevelUp);
  const pendingAchievements = useGamificationStore((s) => s.pendingAchievements);
  const clearPendingLevelUp = useGamificationStore((s) => s.clearPendingLevelUp);
  const clearPendingAchievements = useGamificationStore((s) => s.clearPendingAchievements);

  const achievements = ACHIEVEMENTS.map((a) => ({
    achievement: a,
    unlocked: unlockedAchievementIds.includes(a.id),
  }));

  return {
    xp,
    level,
    currentStreak,
    longestStreak,
    totalTasksCompleted,
    totalPomodorosCompleted,
    achievements,
    pendingLevelUp,
    pendingAchievements,
    clearPendingLevelUp,
    clearPendingAchievements,
  };
}
