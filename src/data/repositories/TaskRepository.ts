import { storage } from "../storage/StorageAdapter";
import { Task } from "../../domain/entities/Task";

const KEY = "@todoquest/tasks";

/**
 * Repository pattern: hides *how* tasks are persisted from the rest of the
 * app. The state layer (Zustand store) only ever talks to this interface,
 * so storage could move to SQLite/a backend API later without touching
 * business logic or UI.
 */
export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  saveAll(tasks: Task[]): Promise<void>;
}

class TaskRepository implements ITaskRepository {
  async getAll(): Promise<Task[]> {
    const tasks = await storage.getItem<Task[]>(KEY);
    return tasks ?? [];
  }

  async saveAll(tasks: Task[]): Promise<void> {
    await storage.setItem(KEY, tasks);
  }
}

export const taskRepository: ITaskRepository = new TaskRepository();
