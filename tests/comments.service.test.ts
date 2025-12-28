import * as commentsService from '../src/services/comments';

describe('Comments Service', () => {
  beforeEach(() => {
    commentsService.clear();
  });

  describe('getAll', () => {
    it('should return empty array when no comments', () => {
      const comments = commentsService.getAll();
      expect(comments).toEqual([]);
    });

    it('should return all comments', () => {
      commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Comment 1', likes: 5 });
      commentsService.create({ userId: 'user-2', postId: 'post-1', content: 'Comment 2', likes: 10 });

      const comments = commentsService.getAll();
      expect(comments).toHaveLength(2);
    });
  });

  describe('getById', () => {
    it('should return a comment by id', () => {
      const created = commentsService.create({
        userId: 'user-1',
        postId: 'post-1',
        content: 'Hello world',
        likes: 0,
      });

      const found = commentsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for missing id', () => {
      const found = commentsService.getById('missing-id');
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update an existing comment and refresh updatedAt', () => {
      const created = commentsService.create({
        userId: 'user-1',
        postId: 'post-1',
        content: 'Old content',
        likes: 1,
      });

      const updated = commentsService.update(created.id, { content: 'New content', likes: 5 });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.content).toBe('New content');
      expect(updated!.likes).toBe(5);
      expect(updated!.createdAt).toEqual(created.createdAt);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined when updating non-existent comment', () => {
      const updated = commentsService.update('non-existent', { content: 'Nothing' });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an existing comment', () => {
      const created = commentsService.create({
        userId: 'user-1',
        postId: 'post-1',
        content: 'Removable',
        likes: 3,
      });

      const deleted = commentsService.remove(created.id);

      expect(deleted).toBe(true);
      expect(commentsService.getById(created.id)).toBeUndefined();
    });

    it('should return false when removing non-existent comment', () => {
      const deleted = commentsService.remove('missing-id');
      expect(deleted).toBe(false);
    });
  });
});
