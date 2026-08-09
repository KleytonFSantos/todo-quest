import { storage } from "../storage/StorageAdapter";
import { Category } from "../../domain/entities/Category";

const KEY = "@todoquest/categories";

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  saveAll(categories: Category[]): Promise<void>;
}

class CategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    const categories = await storage.getItem<Category[]>(KEY);
    return categories ?? [];
  }

  async saveAll(categories: Category[]): Promise<void> {
    await storage.setItem(KEY, categories);
  }
}

export const categoryRepository: ICategoryRepository = new CategoryRepository();
