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

  // NOTE: create, getById, update, remove are intentionally not tested
  // to simulate low test coverage for the coverage detection service
});
