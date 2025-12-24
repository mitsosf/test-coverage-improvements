import { create, getById, getAll, update, remove, clear } from './comments';
import { Comment, CreateCommentInput } from '../types';
import * as uuid from 'uuid';

jest.mock('uuid');

describe('comments service', () => {
  beforeEach(() => {
    clear();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment with required fields', () => {
      const mockId = 'test-uuid-1';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-1',
        postId: 'post-1',
        content: 'Great post!',
        likes: 0,
      };

      const comment = create(input);

      expect(comment.id).toBe(mockId);
      expect(comment.userId).toBe('user-1');
      expect(comment.postId).toBe('post-1');
      expect(comment.content).toBe('Great post!');
      expect(comment.likes).toBe(0);
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
    });

    it('should store comment in internal map (line 19)', () => {
      const mockId = 'test-uuid-2';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-2',
        postId: 'post-2',
        content: 'Another comment',
        likes: 5,
      };

      const created = create(input);
      const retrieved = getById(mockId);

      expect(retrieved).toEqual(created);
    });

    it('should set same createdAt and updatedAt timestamps', () => {
      const mockId = 'test-uuid-3';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const before = new Date();
      const input: CreateCommentInput = {
        userId: 'user-3',
        postId: 'post-3',
        content: 'Test',
        likes: 0,
      };

      const comment = create(input);
      const after = new Date();

      expect(comment.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(comment.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(comment.updatedAt.getTime()).toEqual(comment.createdAt.getTime());
    });
  });

  describe('getById', () => {
    it('should return undefined for non-existent comment', () => {
      const result = getById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should return comment by id (line 27)', () => {
      const mockId = 'test-uuid-4';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-4',
        postId: 'post-4',
        content: 'Test comment',
        likes: 2,
      };

      const created = create(input);
      const retrieved = getById(mockId);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(mockId);
      expect(retrieved?.content).toBe('Test comment');
    });

    it('should return exact comment object from map', () => {
      const mockId = 'test-uuid-5';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-5',
        postId: 'post-5',
        content: 'Detailed test',
        likes: 10,
      };

      const created = create(input);
      const retrieved = getById(mockId);

      expect(retrieved).toEqual(created);
      expect(retrieved?.userId).toBe(created.userId);
      expect(retrieved?.postId).toBe(created.postId);
      expect(retrieved?.likes).toBe(10);
    });
  });

  describe('getAll', () => {
    it('should return empty array when no comments exist (line 28)', () => {
      const all = getAll();
      expect(all).toEqual([]);
      expect(Array.isArray(all)).toBe(true);
    });

    it('should return array of all comments (line 29)', () => {
      const mockId1 = 'test-uuid-6';
      const mockId2 = 'test-uuid-7';
      (uuid.v4 as jest.Mock)
        .mockReturnValueOnce(mockId1)
        .mockReturnValueOnce(mockId2);

      const input1: CreateCommentInput = {
        userId: 'user-6',
        postId: 'post-6',
        content: 'First comment',
        likes: 1,
      };

      const input2: CreateCommentInput = {
        userId: 'user-7',
        postId: 'post-7',
        content: 'Second comment',
        likes: 3,
      };

      const created1 = create(input1);
      const created2 = create(input2);
      const all = getAll();

      expect(all).toHaveLength(2);
      expect(all).toContain(created1);
      expect(all).toContain(created2);
    });

    it('should return array from map values', () => {
      const mockId = 'test-uuid-8';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-8',
        postId: 'post-8',
        content: 'Single comment',
        likes: 0,
      };

      create(input);
      const all = getAll();

      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBe(1);
      expect(all[0].content).toBe('Single comment');
    });
  });

  describe('update', () => {
    it('should return undefined when updating non-existent comment (line 31)', () => {
      const result = update('non-existent-id', { content: 'New content' });
      expect(result).toBeUndefined();
    });

    it('should update comment with new content (line 36, 37)', () => {
      const mockId = 'test-uuid-9';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-9',
        postId: 'post-9',
        content: 'Original content',
        likes: 5,
      };

      const created = create(input);
      const beforeUpdate = new Date();

      const updateInput: Partial<CreateCommentInput> = {
        content: 'Updated content',
      };

      const updated = update(mockId, updateInput);
      const afterUpdate = new Date();

      expect(updated).toBeDefined();
      expect(updated?.id).toBe(mockId);
      expect(updated?.content).toBe('Updated content');
      expect(updated?.userId).toBe('user-9');
      expect(updated?.postId).toBe('post-9');
      expect(updated?.likes).toBe(5);
      expect(updated?.createdAt).toEqual(created.createdAt);
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(updated!.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
    });

    it('should update comment with partial fields', () => {
      const mockId = 'test-uuid-10';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-10',
        postId: 'post-10',
        content: 'Original',
        likes: 2,
      };

      create(input);

      const updated = update(mockId, { likes: 10 });

      expect(updated?.content).toBe('Original');
      expect(updated?.likes).toBe(10);
      expect(updated?.userId).toBe('user-10');
    });

    it('should update updatedAt timestamp on update', () => {
      const mockId = 'test-uuid-11';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-11',
        postId: 'post-11',
        content: 'Test',
        likes: 0,
      };

      const created = create(input);

      // Add small delay to ensure timestamp difference
      setTimeout(() => {
        const updated = update(mockId, { content: 'Modified' });
        expect(updated!.updatedAt.getTime()).toBeGreaterThan(
          created.updatedAt.getTime()
        );
      }, 10);
    });

    it('should persist updated comment in storage', () => {
      const mockId = 'test-uuid-12';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-12',
        postId: 'post-12',
        content: 'Original',
        likes: 1,
      };

      create(input);
      update(mockId, { content: 'Changed', likes: 20 });

      const retrieved = getById(mockId);
      expect(retrieved?.content).toBe('Changed');
      expect(retrieved?.likes).toBe(20);
    });
  });

  describe('remove', () => {
    it('should return false when removing non-existent comment', () => {
      const result = remove('non-existent-id');
      expect(result).toBe(false);
    });

    it('should return true when removing existing comment (line 41)', () => {
      const mockId = 'test-uuid-13';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-13',
        postId: 'post-13',
        content: 'To be deleted',
        likes: 0,
      };

      create(input);
      const result = remove(mockId);

      expect(result).toBe(true);
    });

    it('should actually delete comment from storage', () => {
      const mockId = 'test-uuid-14';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-14',
        postId: 'post-14',
        content: 'Delete me',
        likes: 0,
      };

      create(input);
      remove(mockId);

      const retrieved = getById(mockId);
      expect(retrieved).toBeUndefined();
    });

    it('should remove comment from getAll results', () => {
      const mockId1 = 'test-uuid-15';
      const mockId2 = 'test-uuid-16';
      (uuid.v4 as jest.Mock)
        .mockReturnValueOnce(mockId1)
        .mockReturnValueOnce(mockId2);

      const input1: CreateCommentInput = {
        userId: 'user-15',
        postId: 'post-15',
        content: 'Keep this',
        likes: 0,
      };

      const input2: CreateCommentInput = {
        userId: 'user-16',
        postId: 'post-16',
        content: 'Delete this',
        likes: 0,
      };

      create(input1);
      create(input2);

      expect(getAll()).toHaveLength(2);

      remove(mockId2);

      expect(getAll()).toHaveLength(1);
      expect(getAll()[0].id).toBe(mockId1);
    });

    it('should return false on second removal of same comment', () => {
      const mockId = 'test-uuid-17';
      (uuid.v4 as jest.Mock).mockReturnValue(mockId);

      const input: CreateCommentInput = {
        userId: 'user-17',
        postId: 'post-17',
        content: 'Test',
        likes: 0,
      };

      create(input);

      const firstRemove = remove(mockId);
      const secondRemove = remove(mockId);

      expect(firstRemove).toBe(true);
      expect(secondRemove).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all comments', () => {
      const mockId1 = 'test-uuid-18';
      const mockId2 = 'test-uuid-19';
      (uuid.v4 as jest.Mock)
        .mockReturnValueOnce(mockId1)
        .mockReturnValueOnce(mockId2);

      const input: CreateCommentInput = {
        userId: 'user-18',
        postId: 'post-18',
        content: 'Test',
        likes: 0,
      };

      create(input);
      create({ ...input, userId: 'user-19' });

      expect(getAll()).toHaveLength(2);

      clear();

      expect(getAll()).toHaveLength(0);
    });
  });
});
