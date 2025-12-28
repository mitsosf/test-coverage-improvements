import * as commentsService from '../src/services/comments';

describe('Comments Service', () => {
  beforeEach(() => {
    commentsService.clear();
  });

  describe('create', () => {
    it('should create a new comment with generated id and timestamps', () => {
      const input = { userId: 'user-1', postId: 'post-1', content: 'Hello world', likes: 0 };

      const comment = commentsService.create(input);

      expect(comment.id).toBeDefined();
      expect(comment.userId).toBe('user-1');
      expect(comment.postId).toBe('post-1');
      expect(comment.content).toBe('Hello world');
      expect(comment.likes).toBe(0);
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('should return the comment when it exists', () => {
      const created = commentsService.create({ userId: 'user-1', postId: 'post-2', content: 'Content', likes: 2 });

      const found = commentsService.getById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for unknown id', () => {
      const result = commentsService.getById('missing-id');
      expect(result).toBeUndefined();
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
    it('should update an existing comment and refresh the timestamp', () => {
      const created = commentsService.create({ userId: 'user-3', postId: 'post-3', content: 'Original', likes: 1 });

      const updated = commentsService.update(created.id, { content: 'Updated', likes: 5 });

      expect(updated).toBeDefined();
      expect(updated!.content).toBe('Updated');
      expect(updated!.likes).toBe(5);
      expect(updated!.userId).toBe(created.userId);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should return undefined when updating non-existent comment', () => {
      const updated = commentsService.update('no-comment', { content: 'Nothing' });
      expect(updated).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should delete an existing comment', () => {
      const created = commentsService.create({ userId: 'user-4', postId: 'post-4', content: 'To delete', likes: 0 });

      const removed = commentsService.remove(created.id);

      expect(removed).toBe(true);
      expect(commentsService.getById(created.id)).toBeUndefined();
    });

    it('should return false when deleting non-existent comment', () => {
      const removed = commentsService.remove('missing');
      expect(removed).toBe(false);
    });
  });
});
