import { Router, Request, Response } from 'express';
import * as reviewsService from '../services/reviews';
import { CreateReviewInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateReviewInput = req.body;
  const review = reviewsService.create(input);
  res.status(201).json(review);
});

router.get('/', (_req: Request, res: Response) => {
  const reviews = reviewsService.getAll();
  res.json(reviews);
});

router.get('/:id', (req: Request, res: Response) => {
  const review = reviewsService.getById(req.params.id);
  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.json(review);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = reviewsService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = reviewsService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.status(204).send();
});

export default router;
