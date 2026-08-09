import { useCategoryStore } from "../../../state/useCategoryStore";

/** Facade hook: screens depend on this, not on the Zustand store directly. */
export function useCategories() {
  const categories = useCategoryStore((s) => s.categories);
  const hydrated = useCategoryStore((s) => s.hydrated);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);

  return { categories, hydrated, addCategory, updateCategory, deleteCategory };
}
