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
    it('should return a product by id', () => {
      const input = { name: 'Widget', description: 'A useful widget', price: 29.99, stock: 100 };
      const created = productsService.create(input);
      const product = productsService.getById(created.id);

      expect(product).toBeDefined();
      expect(product?.id).toBe(created.id);
      expect(product?.name).toBe('Widget');
    });

    it('should return undefined for non-existent product', () => {
      const product = productsService.getById('non-existent-id');
      expect(product).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no products exist', () => {
      const products = productsService.getAll();
      expect(products).toEqual([]);
    });

    it('should return all products', () => {
      const input1 = { name: 'Widget', description: 'A useful widget', price: 29.99, stock: 100 };
      const input2 = { name: 'Gadget', description: 'A cool gadget', price: 49.99, stock: 50 };
      productsService.create(input1);
      productsService.create(input2);

      const products = productsService.getAll();
      expect(products).toHaveLength(2);
      expect(products[0].name).toMatch(/Widget|Gadget/);
      expect(products[1].name).toMatch(/Widget|Gadget/);
    });
  });

  describe('update', () => {
    it('should update an existing product', () => {
      const input = { name: 'Widget', description: 'A useful widget', price: 29.99, stock: 100 };
      const created = productsService.create(input);
      const updateInput = { name: 'Updated Widget', price: 39.99 };
      const updated = productsService.update(created.id, updateInput);

      expect(updated).toBeDefined();
      expect(updated?.id).toBe(created.id);
      expect(updated?.name).toBe('Updated Widget');
      expect(updated?.price).toBe(39.99);
      expect(updated?.description).toBe('A useful widget');
      expect(updated?.stock).toBe(100);
      expect(updated?.updatedAt).toBeInstanceOf(Date);
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined when updating non-existent product', () => {
      const updateInput = { name: 'Updated Widget' };
      const updated = productsService.update('non-existent-id', updateInput);
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a product by id', () => {
      const input = { name: 'Widget', description: 'A useful widget', price: 29.99, stock: 100 };
      const created = productsService.create(input);
      const removed = productsService.remove(created.id);

      expect(removed).toBe(true);
      expect(productsService.getById(created.id)).toBeUndefined();
    });

    it('should return false when removing non-existent product', () => {
      const removed = productsService.remove('non-existent-id');
      expect(removed).toBe(false);
    });
  });
});
