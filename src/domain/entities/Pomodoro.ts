/**
 * Domain types for the Pomodoro timer (state-machine shape).
 */
export type PomodoroPhase = "work" | "shortBreak" | "longBreak";
export type TimerStatus = "idle" | "running" | "paused";

export interface PomodoroConfig {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** how many work cycles happen before a long break is granted */
  cyclesBeforeLongBreak: number;
}

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
};

export interface PomodoroState {
  phase: PomodoroPhase;
  status: TimerStatus;
  secondsRemaining: number;
  /** completed work cycles since the last long break */
  completedWorkCycles: number;
  config: PomodoroConfig;
  /** id of the task the current session is dedicated to, if any */
  linkedTaskId: string | null;
}
