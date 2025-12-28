import * as commentsService from '../src/services/comments';

describe('Comments Service', () => {
  beforeEach(() => {
    commentsService.clear();
  });

  describe('create', () => {
    it('should create and store a comment with timestamps and id', () => {
      const input = { userId: 'user-1', postId: 'post-1', content: 'Nice post', likes: 3 };

      const comment = commentsService.create(input);

      expect(comment.id).toBeDefined();
      expect(comment.userId).toBe('user-1');
      expect(comment.postId).toBe('post-1');
      expect(comment.content).toBe('Nice post');
      expect(comment.likes).toBe(3);
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
      expect(commentsService.getById(comment.id)).toEqual(comment);
    });
  });

  describe('getById', () => {
    it('should return undefined when comment does not exist', () => {
      expect(commentsService.getById('missing')).toBeUndefined();
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
    it('should return undefined when updating non-existent comment', () => {
      const updated = commentsService.update('missing-id', { content: 'Nothing here' });
      expect(updated).toBeUndefined();
    });

    it('should merge updates and refresh updatedAt', () => {
      const created = commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Original', likes: 0 });

      const updated = commentsService.update(created.id, { content: 'Updated content', likes: 2 });

      expect(updated).toBeDefined();
      expect(updated!.content).toBe('Updated content');
      expect(updated!.likes).toBe(2);
      expect(updated!.userId).toBe(created.userId);
      expect(updated!.postId).toBe(created.postId);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
      expect(commentsService.getById(created.id)).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete an existing comment and return true', () => {
      const created = commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Delete me', likes: 1 });

      const removed = commentsService.remove(created.id);

      expect(removed).toBe(true);
      expect(commentsService.getById(created.id)).toBeUndefined();
    });

    it('should return false when trying to remove non-existent comment', () => {
      expect(commentsService.remove('missing-id')).toBe(false);
    });
  });
});
