import * as reviewsService from '../src/services/reviews';
import { CreateReviewInput, Review } from '../src/types';

describe('Reviews Service', () => {
  beforeEach(() => {
    reviewsService.clear();
  });

  describe('create', () => {
    it('should create a new review with generated id', () => {
      const input: CreateReviewInput = {
        userId: 'user123',
        productId: 'product456',
        rating: 5,
        title: 'Great product',
        body: 'This is an excellent product. Highly recommend!',
      };
      const review = reviewsService.create(input);

      expect(review.id).toBeDefined();
      expect(review.userId).toBe('user123');
      expect(review.productId).toBe('product456');
      expect(review.rating).toBe(5);
      expect(review.title).toBe('Great product');
      expect(review.body).toBe('This is an excellent product. Highly recommend!');
      expect(review.createdAt).toBeInstanceOf(Date);
      expect(review.updatedAt).toBeInstanceOf(Date);
    });

    it('should set createdAt and updatedAt to the same time', () => {
      const input: CreateReviewInput = {
        userId: 'user789',
        productId: 'product101',
        rating: 4,
        title: 'Good',
        body: 'Pretty good',
      };
      const review = reviewsService.create(input);

      expect(review.createdAt).toEqual(review.updatedAt);
    });

    it('should generate unique ids for different reviews', () => {
      const input1: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 5,
        title: 'Title 1',
        body: 'Body 1',
      };
      const input2: CreateReviewInput = {
        userId: 'user2',
        productId: 'prod2',
        rating: 3,
        title: 'Title 2',
        body: 'Body 2',
      };

      const review1 = reviewsService.create(input1);
      const review2 = reviewsService.create(input2);

      expect(review1.id).not.toBe(review2.id);
    });
  });

  describe('getById', () => {
    it('should retrieve a review by id', () => {
      const input: CreateReviewInput = {
        userId: 'user123',
        productId: 'product456',
        rating: 5,
        title: 'Excellent',
        body: 'Very good',
      };
      const created = reviewsService.create(input);
      const retrieved = reviewsService.getById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.userId).toBe('user123');
      expect(retrieved?.rating).toBe(5);
    });

    it('should return undefined for non-existent review', () => {
      const result = reviewsService.getById('nonexistent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no reviews exist', () => {
      const all = reviewsService.getAll();
      expect(all).toEqual([]);
    });

    it('should return all created reviews', () => {
      const input1: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 5,
        title: 'Title 1',
        body: 'Body 1',
      };
      const input2: CreateReviewInput = {
        userId: 'user2',
        productId: 'prod2',
        rating: 4,
        title: 'Title 2',
        body: 'Body 2',
      };

      const review1 = reviewsService.create(input1);
      const review2 = reviewsService.create(input2);
      const all = reviewsService.getAll();

      expect(all).toHaveLength(2);
      expect(all).toContainEqual(review1);
      expect(all).toContainEqual(review2);
    });

    it('should return array from map values', () => {
      const input: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 3,
        title: 'Average',
        body: 'It is okay',
      };
      reviewsService.create(input);

      const all = reviewsService.getAll();
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an existing review', () => {
      const input: CreateReviewInput = {
        userId: 'user123',
        productId: 'product456',
        rating: 3,
        title: 'Original Title',
        body: 'Original Body',
      };
      const created = reviewsService.create(input);

      const updateInput: Partial<CreateReviewInput> = {
        rating: 5,
        title: 'Updated Title',
      };
      const updated = reviewsService.update(created.id, updateInput);

      expect(updated).toBeDefined();
      expect(updated?.id).toBe(created.id);
      expect(updated?.rating).toBe(5);
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.body).toBe('Original Body');
      expect(updated?.userId).toBe('user123');
    });

    it('should update the updatedAt timestamp', () => {
      const input: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 2,
        title: 'Old',
        body: 'Old body',
      };
      const created = reviewsService.create(input);
      const originalUpdatedAt = created.updatedAt;

      // Wait a bit to ensure time difference
      const delay = new Promise(resolve => setTimeout(resolve, 10));

      return delay.then(() => {
        const updated = reviewsService.update(created.id, { rating: 4 });
        expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
      });
    });

    it('should return undefined for non-existent review', () => {
      const result = reviewsService.update('nonexistent-id', { rating: 5 });
      expect(result).toBeUndefined();
    });

    it('should support partial updates', () => {
      const input: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 1,
        title: 'Bad',
        body: 'Very bad',
      };
      const created = reviewsService.create(input);

      const updated = reviewsService.update(created.id, { rating: 5 });

      expect(updated?.rating).toBe(5);
      expect(updated?.title).toBe('Bad');
      expect(updated?.body).toBe('Very bad');
    });
  });

  describe('remove', () => {
    it('should remove an existing review', () => {
      const input: CreateReviewInput = {
        userId: 'user123',
        productId: 'product456',
        rating: 5,
        title: 'Title',
        body: 'Body',
      };
      const created = reviewsService.create(input);

      const removed = reviewsService.remove(created.id);

      expect(removed).toBe(true);
      expect(reviewsService.getById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent review', () => {
      const result = reviewsService.remove('nonexistent-id');
      expect(result).toBe(false);
    });

    it('should remove review from collection', () => {
      const input: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 3,
        title: 'Title',
        body: 'Body',
      };
      const created = reviewsService.create(input);
      const allBefore = reviewsService.getAll();

      reviewsService.remove(created.id);
      const allAfter = reviewsService.getAll();

      expect(allBefore.length).toBe(1);
      expect(allAfter.length).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all reviews', () => {
      const input1: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 5,
        title: 'Title 1',
        body: 'Body 1',
      };
      const input2: CreateReviewInput = {
        userId: 'user2',
        productId: 'prod2',
        rating: 4,
        title: 'Title 2',
        body: 'Body 2',
      };

      reviewsService.create(input1);
      reviewsService.create(input2);
      const allBefore = reviewsService.getAll();

      reviewsService.clear();
      const allAfter = reviewsService.getAll();

      expect(allBefore.length).toBe(2);
      expect(allAfter.length).toBe(0);
    });

    it('should completely empty the review collection', () => {
      const input: CreateReviewInput = {
        userId: 'user1',
        productId: 'prod1',
        rating: 1,
        title: 'Title',
        body: 'Body',
      };
      reviewsService.create(input);

      reviewsService.clear();

      expect(reviewsService.getAll()).toEqual([]);
    });
  });
});
