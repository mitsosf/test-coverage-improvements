import * as tagsService from '../src/services/tags';

describe('Tags Service', () => {
  beforeEach(() => {
    tagsService.clear();
  });

  describe('create', () => {
    it('should create a new tag with generated id', () => {
      const input = { name: 'JavaScript', color: '#FFD700', description: 'JavaScript tag' };
      const tag = tagsService.create(input);

      expect(tag.id).toBeDefined();
      expect(tag.name).toBe('JavaScript');
      expect(tag.color).toBe('#FFD700');
      expect(tag.description).toBe('JavaScript tag');
      expect(tag.createdAt).toBeInstanceOf(Date);
      expect(tag.updatedAt).toBeInstanceOf(Date);
    });

    it('should create multiple tags with unique ids', () => {
      const tag1 = tagsService.create({ name: 'React', color: '#61DAFB', description: 'React tag' });
      const tag2 = tagsService.create({ name: 'Vue', color: '#42B983', description: 'Vue tag' });

      expect(tag1.id).not.toBe(tag2.id);
    });
  });

  describe('getById', () => {
    it('should return tag by id', () => {
      const created = tagsService.create({ name: 'TypeScript', color: '#3178C6', description: 'TypeScript tag' });
      const found = tagsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = tagsService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no tags', () => {
      const tags = tagsService.getAll();
      expect(tags).toEqual([]);
    });

    it('should return all tags', () => {
      tagsService.create({ name: 'Python', color: '#3776AB', description: 'Python tag' });
      tagsService.create({ name: 'Go', color: '#00ADD8', description: 'Go tag' });
      tagsService.create({ name: 'Rust', color: '#CE422B', description: 'Rust tag' });

      const tags = tagsService.getAll();
      expect(tags).toHaveLength(3);
    });
  });

  describe('update', () => {
    it('should update existing tag', () => {
      const created = tagsService.create({ name: 'Java', color: '#007396', description: 'Java tag' });
      const updated = tagsService.update(created.id, { name: 'Java Updated' });

      expect(updated).toBeDefined();
      expect(updated!.name).toBe('Java Updated');
      expect(updated!.color).toBe('#007396');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined for non-existent tag', () => {
      const updated = tagsService.update('non-existent', { name: 'Test' });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove existing tag', () => {
      const created = tagsService.create({ name: 'C++', color: '#00599C', description: 'C++ tag' });
      const deleted = tagsService.remove(created.id);

      expect(deleted).toBe(true);
      expect(tagsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent tag', () => {
      const deleted = tagsService.remove('non-existent');
      expect(deleted).toBe(false);
    });
  });
});
