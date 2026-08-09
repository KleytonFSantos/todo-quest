/**
 * Domain entity: Task
 * Pure data shape — no persistence or UI concerns live here (Domain layer).
 */
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  pomodorosSpent: number;
  /** references Category.id — undefined means "no category" */
  categoryId?: string;
}

export type NewTaskInput = Pick<Task, "title" | "priority"> & {
  notes?: string;
  categoryId?: string;
};
