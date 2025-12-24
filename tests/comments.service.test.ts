import * as commentsService from '../src/services/comments';
import { CreateCommentInput } from '../src/types';

describe('Comments Service', () => {
  beforeEach(() => {
    commentsService.clear();
  });

  describe('create', () => {
    it('should create a comment with all required fields', () => {
      const input: CreateCommentInput = {
        userId: 'user-1',
        postId: 'post-1',
        content: 'Great post!',
        likes: 5,
      };

      const comment = commentsService.create(input);

      expect(comment.id).toBeDefined();
      expect(comment.userId).toBe('user-1');
      expect(comment.postId).toBe('post-1');
      expect(comment.content).toBe('Great post!');
      expect(comment.likes).toBe(5);
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
    });

    it('should set same createdAt and updatedAt on creation', () => {
      const input: CreateCommentInput = {
        userId: 'user-2',
        postId: 'post-2',
        content: 'Test',
        likes: 0,
      };

      const comment = commentsService.create(input);

      expect(comment.createdAt.getTime()).toBe(comment.updatedAt.getTime());
    });

    it('should store comment in internal storage', () => {
      const input: CreateCommentInput = {
        userId: 'user-3',
        postId: 'post-3',
        content: 'Stored comment',
        likes: 2,
      };

      const created = commentsService.create(input);
      const retrieved = commentsService.getById(created.id);

      expect(retrieved).toEqual(created);
    });

    it('should generate unique IDs for each comment', () => {
      const input1: CreateCommentInput = {
        userId: 'user-4',
        postId: 'post-4',
        content: 'Comment 1',
        likes: 1,
      };

      const input2: CreateCommentInput = {
        userId: 'user-5',
        postId: 'post-5',
        content: 'Comment 2',
        likes: 3,
      };

      const comment1 = commentsService.create(input1);
      const comment2 = commentsService.create(input2);

      expect(comment1.id).not.toBe(comment2.id);
    });
  });

  describe('getById', () => {
    it('should return undefined for non-existent comment', () => {
      const result = commentsService.getById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should retrieve comment by id (line 19)', () => {
      const input: CreateCommentInput = {
        userId: 'user-6',
        postId: 'post-6',
        content: 'Retrievable comment',
        likes: 4,
      };

      const created = commentsService.create(input);
      const retrieved = commentsService.getById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.userId).toBe('user-6');
      expect(retrieved?.content).toBe('Retrievable comment');
    });

    it('should return exact same object from storage', () => {
      const input: CreateCommentInput = {
        userId: 'user-7',
        postId: 'post-7',
        content: 'Exact match test',
        likes: 7,
      };

      const created = commentsService.create(input);
      const retrieved = commentsService.getById(created.id);

      expect(retrieved).toEqual(created);
      expect(retrieved?.likes).toBe(7);
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
    it('should return undefined when updating non-existent comment (line 28, 29)', () => {
      const result = commentsService.update('non-existent-id', { content: 'New content' });
      expect(result).toBeUndefined();
    });

    it('should retrieve existing comment and update it (line 27)', () => {
      const input: CreateCommentInput = {
        userId: 'user-8',
        postId: 'post-8',
        content: 'Original content',
        likes: 3,
      };

      const created = commentsService.create(input);
      const updated = commentsService.update(created.id, { content: 'Updated content' });

      expect(updated).toBeDefined();
      expect(updated?.content).toBe('Updated content');
      expect(updated?.likes).toBe(3);
    });

    it('should update multiple fields', () => {
      const input: CreateCommentInput = {
        userId: 'user-9',
        postId: 'post-9',
        content: 'Original',
        likes: 1,
      };

      const created = commentsService.create(input);
      const updated = commentsService.update(created.id, {
        content: 'Modified',
        likes: 15,
      });

      expect(updated?.content).toBe('Modified');
      expect(updated?.likes).toBe(15);
    });

    it('should preserve unchanged fields (line 31, 32)', () => {
      const input: CreateCommentInput = {
        userId: 'user-10',
        postId: 'post-10',
        content: 'Original',
        likes: 5,
      };

      const created = commentsService.create(input);
      const updated = commentsService.update(created.id, { content: 'Changed' });

      expect(updated?.userId).toBe('user-10');
      expect(updated?.postId).toBe('post-10');
      expect(updated?.likes).toBe(5);
    });

    it('should update updatedAt timestamp on update', () => {
      const input: CreateCommentInput = {
        userId: 'user-11',
        postId: 'post-11',
        content: 'Test',
        likes: 0,
      };

      const created = commentsService.create(input);

      // Small delay to ensure timestamp difference
      const beforeUpdate = new Date();
      const updated = commentsService.update(created.id, { likes: 20 });
      const afterUpdate = new Date();

      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(updated!.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
    });

    it('should preserve createdAt timestamp on update', () => {
      const input: CreateCommentInput = {
        userId: 'user-12',
        postId: 'post-12',
        content: 'Test',
        likes: 0,
      };

      const created = commentsService.create(input);
      const updated = commentsService.update(created.id, { content: 'Updated' });

      expect(updated?.createdAt).toEqual(created.createdAt);
    });

    it('should persist updated comment in storage (line 36, 37)', () => {
      const input: CreateCommentInput = {
        userId: 'user-13',
        postId: 'post-13',
        content: 'Original',
        likes: 2,
      };

      const created = commentsService.create(input);
      commentsService.update(created.id, { content: 'Persisted change', likes: 25 });

      const retrieved = commentsService.getById(created.id);
      expect(retrieved?.content).toBe('Persisted change');
      expect(retrieved?.likes).toBe(25);
    });
  });

  describe('remove', () => {
    it('should return false when removing non-existent comment', () => {
      const result = commentsService.remove('non-existent-id');
      expect(result).toBe(false);
    });

    it('should return true when removing existing comment (line 41)', () => {
      const input: CreateCommentInput = {
        userId: 'user-14',
        postId: 'post-14',
        content: 'To delete',
        likes: 0,
      };

      const created = commentsService.create(input);
      const result = commentsService.remove(created.id);

      expect(result).toBe(true);
    });

    it('should actually delete comment from storage', () => {
      const input: CreateCommentInput = {
        userId: 'user-15',
        postId: 'post-15',
        content: 'Delete me',
        likes: 0,
      };

      const created = commentsService.create(input);
      commentsService.remove(created.id);

      const retrieved = commentsService.getById(created.id);
      expect(retrieved).toBeUndefined();
    });

    it('should remove comment from getAll results', () => {
      const input1: CreateCommentInput = {
        userId: 'user-16',
        postId: 'post-16',
        content: 'Keep this',
        likes: 0,
      };

      const input2: CreateCommentInput = {
        userId: 'user-17',
        postId: 'post-17',
        content: 'Delete this',
        likes: 0,
      };

      const created1 = commentsService.create(input1);
      const created2 = commentsService.create(input2);

      expect(commentsService.getAll()).toHaveLength(2);

      commentsService.remove(created2.id);

      expect(commentsService.getAll()).toHaveLength(1);
      expect(commentsService.getAll()[0].id).toBe(created1.id);
    });

    it('should return false on second removal attempt', () => {
      const input: CreateCommentInput = {
        userId: 'user-18',
        postId: 'post-18',
        content: 'Test',
        likes: 0,
      };

      const created = commentsService.create(input);

      const firstRemove = commentsService.remove(created.id);
      const secondRemove = commentsService.remove(created.id);

      expect(firstRemove).toBe(true);
      expect(secondRemove).toBe(false);
    });
  });
});
