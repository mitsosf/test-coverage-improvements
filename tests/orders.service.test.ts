import * as ordersService from '../src/services/orders';

describe('Orders Service', () => {
  beforeEach(() => {
    ordersService.clear();
  });

  describe('create', () => {
    it('should create a new order with all required fields', () => {
      const input = {
        userId: 'user-123',
        productIds: ['prod-1', 'prod-2'],
        status: 'pending' as const,
        total: 59.99,
      };
      const order = ordersService.create(input);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.userId).toBe(input.userId);
      expect(order.productIds).toEqual(input.productIds);
      expect(order.status).toBe(input.status);
      expect(order.total).toBe(input.total);
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return order by id', () => {
      const created = ordersService.create({
        userId: 'user-123',
        productIds: ['prod-1', 'prod-2'],
        status: 'pending',
        total: 59.99,
      });
      const found = ordersService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = ordersService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all orders as an array', () => {
      const input1 = {
        userId: 'user-1',
        productIds: ['prod-1'],
        status: 'pending' as const,
        total: 29.99,
      };
      const input2 = {
        userId: 'user-2',
        productIds: ['prod-2'],
        status: 'processing' as const,
        total: 49.99,
      };

      const order1 = ordersService.create(input1);
      const order2 = ordersService.create(input2);

      const allOrders = ordersService.getAll();

      expect(allOrders).toHaveLength(2);
      expect(allOrders).toContainEqual(order1);
      expect(allOrders).toContainEqual(order2);
    });

    it('should return empty array when no orders exist', () => {
      const allOrders = ordersService.getAll();
      expect(allOrders).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update an existing order with partial data', () => {
      const created = ordersService.create({
        userId: 'user-123',
        productIds: ['prod-1'],
        status: 'pending',
        total: 59.99,
      });

      const updated = ordersService.update(created.id, {
        status: 'shipped',
        total: 79.99,
      });

      expect(updated).toBeDefined();
      expect(updated?.id).toBe(created.id);
      expect(updated?.userId).toBe(created.userId);
      expect(updated?.status).toBe('shipped');
      expect(updated?.total).toBe(79.99);
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should preserve unchanged fields during update', () => {
      const created = ordersService.create({
        userId: 'user-123',
        productIds: ['prod-1', 'prod-2'],
        status: 'pending',
        total: 59.99,
      });

      const updated = ordersService.update(created.id, {
        status: 'processing',
      });

      expect(updated?.userId).toBe(created.userId);
      expect(updated?.productIds).toEqual(created.productIds);
      expect(updated?.total).toBe(created.total);
    });

    it('should return undefined for non-existent order', () => {
      const updated = ordersService.update('non-existent-id', {
        status: 'shipped',
      });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an existing order and return true', () => {
      const created = ordersService.create({
        userId: 'user-123',
        productIds: ['prod-1'],
        status: 'pending',
        total: 59.99,
      });

      const removed = ordersService.remove(created.id);

      expect(removed).toBe(true);
      expect(ordersService.getById(created.id)).toBeUndefined();
    });

    it('should return false when removing non-existent order', () => {
      const removed = ordersService.remove('non-existent-id');
      expect(removed).toBe(false);
    });
  });
});
