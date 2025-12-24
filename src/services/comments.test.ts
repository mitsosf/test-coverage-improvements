import { create, getById, getAll, update, remove, clear } from '../src/services/comments';
import { v4 as uuidv4 } from 'uuid';
import { Comment, CreateCommentInput } from '../src/types';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('comments service', () => {
  beforeEach(() => {
    clear();
  });

  describe('create', () => {
    it('should create a new comment', () => {
      const input: CreateCommentInput = {
        author: 'John Doe',
        text: 'This is a comment',
      };
      (uuidv4 as jest.Mock).mockReturnValueOnce('1');
      const comment = create(input);
      expect(comment).toEqual({
        id: '1',
        ...input,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(getById('1')).toEqual(comment);
    });
  });

  describe('getById', () => {
    it('should return undefined if no comment with the given id exists', () => {
      expect(getById('non-existing-id')).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all comments', () => {
      const input1: CreateCommentInput = {
        author: 'John Doe',
        text: 'This is a comment',
      };
      const input2: CreateCommentInput = {
        author: 'Jane Doe',
        text: 'This is another comment',
      };
      (uuidv4 as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
      const comment1 = create(input1);
      const comment2 = create(input2);
      expect(getAll()).toEqual([comment1, comment2]);
    });
  });

  describe('update', () => {
    it('should update an existing comment', () => {
      const input: CreateCommentInput = {
        author: 'John Doe',
        text: 'This is a comment',
      };
      (uuidv4 as jest.Mock).mockReturnValueOnce('1');
      const comment = create(input);
      const updatedComment = update('1', { text: 'This is an updated comment' });
      expect(updatedComment).toEqual({
        ...comment,
        text: 'This is an updated comment',
        updatedAt: expect.any(Date),
      });
      expect(getById('1')).toEqual(updatedComment);
    });

    it('should return undefined if no comment with the given id exists', () => {
      expect(update('non-existing-id', { text: 'This is an updated comment' })).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an existing comment', () => {
      const input: CreateCommentInput = {
        author: 'John Doe',
        text: 'This is a comment',
      };
      (uuidv4 as jest.Mock).mockReturnValueOnce('1');
      create(input);
      expect(remove('1')).toBe(true);
      expect(getById('1')).toBeUndefined();
    });

    it('should return false if no comment with the given id exists', () => {
      expect(remove('non-existing-id')).toBe(false);
    });
  });
});