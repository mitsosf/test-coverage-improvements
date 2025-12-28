import * as categoriesService from '../src/services/categories';

describe('Categories Service', () => {
  beforeEach(() => {
    categoriesService.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('create and retrieval', () => {
    it('creates categories with timestamps and retrieves them', () => {
      const root = categoriesService.create({ name: 'Electronics', parentId: null, slug: 'electronics' });
      const child = categoriesService.create({ name: 'Phones', parentId: root.id, slug: 'phones' });

      expect(root.id).toBeDefined();
      expect(root.createdAt).toBeInstanceOf(Date);
      expect(root.updatedAt).toBeInstanceOf(Date);

      const found = categoriesService.getById(root.id);
      expect(found).toEqual(root);

      const all = categoriesService.getAll();
      expect(all).toHaveLength(2);
      expect(all[0]).toEqual(root);
      expect(all[1]).toEqual(child);
    });
  });

  describe('update', () => {
    it('updates an existing category and refreshes updatedAt', () => {
      jest.useFakeTimers();
      const initialTime = new Date('2024-01-01T00:00:00Z');
      jest.setSystemTime(initialTime);

      const category = categoriesService.create({ name: 'Books', parentId: null, slug: 'books' });
      const originalUpdatedAt = category.updatedAt;

      const later = new Date('2024-02-01T00:00:00Z');
      jest.setSystemTime(later);

      const updated = categoriesService.update(category.id, { name: 'Novels', slug: 'novels' });
      expect(updated).toBeDefined();
      if (!updated) {
        throw new Error('Category was not updated');
      }

      expect(updated.name).toBe('Novels');
      expect(updated.slug).toBe('novels');
      expect(updated.createdAt).toBe(category.createdAt);
      expect(updated.updatedAt).not.toBe(originalUpdatedAt);
      expect(updated.updatedAt.getTime()).toBe(later.getTime());
    });

    it('returns undefined when updating a non-existent category', () => {
      const result = categoriesService.update('missing-id', { name: 'Missing' });
      expect(result).toBeUndefined();
    });
  });

  describe('remove and clear', () => {
    it('removes categories and returns correct boolean', () => {
      const category = categoriesService.create({ name: 'Archive', parentId: null, slug: 'archive' });

      const removed = categoriesService.remove(category.id);
      expect(removed).toBe(true);
      expect(categoriesService.getById(category.id)).toBeUndefined();

      const missing = categoriesService.remove('unknown');
      expect(missing).toBe(false);
    });

    it('clears all categories', () => {
      categoriesService.create({ name: 'Sports', parentId: null, slug: 'sports' });
      categoriesService.create({ name: 'Outdoors', parentId: null, slug: 'outdoors' });

      categoriesService.clear();
      expect(categoriesService.getAll()).toEqual([]);
    });
  });
});
