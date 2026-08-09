import { create } from "zustand";
import {
  GamificationState,
  INITIAL_GAMIFICATION_STATE,
  Achievement,
} from "../domain/entities/Gamification";
import { Priority } from "../domain/entities/Task";
import { gamificationRepository } from "../data/repositories/GamificationRepository";
import {
  taskCompletionXPStrategy,
  pomodoroCompletionXPStrategy,
} from "../features/gamification/logic/xpStrategies";
import { getLevelForXP } from "../features/gamification/logic/levelCurve";
import { getNewlyUnlocked } from "../features/gamification/logic/achievements";
import { todayKey, daysBetweenKeys } from "../utils/date";
import { notificationService } from "../services/NotificationService";

interface GamificationStore extends GamificationState {
  hydrated: boolean;
  /** ephemeral UI signals — consumed and cleared by screens/modals */
  pendingLevelUp: number | null;
  pendingAchievements: Achievement[];

  hydrate: () => Promise<void>;
  registerTaskCompletion: (priority: Priority) => Promise<void>;
  registerPomodoroCompletion: (isLinkedToTask: boolean) => Promise<void>;
  clearPendingLevelUp: () => void;
  clearPendingAchievements: () => void;
}

/** Recomputes streak counters given "today" and the last completion day. */
function nextStreak(state: GamificationState): {
  currentStreak: number;
  longestStreak: number;
} {
  const today = todayKey();
  if (state.lastCompletionDate === today) {
    // already counted today — streak unchanged
    return {
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
    };
  }
  const gap = state.lastCompletionDate
    ? daysBetweenKeys(state.lastCompletionDate, today)
    : null;
  const currentStreak = gap === 1 || gap === null ? state.currentStreak + 1 : 1;
  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, state.longestStreak),
  };
}

async function persistAndCheckLevelUp(
  set: (fn: (s: GamificationStore) => Partial<GamificationStore>) => void,
  get: () => GamificationStore,
  nextState: GamificationState
) {
  const previousLevel = get().level;
  const newLevel = getLevelForXP(nextState.xp);
  const previousAchievementIds = get().unlockedAchievementIds;
  const newlyUnlocked = getNewlyUnlocked(previousAchievementIds, nextState);
  const finalState: GamificationState = {
    ...nextState,
    level: newLevel,
    unlockedAchievementIds: [
      ...previousAchievementIds,
      ...newlyUnlocked.map((a) => a.id),
    ],
  };

  await gamificationRepository.save(finalState);

  set(() => ({
    ...finalState,
    pendingLevelUp: newLevel > previousLevel ? newLevel : null,
    pendingAchievements: newlyUnlocked,
  }));

  if (newLevel > previousLevel) {
    void notificationService.notifyLevelUp(newLevel);
  }
}

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  ...INITIAL_GAMIFICATION_STATE,
  hydrated: false,
  pendingLevelUp: null,
  pendingAchievements: [],

  hydrate: async () => {
    const saved = await gamificationRepository.get();
    set(() => ({ ...saved, hydrated: true }));
  },

  registerTaskCompletion: async (priority) => {
    const state = get();
    const { currentStreak, longestStreak } = nextStreak(state);
    const gained = taskCompletionXPStrategy.calculate({
      priority,
      currentStreak,
    });
    const nextState: GamificationState = {
      xp: state.xp + gained,
      level: state.level,
      currentStreak,
      longestStreak,
      lastCompletionDate: todayKey(),
      unlockedAchievementIds: state.unlockedAchievementIds,
      totalTasksCompleted: state.totalTasksCompleted + 1,
      totalPomodorosCompleted: state.totalPomodorosCompleted,
    };
    await persistAndCheckLevelUp(set, get, nextState);
  },

  registerPomodoroCompletion: async (isLinkedToTask) => {
    const state = get();
    const gained = pomodoroCompletionXPStrategy.calculate({ isLinkedToTask });
    const nextState: GamificationState = {
      ...state,
      xp: state.xp + gained,
      totalPomodorosCompleted: state.totalPomodorosCompleted + 1,
    };
    await persistAndCheckLevelUp(set, get, nextState);
  },

  clearPendingLevelUp: () => set(() => ({ pendingLevelUp: null })),
  clearPendingAchievements: () => set(() => ({ pendingAchievements: [] })),
}));
