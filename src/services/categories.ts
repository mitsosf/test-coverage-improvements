import { v4 as uuidv4 } from 'uuid';
import { Category, CreateCategoryInput } from '../types';

const categories = new Map<string, Category>();

export function create(input: CreateCategoryInput): Category {
  const now = new Date();
  const category: Category = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  categories.set(category.id, category);
  return category;
}

export function getById(id: string): Category | undefined {
  return categories.get(id);
}

export function getAll(): Category[] {
  return Array.from(categories.values());
}

export function update(id: string, input: Partial<CreateCategoryInput>): Category | undefined {
  const existing = categories.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Category = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  categories.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return categories.delete(id);
}

export function clear(): void {
  categories.clear();
}
