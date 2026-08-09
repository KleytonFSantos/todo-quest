import { storage } from "../storage/StorageAdapter";
import {
  GamificationState,
  INITIAL_GAMIFICATION_STATE,
} from "../../domain/entities/Gamification";

const KEY = "@todoquest/gamification";

export interface IGamificationRepository {
  get(): Promise<GamificationState>;
  save(state: GamificationState): Promise<void>;
}

class GamificationRepository implements IGamificationRepository {
  async get(): Promise<GamificationState> {
    const state = await storage.getItem<GamificationState>(KEY);
    return state ?? INITIAL_GAMIFICATION_STATE;
  }

  async save(state: GamificationState): Promise<void> {
    await storage.setItem(KEY, state);
  }
}

export const gamificationRepository: IGamificationRepository =
  new GamificationRepository();
