import * as categoriesService from '../src/services/categories';

describe('Categories Service', () => {
  beforeEach(() => {
    categoriesService.clear();
  });

  describe('create', () => {
    it('should create a category with generated id and timestamps', () => {
      const input = { name: 'Tech', parentId: null, slug: 'tech' };

      const category = categoriesService.create(input);

      expect(category.id).toBeDefined();
      expect(category.name).toBe('Tech');
      expect(category.parentId).toBeNull();
      expect(category.slug).toBe('tech');
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return the stored category', () => {
      const created = categoriesService.create({ name: 'Science', parentId: null, slug: 'science' });

      const found = categoriesService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for unknown id', () => {
      expect(categoriesService.getById('missing-id')).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all categories in insertion order', () => {
      const first = categoriesService.create({ name: 'Home', parentId: null, slug: 'home' });
      const second = categoriesService.create({ name: 'Garden', parentId: first.id, slug: 'garden' });

      const result = categoriesService.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(first);
      expect(result[1]).toEqual(second);
    });
  });

  describe('update', () => {
    it('should return undefined when updating a missing category', () => {
      const updated = categoriesService.update('missing-id', { name: 'Nope' });
      expect(updated).toBeUndefined();
    });

    it('should merge provided fields and refresh updatedAt', () => {
      const created = categoriesService.create({ name: 'Outdoors', parentId: null, slug: 'outdoors' });

      const updated = categoriesService.update(created.id, { name: 'Outside', slug: 'outside' });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.name).toBe('Outside');
      expect(updated!.slug).toBe('outside');
      expect(updated!.parentId).toBeNull();
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
      expect(categoriesService.getById(created.id)).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete an existing category and return true', () => {
      const created = categoriesService.create({ name: 'Temp', parentId: null, slug: 'temp' });

      const removed = categoriesService.remove(created.id);

      expect(removed).toBe(true);
      expect(categoriesService.getById(created.id)).toBeUndefined();
    });

    it('should return false when deleting non-existent category', () => {
      expect(categoriesService.remove('missing-id')).toBe(false);
    });
  });
});
