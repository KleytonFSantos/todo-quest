import {
  PomodoroConfig,
  PomodoroPhase,
  PomodoroState,
} from "../../domain/entities/Pomodoro";

/**
 * Finite-state machine for the Pomodoro timer, implemented as a pure
 * reducer. Ticking/side-effects (setInterval, notifications, XP) live in
 * the `usePomodoroTimer` hook — the reducer only ever computes the next
 * state from the current one, which keeps it trivially testable.
 */
export type PomodoroAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" }
  | { type: "TICK" }
  | { type: "SKIP" }
  | { type: "SET_LINKED_TASK"; taskId: string | null }
  | { type: "UPDATE_CONFIG"; config: PomodoroConfig };

function secondsFor(phase: PomodoroPhase, config: PomodoroConfig): number {
  switch (phase) {
    case "work":
      return config.workMinutes * 60;
    case "shortBreak":
      return config.shortBreakMinutes * 60;
    case "longBreak":
      return config.longBreakMinutes * 60;
  }
}

export function createInitialState(config: PomodoroConfig): PomodoroState {
  return {
    phase: "work",
    status: "idle",
    secondsRemaining: secondsFor("work", config),
    completedWorkCycles: 0,
    config,
    linkedTaskId: null,
  };
}

/** Advances to the next phase once the current one hits zero seconds. */
function advancePhase(state: PomodoroState): PomodoroState {
  if (state.phase === "work") {
    const completedWorkCycles = state.completedWorkCycles + 1;
    const nextPhase: PomodoroPhase =
      completedWorkCycles % state.config.cyclesBeforeLongBreak === 0
        ? "longBreak"
        : "shortBreak";
    return {
      ...state,
      phase: nextPhase,
      status: "idle",
      completedWorkCycles,
      secondsRemaining: secondsFor(nextPhase, state.config),
    };
  }
  // any break -> back to work
  return {
    ...state,
    phase: "work",
    status: "idle",
    secondsRemaining: secondsFor("work", state.config),
  };
}

export function pomodoroReducer(
  state: PomodoroState,
  action: PomodoroAction
): PomodoroState {
  switch (action.type) {
    case "START":
    case "RESUME":
      return { ...state, status: "running" };

    case "PAUSE":
      return { ...state, status: "paused" };

    case "RESET":
      return {
        ...state,
        status: "idle",
        secondsRemaining: secondsFor(state.phase, state.config),
      };

    case "TICK": {
      if (state.status !== "running") return state;
      if (state.secondsRemaining <= 1) {
        // caller (hook) is responsible for detecting this transition and
        // firing side effects (XP, notification) by comparing phases
        return advancePhase(state);
      }
      return { ...state, secondsRemaining: state.secondsRemaining - 1 };
    }

    case "SKIP":
      return advancePhase(state);

    case "SET_LINKED_TASK":
      return { ...state, linkedTaskId: action.taskId };

    case "UPDATE_CONFIG":
      return {
        ...state,
        config: action.config,
        // only resync the visible countdown if the timer isn't running
        secondsRemaining:
          state.status === "idle"
            ? secondsFor(state.phase, action.config)
            : state.secondsRemaining,
      };

    default:
      return state;
  }
}
