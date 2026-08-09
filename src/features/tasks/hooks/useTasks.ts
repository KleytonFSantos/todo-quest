import { useMemo } from "react";
import { useTaskStore } from "../../../state/useTaskStore";

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 } as const;

/**
 * Facade hook: screens depend on this, not on the Zustand store directly.
 * Keeps sorting/derivation logic out of components and swappable without
 * touching UI.
 */
export function useTasks() {
  const tasks = useTaskStore((s) => s.tasks);
  const hydrated = useTaskStore((s) => s.hydrated);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);

  const pending = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed)
        .sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]),
    [tasks]
  );

  const completed = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? "")),
    [tasks]
  );

  return {
    hydrated,
    pending,
    completed,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}
