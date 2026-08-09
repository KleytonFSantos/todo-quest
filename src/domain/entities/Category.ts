/**
 * Domain entity: Category
 * User-defined labels (e.g. "Lar", "Estudo", "Trabalho") that tasks can be
 * tagged with. Fully user-managed — the app ships with zero presets.
 */
export interface Category {
  id: string;
  name: string;
  color: string; // hex, chosen from a fixed swatch palette
  createdAt: string;
}

export type NewCategoryInput = Pick<Category, "name" | "color">;
