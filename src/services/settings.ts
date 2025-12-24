import { v4 as uuidv4 } from 'uuid';
import { Settings, CreateSettingsInput } from '../types';

const settings = new Map<string, Settings>();

export function create(input: CreateSettingsInput): Settings {
  const now = new Date();
  const setting: Settings = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  settings.set(setting.id, setting);
  return setting;
}

export function getById(id: string): Settings | undefined {
  return settings.get(id);
}

export function getAll(): Settings[] {
  return Array.from(settings.values());
}

export function update(id: string, input: Partial<CreateSettingsInput>): Settings | undefined {
  const existing = settings.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Settings = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  settings.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return settings.delete(id);
}

export function clear(): void {
  settings.clear();
}
