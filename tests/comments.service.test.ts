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
    it('should return comment by id', () => {
      const created = commentsService.create({
        userId: 'user-1',
        postId: 'post-1',
        content: 'Hello',
        likes: 0,
      });

      const found = commentsService.getById(created.id);
      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = commentsService.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update existing comment', () => {
      const created = commentsService.create({
        userId: 'user-1',
        postId: 'post-1',
        content: 'Original content',
        likes: 3,
      });

      const updated = commentsService.update(created.id, {
        content: 'Updated content',
        likes: 5,
      });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.userId).toBe('user-1');
      expect(updated!.postId).toBe('post-1');
      expect(updated!.content).toBe('Updated content');
      expect(updated!.likes).toBe(5);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined for non-existent comment', () => {
      const updated = commentsService.update('missing-id', { content: 'nope' });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove existing comment', () => {
      const created = commentsService.create({
        userId: 'user-1',
        postId: 'post-1',
        content: 'To be deleted',
        likes: 1,
      });

      const removed = commentsService.remove(created.id);
      expect(removed).toBe(true);
      expect(commentsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent comment', () => {
      const removed = commentsService.remove('non-existent');
      expect(removed).toBe(false);
    });
  });
});
