import * as ordersService from '../src/services/orders';

describe('Orders Service', () => {
  beforeEach(() => {
    ordersService.clear();
  });

  describe('create', () => {
    it('should create a new order with generated id', () => {
      const input = { userId: 'user-1', productIds: ['prod-1', 'prod-2'], status: 'pending' as const, total: 99.99 };
      const order = ordersService.create(input);

      expect(order.id).toBeDefined();
      expect(order.userId).toBe('user-1');
      expect(order.productIds).toEqual(['prod-1', 'prod-2']);
      expect(order.status).toBe('pending');
      expect(order.total).toBe(99.99);
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it('should create multiple orders with unique ids', () => {
      const order1 = ordersService.create({ userId: 'user-1', productIds: ['prod-1'], status: 'pending', total: 50 });
      const order2 = ordersService.create({ userId: 'user-2', productIds: ['prod-2'], status: 'processing', total: 75 });

      expect(order1.id).not.toBe(order2.id);
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
    it('should return empty array when no orders', () => {
      const orders = ordersService.getAll();
      expect(orders).toEqual([]);
    });

    it('should return all orders', () => {
      ordersService.create({ userId: 'user-1', productIds: ['prod-1'], status: 'pending', total: 50 });
      ordersService.create({ userId: 'user-2', productIds: ['prod-2'], status: 'processing', total: 75 });
      ordersService.create({ userId: 'user-3', productIds: ['prod-3'], status: 'shipped', total: 100 });

      const orders = ordersService.getAll();
      expect(orders).toHaveLength(3);
    });
  });

  describe('update', () => {
    it('should update existing order', () => {
      const created = ordersService.create({ userId: 'user-1', productIds: ['prod-1'], status: 'pending', total: 50 });
      const updated = ordersService.update(created.id, { status: 'processing' });

      expect(updated).toBeDefined();
      expect(updated!.status).toBe('processing');
      expect(updated!.userId).toBe('user-1');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined for non-existent order', () => {
      const updated = ordersService.update('non-existent', { status: 'shipped' });
      expect(updated).toBeUndefined();
    });

    it('should update multiple fields', () => {
      const created = ordersService.create({ userId: 'user-1', productIds: ['prod-1'], status: 'pending', total: 50 });
      const updated = ordersService.update(created.id, { status: 'delivered', total: 75 });

      expect(updated!.status).toBe('delivered');
      expect(updated!.total).toBe(75);
    });
  });

  describe('remove', () => {
    it('should remove existing order', () => {
      const created = ordersService.create({ userId: 'user-1', productIds: ['prod-1'], status: 'pending', total: 50 });
      const deleted = ordersService.remove(created.id);

      expect(deleted).toBe(true);
      expect(ordersService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent order', () => {
      const deleted = ordersService.remove('non-existent');
      expect(deleted).toBe(false);
    });
  });
});
