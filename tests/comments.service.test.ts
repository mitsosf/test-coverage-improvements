import * as commentsService from '../src/services/comments';

describe('Comments Service', () => {
  beforeEach(() => {
    commentsService.clear();
  });

  describe('create', () => {
    it('should create a new comment with generated id', () => {
      const input = { userId: 'user-1', postId: 'post-1', content: 'Test comment', likes: 5 };
      const comment = commentsService.create(input);

      expect(comment.id).toBeDefined();
      expect(comment.userId).toBe('user-1');
      expect(comment.postId).toBe('post-1');
      expect(comment.content).toBe('Test comment');
      expect(comment.likes).toBe(5);
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
    });

    it('should create multiple comments with unique ids', () => {
      const comment1 = commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Comment 1', likes: 5 });
      const comment2 = commentsService.create({ userId: 'user-2', postId: 'post-1', content: 'Comment 2', likes: 10 });

      expect(comment1.id).not.toBe(comment2.id);
    });
  });

  describe('getById', () => {
    it('should return comment by id', () => {
      const created = commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Test comment', likes: 5 });
      const found = commentsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = commentsService.getById('non-existent-id');
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
    it('should update existing comment', () => {
      const created = commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Original comment', likes: 5 });
      const updated = commentsService.update(created.id, { content: 'Updated comment', likes: 10 });

      expect(updated).toBeDefined();
      expect(updated!.content).toBe('Updated comment');
      expect(updated!.likes).toBe(10);
      expect(updated!.userId).toBe('user-1');
      expect(updated!.postId).toBe('post-1');
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined for non-existent comment', () => {
      const updated = commentsService.update('non-existent', { content: 'Test' });
      expect(updated).toBeUndefined();
    });

    it('should update partial fields', () => {
      const created = commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Original', likes: 5 });
      const updated = commentsService.update(created.id, { likes: 15 });

      expect(updated!.content).toBe('Original');
      expect(updated!.likes).toBe(15);
    });
  });

  describe('remove', () => {
    it('should remove existing comment', () => {
      const created = commentsService.create({ userId: 'user-1', postId: 'post-1', content: 'Test comment', likes: 5 });
      const deleted = commentsService.remove(created.id);

      expect(deleted).toBe(true);
      expect(commentsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent comment', () => {
      const deleted = commentsService.remove('non-existent');
      expect(deleted).toBe(false);
    });
  });
});
