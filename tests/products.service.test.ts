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

  describe('getById', () => {
    it('returns product when id exists', () => {
      const created = productsService.create({
        name: 'Widget',
        description: 'A useful widget',
        price: 29.99,
        stock: 100,
      });

      const found = productsService.getById(created.id);
      expect(found).toEqual(created);
    });

    it('returns undefined when id does not exist', () => {
      const found = productsService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('returns empty array when there are no products', () => {
      const products = productsService.getAll();
      expect(products).toEqual([]);
    });

    it('returns all products', () => {
      const first = productsService.create({
        name: 'Widget',
        description: 'A useful widget',
        price: 29.99,
        stock: 100,
      });
      const second = productsService.create({
        name: 'Gadget',
        description: 'A neat gadget',
        price: 49.99,
        stock: 50,
      });

      const products = productsService.getAll();
      expect(products).toHaveLength(2);
      expect(products).toEqual([first, second]);
    });
  });

  describe('update', () => {
    it('updates an existing product', () => {
      const created = productsService.create({
        name: 'Widget',
        description: 'A useful widget',
        price: 29.99,
        stock: 100,
      });

      const updated = productsService.update(created.id, { price: 39.99, stock: 80 });
      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.price).toBe(39.99);
      expect(updated!.stock).toBe(80);
      expect(updated!.name).toBe('Widget');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('returns undefined for a non-existent product', () => {
      const updated = productsService.update('missing-id', { price: 9.99 });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('removes an existing product and returns true', () => {
      const created = productsService.create({
        name: 'Widget',
        description: 'A useful widget',
        price: 29.99,
        stock: 100,
      });

      const deleted = productsService.remove(created.id);
      expect(deleted).toBe(true);
      expect(productsService.getById(created.id)).toBeUndefined();
    });

    it('returns false when removing a non-existent product', () => {
      const deleted = productsService.remove('missing-id');
      expect(deleted).toBe(false);
    });
  });
});
