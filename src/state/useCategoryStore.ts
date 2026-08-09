import { create } from "zustand";
import { Category, NewCategoryInput } from "../domain/entities/Category";
import { categoryRepository } from "../data/repositories/CategoryRepository";
import { generateId } from "../utils/id";
import { useTaskStore } from "./useTaskStore";

interface CategoryStore {
  categories: Category[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addCategory: (input: NewCategoryInput) => Promise<void>;
  updateCategory: (id: string, changes: Partial<NewCategoryInput>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

async function persist(categories: Category[]) {
  await categoryRepository.saveAll(categories);
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  hydrated: false,

  hydrate: async () => {
    const categories = await categoryRepository.getAll();
    set({ categories, hydrated: true });
  },

  addCategory: async (input) => {
    const newCategory: Category = {
      id: generateId(),
      name: input.name.trim(),
      color: input.color,
      createdAt: new Date().toISOString(),
    };
    const categories = [...get().categories, newCategory];
    set({ categories });
    await persist(categories);
  },

  updateCategory: async (id, changes) => {
    const categories = get().categories.map((c) =>
      c.id === id ? { ...c, ...changes } : c
    );
    set({ categories });
    await persist(categories);
  },

  deleteCategory: async (id) => {
    const categories = get().categories.filter((c) => c.id !== id);
    set({ categories });
    await persist(categories);
    // keep tasks consistent: a deleted category can't stay referenced
    await useTaskStore.getState().clearCategoryFromTasks(id);
  },
}));
