import { v4 as uuidv4 } from 'uuid';
import { Log, CreateLogInput } from '../types';

const logs = new Map<string, Log>();

export function create(input: CreateLogInput): Log {
  const now = new Date();
  const log: Log = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  logs.set(log.id, log);
  return log;
}

export function getById(id: string): Log | undefined {
  return logs.get(id);
}

export function getAll(): Log[] {
  return Array.from(logs.values());
}

export function update(id: string, input: Partial<CreateLogInput>): Log | undefined {
  const existing = logs.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Log = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  logs.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return logs.delete(id);
}

export function clear(): void {
  logs.clear();
}
