import { v4 as uuidv4 } from 'uuid';
import { Product, CreateProductInput } from '../types';

const products = new Map<string, Product>();

export function create(input: CreateProductInput): Product {
  const now = new Date();
  const product: Product = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  products.set(product.id, product);
  return product;
}

export function getById(id: string): Product | undefined {
  return products.get(id);
}

export function getAll(): Product[] {
  return Array.from(products.values());
}

export function update(id: string, input: Partial<CreateProductInput>): Product | undefined {
  const existing = products.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Product = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  products.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return products.delete(id);
}

export function clear(): void {
  products.clear();
}
