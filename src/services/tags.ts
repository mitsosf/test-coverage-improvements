import { v4 as uuidv4 } from 'uuid';
import { Tag, CreateTagInput } from '../types';

const tags = new Map<string, Tag>();

export function create(input: CreateTagInput): Tag {
  const now = new Date();
  const tag: Tag = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  tags.set(tag.id, tag);
  return tag;
}

export function getById(id: string): Tag | undefined {
  return tags.get(id);
}

export function getAll(): Tag[] {
  return Array.from(tags.values());
}

export function update(id: string, input: Partial<CreateTagInput>): Tag | undefined {
  const existing = tags.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Tag = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  tags.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return tags.delete(id);
}

export function clear(): void {
  tags.clear();
}
