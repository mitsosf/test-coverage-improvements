import { v4 as uuidv4 } from 'uuid';
import { Review, CreateReviewInput } from '../types';

const reviews = new Map<string, Review>();

export function create(input: CreateReviewInput): Review {
  const now = new Date();
  const review: Review = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  reviews.set(review.id, review);
  return review;
}

export function getById(id: string): Review | undefined {
  return reviews.get(id);
}

export function getAll(): Review[] {
  return Array.from(reviews.values());
}

export function update(id: string, input: Partial<CreateReviewInput>): Review | undefined {
  const existing = reviews.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Review = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  reviews.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return reviews.delete(id);
}

export function clear(): void {
  reviews.clear();
}
