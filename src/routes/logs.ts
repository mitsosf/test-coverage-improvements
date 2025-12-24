import { Router, Request, Response } from 'express';
import * as logsService from '../services/logs';
import { CreateLogInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const input: CreateLogInput = req.body;
  const log = logsService.create(input);
  res.status(201).json(log);
});

router.get('/', (_req: Request, res: Response) => {
  const logs = logsService.getAll();
  res.json(logs);
});

router.get('/:id', (req: Request, res: Response) => {
  const log = logsService.getById(req.params.id);
  if (!log) {
    res.status(404).json({ error: 'Log not found' });
    return;
  }
  res.json(log);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = logsService.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Log not found' });
    return;
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = logsService.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Log not found' });
    return;
  }
  res.status(204).send();
});

export default router;
