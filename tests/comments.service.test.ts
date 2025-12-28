import * as commentsService from '../src/services/comments';

describe('Comments Service', () => {
  beforeEach(() => {
    commentsService.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('create and getById', () => {
    it('should create a comment with timestamps and retrieve it by id', () => {
      jest.useFakeTimers();
      const now = new Date('2024-03-01T00:00:00Z');
      jest.setSystemTime(now);

      const input = { userId: 'user-1', postId: 'post-1', content: 'Nice post', likes: 2 };
      const created = commentsService.create(input);

      expect(created.id).toBeDefined();
      expect(created.createdAt).toBeInstanceOf(Date);
      expect(created.updatedAt).toBeInstanceOf(Date);
      expect(created.createdAt).toBe(created.updatedAt);

      const found = commentsService.getById(created.id);
      expect(found).toEqual(created);
    });

    it('should return undefined when comment does not exist', () => {
      const found = commentsService.getById('missing');
      expect(found).toBeUndefined();
    });
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

  describe('update', () => {
    it('should update an existing comment and refresh updatedAt', () => {
      jest.useFakeTimers();
      const initialTime = new Date('2024-04-01T00:00:00Z');
      jest.setSystemTime(initialTime);

      const created = commentsService.create({ userId: 'user-3', postId: 'post-3', content: 'First', likes: 1 });
      const originalUpdatedAt = created.updatedAt;

      const later = new Date('2024-04-02T00:00:00Z');
      jest.setSystemTime(later);
      const updated = commentsService.update(created.id, { content: 'Updated content', likes: 5 });

      expect(updated).toBeDefined();
      if (!updated) {
        throw new Error('Comment was not updated');
      }

      expect(updated.content).toBe('Updated content');
      expect(updated.likes).toBe(5);
      expect(updated.createdAt).toBe(created.createdAt);
      expect(updated.updatedAt).not.toBe(originalUpdatedAt);
      expect(updated.updatedAt.getTime()).toBe(later.getTime());
    });

    it('should return undefined when updating missing comment', () => {
      const result = commentsService.update('unknown', { content: 'Nothing' });
      expect(result).toBeUndefined();
    });
  });

  describe('remove and clear', () => {
    it('should remove a comment and indicate deletion status', () => {
      const created = commentsService.create({ userId: 'user-4', postId: 'post-4', content: 'To delete', likes: 0 });

      const removed = commentsService.remove(created.id);
      expect(removed).toBe(true);
      expect(commentsService.getById(created.id)).toBeUndefined();

      const missing = commentsService.remove('non-existent');
      expect(missing).toBe(false);
    });

    it('should clear all comments', () => {
      commentsService.create({ userId: 'user-5', postId: 'post-5', content: 'First comment', likes: 3 });
      commentsService.create({ userId: 'user-6', postId: 'post-6', content: 'Second comment', likes: 4 });

      commentsService.clear();
      expect(commentsService.getAll()).toEqual([]);
    });
  });
});
