import { v4 as uuidv4 } from 'uuid';
import { Notification, CreateNotificationInput } from '../types';

const notifications = new Map<string, Notification>();

export function create(input: CreateNotificationInput): Notification {
  const now = new Date();
  const notification: Notification = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  notifications.set(notification.id, notification);
  return notification;
}

export function getById(id: string): Notification | undefined {
  return notifications.get(id);
}

export function getAll(): Notification[] {
  return Array.from(notifications.values());
}

export function update(id: string, input: Partial<CreateNotificationInput>): Notification | undefined {
  const existing = notifications.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Notification = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  notifications.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return notifications.delete(id);
}

export function clear(): void {
  notifications.clear();
}
