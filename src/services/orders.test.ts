import * as ordersService from './orders';

describe('Orders Service', () => {
  beforeEach(() => {
    ordersService.clear();
  });

  describe('create', () => {
    it('should create a new order with generated id and timestamps', () => {
      const input = {
        userId: 'user-create-1',
        productIds: ['prod-1', 'prod-2'],
        status: 'pending' as const,
        total: 150,
      };

      const order = ordersService.create(input);

      expect(order.id).toBeDefined();
      expect(order.userId).toBe('user-create-1');
      expect(order.productIds).toEqual(['prod-1', 'prod-2']);
      expect(order.status).toBe('pending');
      expect(order.total).toBe(150);
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return the order when it exists', () => {
      const created = ordersService.create({
        userId: 'user-getById-1',
        productIds: ['prod-a'],
        status: 'processing',
        total: 250,
      });

      const found = ordersService.getById(created.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
      expect(found!.userId).toBe('user-getById-1');
      expect(found!.status).toBe('processing');
      expect(found!.total).toBe(250);
    });

    it('should return undefined when order does not exist', () => {
      const result = ordersService.getById('non-existent-order-id');

      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return an empty array when no orders exist', () => {
      const orders = ordersService.getAll();
      expect(orders).toEqual([]);
    });

    it('should return all orders', () => {
      const order1 = ordersService.create({
        userId: 'user-1',
        productIds: ['prod-1'],
        status: 'pending',
        total: 100,
      });
      const order2 = ordersService.create({
        userId: 'user-2',
        productIds: ['prod-2', 'prod-3'],
        status: 'processing',
        total: 200,
      });

      const orders = ordersService.getAll();

      expect(orders).toHaveLength(2);
      expect(orders).toContainEqual(order1);
      expect(orders).toContainEqual(order2);
    });
  });

  describe('update', () => {
    it('should update an existing order and return the updated order', () => {
      const created = ordersService.create({
        userId: 'user-123',
        productIds: ['prod-1'],
        status: 'pending',
        total: 50,
      });

      const updated = ordersService.update(created.id, {
        status: 'shipped',
        total: 75,
      });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.status).toBe('shipped');
      expect(updated!.total).toBe(75);
      expect(updated!.userId).toBe('user-123');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined when updating a non-existent order', () => {
      const result = ordersService.update('non-existent-id', {
        status: 'cancelled',
      });

      expect(result).toBeUndefined();
    });

    it('should persist the updated order', () => {
      const created = ordersService.create({
        userId: 'user-456',
        productIds: ['prod-a'],
        status: 'pending',
        total: 100,
      });

      ordersService.update(created.id, { status: 'delivered' });
      const fetched = ordersService.getById(created.id);

      expect(fetched).toBeDefined();
      expect(fetched!.status).toBe('delivered');
    });

    it('should update all fields when provided', () => {
      const created = ordersService.create({
        userId: 'user-full-update',
        productIds: ['prod-1'],
        status: 'pending',
        total: 100,
      });

      const updated = ordersService.update(created.id, {
        userId: 'user-updated',
        productIds: ['prod-2', 'prod-3'],
        status: 'delivered',
        total: 250,
      });

      expect(updated).toBeDefined();
      expect(updated!.userId).toBe('user-updated');
      expect(updated!.productIds).toEqual(['prod-2', 'prod-3']);
      expect(updated!.status).toBe('delivered');
      expect(updated!.total).toBe(250);
      expect(updated!.id).toBe(created.id);
      expect(updated!.createdAt).toEqual(created.createdAt);
    });

    it('should update only specified fields and preserve others', () => {
      const created = ordersService.create({
        userId: 'user-partial',
        productIds: ['prod-x', 'prod-y'],
        status: 'pending',
        total: 500,
      });

      const updated = ordersService.update(created.id, {
        status: 'processing',
      });

      expect(updated).toBeDefined();
      expect(updated!.status).toBe('processing');
      expect(updated!.userId).toBe('user-partial');
      expect(updated!.productIds).toEqual(['prod-x', 'prod-y']);
      expect(updated!.total).toBe(500);
    });

    it('should set a new updatedAt timestamp', () => {
      const created = ordersService.create({
        userId: 'user-timestamp',
        productIds: ['prod-1'],
        status: 'pending',
        total: 100,
      });

      const originalUpdatedAt = created.updatedAt;

      // Small delay to ensure different timestamp
      const updated = ordersService.update(created.id, { total: 200 });

      expect(updated).toBeDefined();
      expect(updated!.updatedAt).toBeInstanceOf(Date);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('remove', () => {
    it('should remove an existing order and return true', () => {
      const created = ordersService.create({
        userId: 'user-789',
        productIds: ['prod-x'],
        status: 'pending',
        total: 25,
      });

      const result = ordersService.remove(created.id);

      expect(result).toBe(true);
      expect(ordersService.getById(created.id)).toBeUndefined();
    });

    it('should return false when removing a non-existent order', () => {
      const result = ordersService.remove('non-existent-id');

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all orders from the store', () => {
      ordersService.create({
        userId: 'user-clear-1',
        productIds: ['prod-1'],
        status: 'pending',
        total: 100,
      });
      ordersService.create({
        userId: 'user-clear-2',
        productIds: ['prod-2'],
        status: 'shipped',
        total: 200,
      });

      expect(ordersService.getAll()).toHaveLength(2);

      ordersService.clear();

      expect(ordersService.getAll()).toHaveLength(0);
    });
  });
});
