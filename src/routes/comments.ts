import { Router, Request, Response } from 'express';
import * as commentsService from '../services/comments';
import { CreateCommentInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateCommentInput = req.body;
  const comment = commentsService.create(input);
  res.status(201).json(comment);
});

router.get('/', (_req: Request, res: Response) => {
  const comments = commentsService.getAll();
  res.json(comments);
});

router.get('/:id', (req: Request, res: Response) => {
  const comment = commentsService.getById(req.params.id);
  if (!comment) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }
  res.json(comment);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = commentsService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = commentsService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }
  res.status(204).send();
});

export default router;
