import { create } from "zustand";
import * as Haptics from "expo-haptics";
import { NewTaskInput, Task } from "../domain/entities/Task";
import { taskRepository } from "../data/repositories/TaskRepository";
import { generateId } from "../utils/id";
import { useGamificationStore } from "./useGamificationStore";

interface TaskStore {
  tasks: Task[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addTask: (input: NewTaskInput) => Promise<void>;
  updateTask: (id: string, changes: Partial<NewTaskInput>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  /** toggling to complete awards XP; toggling back off does not refund it */
  toggleComplete: (id: string) => Promise<void>;
  incrementPomodoroCount: (id: string) => Promise<void>;
  /** used by useCategoryStore when a category is deleted, to avoid dangling refs */
  clearCategoryFromTasks: (categoryId: string) => Promise<void>;
}

async function persist(tasks: Task[]) {
  await taskRepository.saveAll(tasks);
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  hydrated: false,

  hydrate: async () => {
    const tasks = await taskRepository.getAll();
    set({ tasks, hydrated: true });
  },

  addTask: async (input) => {
    const newTask: Task = {
      id: generateId(),
      title: input.title.trim(),
      notes: input.notes?.trim(),
      priority: input.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      pomodorosSpent: 0,
      categoryId: input.categoryId,
    };
    const tasks = [newTask, ...get().tasks];
    set({ tasks });
    await persist(tasks);
  },

  updateTask: async (id, changes) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, ...changes } : t
    );
    set({ tasks });
    await persist(tasks);
  },

  deleteTask: async (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id);
    set({ tasks });
    await persist(tasks);
  },

  toggleComplete: async (id) => {
    const target = get().tasks.find((t) => t.id === id);
    if (!target) return;
    const willComplete = !target.completed;

    const tasks = get().tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined,
          }
        : t
    );
    set({ tasks });
    await persist(tasks);

    if (willComplete) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await useGamificationStore.getState().registerTaskCompletion(
        target.priority
      );
    }
  },

  incrementPomodoroCount: async (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, pomodorosSpent: t.pomodorosSpent + 1 } : t
    );
    set({ tasks });
    await persist(tasks);
  },

  clearCategoryFromTasks: async (categoryId) => {
    const tasks = get().tasks.map((t) =>
      t.categoryId === categoryId ? { ...t, categoryId: undefined } : t
    );
    set({ tasks });
    await persist(tasks);
  },
}));
