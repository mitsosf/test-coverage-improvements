import { Router, Request, Response } from 'express';
import * as tagsService from '../services/tags';
import { CreateTagInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateTagInput = req.body;
  const tag = tagsService.create(input);
  res.status(201).json(tag);
});

router.get('/', (_req: Request, res: Response) => {
  const tags = tagsService.getAll();
  res.json(tags);
});

router.get('/:id', (req: Request, res: Response) => {
  const tag = tagsService.getById(req.params.id);
  if (!tag) {
    res.status(404).json({ error: 'Tag not found' });
    return;
  }
  res.json(tag);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = tagsService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Tag not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = tagsService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Tag not found' });
    return;
  }
  res.status(204).send();
});

export default router;
