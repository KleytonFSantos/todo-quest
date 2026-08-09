import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Singleton wrapper around AsyncStorage.
 *
 * Why: repositories (and Zustand's `persist` middleware) shouldn't talk to
 * AsyncStorage directly — if we ever swap to MMKV or SQLite, this is the
 * only file that changes.
 */
class StorageAdapter {
  private static instance: StorageAdapter;

  static getInstance(): StorageAdapter {
    if (!StorageAdapter.instance) {
      StorageAdapter.instance = new StorageAdapter();
    }
    return StorageAdapter.instance;
  }

  private constructor() {}

  async getItem<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

export const storage = StorageAdapter.getInstance();
