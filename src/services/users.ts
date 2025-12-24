import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserInput } from '../types';

const users = new Map<string, User>();

export function create(input: CreateUserInput): User {
  const now = new Date();
  const user: User = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  users.set(user.id, user);
  return user;
}

export function getById(id: string): User | undefined {
  return users.get(id);
}

export function getAll(): User[] {
  return Array.from(users.values());
}

export function update(id: string, input: Partial<CreateUserInput>): User | undefined {
  const existing = users.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: User = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  users.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return users.delete(id);
}

export function clear(): void {
  users.clear();
}
