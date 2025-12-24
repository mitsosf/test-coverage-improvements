import * as ordersService from '../src/services/orders';

describe('Orders Service', () => {
  beforeEach(() => {
    ordersService.clear();
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

  // NOTE: create, getAll, update, remove are intentionally not tested
  // to simulate low test coverage for the coverage detection service
});
