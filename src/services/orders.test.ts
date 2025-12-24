import { v4 as uuidv4 } from 'uuid';
import { Order, CreateOrderInput } from '../types';

const orders = new Map<string, Order>();

export function create(input: CreateOrderInput): Order {
  const now = new Date();
  const order: Order = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  orders.set(order.id, order);
  return order;
}

export function getById(id: string): Order | undefined {
  return orders.get(id);
}

export function getAll(): Order[] {
  return Array.from(orders.values());
}

export function update(id: string, input: Partial<CreateOrderInput>): Order | undefined {
  const existing = orders.get(id);
  if (!existing) {
    return undefined;
  }
  const updated: Order = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  orders.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return orders.delete(id);
}

export function clear(): void {
  orders.clear();
}