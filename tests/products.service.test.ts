import * as productsService from '../src/services/products';

describe('Products Service', () => {
  beforeEach(() => {
    productsService.clear();
  });

  describe('create', () => {
    it('should create a new product with generated id', () => {
      const input = { name: 'Widget', description: 'A useful widget', price: 29.99, stock: 100 };
      const product = productsService.create(input);

      expect(product.id).toBeDefined();
      expect(product.name).toBe('Widget');
      expect(product.description).toBe('A useful widget');
      expect(product.price).toBe(29.99);
      expect(product.stock).toBe(100);
    });
  });

  // NOTE: getById, getAll, update, remove are intentionally not tested
  // to simulate low test coverage for the coverage detection service
});
