import { useEffect, useReducer, useRef } from "react";
import {
  createInitialState,
  pomodoroReducer,
} from "../pomodoroMachine";
import { PomodoroPhase } from "../../../domain/entities/Pomodoro";
import { useSettingsStore } from "../../../state/useSettingsStore";
import { useGamificationStore } from "../../../state/useGamificationStore";
import { useTaskStore } from "../../../state/useTaskStore";
import { notificationService } from "../../../services/NotificationService";

const PHASE_LABEL: Record<PomodoroPhase, string> = {
  work: "Foco",
  shortBreak: "Pausa curta",
  longBreak: "Pausa longa",
};

/**
 * Wires the pure `pomodoroReducer` state machine to real-world side effects:
 * the 1s ticking interval, XP awarding, task pomodoro counters and local
 * notifications. Screens just call the actions this hook returns.
 */
export function usePomodoroTimer() {
  const config = useSettingsStore((s) => s.pomodoro);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const registerPomodoroCompletion = useGamificationStore(
    (s) => s.registerPomodoroCompletion
  );
  const incrementPomodoroCount = useTaskStore((s) => s.incrementPomodoroCount);

  const [state, dispatch] = useReducer(pomodoroReducer, config, createInitialState);
  const previousPhase = useRef<PomodoroPhase>(state.phase);

  // ticking loop
  useEffect(() => {
    if (state.status !== "running") return;
    const interval = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(interval);
  }, [state.status]);

  // react to the config screen changing durations while idle
  useEffect(() => {
    dispatch({ type: "UPDATE_CONFIG", config });
  }, [config]);

  // detect phase transitions to fire side effects exactly once per change
  useEffect(() => {
    if (previousPhase.current === state.phase) return;
    const completedPhase = previousPhase.current;
    previousPhase.current = state.phase;

    if (completedPhase === "work") {
      void registerPomodoroCompletion(state.linkedTaskId !== null);
      if (state.linkedTaskId) {
        void incrementPomodoroCount(state.linkedTaskId);
      }
    }

    if (notificationsEnabled) {
      void notificationService.notifyPhaseComplete(
        `${PHASE_LABEL[completedPhase]} concluído!`,
        completedPhase === "work"
          ? "Hora de uma pausa. Você ganhou XP! 🎉"
          : "Pausa terminada, hora de focar de novo."
      );
    }
  }, [
    state.phase,
    state.linkedTaskId,
    notificationsEnabled,
    registerPomodoroCompletion,
    incrementPomodoroCount,
  ]);

  return {
    state,
    start: () => dispatch({ type: "START" }),
    pause: () => dispatch({ type: "PAUSE" }),
    resume: () => dispatch({ type: "RESUME" }),
    reset: () => dispatch({ type: "RESET" }),
    skip: () => dispatch({ type: "SKIP" }),
    setLinkedTask: (taskId: string | null) =>
      dispatch({ type: "SET_LINKED_TASK", taskId }),
  };
}
