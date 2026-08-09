import { create } from "zustand";
import {
  AppSettings,
  DEFAULT_SETTINGS,
  settingsRepository,
} from "../data/repositories/SettingsRepository";
import { PomodoroConfig } from "../domain/entities/Pomodoro";

interface SettingsStore extends AppSettings {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  updatePomodoroConfig: (changes: Partial<PomodoroConfig>) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,

  hydrate: async () => {
    const settings = await settingsRepository.get();
    set({ ...settings, hydrated: true });
  },

  updatePomodoroConfig: async (changes) => {
    const next: AppSettings = {
      ...get(),
      pomodoro: { ...get().pomodoro, ...changes },
    };
    set(next);
    await settingsRepository.save(next);
  },

  setNotificationsEnabled: async (enabled) => {
    const next: AppSettings = { ...get(), notificationsEnabled: enabled };
    set(next);
    await settingsRepository.save(next);
  },
}));
