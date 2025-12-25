import * as reviewsService from '../src/services/reviews';

describe('Reviews Service', () => {
  beforeEach(() => {
    // Ensure in-memory store is clean before each test
    reviewsService.clear();
  });

  describe('create', () => {
    it('creates a review with generated id and timestamps', () => {
      const input = {
        userId: 'user-1',
        productId: 'prod-1',
        rating: 5,
        title: 'Great!',
        body: 'Really enjoyed this product',
      };

      const review = reviewsService.create(input);

      expect(review.id).toBeDefined(); // uuid generated
      expect(review.userId).toBe('user-1');
      expect(review.productId).toBe('prod-1');
      expect(review.rating).toBe(5);
      expect(review.title).toBe('Great!');
      expect(review.body).toBe('Really enjoyed this product');
      expect(review.createdAt).toBeInstanceOf(Date);
      expect(review.updatedAt).toBeInstanceOf(Date);
    });

    it('stores created review in the map (getById reflects it)', () => {
      const created = reviewsService.create({
        userId: 'user-2',
        productId: 'prod-2',
        rating: 4,
        title: 'Good',
        body: 'Solid quality',
      });

      const found = reviewsService.getById(created.id);
      expect(found).toEqual(created);
    });
  });

  describe('getAll', () => {
    it('returns empty array when no reviews exist', () => {
      const all = reviewsService.getAll();
      expect(all).toEqual([]);
    });

    it('returns all stored reviews', () => {
      reviewsService.create({ userId: 'u1', productId: 'p1', rating: 3, title: 'Ok', body: 'It is ok' });
      reviewsService.create({ userId: 'u2', productId: 'p2', rating: 5, title: 'Amazing', body: 'Loved it' });

      const all = reviewsService.getAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('returns undefined when review does not exist', () => {
      const updated = reviewsService.update('non-existent-id', { title: 'Nope' });
      expect(updated).toBeUndefined();
    });

    it('updates existing review and refreshes updatedAt', () => {
      const created = reviewsService.create({
        userId: 'user-3',
        productId: 'prod-3',
        rating: 2,
        title: 'Not great',
        body: 'Could be better',
      });

      const updated = reviewsService.update(created.id, { rating: 4, title: 'Improved' });

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.userId).toBe(created.userId);
      expect(updated!.productId).toBe(created.productId);
      expect(updated!.rating).toBe(4);
      expect(updated!.title).toBe('Improved');
      expect(updated!.body).toBe('Could be better'); // unchanged
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });
  });

  describe('remove', () => {
    it('removes an existing review and returns true', () => {
      const created = reviewsService.create({
        userId: 'u-del',
        productId: 'p-del',
        rating: 1,
        title: 'Bad',
        body: 'Do not recommend',
      });

      const deleted = reviewsService.remove(created.id);
      expect(deleted).toBe(true);
      expect(reviewsService.getById(created.id)).toBeUndefined();
    });

    it('returns false when removing non-existent review', () => {
      const deleted = reviewsService.remove('no-such-id');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('clears all reviews', () => {
      reviewsService.create({ userId: 'u1', productId: 'p1', rating: 3, title: 'A', body: 'B' });
      reviewsService.create({ userId: 'u2', productId: 'p2', rating: 4, title: 'C', body: 'D' });

      reviewsService.clear();

      expect(reviewsService.getAll()).toEqual([]);
    });
  });
});

