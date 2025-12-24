import { Router, Request, Response } from 'express';
import * as categoriesService from '../services/categories';
import { CreateCategoryInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateCategoryInput = req.body;
  const category = categoriesService.create(input);
  res.status(201).json(category);
});

router.get('/', (_req: Request, res: Response) => {
  const categories = categoriesService.getAll();
  res.json(categories);
});

router.get('/:id', (req: Request, res: Response) => {
  const category = categoriesService.getById(req.params.id);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json(category);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = categoriesService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = categoriesService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.status(204).send();
});

export default router;
