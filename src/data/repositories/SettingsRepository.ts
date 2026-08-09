import { storage } from "../storage/StorageAdapter";
import {
  DEFAULT_POMODORO_CONFIG,
  PomodoroConfig,
} from "../../domain/entities/Pomodoro";

const KEY = "@todoquest/settings";

export interface AppSettings {
  pomodoro: PomodoroConfig;
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  pomodoro: DEFAULT_POMODORO_CONFIG,
  notificationsEnabled: true,
};

export interface ISettingsRepository {
  get(): Promise<AppSettings>;
  save(settings: AppSettings): Promise<void>;
}

class SettingsRepository implements ISettingsRepository {
  async get(): Promise<AppSettings> {
    const settings = await storage.getItem<AppSettings>(KEY);
    return settings ?? DEFAULT_SETTINGS;
  }

  async save(settings: AppSettings): Promise<void> {
    await storage.setItem(KEY, settings);
  }
}

export const settingsRepository: ISettingsRepository =
  new SettingsRepository();
